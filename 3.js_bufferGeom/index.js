if(! Detector.webgl) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer, controls;
var mesh;

var mic, soundFile;
var amplitude;
var mapMax = 1.0;

mic = new p5.AudioIn();
mic.start();

amplitude = new p5.Amplitude();
amplitude.setInput(mic);


d3.json('map.json',function(json){

  for (var i = 0; i < json.length; i++) {
    json[i].x = +json[i].x * 10;
    json[i].y = +json[i].y * 10;
    json[i].z = +json[i].z * 10;
  };


  init(json); //only excute once
  animate();
});
function init(json){
  container = document.getElementById('container');

  //

  camera = new THREE.PerspectiveCamera(27, window.innerWidth/window.innerHeight, 1, 350000);
  camera.position.z = 2750;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x050505, 2000, 350000 );

  //

  scene.add(new THREE.AmbientLight( 0x444444 ));

  var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light1.position.set(1,1,1);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light2.position.set(0,-1,0);
  scene.add(light2);

  //

  var triangles = json.length; // 29095
  // 360000;


  var geometry = new THREE.BufferGeometry();

  var positions = new Float32Array( triangles * 3 * 3);
  var normals = new Float32Array( triangles * 3 * 3);
  var colors = new Float32Array( triangles * 3 * 3);

  var color = new THREE.Color();


	var n = 800, n2 = n/2;	// triangles spread in the cube
	var d = 4, d2 = d/2;	// individual triangle size

  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();

  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();

//---------------change :

  for(var i = 0; i< positions.length; i+=9){

      //positions
      // console.log(json[i]);
      // console.log(i);
      // debugger
      var x =
      // json[i / 3 / 3].x;
      Math.random() * n - n2;
      var y =
      // json[i / 3 / 3].y;
      Math.random() * n - n2;
      var z =
      // json[i / 3 / 3].z;
      // console.log(Math.random() * n - n2);
      Math.random() * n - n2;

      var ax = x + Math.random() * d - d2;
      var ay = y + Math.random() * d - d2;
      var az = z + Math.random() * d - d2;


      var bx = x + Math.random() * d - d2;
      var by = y + Math.random() * d - d2;
      var bz = z + Math.random() * d - d2;

      var cx = x + Math.random() * d - d2;
			var cy = y + Math.random() * d - d2;
		  var cz = z + Math.random() * d - d2;

      positions[i] = ax;
      positions[i + 1] = ay;
      positions[i + 2] = az;

      positions[i + 3] = bx;
      positions[i + 4] = by;
      positions[i + 5] = bz;

      positions[i + 6] = cx;
      positions[i + 7] = cy;
      positions[i + 8] = cz;

      // flat face normals

      pA.set(ax, ay, az);
      pB.set(bx, by, bz);
      pC.set(cx, cy, cz);

      cb.subVectors(pC, pB);
      ab.subVectors(pA, pB);
      cb.cross(ab);

      cb.normalize();
      var nx = cb.x;
      var ny = cb.y;
      var nz = cb.z;

      normals[i] = nx;
      normals[ i + 1 ] = ny;
			normals[ i + 2 ] = nz;
			normals[ i + 3 ] = nx;
			normals[ i + 4 ] = ny;
			normals[ i + 5 ] = nz;
			normals[ i + 6 ] = nx;
			normals[ i + 7 ] = ny;
			normals[ i + 8 ] = nz;

      // colors

      var vx = (x/n) +0.5;
      var vy = (y/n) +0.5;
      var vz = (z/n) +0.5;

      color.setRGB( vx, vy, vz );

      colors[i] = color.r;
      colors[ i + 1 ] = color.g;
			colors[ i + 2 ] = color.b;
			colors[ i + 3 ] = color.r;
			colors[ i + 4 ] = color.g;
			colors[ i + 5 ] = color.b;
			colors[ i + 6 ] = color.r;
			colors[ i + 7 ] = color.g;
			colors[ i + 8 ] = color.b;

  }

  function disposeArray(){ this.array = null;}

  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
  geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).onUpload( disposeArray ) );


  geometry.computeBoundingSphere();

  var material = new THREE.MeshPhongMaterial( {
    color: 0xaaaaaa,
    specular: 0xffffff,
    shininess: 250,
		side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors
  } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.gammaInput = true;
  renderer.gamaOutput = true;

  container.appendChild( renderer.domElement );

  //

  stats = new Stats();
  container.appendChild( stats.dom );

  //

  window.addEventListener('resize', onWindowResize, false);

  //
  //add controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0,100,0)

}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(){
  var level = amplitude.getLevel();
// text('Amplitude: ' + level, 20, 20);
// text('mapMax: ' + mapMax, 20, 40);
// camera.position.x = camera.position.x +(10000* level)



  requestAnimationFrame( animate );
  render();
  stats.update();
  controls.update();
}

function render(){
  amplitude.smooth(0.91);


  var level = amplitude.getLevel();
  var randomNumber = Math.floor(Math.random() * 1) - 0.5;

   time = Date.now() * 0.001;
  camera.position.z = 2300 + level*3000 *randomNumber
  // camera.position.z = Math.sin(time)
  // mesh.rotation.x = level*10+ time;
  mesh.rotation.y = time * .5 + level;
  // mesh.rotation.z = level;
  renderer.render( scene, camera );
}
