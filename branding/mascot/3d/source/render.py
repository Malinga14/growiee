"""Render stills / animation frames from groowie.blend.

blender -b out/groowie.blend -P render.py -- <out_dir> <job> [<job> ...]
job = action:camera:frames:prefix   e.g.  Walk:hero:0-23:walk   none:front:0:rest_front
"""
import os, sys
import bpy
from mathutils import Quaternion, Vector

args = sys.argv[sys.argv.index("--") + 1:]
out, jobs = args[0], args[1:]
scene = bpy.context.scene
scene.render.resolution_x = scene.render.resolution_y = int(os.environ.get("RES", 1600))
scene.cycles.samples = int(os.environ.get("SAMPLES", 128))
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("GPU unavailable:", e)

rig = bpy.data.objects["GROOWIE_Rig"]
for job in jobs:
    action, cam, frames, prefix = job.split(":")
    if action == "none":
        rig.animation_data.action = None
        for b in rig.pose.bones:
            b.rotation_quaternion = Quaternion()
            b.location = Vector()
    else:
        rig.animation_data.action = bpy.data.actions[action]
    scene.camera = bpy.data.objects[cam]
    if "-" in frames:
        a, b = map(int, frames.split("-"))
        fl = range(a, b + 1)
    else:
        fl = [int(f) for f in frames.split(",")]
    for f in fl:
        scene.frame_set(f)
        scene.render.filepath = f"{out}/{prefix}_{f:03d}.png"
        bpy.ops.render.render(write_still=True)
    print("rendered", job)
