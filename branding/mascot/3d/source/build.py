"""Assemble GROOWIE v2 in Blender: retopo, materials, rig, skin weights,
animations (Idle / Walk / Wave / ThumbsUp), studio scene, exports.

blender -b -P build.py -- <parts_dir> <out_dir>
"""
import json, math, os, sys
import bpy, bmesh
from mathutils import Matrix, Quaternion, Vector, kdtree

parts, out = sys.argv[sys.argv.index("--") + 1:][:2]
os.makedirs(out, exist_ok=True)
P = json.load(open(f"{parts}/params.json"))
J = {k: Vector(v) for k, v in P["rig"].items() if k not in ("TAIL", "FINGERS")}
FINGER_NAMES = ("ring", "middle", "index")
FINGER_SEG = {n: (Vector(f[0]), Vector(f[2])) for n, f in zip(FINGER_NAMES, P["rig"]["FINGERS"])}
TAIL = [Vector(v) for v in P["rig"]["TAIL"]]

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
view_layer = bpy.context.view_layer
scene.unit_settings.system = "METRIC"
scene.render.fps = 24

# ------------------------------------------------------------------ materials
def lin(h):
    def c(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (c(int(h[1:3], 16)), c(int(h[3:5], 16)), c(int(h[5:7], 16)), 1.0)

def material(name, hexcol, rough, coat=0.0, coat_rough=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = lin(hexcol)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    return m

M = {
    "yellow": material("Groowie_Yellow", "#FDE047", 0.45, coat=0.12, coat_rough=0.3),
    "cream": material("Groowie_Cream", "#FFF7D6", 0.5, coat=0.1, coat_rough=0.35),
    "green": material("Groowie_Green", "#16A34A", 0.40, coat=0.25, coat_rough=0.28),
    "eye": material("Groowie_Eye", "#0B0B0F", 0.06, coat=1.0, coat_rough=0.02),
    "dark": material("Groowie_Mouth", "#4A2E14", 0.55),
    "iris": material("Groowie_Iris", "#3A2414", 0.08, coat=1.0, coat_rough=0.02),
    "blush": material("Groowie_Blush", "#F9A8D4", 0.55, coat=0.1, coat_rough=0.35),
    "light": material("Groowie_Catchlight", "#FFFFFF", 0.2),
}
_e = M["light"].node_tree.nodes["Principled BSDF"]
_e.inputs["Emission Color"].default_value = (1, 1, 1, 1)
_e.inputs["Emission Strength"].default_value = 2.0

# ------------------------------------------------------------------ geometry
root = bpy.data.objects.new("GROOWIE", None)
scene.collection.objects.link(root)

def select_only(ob):
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    view_layer.objects.active = ob

def finish(ob, name, mat):
    ob.name = name
    ob.data.name = name
    ob.data.materials.clear()
    ob.data.materials.append(mat)
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob

def fix_normals(ob):
    select_only(ob)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")

def voxel(ob, size):
    select_only(ob)
    ob.data.remesh_voxel_size = size
    ob.data.use_remesh_fix_poles = True
    bpy.ops.object.voxel_remesh()

def import_ply(name):
    bpy.ops.wm.ply_import(filepath=f"{parts}/{name}.ply")
    return bpy.context.selected_objects[0]

def sphere(name, spec, mat, segs=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2,
                                         radius=spec["radius"], location=spec["center"])
    ob = bpy.context.active_object
    ob.rotation_mode = "QUATERNION"
    ob.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(Vector(spec["normal"]))
    return finish(ob, name, mat)

body = import_ply("body")
voxel(body, 0.0035)
select_only(body)
bpy.ops.object.quadriflow_remesh(target_faces=30000, use_mesh_symmetry=True, use_preserve_sharp=False,
                                 use_preserve_boundary=False, smooth_normals=False, seed=7)
fix_normals(body)
print("BODY faces", len(body.data.polygons))
finish(body, "Groowie_Body", M["yellow"])

parts_objs = []
for name, size, mat in (("belly", 0.004, "cream"), ("spikes", 0.0036, "green"), ("blush", 0.002, "blush")):
    ob = import_ply(name)
    voxel(ob, size)
    fix_normals(ob)
    parts_objs.append(finish(ob, f"Groowie_{name.capitalize()}", M[mat]))
def cap(name, c, rr, axis, angle, mat, segs=48):
    """Spherical cap of radius rr around `axis` (half-angle `angle` degrees)."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=rr)
    axis = Vector(axis).normalized()
    m = Matrix.Translation(c) @ Vector((0, 0, 1)).rotation_difference(axis).to_matrix().to_4x4()
    bmesh.ops.transform(bm, matrix=m, verts=bm.verts)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                           plane_co=c + axis * rr * math.cos(math.radians(angle)), plane_no=axis, clear_inner=True)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    return finish(ob, name, mat)

VIEWER = Vector((0, -3.6, 0.70))                                # eyes converge on the viewer
EYES, RIGID = {}, {}
for i, s in enumerate(P["eyes"]):
    sfx = (".R", ".L")[i]
    c, r, n = Vector(s["center"]), s["radius"], Vector(s["normal"])
    look = (VIEWER - c).normalized()
    up = (Vector((0, 0, 1)) - n * n.z).normalized()
    EYES[sfx] = dict(c=c, n=n, look=look, h_up=(-n).cross(up).normalized())
    objs = [sphere(f"Groowie_Eye{sfx}", s, M["eye"], 64),
            cap(f"Groowie_Iris{sfx}", c, r + 0.0004, look, 34, M["iris"]),
            cap(f"Groowie_Pupil{sfx}", c, r + 0.0008, look, 19, M["eye"]),
            cap(f"Groowie_Catchlight{sfx}", c, r + 0.0012, look + Vector((-0.30, 0, 0.42)), 8.5, M["light"], 32),
            cap(f"Groowie_Catchlight2{sfx}", c, r + 0.0012, look + Vector((0.22, 0, -0.30)), 3.8, M["light"], 24)]
    for o in objs:
        RIGID[o.name] = "eye" + sfx
    for lid in ("upper", "lower"):                              # hidden behind the eye at rest
        o = cap(f"Groowie_Lid_{lid}{sfx}", c, r + 0.0042, -n, 90, M["yellow"], 64)
        sol = o.modifiers.new("Solidify", "SOLIDIFY")
        sol.thickness, sol.offset, sol.use_rim = 0.003, -1, True
        select_only(o)
        bpy.ops.object.modifier_apply(modifier="Solidify")
        RIGID[o.name] = f"lid_{lid}{sfx}"
        objs.append(o)
    parts_objs.extend(objs)
for i, s in enumerate(P["nostrils"]):
    parts_objs.append(sphere(f"Groowie_Nostril_{'RL'[i]}", s, M["dark"], 24))
for i, s in enumerate(P["toes"]):
    parts_objs.append(sphere(f"Groowie_Toe_{i + 1}", s, M["cream"], 24))

cu = bpy.data.curves.new("Groowie_Mouth", "CURVE")
cu.dimensions = "3D"
cu.bevel_depth = 0.0052
cu.bevel_resolution = 4
cu.use_fill_caps = True
cu.resolution_u = 3
sp = cu.splines.new("NURBS")
sp.points.add(len(P["mouth"]) - 1)
for pt, co in zip(sp.points, P["mouth"]):
    pt.co = (*co, 1.0)
sp.order_u = 4
sp.use_endpoint_u = True
mouth = bpy.data.objects.new("Groowie_Mouth", cu)
scene.collection.objects.link(mouth)
select_only(mouth)
bpy.ops.object.convert(target="MESH")
parts_objs.append(finish(bpy.context.active_object, "Groowie_Mouth", M["dark"]))

# bake object transforms so every mesh lives in rig space (clean skinning + export)
for ob in parts_objs:
    select_only(ob)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# ------------------------------------------------------------------ armature
arm = bpy.data.armatures.new("GROOWIE_Rig")
rig = bpy.data.objects.new("GROOWIE_Rig", arm)
scene.collection.objects.link(rig)
rig.parent = root
arm.display_type = "STICK"
select_only(rig)
bpy.ops.object.mode_set(mode="EDIT")
eb = arm.edit_bones

def bone(name, head, tail, parent=None, connect=False, deform=True):
    b = eb.new(name)
    b.head, b.tail = Vector(head), Vector(tail)
    if parent:
        b.parent = eb[parent]
        b.use_connect = connect
    b.use_deform = deform
    return b

def mx(v, s):
    return Vector((v.x * s, v.y, v.z))

bone("root", (0, 0, 0), (0, 0.14, 0), deform=False)
bone("hips", (0, 0.012, 0.205), (0, 0.012, 0.300), "root")
bone("spine", (0, 0.012, 0.300), (0, 0.016, 0.380), "hips", True)
bone("chest", (0, 0.016, 0.380), (0, 0.022, 0.440), "spine", True)
bone("neck", (0, 0.022, 0.440), (0, 0.030, 0.500), "chest", True)
bone("head", (0, 0.030, 0.500), (0, 0.030, 0.950), "neck", True)
bone("tail_01", (0, 0.110, 0.215), TAIL[1], "hips")
for i in range(2, 5):
    bone(f"tail_0{i}", TAIL[i - 1], TAIL[i], f"tail_0{i - 1}", True)

for sfx, s in ((".L", 1), (".R", -1)):
    hd, hf = mx(J["HAND_D"], s), mx(J["HAND_F"], s)
    w = mx(J["WRIST"], s)
    bone("shoulder" + sfx, (0.045 * s, 0.022, 0.405), mx(J["SHOULDER"], s), "chest")
    bone("upper_arm" + sfx, mx(J["SHOULDER"], s), mx(J["ELBOW"], s), "shoulder" + sfx, True)
    bone("forearm" + sfx, mx(J["ELBOW"], s), w, "upper_arm" + sfx, True)
    bone("hand" + sfx, w, w + hd * 0.045, "forearm" + sfx, True)
    for fname, (fb, fj, ft) in zip(FINGER_NAMES, P["rig"]["FINGERS"]):
        bone(f"{fname}_01{sfx}", mx(Vector(fb), s) - hd * 0.008, mx(Vector(fj), s), "hand" + sfx)
        bone(f"{fname}_02{sfx}", mx(Vector(fj), s), mx(Vector(ft), s), f"{fname}_01{sfx}", True)
    bone("thumb_01" + sfx, mx(J["THUMB_BASE"], s) - hf * 0.010, mx(J["THUMB_MID"], s), "hand" + sfx)
    bone("thumb_02" + sfx, mx(J["THUMB_MID"], s), mx(J["THUMB_TIP"], s), "thumb_01" + sfx, True)
    bone("thigh" + sfx, mx(J["HIP"], s), mx(J["KNEE"], s), "hips")
    bone("shin" + sfx, mx(J["KNEE"], s), mx(J["ANKLE"], s), "thigh" + sfx, True)
    bone("foot" + sfx, mx(J["ANKLE"], s), mx(J["TOE_END"], s), "shin" + sfx, True)

FACE_BONES = []
for sfx, e in EYES.items():
    bone("eye" + sfx, e["c"], e["c"] + e["look"] * 0.05, "head")
    bone("lid_upper" + sfx, e["c"], e["c"] + e["n"] * 0.04, "head")
    bone("lid_lower" + sfx, e["c"], e["c"] + e["n"] * 0.04, "head")
    FACE_BONES += ["eye" + sfx, "lid_upper" + sfx, "lid_lower" + sfx]
for sfx, mp in ((".R", Vector(P["mouth"][0])), (".L", Vector(P["mouth"][-1]))):
    bone("mouth_corner" + sfx, mp, mp + Vector((0, 0, 0.025)), "head")
    FACE_BONES.append("mouth_corner" + sfx)

# consistent, mirror-symmetric bone rolls
bpy.ops.armature.select_all(action="SELECT")
bpy.ops.armature.calculate_roll(type="GLOBAL_POS_X")
for b in eb:
    if b.name.endswith(".R"):
        b.roll = -eb[b.name[:-2] + ".L"].roll
bpy.ops.object.mode_set(mode="OBJECT")
DEFORM = [b.name for b in arm.bones if b.use_deform]

# ------------------------------------------------------------------ skinning
for n in FACE_BONES:                                            # face parts are rigid-bound, keep them off the skin
    arm.bones[n].use_deform = False
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True)
rig.select_set(True)
view_layer.objects.active = rig
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
for n in FACE_BONES:
    arm.bones[n].use_deform = True

def seg_dist(p, a, b):
    ab = b - a
    t = max(0.0, min(1.0, (p - a).dot(ab) / ab.length_squared))
    return (p - (a + ab * t)).length

def allowed(name, co):
    """Anatomical masks that stop heat-weight bleed between body regions."""
    if name.endswith(".L") and co.x < -0.004 or name.endswith(".R") and co.x > 0.004:
        return False
    m = Vector((abs(co.x), co.y, co.z))
    base = name[:-2] if name[-2:] in (".L", ".R") else name
    if base[:-3] in FINGER_SEG:
        a, b = FINGER_SEG[base[:-3]]
        return seg_dist(m, a, b) < 0.027
    if base.startswith("thumb_"):
        return seg_dist(m, J["THUMB_BASE"], J["THUMB_TIP"]) < 0.029
    if base in ("forearm", "hand"):
        return min(seg_dist(m, J["ELBOW"], J["FINGER_TIP"]), seg_dist(m, J["THUMB_BASE"], J["THUMB_TIP"])) < 0.08
    if base in ("thigh", "shin", "foot"):
        return min(seg_dist(m, J["HIP"], J["ANKLE"]), seg_dist(m, J["ANKLE"], J["TOE_END"])) < 0.125
    if base.startswith("tail"):
        return co.y > 0.04
    return True

SEGS = {bn.name: (bn.head_local.copy(), bn.tail_local.copy()) for bn in arm.bones}

def fallback(co):
    """Nearest anatomically allowed bone, so no vertex is ever left behind."""
    cands = [n for n in DEFORM if n not in FACE_BONES and allowed(n, co)]
    return min(cands, key=lambda n: seg_dist(co, *SEGS[n]))

def clean(ws, co, top=4):
    ws = {n: w for n, w in ws.items() if w > 1e-3 and allowed(n, co)}
    if not ws:
        ws = {fallback(co): 1.0}
    ws = dict(sorted(ws.items(), key=lambda kv: -kv[1])[:top])
    t = sum(ws.values())
    return {n: w / t for n, w in ws.items()}

def set_weights(ob, vweights):
    for g in list(ob.vertex_groups):
        ob.vertex_groups.remove(g)
    groups = {n: ob.vertex_groups.new(name=n) for n in DEFORM}
    for i, ws in enumerate(vweights):
        for n, w in ws.items():
            groups[n].add([i], w, "REPLACE")

TRUNK, CENTRES = ("hips", "spine", "chest", "neck"), (0.25, 0.34, 0.41, 0.47)

def trunk_split(z):
    """Smooth height-based share of the trunk weight between the spine bones."""
    if z <= CENTRES[0]:
        return {"hips": 1.0}
    if z >= CENTRES[-1]:
        return {"neck": 1.0}
    for i in range(3):
        if CENTRES[i] <= z <= CENTRES[i + 1]:
            t = (z - CENTRES[i]) / (CENTRES[i + 1] - CENTRES[i])
            t = t * t * (3 - 2 * t)
            return {TRUNK[i]: 1 - t, TRUNK[i + 1]: t}

def body_weights(v):
    raw = {names[g.group]: g.weight for g in v.groups if names[g.group] in DEFORM}
    share = sum(raw.pop(n, 0.0) for n in TRUNK)
    for n, w in trunk_split(v.co.z).items():
        raw[n] = raw.get(n, 0.0) + share * w
    return clean(raw, v.co)

names = {g.index: g.name for g in body.vertex_groups}
body_w = [body_weights(v) for v in body.data.vertices]
set_weights(body, body_w)
counts = {n: sum(1 for ws in body_w if ws.get(n, 0) > 0.1) for n in DEFORM}
print("WEIGHTS", " ".join(f"{n}:{c}" for n, c in counts.items()))
missing = [n for n, c in counts.items() if c == 0]
print("WARNING bones without influence:" if missing else "all deform bones weighted", missing or "")

# transfer weights from the body to every attached part (nearest-surface blend)
kd = kdtree.KDTree(len(body.data.vertices))
for i, v in enumerate(body.data.vertices):
    kd.insert(v.co, i)
kd.balance()
def mouth_weights(co):
    t = max(0.0, min(1.0, (abs(co.x) / 0.205 - 0.35) / 0.65))
    t = t * t * (3 - 2 * t)
    corner = "mouth_corner" + (".L" if co.x > 0 else ".R")
    return {corner: t, "head": 1 - t} if t > 1e-3 else {"head": 1.0}

for ob in parts_objs:
    vw = []
    if ob.name in RIGID or ob.name == "Groowie_Mouth":
        vw = [{RIGID[ob.name]: 1.0} if ob.name in RIGID else mouth_weights(v.co) for v in ob.data.vertices]
    for v in (ob.data.vertices if not vw else []):
        acc = {}
        for co, i, d in kd.find_n(v.co, 6):
            k = 1.0 / (d + 1e-4) ** 2
            for n, w in body_w[i].items():
                acc[n] = acc.get(n, 0) + w * k
        vw.append(clean(acc, v.co))
    set_weights(ob, vw)
    ob.parent = rig
    ob.modifiers.new("Armature", "ARMATURE").object = rig

sub = body.modifiers.new("Subdivision", "SUBSURF")              # after the armature modifier
sub.levels, sub.render_levels = 1, 2
mascot = [body] + parts_objs

# ------------------------------------------------------------------ animation
pb = rig.pose.bones
for b in pb:
    b.rotation_mode = "QUATERNION"
REST = {b.name: b.bone.matrix_local.to_quaternion() for b in pb}
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))

def R(name, *turns):
    """(axis, degrees) turns expressed in rig rest space -> bone-local quaternion."""
    q = Quaternion()
    for axis, deg in turns:
        q = Quaternion(Vector(axis), math.radians(deg)) @ q
    m = REST[name]
    return m.inverted() @ q @ m

def T(name, v):
    return REST[name].inverted() @ Vector(v)

def side(sfx):
    return 1 if sfx == ".L" else -1

def hand_axes(sfx):
    s = side(sfx)
    return mx(J["HAND_D"], s), mx(J["HAND_F"], s), mx(J["HAND_N"], s) * s  # palm faces the body

def curl(sfx, deg):
    d, f, palm = hand_axes(sfx)
    ax = d.cross(palm).normalized()
    p = {}
    for i, fname in enumerate(FINGER_NAMES):
        k = deg * (1.0 + 0.06 * (1 - i))                        # outer fingers curl a touch more
        p[f"{fname}_01{sfx}"] = R(f"{fname}_01{sfx}", (ax, k))
        p[f"{fname}_02{sfx}"] = R(f"{fname}_02{sfx}", (ax, k * 0.9))
    return p

def lids(sfx, upper, lower):
    e = EYES[sfx]
    return {"lid_upper" + sfx: R("lid_upper" + sfx, (e["h_up"], upper)),
            "lid_lower" + sfx: R("lid_lower" + sfx, (-e["h_up"], lower))}

def smile(amount):
    return {f"mouth_corner{s}@loc": T(f"mouth_corner{s}", (0, 0.3 * amount, amount)) for s in (".L", ".R")}

def blink(t, t0, dur=0.12):
    x = (t - t0) / dur
    return 0.0 if x <= 0 or x >= 1 else 178 * math.sin(math.pi * x)

def aim_hand(sfx, d_t, f_t):
    """Orient a hand so its length axis points d_t and its thumb side points f_t (rig space)."""
    d_r, f_r, _ = hand_axes(sfx)
    Mr = Matrix((d_r, f_r, d_r.cross(f_r))).transposed()
    d_t = Vector(d_t).normalized()
    f_t = (Vector(f_t) - d_t * Vector(f_t).dot(d_t)).normalized()
    Mt = Matrix((d_t, f_t, d_t.cross(f_t))).transposed()
    view_layer.update()
    b = pb["hand" + sfx]
    m = ((Mt @ Mr.inverted()) @ b.bone.matrix_local.to_3x3()).to_4x4()
    m.translation = b.matrix.translation
    b.matrix = m
    view_layer.update()

def aim_bone(name, direction):
    """Swing a bone (minimal rotation) so it points along `direction` in rig space."""
    view_layer.update()
    b = pb[name]
    cur = b.matrix.to_3x3()
    q = cur.col[1].normalized().rotation_difference(Vector(direction).normalized())
    m = (q.to_matrix() @ cur).to_4x4()
    m.translation = b.matrix.translation
    b.matrix = m
    view_layer.update()

def spin(v, axis, deg):
    return Quaternion(Vector(axis), math.radians(deg)) @ Vector(v)

def tail_wag(amp, phase, lift=0.0):
    return {f"tail_0{i}": R(f"tail_0{i}", (Z, amp * (0.55 + 0.25 * i) * math.sin(phase - 0.65 * i)), (X, -lift * i))
            for i in range(1, 5)}

def pose_idle(t):
    a = 2 * math.pi * t
    p = {
        "hips": R("hips", (Y, 1.2 * math.sin(a))),
        "spine": R("spine", (X, 1.2 * math.sin(a))),
        "chest": R("chest", (X, -1.6 * math.sin(a))),
        "head": R("head", (X, 2.0 * math.sin(a + 0.8)), (Y, -2.5 * math.sin(a))),
        "hips@loc": T("hips", (0, 0, 0.003 * math.sin(2 * a))),
    }
    for sfx in (".L", ".R"):
        s = side(sfx)
        p["upper_arm" + sfx] = R("upper_arm" + sfx, (Y, -s * 2.5 * math.sin(a + 0.5)), (X, 2 * math.sin(a)))
        p["forearm" + sfx] = R("forearm" + sfx, (X, -8 - 3 * math.sin(a + 1.0)))
        p.update(curl(sfx, 12))
    glance = 8 * math.sin(math.pi * min(1.0, max(0.0, (t - 0.12) / 0.36)))
    bl = blink(t, 0.62)
    for sfx in (".L", ".R"):
        p.update(lids(sfx, bl, bl * 0.12))
        p["eye" + sfx] = R("eye" + sfx, (Z, glance))
    p.update(smile(0.003))
    p.update(tail_wag(6, a))
    return p

def pose_walk(t):
    a = 2 * math.pi * t
    twist, waddle = -5 * math.sin(a), -4 * math.cos(a)
    p = {
        "hips": R("hips", (Z, twist), (Y, waddle)),
        "hips@loc": T("hips", (0.010 * -math.cos(a), 0, 0.006 - 0.016 * math.sin(a) ** 2)),
        "spine": R("spine", (X, 4), (Z, 3.5 * math.sin(a)), (Y, -waddle * 0.6)),
        "chest": R("chest", (Z, 4 * math.sin(a))),
        "neck": R("neck", (X, -2)),
        "head": R("head", (X, -2 + 2.5 * math.cos(2 * a)), (Z, -2.5 * math.sin(a)), (Y, -waddle * 0.5)),
    }
    for sfx in (".L", ".R"):
        ph = a + (0 if sfx == ".L" else math.pi)
        thigh = -26 * math.sin(ph)
        knee = 42 * max(0.0, math.cos(ph)) ** 1.4
        p["thigh" + sfx] = R("thigh" + sfx, (X, thigh), (Y, -waddle))
        p["shin" + sfx] = R("shin" + sfx, (X, knee))
        p["foot" + sfx] = R("foot" + sfx, (X, -(thigh + knee) * 0.85 + 6 * max(0.0, -math.cos(ph))))
        p["upper_arm" + sfx] = R("upper_arm" + sfx, (X, 30 * math.sin(ph)), (Y, -side(sfx) * 4))
        p["forearm" + sfx] = R("forearm" + sfx, (X, -12 - 16 * max(0.0, -math.sin(ph))))
        p.update(curl(sfx, 15))
    p.update(smile(0.005))
    p.update(tail_wag(9, a, lift=1.5 * math.sin(2 * a)))
    return p

def pose_wave(t):
    a = 2 * math.pi * t
    w = math.sin(3 * a)                                         # three waves per loop
    fore = spin((-0.56, -0.16, 0.81), Y, 18 * w)                # forearm swings side to side
    p = {
        "hips@loc": T("hips", (0, 0, 0.004 * math.sin(2 * a))),
        "spine": R("spine", (Y, 2.5)),
        "chest": R("chest", (Y, 3 + 1.2 * w)),
        "head": R("head", (Y, 5 + 1.5 * w), (X, -3)),
        "upper_arm.L": R("upper_arm.L", (X, 3 * math.sin(a))),
        "forearm.L": R("forearm.L", (X, -10)),
        **curl(".L", 15),
        **curl(".R", -6),
        "@aims": [("upper_arm.R", (-0.93, -0.10, 0.36)), ("forearm.R", fore)],
        "@hand": (".R", spin(fore, Y, 12 * math.sin(3 * a - 0.9)), (1, -0.15, 0.1)),  # palm to camera
    }
    for sfx in (".L", ".R"):
        p.update(lids(sfx, 34, 100))                            # happy smiling eyes
    p.update(smile(0.010))
    p.update(tail_wag(14, 2 * a))
    return p

def pose_thumbs(t):
    a = 2 * math.pi * t
    bob = math.sin(2 * a)
    p = {
        "hips@loc": T("hips", (0, 0, 0.005 * bob)),
        "spine": R("spine", (X, -2), (Z, 5)),
        "chest": R("chest", (Z, 4), (Y, 2)),
        "head": R("head", (Y, 6), (X, 2 * bob), (Z, -3)),
        **curl(".R", 95),
        "upper_arm.L": R("upper_arm.L", (Y, -6), (X, -6)),
        "forearm.L": R("forearm.L", (X, -14)),
        **curl(".L", 15),
        "@aims": [("upper_arm.R", (-0.90, -0.36, -0.24)), ("forearm.R", (-0.05, -0.84, 0.54 + 0.05 * bob))],
        "@hand": (".R", (0.30, -1.0, 0.05), (0, 0, 1)),             # thumb straight up
    }
    p.update(lids(".L", 176, 40))                               # wink
    p.update(lids(".R", 18, 62))
    p.update(smile(0.011))
    p.update(tail_wag(10, 2 * a))
    return p

ACTIONS = [("Idle", 48, pose_idle), ("Walk", 24, pose_walk), ("Wave", 48, pose_wave), ("ThumbsUp", 48, pose_thumbs)]

def solve(fn, t):
    """Pose the rig with no action bound and capture every bone's local transform."""
    for b in pb:
        b.rotation_quaternion = Quaternion()
        b.location = Vector()
    pose = fn(t)
    for k, v in pose.items():
        if k.endswith("@loc"):
            pb[k[:-4]].location = v
        elif not k.startswith("@"):
            pb[k].rotation_quaternion = v
    for name, direction in pose.get("@aims", []):
        aim_bone(name, direction)
    if "@hand" in pose:
        aim_hand(*pose["@hand"])
    return {b.name: (b.rotation_quaternion.copy(), b.location.copy()) for b in pb}

rig.animation_data_create()
for name, length, fn in ACTIONS:
    rig.animation_data.action = None
    frames = [solve(fn, (f % length) / length) for f in range(length + 1)]
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    rig.animation_data.action = act
    prev = {}
    for f, pose in enumerate(frames):
        for b in pb:
            q, l = pose[b.name]
            if b.name in prev and prev[b.name].dot(q) < 0:       # keep quaternion signs continuous
                q = -q
            prev[b.name] = q
            b.rotation_quaternion, b.location = q, l
            b.keyframe_insert("rotation_quaternion", frame=f, group=b.name)
            b.keyframe_insert("location", frame=f, group=b.name)
    act.use_frame_range = True
    act.frame_start, act.frame_end = 0, length
    act.use_cyclic = True
    print("ACTION", name, length, "frames")

for b in pb:
    b.rotation_quaternion = Quaternion()
    b.location = Vector()
rig.animation_data.action = bpy.data.actions["Idle"]
scene.frame_start, scene.frame_end = 0, 48

# ------------------------------------------------------------------ studio (not exported)
studio = bpy.data.collections.new("Studio")
scene.collection.children.link(studio)

def link(ob):
    studio.objects.link(ob)
    return ob

target = link(bpy.data.objects.new("CamTarget", None))
target.location = (0, 0.03, 0.52)

ground = bpy.data.meshes.new("Ground")
ground.from_pydata([(-15, -15, 0), (15, -15, 0), (15, 15, 0), (-15, 15, 0)], [], [(0, 1, 2, 3)])
g = link(bpy.data.objects.new("ShadowCatcher", ground))
g.is_shadow_catcher = True

def area(name, loc, size, power):
    L = bpy.data.lights.new(name, "AREA")
    L.shape = "DISK"
    L.size = size
    L.energy = power
    ob = link(bpy.data.objects.new(name, L))
    ob.location = loc
    ob.constraints.new("TRACK_TO").target = target
    return ob

area("Key", (-2.6, -3.0, 3.4), 2.6, 150)
area("Top", (0.15, -0.2, 4.0), 1.6, 70).visible_glossy = False
for name, loc, size, power, glossy in [("Fill", (3.2, -2.4, 1.3), 3.2, 30, False),
                                       ("Rim", (2.0, 3.0, 3.0), 2.0, 210, True),
                                       ("RimL", (-2.4, 2.6, 2.2), 2.0, 150, True)]:
    ob = area(name, loc, size, power)
    ob.visible_glossy = glossy
    ob.data.use_shadow = False

world = bpy.data.worlds.new("World")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.92, 0.95, 1.0, 1)
bg.inputs["Strength"].default_value = 0.09
scene.world = world

def camera(name, loc, lens=85):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    ob = link(bpy.data.objects.new(name, cd))
    ob.location = loc
    ob.constraints.new("TRACK_TO").target = target

D = 3.9
camera("front", (0, -D, 0.62))
camera("left_side", (D, 0, 0.62))
camera("right_side", (-D, 0, 0.62))
camera("back", (0, D, 0.62))
camera("hero", (-D * 0.62, -D * 0.78, 1.15))
camera("hero_right", (D * 0.62, -D * 0.78, 0.95))
scene.camera = bpy.data.objects["hero"]

scene.render.engine = "CYCLES"
scene.cycles.samples = 128
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.render.resolution_x = scene.render.resolution_y = 1600
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"

select_only(rig)
bpy.ops.wm.save_as_mainfile(filepath=f"{out}/groowie.blend")

# ------------------------------------------------------------------ exports
def select_mascot():
    bpy.ops.object.select_all(action="DESELECT")
    for o in mascot + [rig, root]:
        o.select_set(True)
    view_layer.objects.active = rig

select_mascot()
bpy.ops.export_scene.gltf(filepath=f"{out}/groowie.glb", export_format="GLB", use_selection=True,
                          export_apply=True, export_yup=True, export_skins=True,
                          export_animations=True, export_animation_mode="ACTIONS",
                          export_force_sampling=True, export_def_bones=False)
select_mascot()
bpy.ops.export_scene.fbx(filepath=f"{out}/groowie.fbx", use_selection=True, use_mesh_modifiers=True,
                         object_types={"EMPTY", "ARMATURE", "MESH"}, add_leaf_bones=False,
                         bake_anim=True, bake_anim_use_all_actions=True, bake_anim_use_nla_strips=False)
# USDZ (Apple Quick Look / AR) carries a single clip: the walk
rig.animation_data.action = bpy.data.actions["Walk"]
scene.frame_start, scene.frame_end = 0, 24
select_mascot()
try:
    bpy.ops.wm.usd_export(filepath=f"{out}/groowie.usdz", selected_objects_only=True,
                          export_materials=True, export_animation=True, export_armatures=True)
except Exception as e:
    print("usdz export failed:", e)
rig.animation_data.action = bpy.data.actions["Idle"]
scene.frame_start, scene.frame_end = 0, 48

tris = 0
dg = bpy.context.evaluated_depsgraph_get()
for o in mascot:
    me = o.evaluated_get(dg).to_mesh()
    me.calc_loop_triangles()
    tris += len(me.loop_triangles)
print("EXPORT TRIS", tris, "BONES", len(arm.bones), "DEFORM", len(DEFORM))
