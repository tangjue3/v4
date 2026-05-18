import bpy
import math
import random
from mathutils import Vector


SEED = 220518
random.seed(SEED)

TREE_HEIGHT = 11.2


def clear_scene():
    if bpy.ops.object.mode_set.poll():
        bpy.ops.object.mode_set(mode="OBJECT")

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.lights,
        bpy.data.cameras,
        bpy.data.images,
        bpy.data.textures,
    ):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    for collection in list(bpy.data.collections):
        if collection.users == 0:
            bpy.data.collections.remove(collection)


def ensure_collection(name, parent=None):
    collection = bpy.data.collections.get(name)
    if collection is None:
        collection = bpy.data.collections.new(name)

    target = parent or bpy.context.scene.collection
    if target.children.get(collection.name) is None:
        target.children.link(collection)
    return collection


def link_object(obj, collection):
    for old_collection in list(obj.users_collection):
        old_collection.objects.unlink(obj)
    collection.objects.link(obj)


def create_empty(name, collection, location=(0.0, 0.0, 0.0), parent=None):
    empty = bpy.data.objects.new(name, None)
    empty.empty_display_type = "PLAIN_AXES"
    empty.location = location
    empty.parent = parent
    collection.objects.link(empty)
    return empty


def look_at(obj, target, track="-Z", up="Y"):
    direction = (Vector(target) - obj.location).normalized()
    obj.rotation_euler = direction.to_track_quat(track, up).to_euler()


def set_material_option(material, attribute_name, value):
    if hasattr(material, attribute_name):
        try:
            setattr(material, attribute_name, value)
        except (AttributeError, TypeError, ValueError):
            pass


def set_node_input(node, preferred_name, value, fallback_names=()):
    for socket_name in (preferred_name, *fallback_names):
        socket = node.inputs.get(socket_name)
        if socket is not None:
            socket.default_value = value
            return


def quadratic_bezier(points, t):
    p0, p1, p2 = points
    return ((1 - t) ** 2) * p0 + (2 * (1 - t) * t) * p1 + (t ** 2) * p2


def quadratic_tangent(points, t):
    p0, p1, p2 = points
    tangent = (2 * (1 - t) * (p1 - p0)) + (2 * t * (p2 - p1))
    if tangent.length == 0:
        tangent = Vector((0.0, 0.0, 1.0))
    return tangent.normalized()


def perpendicular_side(tangent, fallback=Vector((1.0, 0.0, 0.0))):
    side = tangent.cross(Vector((0.0, 0.0, 1.0)))
    if side.length < 0.001:
        side = fallback
    return side.normalized()


def set_render_defaults():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_adaptive_sampling = True
    try:
        scene.cycles.use_denoising = True
        scene.cycles.denoiser = "OPENIMAGEDENOISE"
    except (AttributeError, TypeError):
        pass

    scene.render.resolution_x = 1280
    scene.render.resolution_y = 1600
    scene.render.film_transparent = False

    world = bpy.data.worlds.get("World")
    if world is None:
        world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    tex_coord = nodes.new("ShaderNodeTexCoord")
    tex_coord.location = (-900, 0)
    mapping = nodes.new("ShaderNodeMapping")
    mapping.location = (-700, 0)
    mapping.inputs["Rotation"].default_value = (0.0, 0.0, math.radians(90))
    gradient = nodes.new("ShaderNodeTexGradient")
    gradient.location = (-500, 0)
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.location = (-260, 0)
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.035, 0.04, 0.075, 1.0)
    ramp.color_ramp.elements[1].position = 0.58
    ramp.color_ramp.elements[1].color = (0.08, 0.06, 0.12, 1.0)
    top = ramp.color_ramp.elements.new(1.0)
    top.color = (0.13, 0.09, 0.11, 1.0)

    background = nodes.new("ShaderNodeBackground")
    background.location = (0, 0)
    background.inputs["Strength"].default_value = 1.0
    output = nodes.new("ShaderNodeOutputWorld")
    output.location = (220, 0)

    links.new(tex_coord.outputs["Generated"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], gradient.inputs["Vector"])
    links.new(gradient.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], background.inputs["Color"])
    links.new(background.outputs["Background"], output.inputs["Surface"])


