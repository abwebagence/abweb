/* Smoke Effect */


var camera, scene, renderer,
    geometry, material, mesh, container;

var targetPositionZ = 780;
 
init();
animate(); 

function init() {
	
 /*container = document.getElementById('smoke-class');*/
  container = document.getElementsByClassName('smoke-class')[0];
 


    clock = new THREE.Clock();	

    renderer = new THREE.WebGLRenderer( { alpha: true });
    renderer.setSize( jQuery(".smoke-class").width(), jQuery(".smoke-class").height() );
    /*renderer.setSize( 600, 600 );*/
	renderer.setClearColor( 0x000000, 0.5 );

    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );
 
    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshLambertMaterial( { color: 0xaa6666, wireframe: false } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );
    cubeSineDriver = 0;
 
    textGeo = new THREE.PlaneGeometry(176,200);
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    textTexture = THREE.ImageUtils.loadTexture('assets/colourlogo.png');
    textMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 0, map: textTexture, transparent: true, blending: THREE.AdditiveBlending})
    text = new THREE.Mesh(textGeo,textMaterial);
    text.position.z = 730;
    scene.add(text);

    light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    scene.add(light);
  
    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];

	smokeMaterial = new THREE.MeshLambertMaterial({map: smokeTexture, transparent: true});

    for (p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
 
    container.appendChild( renderer.domElement );
 
}
 
function animate() {
 
    // note: three.js includes requestAnimationFrame shim
    delta = clock.getDelta();
    requestAnimationFrame( animate );
    evolveSmoke();
    render();
	fadeLogo();
}
 
function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

function fadeLogo() {
	
	/*if (textMaterial.opacity < 1 && text.position.z < targetPositionZ) {
		textMaterial.opacity += 0.1;
	}*/
	
	if (text.position.z < targetPositionZ) {
        text.position.z += 0.2;
    } else {
		//textMaterial.opacity -= 0.007;
	}
	
}

function render() {
 
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    cubeSineDriver += .01;
    mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render( scene, camera );
 
}

/* End Smoke Effect */