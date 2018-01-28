/*
 * UBC CPSC 314, Vsep2017
 * Assignment 4 Template
 */

// Setup renderer
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF);
canvas.appendChild(renderer.domElement);

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  lightCamera.aspect = window.innerWidth / window.innerHeight;
  lightCamera.updateProjectionMatrix();
}

// Hook up to event listener
window.addEventListener('resize', resize);
window.addEventListener('vrdisplaypresentchange', resize, true);

// Disable scrollbar function
window.onscroll = function() {
  window.scrollTo(0, 0);
}

var depthScene = new THREE.Scene(); // shadowmap 
var finalScene = new THREE.Scene(); // final result

// Main camera 
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(0,10,20);
camera.lookAt(finalScene.position);
finalScene.add(camera);

// COMMENT BELOW FOR VR CAMERA
// ------------------------------

// Giving it some controls
cameraControl = new THREE.OrbitControls(camera);
cameraControl.damping = 0.2;
cameraControl.autoRotate = false;
// ------------------------------
// COMMENT ABOVE FOR VR CAMERA



// UNCOMMENT BELOW FOR VR CAMERA
// ------------------------------
// Apply VR headset positional data to camera.
// var controls = new THREE.VRControls(camera);
// controls.standing = true;

// // Apply VR stereo rendering to renderer.
// var effect = new THREE.VREffect(renderer);
// effect.setSize(window.innerWidth, window.innerHeight);


// var display;

// // Create a VR manager helper to enter and exit VR mode.
// var params = {
//   hideButton: false, // Default: false.
//   isUndistorted: false // Default: false.
// };
// var manager = new WebVRManager(renderer, effect, params);
// ------------------------------
// UNCOMMENT ABOVE FOR VR CAMERA


// ------------------------------
// LOADING MATERIALS AND TEXTURES

// Shadow map camera
var shadowMapWidth = 10
var shadowMapHeight = 10
var lightDirection = new THREE.Vector3(0.49,0.79,0.49);
var lightCamera = new THREE.OrthographicCamera(shadowMapWidth / - 2, shadowMapWidth / 2, shadowMapHeight / 2, shadowMapHeight / -2, 1, 1000)
lightCamera.position.set(10, 10, 10)
lightCamera.lookAt(new THREE.Vector3(lightCamera.position - lightDirection));
depthScene.add(lightCamera);

// XYZ axis helper
var worldFrame = new THREE.AxisHelper(2);
finalScene.add(worldFrame)

// texture containing the depth values from the lightCamera POV
// anisotropy allows the texture to be viewed decently at skewed angles
var shadowMapWidth = window.innerWidth
var shadowMapHeight = window.innerHeight

// Texture/Render Target where the shadowmap will be written to
var shadowMap = new THREE.WebGLRenderTarget(shadowMapWidth, shadowMapHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } )

// Loading the different textures 
// Anisotropy allows the texture to be viewed 'decently' at different angles
var colorMap = new THREE.TextureLoader().load('images/color.jpg')
colorMap.anisotropy = renderer.getMaxAnisotropy()
var normalMap = new THREE.TextureLoader().load('images/normal.png')
normalMap.anisotropy = renderer.getMaxAnisotropy()
var aoMap = new THREE.TextureLoader().load('images/ambient_occlusion.png')
aoMap.anisotropy = renderer.getMaxAnisotropy()

var colorMap2 = new THREE.TextureLoader().load('images/color2.jpg')
colorMap2.anisotropy = renderer.getMaxAnisotropy()
var normalMap2 = new THREE.TextureLoader().load('images/normal.png')
normalMap2.anisotropy = renderer.getMaxAnisotropy()
var aoMap2 = new THREE.TextureLoader().load('images/ambient_occlusion.png')
aoMap2.anisotropy = renderer.getMaxAnisotropy()

var colorMap3 = new THREE.TextureLoader().load('images/color3.jpg')
colorMap3.anisotropy = renderer.getMaxAnisotropy()
var normalMap3 = new THREE.TextureLoader().load('images/normal.png')
normalMap3.anisotropy = renderer.getMaxAnisotropy()
var aoMap3 = new THREE.TextureLoader().load('images/ambient_occlusion.png')
aoMap3.anisotropy = renderer.getMaxAnisotropy()

