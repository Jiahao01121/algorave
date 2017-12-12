// full screen
var d = 2,
camera.position.z = 1250;

// cube
var d = 4,
camera.position.z = 1250;



// first view -- full viewport particle
function render(){
  amplitude.smooth(0.91);


  var level = amplitude.getLevel();
  var randomNumber = Math.floor(Math.random() * 1) - 0.5;

   time = Date.now() * 0.001;
  camera.position.z = 1000 + level*3000 *randomNumber
  // camera.position.z = Math.sin(time)
  // mesh.rotation.x = level*10+ time;
  mesh.rotation.y = time * .5 + level;
  // mesh.rotation.z = level;
  renderer.render( scene, camera );
}
