//create audio context
var audioCtx = new window.AudioContext();
var source;
var scriptSource;
var buffer;
var analyser;
var myArray;
var speed = 0;
var yes = 0;

//create cube
var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 35, window.innerWidth/window.innerHeight, 0.1, 1000 ); 
var renderer = new THREE.WebGLRenderer(); renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement ); 

var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
var material = new THREE.MeshNormalMaterial(); 
var cube = new THREE.Mesh( geometry, material ); scene.add( cube ); camera.position.z = 5; 

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');

// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

scriptSource = audioCtx.createScriptProcessor(2048, 1, 1);
  scriptSource.buffer = buffer;
  scriptSource.connect(audioCtx.destination);

analyser = audioCtx.createAnalyser();
  analyser.smoothingTimeConstant = 1;
  analyser.fftSize = 1024;
	  
function getData() {
  source = audioCtx.createBufferSource();
  request = new XMLHttpRequest();

  request.open('GET', 'mysong4meows.ogg', true);

  request.responseType = 'arraybuffer';


  request.onload = function() {
    var audioData = request.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
	  
      source.buffer = buffer;
      source.connect(analyser);
	  analyser.connect(audioCtx.destination);
      source.loop = true;
	  
      });
  }
  request.send();
}
scriptSource.onaudioprocess = function(e) {
  myArray = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(myArray);
  for (var i = 0; i < myArray.length; i++) {
	if (yes == 1) {
	  var size = myArray[i]/128;
	  cube.scale.x = size;
      cube.scale.y = size;
      cube.scale.z = size;
	  speed = 0.009;
	}
    else {
	  speed = 0;
    }
  }
}
getData();

var render = function () { 
  requestAnimationFrame( render );
  cube.rotation.x += speed; 
  cube.rotation.y += speed; 
  renderer.render(scene, camera); 
}; 

render();

// wire up buttons to stop and play audio

play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
  yes = 1;
}

stop.onclick = function() {
  source.stop(0);
  play.removeAttribute('disabled');
  yes = 0;
}