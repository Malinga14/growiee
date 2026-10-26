"""GROOWIE v2 — procedural SDF modelling, built for rigging.

Units: metres. Z up, character faces -Y, feet on Z=0, height ~1.0.
Left side of the character is +X (Blender .L convention).

v2 changes: one continuous dorsal ridge (crest -> tail tip), no teeth,
longer curled tail, jointed arms (shoulder/elbow/wrist) with mitten hands
and thumbs, jointed legs (hip/knee/ankle) with shaped feet. Joint
positions are shared with the Blender rig via params.json.
"""
import json, math, os
import numpy as np
from skimage import measure

OUT = os.path.dirname(os.path.abspath(__file__)) + "/parts"
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- SDF helpers
def V(*a):
    return np.array(a, dtype=np.float32)

def unit(v):
    v = np.asarray(v, np.float32)
    return v / np.linalg.norm(v)

def length(p):
    return np.sqrt(np.sum(p * p, axis=-1))

def ellipsoid(p, c, r):
    q = (p - c) / r
    k0 = length(q)
    k1 = length(q / r)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)

def round_cone(p, a, b, r1, r2):
    ba = b - a
    l2 = float(ba @ ba)
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = p - a
    y = pa @ ba
    z = y - l2
    w = pa * l2 - y[..., None] * ba
    x2 = np.sum(w * w, axis=-1)
    y2 = y * y * l2
    z2 = z * z * l2
    k = math.copysign(1.0, rr) * rr * rr * x2
    d_tip = np.sqrt(x2 + z2) * il2 - r2
    d_base = np.sqrt(x2 + y2) * il2 - r1
    d_side = (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1
    return np.where(np.sign(z) * a2 * z2 > k, d_tip,
                    np.where(np.sign(y) * a2 * y2 < k, d_base, d_side))

def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)

def smax(a, b, k):
    return -smin(-a, -b, k)

def mirror_x(p):
    q = p.copy()
    q[..., 0] = np.abs(q[..., 0])
    return q

# ---------------------------------------------------------------- anatomy (left side, mirrored)
CRANIUM_C = V(0, 0.06, 0.665)
MUZZLE_C = V(0, -0.15, 0.545)
TORSO_C, TORSO_R = V(0, 0.0, 0.29), V(0.188, 0.145, 0.205)

SHOULDER = V(0.150, 0.030, 0.378)
ELBOW = V(0.212, 0.024, 0.298)
WRIST = V(0.243, 0.010, 0.226)
HAND_D = unit(WRIST - ELBOW)                                  # along the hand
_f = V(0, -1, 0)
HAND_F = unit(_f - (_f @ HAND_D) * HAND_D)                    # forward, thumb side
HAND_N = np.cross(HAND_D, HAND_F)                             # -X: palm faces the body
HAND_AXES = np.stack([HAND_D, HAND_F, HAND_N])
THUMB_BASE = WRIST + HAND_D * 0.026 + HAND_F * 0.030
THUMB_TIP = WRIST + HAND_D * 0.044 + HAND_F * 0.066
THUMB_MID = (THUMB_BASE + THUMB_TIP) / 2
FINGERS = []                                                  # ring, middle, index (index nearest the thumb)
for off in (-0.030, 0.0, 0.030):
    base = WRIST + HAND_D * 0.050 + HAND_F * (off - 0.004)
    dirn = unit(HAND_D + HAND_F * off * 3.0)                  # slight fan so the tips separate
    FINGERS.append((base, base + dirn * 0.021, base + dirn * 0.040))
FINGER_TIP = FINGERS[1][2]

HIP = V(0.100, 0.012, 0.205)
KNEE = V(0.100, 0.004, 0.118)
ANKLE = V(0.100, 0.000, 0.066)
TOE_END = V(0.100, -0.112, 0.030)

TAIL = [(V(0, 0.070, 0.245), 0.125), (V(0, 0.210, 0.170), 0.088), (V(0, 0.335, 0.136), 0.058),
        (V(0, 0.428, 0.146), 0.035), (V(0, 0.488, 0.180), 0.017)]

def head_sdf(p):
    cranium = ellipsoid(p, CRANIUM_C, V(0.300, 0.265, 0.262))
    muzzle = ellipsoid(p, MUZZLE_C, V(0.284, 0.205, 0.168))
    return smin(cranium, muzzle, 0.05)