// Uniforms
var cameraPositionUniform = {type: "v3", value: camera.position }
var lightColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0) };
var ambientColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0) };
var lightDirectionUniform = {type: "v3", value: lightDirection };
var kAmbientUniform = {type: "f", value: 0.1};
var kDiffuseUniform = {type: "f", value: 0.8};
var kSpecularUniform = {type: "f", value: 0.4};
var shininessUniform = {type: "f", value: 50.0};
var lightViewMatrixUniform = {type: "m4", value: lightCamera.matrixWorldInverse};
var lightProjectMatrixUniform = {type: "m4", value: lightCamera.projectionMatrix};


var position1 = {type:"v3", value: new THREE.Vector3(0.0,0.0,0.0)};
var position2 = {type:"v3", value: new THREE.Vector3(0.0,0.0,0.0)};
var position3 = {type:"v3", value: new THREE.Vector3(0.0,0.0,0.0)};
var position4 = {type:"v3", value: new THREE.Vector3(0.0,0.0,0.0)};
var position5 = {type:"v3", value: new THREE.Vector3(0.0,0.0,0.0)};



// // Materials
// var depthMaterial = new THREE.ShaderMaterial({


//})

var terrainMaterial = new THREE.ShaderMaterial({
  // side: THREE.DoubleSide,
  uniforms: {
    lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform,
    colorMap: { type: "t", value: colorMap },
    normalMap: { type: "t", value: normalMap },
    aoMap: { type: "t", value: aoMap },
    shadowMap: { type: "t", value: shadowMap },
      lightViewMatrixUniform: lightViewMatrixUniform,
      lightProjectMatrixUniform:lightProjectMatrixUniform
  },
});

var electronMaterial = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    uniforms: {
        lightColorUniform: lightColorUniform,
        ambientColorUniform: ambientColorUniform,
        lightDirectionUniform: lightDirectionUniform,
        kAmbientUniform: kAmbientUniform,
        kDiffuseUniform: kDiffuseUniform,
        kSpecularUniform: kSpecularUniform,
        shininessUniform: shininessUniform,
        colorMap: { type: "t", value: colorMap2 },
        normalMap: { type: "t", value: normalMap2 },
        aoMap: { type: "t", value: aoMap2 },
        shadowMap: { type: "t", value: shadowMap },
        lightViewMatrixUniform: lightViewMatrixUniform,
        lightProjectMatrixUniform:lightProjectMatrixUniform,
        position1: position1
    },
});

var electronMaterial2 = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    uniforms: {
        lightColorUniform: lightColorUniform,
        ambientColorUniform: ambientColorUniform,
        lightDirectionUniform: lightDirectionUniform,
        kAmbientUniform: kAmbientUniform,
        kDiffuseUniform: kDiffuseUniform,
        kSpecularUniform: kSpecularUniform,
        shininessUniform: shininessUniform,
        colorMap: { type: "t", value: colorMap3 },
        normalMap: { type: "t", value: normalMap3 },
        aoMap: { type: "t", value: aoMap3 },
        shadowMap: { type: "t", value: shadowMap },
        lightViewMatrixUniform: lightViewMatrixUniform,
        lightProjectMatrixUniform:lightProjectMatrixUniform,
        position2: position2
    },
});

var electronMaterial3 = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    uniforms: {
        lightColorUniform: lightColorUniform,
        ambientColorUniform: ambientColorUniform,
        lightDirectionUniform: lightDirectionUniform,
        kAmbientUniform: kAmbientUniform,
        kDiffuseUniform: kDiffuseUniform,
        kSpecularUniform: kSpecularUniform,
        shininessUniform: shininessUniform,
        colorMap: { type: "t", value: colorMap3 },
        normalMap: { type: "t", value: normalMap3 },
        aoMap: { type: "t", value: aoMap3 },
        shadowMap: { type: "t", value: shadowMap },
        lightViewMatrixUniform: lightViewMatrixUniform,
        lightProjectMatrixUniform:lightProjectMatrixUniform,
        position3: position3
    },
});