def make_trunk_material():
    material = bpy.data.materials.new("Trunk_Red")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    tex_coord = nodes.new("ShaderNodeTexCoord")
    tex_coord.location = (-920, 0)
    mapping = nodes.new("ShaderNodeMapping")
    mapping.location = (-720, 0)
    mapping.inputs["Scale"].default_value = (1.5, 1.5, 4.2)
    noise = nodes.new("ShaderNodeTexNoise")
    noise.location = (-520, 80)
    noise.inputs["Scale"].default_value = 7.0
    noise.inputs["Detail"].default_value = 8.0
    wave = nodes.new("ShaderNodeTexWave")
    wave.location = (-520, -120)
    wave.inputs["Scale"].default_value = 2.4
    wave.inputs["Distortion"].default_value = 2.8
    mix = nodes.new("ShaderNodeMixRGB")
    mix.location = (-280, 0)
    mix.blend_type = "SOFT_LIGHT"
    mix.inputs["Fac"].default_value = 0.26
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.location = (-60, 0)
    ramp.color_ramp.elements[0].position = 0.16
    ramp.color_ramp.elements[0].color = (0.9, 0.9, 0.93, 1.0)
    ramp.color_ramp.elements[1].position = 0.9
    ramp.color_ramp.elements[1].color = (0.99, 0.985, 0.995, 1.0)

    principled = nodes.new("ShaderNodeBsdfPrincipled")
    principled.location = (180, 120)
    principled.inputs["Roughness"].default_value = 0.28
    set_node_input(principled, "Specular IOR Level", 0.6, fallback_names=("Specular",))
    emission = nodes.new("ShaderNodeEmission")
    emission.location = (180, -30)
    emission.inputs["Color"].default_value = (1.0, 0.88, 0.92, 1.0)
    emission.inputs["Strength"].default_value = 0.28
    add_shader = nodes.new("ShaderNodeAddShader")
    add_shader.location = (400, 60)
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (620, 60)

    links.new(tex_coord.outputs["Object"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
    links.new(mapping.outputs["Vector"], wave.inputs["Vector"])
    links.new(noise.outputs["Fac"], mix.inputs["Color1"])
    links.new(wave.outputs["Color"], mix.inputs["Color2"])
    links.new(mix.outputs["Color"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], principled.inputs["Base Color"])
    links.new(ramp.outputs["Color"], emission.inputs["Color"])
    links.new(principled.outputs["BSDF"], add_shader.inputs[0])
    links.new(emission.outputs["Emission"], add_shader.inputs[1])
    links.new(add_shader.outputs["Shader"], output.inputs["Surface"])
    return material


def make_leaf_material():
    material = bpy.data.materials.new("Leaf_Red")
    material.use_nodes = True
    set_material_option(material, "blend_method", "HASHED")
    set_material_option(material, "shadow_method", "HASHED")
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    object_info = nodes.new("ShaderNodeObjectInfo")
    object_info.location = (-660, 200)
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.location = (-440, 200)
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.72, 0.06, 0.14, 1.0)
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (0.98, 0.17, 0.28, 1.0)
    pink = ramp.color_ramp.elements.new(1.0)
    pink.color = (1.0, 0.56, 0.68, 1.0)

    principled = nodes.new("ShaderNodeBsdfPrincipled")
    principled.location = (-60, 160)
    principled.inputs["Roughness"].default_value = 0.45
    set_node_input(principled, "Specular IOR Level", 0.22, fallback_names=("Specular",))
    emission = nodes.new("ShaderNodeEmission")
    emission.location = (-60, 0)
    emission.inputs["Strength"].default_value = 0.5

    add_shader = nodes.new("ShaderNodeAddShader")
    add_shader.location = (180, 80)
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (400, 80)

    links.new(object_info.outputs["Random"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], principled.inputs["Base Color"])
    links.new(ramp.outputs["Color"], emission.inputs["Color"])
    links.new(principled.outputs["BSDF"], add_shader.inputs[0])
    links.new(emission.outputs["Emission"], add_shader.inputs[1])
    links.new(add_shader.outputs["Shader"], output.inputs["Surface"])
    return material


def make_aura_material():
    material = bpy.data.materials.new("Root_Aura")
    material.use_nodes = True
    set_material_option(material, "blend_method", "ADD")
    set_material_option(material, "shadow_method", "NONE")
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    transparent = nodes.new("ShaderNodeBsdfTransparent")
    transparent.location = (-40, -100)
    emission = nodes.new("ShaderNodeEmission")
    emission.location = (-40, 80)
    emission.inputs["Color"].default_value = (1.0, 0.96, 0.98, 1.0)
    emission.inputs["Strength"].default_value = 1.8
    layer_weight = nodes.new("ShaderNodeLayerWeight")
    layer_weight.location = (-260, 0)
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.location = (-60, 260)
    ramp.color_ramp.elements[0].position = 0.12
    ramp.color_ramp.elements[1].position = 0.88
    mix = nodes.new("ShaderNodeMixShader")
    mix.location = (180, 0)
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (400, 0)

    links.new(layer_weight.outputs["Facing"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], emission.inputs["Color"])
    links.new(ramp.outputs["Alpha"], mix.inputs["Fac"])
    links.new(transparent.outputs["BSDF"], mix.inputs[1])
    links.new(emission.outputs["Emission"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    return material


def make_mist_material():
    material = bpy.data.materials.new("Root_Mist")
    material.use_nodes = True
    set_material_option(material, "blend_method", "BLEND")
    set_material_option(material, "shadow_method", "NONE")
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    transparent = nodes.new("ShaderNodeBsdfTransparent")
    transparent.location = (-40, -80)
    principled = nodes.new("ShaderNodeBsdfPrincipled")
    principled.location = (-40, 120)
    principled.inputs["Base Color"].default_value = (0.98, 0.96, 0.99, 1.0)
    principled.inputs["Roughness"].default_value = 1.0
    principled.inputs["Alpha"].default_value = 0.16
    mix = nodes.new("ShaderNodeMixShader")
    mix.location = (180, 20)
    fresnel = nodes.new("ShaderNodeLayerWeight")
    fresnel.location = (-260, 20)
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (400, 20)

    links.new(fresnel.outputs["Facing"], mix.inputs["Fac"])
    links.new(transparent.outputs["BSDF"], mix.inputs[1])
    links.new(principled.outputs["BSDF"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    return material


def make_ground_material():
    material = bpy.data.materials.new("Ground_Shadow")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    principled = nodes.new("ShaderNodeBsdfPrincipled")
    principled.location = (0, 0)
    principled.inputs["Base Color"].default_value = (0.07, 0.07, 0.1, 1.0)
    principled.inputs["Roughness"].default_value = 0.9
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (200, 0)
    links.new(principled.outputs["BSDF"], output.inputs["Surface"])
    return material


def make_all_materials():
    return {
        "Trunk_Red": make_trunk_material(),
        "Leaf_Red": make_leaf_material(),
        "Root_Aura": make_aura_material(),
        "Root_Mist": make_mist_material(),
        "Ground_Shadow": make_ground_material(),
    }


def create_curve_branch(name, points, radii, bevel_depth, material, collection, parent=None):
    curve_data = bpy.data.curves.new(f"{name}_Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 20
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 6
    curve_data.fill_mode = "FULL"
    if hasattr(curve_data, "use_fill_caps"):
        curve_data.use_fill_caps = True

    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)

    for index, point in enumerate(spline.bezier_points):
        point.co = points[index]
        point.radius = radii[index]
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
        point.tilt = random.uniform(-0.06, 0.06)

    obj = bpy.data.objects.new(name, curve_data)
    obj.parent = parent
    collection.objects.link(obj)
    if material:
        curve_data.materials.append(material)
    return obj


def build_primary_structure(material, collection, parent):
    major_branches = []
    canopy_anchors = []

    trunk_core_points = [
        Vector((0.0, 0.0, 0.18)),
        Vector((-0.08, 0.02, 2.2)),
        Vector((0.05, -0.03, 4.45)),
        Vector((0.02, 0.08, 6.2)),
        Vector((0.0, 0.16, 7.0)),
    ]
    create_curve_branch(
        name="Trunk_Red_Core",
        points=trunk_core_points,
        radii=[2.7, 2.35, 1.95, 1.45, 1.02],
        bevel_depth=0.28,
        material=material,
        collection=collection,
        parent=parent,
    )

    base_specs = [
        {"root": (-0.28, -0.04, 3.35), "merge": (-0.42, -0.05, 4.6), "lift": (-1.08, -0.14, 6.55), "mid": (-1.95, -0.42, 8.25), "end": (-2.9, -0.6, 9.75)},
        {"root": (-0.05, 0.04, 3.85), "merge": (0.0, 0.08, 5.15), "lift": (0.16, 0.18, 7.25), "mid": (0.38, 0.22, 8.95), "end": (0.55, 0.3, 10.35)},
        {"root": (0.3, 0.0, 3.45), "merge": (0.52, 0.05, 4.85), "lift": (1.25, 0.46, 6.7), "mid": (2.18, 0.98, 8.35), "end": (3.15, 1.38, 9.75)},
        {"root": (-0.22, 0.18, 4.1), "merge": (-0.38, 0.55, 5.2), "lift": (-1.0, 1.35, 6.95), "mid": (-1.35, 2.05, 8.4), "end": (-1.7, 2.4, 9.95)},
        {"root": (0.18, -0.12, 4.0), "merge": (0.48, -0.02, 5.0), "lift": (1.95, 0.18, 6.35), "mid": (2.9, 0.62, 7.95), "end": (4.0, 1.0, 9.05)},
    ]

    for index, spec in enumerate(base_specs, start=1):
        points = [Vector(spec[key]) for key in ("root", "merge", "lift", "mid", "end")]
        radii = [1.28, 1.14, 0.88, 0.52, 0.22] if index <= 3 else [0.98, 0.82, 0.62, 0.36, 0.18]
        branch = create_curve_branch(
            name=f"Branch_Red_{index:02d}",
            points=points,
            radii=radii,
            bevel_depth=0.16 if index <= 3 else 0.13,
            material=material,
            collection=collection,
            parent=parent,
        )
        major_branches.append((branch, points))
        canopy_anchors.append(points[-1])

    secondary_specs = []
    for major_index, (_, points) in enumerate(major_branches, start=1):
        p0, p1, p2 = points[2], points[3], points[4]
        base_curve = [p0, p1, p2]
        tangent = quadratic_tangent(base_curve, 0.68)
        side = perpendicular_side(tangent)
        rise = Vector((0.0, 0.0, 1.0))

        for side_sign in (-1.0, 1.0):
            start_t = 0.28 if side_sign < 0 else 0.52
            start = quadratic_bezier(base_curve, start_t)
            sweep = tangent.lerp(side * side_sign, 0.56).normalized()
            middle = start + sweep * random.uniform(1.2, 1.8) + rise * random.uniform(0.6, 1.15)
            end = middle + sweep * random.uniform(1.0, 1.5) + rise * random.uniform(0.5, 0.95)
            secondary_specs.append(
                {
                    "name": f"Branch_Red_{major_index:02d}_Sub_{1 if side_sign < 0 else 2:02d}",
                    "points": [start, middle, end],
                    "radii": [0.82, 0.42, 0.16],
                    "bevel_depth": 0.105,
                }
            )
            canopy_anchors.append(end)

            twig_start = quadratic_bezier([start, middle, end], 0.56)
            twig_tangent = quadratic_tangent([start, middle, end], 0.56)
            twig_side = perpendicular_side(twig_tangent)
            twig_dir = twig_tangent.lerp(twig_side * random.choice((-1.0, 1.0)), 0.42).normalized()
            twig_mid = twig_start + twig_dir * random.uniform(0.65, 1.0) + rise * random.uniform(0.25, 0.5)
            twig_end = twig_mid + twig_dir * random.uniform(0.5, 0.8) + rise * random.uniform(0.18, 0.35)
            secondary_specs.append(
                {
                    "name": f"Branch_Red_{major_index:02d}_Twig_{1 if side_sign < 0 else 2:02d}",
                    "points": [twig_start, twig_mid, twig_end],
                    "radii": [0.28, 0.14, 0.06],
                    "bevel_depth": 0.052,
                }
            )
            canopy_anchors.append(twig_end)

    for spec in secondary_specs:
        create_curve_branch(
            name=spec["name"],
            points=spec["points"],
            radii=spec["radii"],
            bevel_depth=spec["bevel_depth"],
            material=material,
            collection=collection,
            parent=parent,
        )

    return canopy_anchors


def create_root_system(material, collection, parent):
    root_specs = []
    for index, angle_deg in enumerate((10, 62, 122, 186, 248, 308), start=1):
        angle = math.radians(angle_deg)
        direction = Vector((math.cos(angle), math.sin(angle), 0.0))
        start = Vector((0.0, 0.0, 0.22))
        middle = direction * random.uniform(0.85, 1.25) + Vector((0.0, 0.0, 0.1))
        end = direction * random.uniform(1.7, 2.4) + Vector((0.0, 0.0, random.uniform(-0.06, 0.08)))
        root_specs.append([start, middle, end])

    for index, points in enumerate(root_specs, start=1):
        create_curve_branch(
            name=f"Root_Red_{index:02d}",
            points=points,
            radii=[1.0, 0.62, 0.18],
            bevel_depth=0.13,
            material=material,
            collection=collection,
            parent=parent,
        )


def create_leaf_template(collection, parent, material):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.14, location=(0.0, 0.0, 0.0))
    leaf = bpy.context.active_object
    leaf.name = "Leaf_Template"
    link_object(leaf, collection)
    leaf.parent = parent
    if material:
        leaf.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    leaf.hide_render = True
    leaf.hide_set(True)
    return leaf


def create_canopy(anchors, leaf_template, collection, parent):
    leaf_count = 0
    for anchor_index, anchor in enumerate(anchors):
        cluster_scale = 1.4 if anchor.z > 9.0 else 1.12
        cluster_shape = Vector((
            random.uniform(0.8, 1.25) * cluster_scale,
            random.uniform(0.6, 1.0) * cluster_scale,
            random.uniform(0.55, 0.95) * cluster_scale,
        ))
        petals = random.randint(54, 84) if anchor.z > 9.0 else random.randint(36, 58)

        for _ in range(petals):
            leaf = leaf_template.copy()
            leaf.data = leaf_template.data
            leaf.hide_render = False
            leaf.hide_set(False)
            leaf.name = f"Leaf_Red_{anchor_index:02d}_{leaf_count:03d}"
            leaf.parent = parent

            angle = random.uniform(0.0, math.tau)
            radial = math.sqrt(random.random())
            height = random.uniform(-1.0, 1.0)
            offset = Vector((
                math.cos(angle) * cluster_shape.x * radial,
                math.sin(angle) * cluster_shape.y * radial,
                height * cluster_shape.z,
            ))
            offset += Vector((
                random.uniform(-0.12, 0.12),
                random.uniform(-0.12, 0.12),
                random.uniform(-0.08, 0.08),
            ))

            leaf.location = anchor + offset
            leaf.rotation_euler = (
                random.uniform(0.0, math.pi),
                random.uniform(0.0, math.pi),
                random.uniform(0.0, math.pi),
            )
            scale = random.uniform(0.55, 1.18)
            leaf.scale = (
                0.7 * scale,
                1.22 * scale,
                0.42 * scale,
            )
            collection.objects.link(leaf)
            leaf_count += 1


def create_root_fx(aura_material, mist_material, collection, parent):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.55, minor_radius=0.09, location=(0.0, 0.0, 0.08), rotation=(math.radians(90), 0.0, 0.0))
    aura_ring = bpy.context.active_object
    aura_ring.name = "Root_Aura_Ring"
    link_object(aura_ring, collection)
    aura_ring.parent = parent
    aura_ring.scale = (1.1, 1.1, 1.1)
    aura_ring.data.materials.append(aura_material)
    bpy.ops.object.shade_smooth()

    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.42, location=(0.0, 0.0, 0.28))
    mist = bpy.context.active_object
    mist.name = "Root_Mist"
    link_object(mist, collection)
    mist.parent = parent
    mist.scale = (1.85, 1.85, 0.52)
    mist.data.materials.append(mist_material)
    bpy.ops.object.shade_smooth()


def create_ground(material, collection, parent):
    bpy.ops.mesh.primitive_plane_add(size=14.0, location=(0.0, 0.0, -0.02))
    ground = bpy.context.active_object
    ground.name = "Preview_Ground"
    link_object(ground, collection)
    ground.parent = parent
    ground.data.materials.append(material)


def convert_object_to_mesh(obj):
    if obj.type == "MESH":
        return obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    return bpy.context.view_layer.objects.active


def prepare_export(root, collections):
    for collection in collections:
        for obj in list(collection.objects):
            if obj.type in {"CURVE", "FONT", "SURFACE", "META"}:
                convert_object_to_mesh(obj)
    root["export_format"] = "glb"
    root["style"] = "valorant_red_fantasy_tree"
    root["rotation_ready"] = True


def export_glb(filepath, collections):
    export_objects = []
    for collection in collections:
        export_objects.extend([obj for obj in collection.objects if obj.type == "MESH"])

    bpy.ops.object.select_all(action="DESELECT")
    for obj in export_objects:
        obj.select_set(True)
    if export_objects:
        bpy.context.view_layer.objects.active = export_objects[0]

    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
    )


def get_world_bounds(objects):
    mins = Vector((10_000.0, 10_000.0, 10_000.0))
    maxs = Vector((-10_000.0, -10_000.0, -10_000.0))
    for obj in objects:
        if obj.type not in {"MESH", "CURVE"}:
            continue
        for corner in obj.bound_box:
            world_corner = obj.matrix_world @ Vector(corner)
            mins.x = min(mins.x, world_corner.x)
            mins.y = min(mins.y, world_corner.y)
            mins.z = min(mins.z, world_corner.z)
            maxs.x = max(maxs.x, world_corner.x)
            maxs.y = max(maxs.y, world_corner.y)
            maxs.z = max(maxs.z, world_corner.z)
    return mins, maxs


def frame_camera_to_objects(camera, objects, margin=1.18):
    bounds_min, bounds_max = get_world_bounds(objects)
    center = (bounds_min + bounds_max) * 0.5
    size = bounds_max - bounds_min
    center.z += size.z * 0.05
    radius = max(size.x * 0.62, size.z * 0.48) * margin
    lens = max(32.0, camera.data.lens)
    sensor_width = camera.data.sensor_width or 36.0
    fov = 2.0 * math.atan(sensor_width / (2.0 * lens))
    distance = radius / max(math.tan(fov / 2.0), 0.18)
    distance = max(distance, 11.0)
    camera.location = Vector((center.x + size.x * 0.22, center.y - distance, center.z + size.z * 0.08))
    look_at(camera, center)
    return center


def create_camera_and_lights(collection, frame_objects):
    bpy.ops.object.camera_add(location=(7.4, -12.4, 7.8))
    camera = bpy.context.active_object
    camera.name = "Preview_Camera"
    link_object(camera, collection)
    camera.data.lens = 48
    camera.data.dof.use_dof = True
    camera.data.dof.aperture_fstop = 3.4
    focus_target = frame_camera_to_objects(camera, frame_objects, margin=1.12)
    camera.data.dof.focus_distance = (focus_target - camera.location).length
    bpy.context.scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(0.0, -6.5, 11.8))
    key = bpy.context.active_object
    key.name = "Key_Light"
    link_object(key, collection)
    key.data.energy = 7000
    key.data.shape = "RECTANGLE"
    key.data.size = 8.5
    key.data.size_y = 6.0
    key.data.color = (1.0, 0.96, 0.98)
    look_at(key, focus_target, track="-Z", up="Y")

    bpy.ops.object.light_add(type="AREA", location=(6.2, -1.6, 8.4))
    rim = bpy.context.active_object
    rim.name = "Rim_Light"
    link_object(rim, collection)
    rim.data.energy = 3800
    rim.data.shape = "RECTANGLE"
    rim.data.size = 4.6
    rim.data.size_y = 5.6
    rim.data.color = (1.0, 0.52, 0.62)
    look_at(rim, focus_target, track="-Z", up="Y")

    bpy.ops.object.light_add(type="POINT", location=(0.0, 0.0, 0.9))
    base = bpy.context.active_object
    base.name = "Root_Glow"
    link_object(base, collection)
    base.data.energy = 1200
    base.data.color = (1.0, 0.96, 0.98)