def leg_sdf(m):
    thigh = round_cone(m, HIP, KNEE, 0.088, 0.080)
    shin = round_cone(m, KNEE, ANKLE, 0.080, 0.073)
    foot = ellipsoid(m, V(0.100, -0.028, 0.046), V(0.087, 0.120, 0.052))
    d = smin(smin(thigh, shin, 0.02), foot, 0.03)
    return smax(d, -m[..., 2], 0.012)                         # flat sole, softened edge

def upper_arm_sdf(m):
    return round_cone(m, SHOULDER, ELBOW, 0.060, 0.051)

def lower_arm_sdf(m):
    fore = round_cone(m, ELBOW, WRIST, 0.051, 0.045)
    q = ((m - WRIST) @ HAND_AXES.T) * V(1.0, 1.0, 1.42)       # palm: flatter across the hand
    palm = round_cone(q, V(0.008, 0, 0), V(0.046, 0, 0), 0.046, 0.042) / 1.2
    fingers = np.minimum.reduce([round_cone(m, b, t, 0.0168, 0.0155) for b, _, t in FINGERS])
    thumb = smin(round_cone(m, THUMB_BASE, THUMB_MID, 0.0175, 0.0158),
                 round_cone(m, THUMB_MID, THUMB_TIP, 0.0158, 0.0145), 0.004)
    return smin(fore, smin(smin(palm, fingers, 0.010), thumb, 0.010), 0.02)

def tail_sdf(p):
    d = np.full(p.shape[:-1], 1e3, np.float32)
    for (a, ra), (b, rb) in zip(TAIL[:-1], TAIL[1:]):
        d = smin(d, round_cone(p, a, b, ra, rb), 0.03)
    return d

def body_sdf(p):
    m = mirror_x(p)
    d = smin(head_sdf(p), ellipsoid(p, TORSO_C, TORSO_R), 0.06)
    d = smin(d, leg_sdf(m), 0.035)
    d = smin(d, upper_arm_sdf(m), 0.030)
    d = smin(d, lower_arm_sdf(m), 0.006)                      # hands stay clear of the hips
    d = smin(d, tail_sdf(p), 0.05)
    return d

def belly_sdf(p):
    shell = body_sdf(p) - 0.006
    q = (p[..., [0, 2]] - V(0, 0.275)) / V(0.136, 0.128)
    ell = (np.sqrt(np.sum(q * q, -1)) - 1.0) * 0.13
    d = smax(shell, ell, 0.006)
    d = smax(d, p[..., 1] + 0.02, 0.01)                       # front half only
    d = smax(d, -(head_sdf(p) - 0.012), 0.008)               # tucks under the chin
    return d

# ---------------------------------------------------------------- probing
def grad(f, p, e=1e-3):
    g = np.zeros(3, np.float32)
    for i in range(3):
        d = np.zeros(3, np.float32); d[i] = e
        g[i] = f((p + d)[None])[0] - f((p - d)[None])[0]
    return g / np.linalg.norm(g)

def surface_hit(f, origin, direction, tmax=0.8):
    direction = direction / np.linalg.norm(direction)
    ts = np.linspace(0, tmax, 1601, dtype=np.float32)
    vals = f(origin[None] + ts[:, None] * direction[None])
    assert vals[0] < 0, "probe origin must be inside"
    i = int(np.argmax(vals > 0))
    lo, hi = ts[i - 1], ts[i]
    for _ in range(30):
        mid = 0.5 * (lo + hi)
        if f((origin + mid * direction)[None])[0] > 0:
            hi = mid
        else:
            lo = mid
    p = origin + hi * direction
    return p.astype(np.float32), grad(f, p)

# ---------------------------------------------------------------- continuous dorsal ridge
def dorsal_path():
    """Mid-sagittal outline from the top of the head, over the back, to the tail tip."""
    res = 0.002
    ys = np.arange(-0.45, 0.62, res, dtype=np.float32)
    zs = np.arange(-0.03, 1.12, res, dtype=np.float32)
    Y, Z = np.meshgrid(ys, zs, indexing="ij")
    F = body_sdf(np.stack([np.zeros_like(Y), Y, Z], -1))
    c = max(measure.find_contours(F, 0.0), key=len)
    pts = np.stack([np.zeros(len(c)), ys[0] + c[:, 0] * res, zs[0] + c[:, 1] * res], -1).astype(np.float32)
    n = len(pts)
    i_top, i_tip = int(np.argmax(pts[:, 2])), int(np.argmax(pts[:, 1]))
    step = 1 if pts[(i_top + 1) % n, 1] > pts[i_top, 1] else -1
    path, i = [], i_top
    while True:
        path.append(pts[i])
        if i == i_tip:
            break
        i = (i + step) % n
    path = np.array(path)
    s = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(path, axis=0), axis=1))])
    return path, s