var electronMaterial4 = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    uniforms: {
        lightColorUniform: lightColorUniform,
        ambientColorUniform: ambientColorUniform,
        lightDirectionUniform: lightDirectionUniform,
        kAmbientUniform: kAmbientUniform,
        kDiffuseUniform: kDiffuseUniform,
        kSpecularUniform: kSpecularUniform,
        shininessUniform: shininessUniform,
        colorMap: { type: "t", value: colorMap3 },
        normalMap: { type: "t", value: normalMap3 },
        aoMap: { type: "t", value: aoMap3 },
        shadowMap: { type: "t", value: shadowMap },
        lightViewMatrixUniform: lightViewMatrixUniform,
        lightProjectMatrixUniform:lightProjectMatrixUniform,
        position4: position4
    },
});

var electronMaterial5 = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    uniforms: {
        lightColorUniform: lightColorUniform,
        ambientColorUniform: ambientColorUniform,
        lightDirectionUniform: lightDirectionUniform,
        kAmbientUniform: kAmbientUniform,
        kDiffuseUniform: kDiffuseUniform,
        kSpecularUniform: kSpecularUniform,
        shininessUniform: shininessUniform,
        colorMap: { type: "t", value: colorMap3 },
        normalMap: { type: "t", value: normalMap3 },
        aoMap: { type: "t", value: aoMap3 },
        shadowMap: { type: "t", value: shadowMap },
        lightViewMatrixUniform: lightViewMatrixUniform,
        lightProjectMatrixUniform:lightProjectMatrixUniform,
        position5: position5
    },
});

// var armadilloMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     lightColorUniform: lightColorUniform,
//     ambientColorUniform: ambientColorUniform,
//     lightDirectionUniform: lightDirectionUniform,
//     kAmbientUniform: kAmbientUniform,
//     kDiffuseUniform: kDiffuseUniform,
//     kSpecularUniform: kSpecularUniform,
//     shininessUniform: shininessUniform,
//   },
// });

var skyboxCubemap = new THREE.CubeTextureLoader()
  .setPath( 'images/cubemap/' )
  .load( [
  'cube1.png', 'cube2.png',
  'cube3.png', 'cube4.png',
  'cube5.png', 'cube6.png'
  ] );

var skyboxMaterial = new THREE.ShaderMaterial({
	uniforms: {
		skybox: { type: "t", value: skyboxCubemap },
	},
    side: THREE.DoubleSide
})

// var smaterial = new THREE.ShaderMaterial({
//     uniforms: {
//             lightColorUniform: lightColorUniform,
//     ambientColorUniform: ambientColorUniform,
//     lightDirectionUniform: lightDirectionUniform,
//     kAmbientUniform: kAmbientUniform,
//     kDiffuseUniform: kDiffuseUniform,
//     kSpecularUniform: kSpecularUniform,
//     shininessUniform: shininessUniform,
//     colorMap: { type: "t", value: colorMap },
//     normalMap: { type: "t", value: normalMap },
//     aoMap: { type: "t", value: aoMap },
//     shadowMap: { type: "t", value: shadowMap },
//       lightViewMatrixUniform: lightViewMatrixUniform,
//       lightProjectMatrixUniform:lightProjectMatrixUniform
//
//     },
// })