def main():
    clear_scene()
    set_render_defaults()

    root_collection = ensure_collection("FantasyTree_Scene")
    trunk_collection = ensure_collection("Trunk_System", root_collection)
    canopy_collection = ensure_collection("Canopy_System", root_collection)
    fx_collection = ensure_collection("FX_System", root_collection)
    environment_collection = ensure_collection("Environment_System", root_collection)

    root = create_empty("FantasyTree_ROOT", root_collection)
    trunk_group = create_empty("Trunk_GRP", trunk_collection, parent=root)
    canopy_group = create_empty("Canopy_GRP", canopy_collection, parent=root)
    fx_group = create_empty("FX_GRP", fx_collection, parent=root)
    env_group = create_empty("Environment_GRP", environment_collection, parent=root)

    materials = make_all_materials()

    create_root_system(materials["Trunk_Red"], trunk_collection, trunk_group)
    canopy_anchors = build_primary_structure(materials["Trunk_Red"], trunk_collection, trunk_group)

    leaf_template = create_leaf_template(canopy_collection, canopy_group, materials["Leaf_Red"])
    create_canopy(canopy_anchors, leaf_template, canopy_collection, canopy_group)

    create_root_fx(materials["Root_Aura"], materials["Root_Mist"], fx_collection, fx_group)
    create_ground(materials["Ground_Shadow"], environment_collection, env_group)

    prepare_export(root, (trunk_collection,))
    export_glb(
        r"D:\ZYY_Project\v4\public\knowledge-tree\knowledge-tree-red.glb",
        (trunk_collection, canopy_collection, fx_collection),
    )
    frame_objects = [obj for obj in list(trunk_collection.objects) + list(canopy_collection.objects) + list(fx_collection.objects) if obj.type in {"MESH", "CURVE"}]
    create_camera_and_lights(environment_collection, frame_objects)

    bpy.ops.object.select_all(action="DESELECT")
    print("Valorant-style red fantasy tree generated successfully.")


if __name__ == "__main__":
    main()