PATH, ARC = dorsal_path()
L_PATH = float(ARC[-1])
S_HEAD = float(ARC[int(np.argmax(head_sdf(PATH) > 0.004))])  # where the ridge leaves the head

def ridge_height(s):
    if s < S_HEAD:
        return 0.090 - 0.028 * (s / S_HEAD)
    t = (s - S_HEAD) / (L_PATH - S_HEAD)
    return 0.056 - 0.039 * t ** 1.1

def path_at(s):
    i = int(np.clip(np.searchsorted(ARC, s), 1, len(ARC) - 1))
    p = PATH[i]
    n = grad(body_sdf, p); n[0] = 0; n = unit(n)
    t = PATH[min(i + 3, len(PATH) - 1)] - PATH[max(i - 3, 0)]
    t = unit(t - (t @ n) * n)
    return p, n, t

def ridge_prims():
    prims = []                                                # (lo, hi, fn, k)
    # continuous base: a chain of round cones riding the outline
    ss = np.linspace(0, L_PATH, int(L_PATH / 0.01) + 1)
    pts = [path_at(s)[0] for s in ss]
    for s0, s1, a, b in zip(ss[:-1], ss[1:], pts[:-1], pts[1:]):
        r0, r1 = 0.36 * ridge_height(s0), 0.36 * ridge_height(s1)
        if np.linalg.norm(b - a) < 1e-4:
            continue
        lo, hi = np.minimum(a, b) - r0 - 0.02, np.maximum(a, b) + r0 + 0.02
        prims.append((lo, hi, (lambda p, a=a, b=b, r0=r0, r1=r1: round_cone(p, a, b, r0, r1)), 0.0))
    # lobes, spaced by their own size so neighbours overlap
    s, frames = 0.0, []
    while s < L_PATH - 0.012:
        h = ridge_height(s)
        p, n, t = path_at(s)
        frames.append((p, n, t, h))
        s += 1.12 * h
    for p, n, t, h in frames:
        def lobe(q, p=p, n=n, t=t, h=h):
            r = q - p
            u, v, w = r @ t, r @ n, r[..., 0]
            loc = np.stack([w * 1.45, u, v], -1)
            rb, rt = 0.92 * h, 0.56 * h
            return round_cone(loc, V(0, 0, -0.5 * h), V(0, 0.22 * h, h - rt), rb, rt) / 1.2
        lo, hi = p - 1.6 * h - 0.02, p + 1.6 * h + 0.02
        prims.append((lo, hi, lobe, 0.012))
    print(f"ridge: path {L_PATH:.3f} m, head part {S_HEAD:.3f} m, {len(frames)} lobes")
    return prims

# ---------------------------------------------------------------- face + toes
CHEEKS = [surface_hit(body_sdf, V(0, -0.05, 0.565), V(sx * 0.17, -0.20, 0))[0] for sx in (-1, 1)]

def blush_sdf(p):
    d = np.minimum.reduce([ellipsoid(p, c, V(0.046, 0.046, 0.029)) for c in CHEEKS])
    return smax(body_sdf(p) - 0.0016, d, 0.003)

def mouth_points():
    pts = []
    for phi in np.linspace(-58, 58, 47):
        a = math.radians(phi)
        z = 0.468 + 0.032 * (abs(phi) / 58.0) ** 2.2
        s, n = surface_hit(body_sdf, V(0, MUZZLE_C[1], z), V(math.sin(a), -math.cos(a), 0))
        pts.append((s - n * 0.0028).tolist())
    return pts

def sphere_on_surface(origin, target, r, protrude):
    s, n = surface_hit(body_sdf, origin, target - origin)
    return {"center": (s - n * (r - protrude)).tolist(), "radius": r, "normal": n.tolist()}