// -------------------------------
// LOADING SHADERS
var shaderFiles = [
  // 'glsl/depth.vs.glsl',
  // 'glsl/depth.fs.glsl',
  //
  'glsl/terrain.vs.glsl',
  'glsl/terrain.fs.glsl',

    'glsl/electron.vs.glsl',
    'glsl/electron.fs.glsl',

    'glsl/electron2.vs.glsl',
    'glsl/electron2.fs.glsl',

    'glsl/electron3.vs.glsl',
    'glsl/electron3.fs.glsl',

    'glsl/electron4.vs.glsl',
    'glsl/electron4.fs.glsl',

    'glsl/electron5.vs.glsl',
    'glsl/electron5.fs.glsl',
  //
  // 'glsl/bphong.vs.glsl',
  // 'glsl/bphong.fs.glsl',

  'glsl/skybox.vs.glsl',
  'glsl/skybox.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
	// depthMaterial.vertexShader = shaders['glsl/depth.vs.glsl']
	// depthMaterial.fragmentShader = shaders['glsl/depth.fs.glsl']
	terrainMaterial.vertexShader = shaders['glsl/terrain.vs.glsl']
	terrainMaterial.fragmentShader = shaders['glsl/terrain.fs.glsl']
    electronMaterial.vertexShader = shaders['glsl/electron.vs.glsl']
    electronMaterial.fragmentShader = shaders['glsl/electron.fs.glsl']
    electronMaterial2.vertexShader = shaders['glsl/electron2.vs.glsl']
    electronMaterial2.fragmentShader = shaders['glsl/electron2.fs.glsl']
    electronMaterial3.vertexShader = shaders['glsl/electron3.vs.glsl']
    electronMaterial3.fragmentShader = shaders['glsl/electron3.fs.glsl']
    electronMaterial4.vertexShader = shaders['glsl/electron4.vs.glsl']
    electronMaterial4.fragmentShader = shaders['glsl/electron4.fs.glsl']
    electronMaterial5.vertexShader = shaders['glsl/electron5.vs.glsl']
    electronMaterial5.fragmentShader = shaders['glsl/electron5.fs.glsl']


    //  smaterial.vertexShader = shaders['glsl/bphong.vs.glsl']
	//  smaterial.fragmentShader = shaders['glsl/bphong.fs.glsl']
	skyboxMaterial.vertexShader = shaders['glsl/skybox.vs.glsl']	
	skyboxMaterial.fragmentShader = shaders['glsl/skybox.fs.glsl']
})

// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(scene, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if (query.lengthComputable) {
      var percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    scene.add(object)
  }, onProgress, onError);
}

// -------------------------------
// ADD OBJECTS TO THE SCENE
var terrainGeometry = new THREE.SphereGeometry(2, 32, 32);
var terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
terrain.rotation.set(-1.57, 0, 0)
finalScene.add(terrain)

var electronGeometery = new THREE.SphereGeometry(0.5, 32, 32);
var electron = new THREE.Mesh(electronGeometery, electronMaterial)
finalScene.add(electron)

var electronGeometery2 = new THREE.SphereGeometry(0.5, 32, 32);
var electron2 = new THREE.Mesh(electronGeometery2, electronMaterial2)
finalScene.add(electron2)

var electronGeometery3 = new THREE.SphereGeometry(0.5, 32, 32);
var electron3 = new THREE.Mesh(electronGeometery3, electronMaterial3)
finalScene.add(electron3)

var electronGeometery4 = new THREE.SphereGeometry(0.5, 32, 32);
var electron4 = new THREE.Mesh(electronGeometery4, electronMaterial4)
finalScene.add(electron4)

var electronGeometery5 = new THREE.SphereGeometry(0.5, 32, 32);
var electron5 = new THREE.Mesh(electronGeometery5, electronMaterial5)
finalScene.add(electron5)

var orbitRad = 24;
var ringGeom = new THREE.RingGeometry( orbitRad, orbitRad+0.015, 30 );
var ringMat = new THREE.MeshBasicMaterial( { color:0xe0ffff, side: THREE.DoubleSide } );
var ringEl = new THREE.Mesh( ringGeom, ringMat );
ringEl.rotateX(-1.57)
finalScene.add( ringEl );

var orbitRad2 = 24;
var ringGeom2 = new THREE.RingGeometry( orbitRad2, orbitRad2+0.015, 30 );
var ringMat2 = new THREE.MeshBasicMaterial( { color:0xe0ffff, side: THREE.DoubleSide } );
var ringEl2 = new THREE.Mesh( ringGeom2, ringMat2 );
//ringEl.rotateX(-1.57)
finalScene.add( ringEl2 );

