options = {
    d : 2,
  //amplitude sooth
    smooth: 0.91,
  //camera z distance
    z : 1300,
    z_bounceRate : 300,
    z_bounceRateGlitch : true,
  // global intense rate
    time_factor : 0.0005,
  // y intence rate
    y_factor : 10,
    particle_num : 129095,
    tween : function(target, start_v, end_v, time, easeFc){
        var diff = end_v - start_v;
        timer_zoom = d3.timer((e) =>{
            var ease = Math.min(1,d3[easeFc](e/time,4));
            this[target] = start_v +(diff * ease);
            console.log(this[target]);

            if(target === 'particle_num'){
              this.rerun(Math.floor(this[target]),this.d);
            }
            if(ease == 1){
              timer_zoom.stop();
            }
        })
    },
    rerun : function(particle_num,particle_size){
        //reevaluate mesh
        mesh = null;
        var triangles = particle_num? particle_num : this.particle_num; // 29095
        // 360000;

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array( triangles * 3 * 3);
        var normals = new Float32Array( triangles * 3 * 3);
        var colors = new Float32Array( triangles * 3 * 3);

        var color = new THREE.Color();

        var d_ = particle_size ? particle_size : options.d;
        var n = 800, n2 = n/2;	// triangles spread in the cube
        var d2 = d_/2;	// individual triangle size

        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();

        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();

        //---------------change :

        for(var i = 0; i< positions.length; i+=9){

            //positions
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            var ax = x + Math.random() * (d_* 2*Math.random()) - d2;
            var ay = y + Math.random() * d_ - d2;
            var az = z + Math.random() * d_ - d2;


            var bx = x + Math.random() * d_ - d2;
            var by = y + Math.random() * (d_* 2*Math.random()) - d2;
            var bz = z + Math.random() * d_ - d2;

            var cx = x + Math.random() * d_ - d2;
            var cy = y + Math.random() * (d_* 2*Math.random()) - d2;
            var cz = z + Math.random() * (d_* 2*Math.random()) - d2;

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
          specular: 0x000000,
          shininess: 250,
          side: THREE.DoubleSide,
          vertexColors: THREE.VertexColors
        } );

        mesh = new THREE.Mesh( geometry, material );
        // console.log("UPDATE mesh --->\ncurrent mesh: ",mesh );

        scene.add( mesh );

        scene.children.forEach((d) =>{
          d.uuid == previous_uuid ? scene.remove(d) : null
        });
        previous_uuid = mesh.uuid;
        // console.log("DONE UPDATE --->\nset current mesh to previous: ",mesh );

    }



}//options

if(! Detector.webgl) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer, controls;
var mesh;

var mic, soundFile;
var amplitude;
var mapMax = 1.0;

var previous_uuid;

mic = new p5.AudioIn();
mic.start();

amplitude = new p5.Amplitude();
amplitude.setInput(mic);


  init(); //only excute once
  animate();



function init(){
  container = document.getElementById('container');

  //

  camera = new THREE.PerspectiveCamera(27, window.innerWidth/window.innerHeight, 1, 350000);
  camera.position.z = 2250;

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



    var triangles =  290950;
    // 360000;


    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( triangles * 3 * 3);
    var normals = new Float32Array( triangles * 3 * 3);
    var colors = new Float32Array( triangles * 3 * 3);

    var color = new THREE.Color();


    var n = 800, n2 = n/2;	// triangles spread in the cube
    var d2 = options.d/2;	// individual triangle size

    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    //---------------change :

    for(var i = 0; i< positions.length; i+=9){

        //positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;

        var ax = x + Math.random() * (options.d* 2*Math.random()) - d2;
        var ay = y + Math.random() * options.d - d2;
        var az = z + Math.random() * options.d - d2;


        var bx = x + Math.random() * options.d - d2;
        var by = y + Math.random() * (options.d* 2*Math.random()) - d2;
        var bz = z + Math.random() * options.d - d2;

        var cx = x + Math.random() * options.d - d2;
        var cy = y + Math.random() * (options.d* 2*Math.random()) - d2;
        var cz = z + Math.random() * (options.d* 2*Math.random()) - d2;

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
      specular: 0x000000,
      shininess: 250,
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    } );

    mesh = new THREE.Mesh( geometry, material );
    previous_uuid = mesh.uuid;

    scene.add( mesh );
    // scene.remove(scene.children[scene.children.length -1])



    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gamaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener('resize', onWindowResize, false);



  //add controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0,100,0)

} //init

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(){
  var level = amplitude.getLevel();
  requestAnimationFrame( animate );
  render();
  controls.update();
}



function render(){
  var level = amplitude.getLevel();
  amplitude.smooth(options.smooth);
  var randomNumber = Math.floor(Math.random() * 1) - 0.5;
  time = Date.now();

  //viz sector
  camera.position.z = options.z + level* options.z_bounceRate * (options.z_bounceRateGlitch ? randomNumber : 1);
  // camera.position.z = Math.sin(time)
  // mesh.rotation.x = level*10+ time;
  mesh.rotation.y = time * options.time_factor + level *options.y_factor;



  renderer.render( scene, camera );
}