def details():
    eyes = [sphere_on_surface(CRANIUM_C, V(sx * 0.225, -0.13, 0.742), 0.033, 0.021) for sx in (-1, 1)]
    nostrils = [sphere_on_surface(MUZZLE_C, V(sx * 0.098, -0.33, 0.628), 0.0135, 0.0045) for sx in (-1, 1)]
    toes = []
    for sx in (-1, 1):
        for dx in (-0.044, 0.0, 0.044):
            o = V(sx * 0.10 + dx, -0.01, 0.026)
            toes.append(sphere_on_surface(o, o + V(0, -1, 0), 0.0145, 0.008))
    rig = {k: v.tolist() for k, v in dict(
        SHOULDER=SHOULDER, ELBOW=ELBOW, WRIST=WRIST, HAND_D=HAND_D, HAND_F=HAND_F, HAND_N=HAND_N,
        THUMB_BASE=THUMB_BASE, THUMB_TIP=THUMB_TIP, THUMB_MID=THUMB_MID, FINGER_TIP=FINGER_TIP,
        HIP=HIP, KNEE=KNEE, ANKLE=ANKLE, TOE_END=TOE_END).items()}
    rig["TAIL"] = [a.tolist() for a, _ in TAIL]
    rig["FINGERS"] = [[b.tolist(), j.tolist(), t.tolist()] for b, j, t in FINGERS]
    return {"eyes": eyes, "nostrils": nostrils, "toes": toes, "mouth": mouth_points(), "rig": rig}

# ---------------------------------------------------------------- meshing
def write_ply(path, verts, faces):
    with open(path, "wb") as fh:
        fh.write((f"ply\nformat binary_little_endian 1.0\nelement vertex {len(verts)}\n"
                  "property float x\nproperty float y\nproperty float z\n"
                  f"element face {len(faces)}\nproperty list uchar int vertex_indices\nend_header\n").encode())
        fh.write(verts.astype("<f4").tobytes())
        rec = np.empty(len(faces), dtype=[("n", "u1"), ("i", "<i4", 3)])
        rec["n"] = 3
        rec["i"] = faces
        fh.write(rec.tobytes())

def grid_axes(lo, hi, res):
    return [np.arange(lo[i], hi[i] + res, res, dtype=np.float32) for i in range(3)]

def march(name, vol, lo, res):
    verts, faces, _, _ = measure.marching_cubes(vol, 0.0, spacing=(res, res, res))
    verts += np.array(lo, np.float32)
    write_ply(f"{OUT}/{name}.ply", verts, faces[:, ::-1])
    print(f"{name}: {len(verts)} verts, {len(faces)} tris, grid {vol.shape}")

def mesh(name, f, lo, hi, res):
    ax = grid_axes(lo, hi, res)
    vol = np.empty([len(a) for a in ax], np.float32)
    Y, Z = np.meshgrid(ax[1], ax[2], indexing="ij")
    for i, x in enumerate(ax[0]):                             # slice to bound memory
        vol[i] = f(np.stack([np.full_like(Y, x), Y, Z], -1))
    march(name, vol, lo, res)

def mesh_prims(name, prims, lo, hi, res):
    """Union of many small primitives, each evaluated only inside its own box."""
    ax = grid_axes(lo, hi, res)
    vol = np.full([len(a) for a in ax], 1e3, np.float32)
    for plo, phi, fn, k in prims:
        idx = tuple(slice(max(0, int((plo[i] - ax[i][0]) / res)),
                          min(len(ax[i]), int((phi[i] - ax[i][0]) / res) + 2)) for i in range(3))
        X, Y, Z = np.meshgrid(ax[0][idx[0]], ax[1][idx[1]], ax[2][idx[2]], indexing="ij")
        d = fn(np.stack([X, Y, Z], -1))
        vol[idx] = smin(vol[idx], d, k) if k else np.minimum(vol[idx], d)
    march(name, vol, lo, res)

if __name__ == "__main__":
    mesh("body", body_sdf, (-0.38, -0.40, -0.004), (0.38, 0.53, 1.00), 0.0035)
    mesh("blush", blush_sdf, (-0.32, -0.36, 0.50), (0.32, -0.02, 0.66), 0.002)
    mesh("belly", belly_sdf, (-0.20, -0.22, 0.10), (0.20, 0.0, 0.45), 0.002)
    mesh_prims("spikes", ridge_prims(), (-0.07, -0.10, 0.05), (0.07, 0.60, 1.08), 0.0025)
    with open(f"{OUT}/params.json", "w") as fh:
        json.dump(details(), fh, indent=1)
    for stale in ("teeth.ply",):
        if os.path.exists(f"{OUT}/{stale}"):
            os.remove(f"{OUT}/{stale}")
    print("params written")