var orbitRad3 = 24;
var ringGeom3 = new THREE.RingGeometry( orbitRad3, orbitRad3+0.015, 30 );
var ringMat3 = new THREE.MeshBasicMaterial( { color:0xe0ffff, side: THREE.DoubleSide } );
var ringEl3 = new THREE.Mesh( ringGeom3, ringMat3 );
ringEl3.rotateY(-1.57)
finalScene.add( ringEl3 );

var orbitRad4 = 24;
var ringGeom4 = new THREE.RingGeometry( orbitRad4, orbitRad4+0.015, 30 );
var ringMat4 = new THREE.MeshBasicMaterial( { color:0xe0ffff, side: THREE.DoubleSide } );
var ringEl4 = new THREE.Mesh( ringGeom4, ringMat4 );
 ringEl4.rotateY(0.785398)
finalScene.add( ringEl4 );

var orbitRad5 = 24;
var ringGeom5 = new THREE.RingGeometry( orbitRad5, orbitRad5+0.015, 30 );
var ringMat5 = new THREE.MeshBasicMaterial( { color:0xe0ffff, side: THREE.DoubleSide } );
var ringEl5 = new THREE.Mesh( ringGeom5, ringMat5 );
ringEl5.rotateY(-0.785398)
finalScene.add( ringEl5 );

// var terrainDO = new THREE.Mesh(terrainGeometry, depthMaterial)
// terrainDO.rotation.set(-1.57, 0, 0)
// depthScene.add(terrainDO)

var skyBoxGeo = new THREE.BoxGeometry(1000.0, 1000.0, 1000.0);
var sky = new THREE.Mesh(skyBoxGeo, skyboxMaterial);
finalScene.add(sky);

// var geometry = new THREE.SphereGeometry( 5, 32, 32 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// var sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );

//loadOBJ(finalScene, 'obj/armadillo.obj', armadilloMaterial, 1.0, 0, 1.0, 0, 0, 0, 0)
//(depthScene, 'obj/armadillo.obj', depthMaterial, 1.0, 0, 1.0, 0, 0, 0, 0)

// -------------------------------
// UPDATE ROUTINES
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() { }

function updateMaterials() {
	cameraPositionUniform.value = camera.position

	// depthMaterial.needsUpdate = true
	terrainMaterial.needsUpdate = true
    electronMaterial.needsUpdate = true
    electronMaterial2.needsUpdate = true
    electronMaterial3.needsUpdate = true
    electronMaterial4.needsUpdate = true
    electronMaterial5.needsUpdate = true

    // armadilloMaterial.needsUpdate = true
	skyboxMaterial.needsUpdate = true
}

// Update routine

var time = 0.0010;
function update() {
	checkKeyboard()
	updateMaterials()

	requestAnimationFrame(update)
	renderer.render(depthScene, lightCamera, shadowMap);
	renderer.render(finalScene, camera);

    time += 0.10;


    position1.value.x = orbitRad*Math.cos(time);
    position1.value.z = orbitRad*Math.sin(time);

    position2.value.x = orbitRad2*Math.cos(time);
    position2.value.y = orbitRad2*Math.sin(time);

    position3.value.y = orbitRad3*Math.cos(time);
    position3.value.z = orbitRad3*Math.sin(time);

    position4.value.x = 0.8*orbitRad4*Math.cos(time);
    position4.value.y = -1.04*orbitRad4*Math.sin(time);
    position4.value.z = -0.6*orbitRad4*Math.cos(time);

    position5.value.x = -0.8*orbitRad5*Math.cos(time);
    position5.value.y = 1.04*orbitRad5*Math.sin(time);
    position5.value.z = -0.6*orbitRad5*Math.cos(time);





    // UNCOMMENT BELOW FOR VR CAMERA
  // ------------------------------
  // Update VR headset position and apply to camera.
  // controls.update();
  // ------------------------------
  // UNCOMMENT ABOVE FOR VR CAMERA

  // To see the shadowmap values: 
    // renderer.render(depthScene, lightCamera)
}

resize()
update();
