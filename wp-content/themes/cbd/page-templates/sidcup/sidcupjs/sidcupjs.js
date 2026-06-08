/**
 * Initial Settings
 */
// GSAP Settings
gsap.registerPlugin(ScrollTrigger);

// Clear Scroll Memory
window.history.scrollRestoration = "manual"

// Lenis Smooth Scrolling
const lenis = new Lenis({
  wrapper: document.querySelector('#body-wrap'),
  content: document.querySelector('#sidcup-main'),
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical", // vertical, horizontal
  gestureDirection: "vertical", // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

const raf = (time) => {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

/**
 * Main JS
 */
const main = () => {
  /**
   * 3D Setup
   */
  // ----------------------------------------------------------------
  // Canvas
  const canvas = document.querySelector(".webgl")

  // Scene
  const scene = new THREE.Scene()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    30,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.set(0, 0, 10)
  scene.add(camera)
  camera.add(ambientLight)
  camera.add(directionalLight)
  directionalLight.position.set(-5, 5, 10)

  // Visible Sizes
  const visibleSizes = {
    width: 0,
    height: 0,
  }

  const depth = camera.position.z
  const vFOV = (camera.fov * Math.PI) / 180
  visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

  // Resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
    visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

    // Blob Positions
    blob1.position.set(visibleSizes.width * 0, 0, -1)
    blob2.position.set(-visibleSizes.width * 0.35, -visibleSizes.height * 0.8, 2)
    blob3.position.set(visibleSizes.width * 0.15, -visibleSizes.height* 0.9 * 2, -3)
    const mainHeight = document.querySelector('main').clientHeight
    blob4.position.set(visibleSizes.width * 0.5, -(mainHeight * visibleSizes.height/sizes.height - visibleSizes.height/2 * 3), 0)
    blob5.position.set(visibleSizes.width * 0, -(mainHeight * visibleSizes.height/sizes.height - visibleSizes.height/2), 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // CTA Scale
    if (sizes.width <= 1500) {
      ctaScale = 1.5
    }
    else {
      ctaScale = 1
    }
    gsap.to(cta, {duration: 0, scale: 1 * ctaScale})
  })

  // Texture Loader
  const textureLoader = new THREE.TextureLoader()

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  // Blob 1
  const blob1Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const blob1Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          vec3 newPosition = position;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
  
      varying vec2 vUv;
  
      vec2 blur(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -0.0 + 1.0 * fract(sin(p) * 43801.7208);
      }

      void main() {
        vec2 newUv = vUv * vec2(2., 2.) - vec2(1., 1.);
        
        float blurPower = 0.03;
        vec2 offset = blur(uTime + newUv) * blurPower;

        newUv += offset;
	
        float d = 0.;
        float inverseSize = 5.;
        int blobCount = 5;
          
        for (int i=0; i<blobCount; i++)
        {
          float speed = sin(0.1+float(i)/float(blobCount))*0.5;
          float fi = float(i);
          vec3 pos = speed*sin((uTime + 100000.)*speed*vec3(0.5,0.9,0.75)+fi);
      
          d += pow(clamp((1.-abs(distance(vec3(newUv.x,newUv.y,0.0), pos))),0.0,1.),inverseSize);
        }
          
        float power = 10.;
        
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,-2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(2.,newUv.y,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(-2.,newUv.y,0.0)))),0.0,1.0),power);
        
          float maxClamp = 0.125;
          float brightness = 4.;
          
        d = clamp(d,0.0,maxClamp)*brightness;
        
        float noise = 2.25;
        noise = 0.5*(newUv.y - 1.)/2.+1.0 -3.*(newUv.x - 1.)/2.;

        gl_FragColor = vec4(0.627,0.823,0.098,d*noise)*d*noise;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const blob1 = new THREE.Mesh(blob1Geometry, blob1Material)
  blob1.scale.set(7,7,1)

  scene.add(blob1)

  // Blob 2
  const blob2Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const blob2Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          vec3 newPosition = position;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
  
      varying vec2 vUv;
  
      vec2 blur(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -0.0 + 1.0 * fract(sin(p) * 43801.7208);
      }

      void main() {
        vec2 newUv = vUv * vec2(2., 2.) - vec2(1., 1.);
        
        float blurPower = 0.03;
        vec2 offset = blur(uTime + newUv) * blurPower;

        newUv += offset;
	
        float d = 0.;
        float inverseSize = 12.;
        int blobCount = 10;
          
        for (int i=0; i<blobCount; i++)
        {
          float speed = sin(0.1+float(i)/float(blobCount))*0.8;
          float fi = float(i);
          vec3 pos = speed*sin((uTime + 10.)*speed*vec3(0.5,0.9,0.75)+fi);
      
          d += pow(clamp((1.-abs(distance(vec3(newUv.x,newUv.y,0.0), pos))),0.0,1.),inverseSize);
        }
          
        float power = 10.;
        
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,-2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(2.,newUv.y,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(-2.,newUv.y,0.0)))),0.0,1.0),power);
        
          float maxClamp = 0.125;
          float brightness = 4.;
          
        d = clamp(d,0.0,maxClamp)*brightness;
        
        float noise = 2.25;
        noise = 0.5*(newUv.y - 1.)/2.+1.0 -2.*(newUv.x - 1.5);

        gl_FragColor = vec4(0.627,0.823,0.098,d*noise)*d*noise;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const blob2 = new THREE.Mesh(blob2Geometry, blob2Material)
  blob2.scale.set(4,4,1)

  scene.add(blob2)

  // Blob 3
  const blob3Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const blob3Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          vec3 newPosition = position;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
  
      varying vec2 vUv;
  
      vec2 blur(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -0.0 + 1.0 * fract(sin(p) * 43801.7208);
      }

      void main() {
        vec2 newUv = vUv * vec2(2., 2.) - vec2(1., 1.);
        
        float blurPower = 0.03;
        vec2 offset = blur(uTime + newUv) * blurPower;

        newUv += offset;
	
        float d = 0.;
        float inverseSize = 4.;
        int blobCount = 5;
          
        for (int i=0; i<blobCount; i++)
        {
          float speed = sin(0.1+float(i)/10.)*0.8;
          float fi = float(i);
          vec3 pos = speed*sin((uTime)*speed*vec3(0.5,0.9,0.75)+fi);
      
          d += pow(clamp((1.-abs(distance(vec3(newUv.x,newUv.y,0.0), pos))),0.0,1.),inverseSize);
        }
          
        float power = 10.;
        
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,-2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(2.,newUv.y,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(-2.,newUv.y,0.0)))),0.0,1.0),power);
        
        float maxClamp = 0.125;
        float brightness = 4.;
          
        d = clamp(d,0.0,maxClamp)*brightness;
        
        float noise = 2.25;
        noise = 0.5*(newUv.y + 0.)+1.0 -3.*(newUv.x - 1.)/2.;

        gl_FragColor = vec4(0.627,0.823,0.098,d*noise)*d*noise;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const blob3 = new THREE.Mesh(blob3Geometry, blob3Material)
  blob3.scale.set(10,10,1)

  scene.add(blob3)

  // Blob 2
  const blob4Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const blob4Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          vec3 newPosition = position;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
  
      varying vec2 vUv;
  
      vec2 blur(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -0.0 + 1.0 * fract(sin(p) * 43801.7208);
      }

      void main() {
        vec2 newUv = vUv * vec2(2., 2.) - vec2(1., 1.);
        
        float blurPower = 0.03;
        vec2 offset = blur(uTime + newUv) * blurPower;

        newUv += offset;
	
        float d = 0.;
        float inverseSize = 8.;
        int blobCount = 20;
          
        for (int i=0; i<blobCount; i++)
        {
          float speed = sin(0.1+float(i)/float(blobCount) * 0.5)*0.8;
          float fi = float(i);
          vec3 pos = speed*sin((uTime + 200.)*speed*vec3(0.5,0.9,0.75)+fi);
      
          d += pow(clamp((1.-abs(distance(vec3(newUv.x,newUv.y,0.0), pos))),0.0,1.),inverseSize);
        }
          
        float power = 10.;
        
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,-2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(2.,newUv.y,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(-2.,newUv.y,0.0)))),0.0,1.0),power);
        
          float maxClamp = 0.125;
          float brightness = 4.;
          
        d = clamp(d,0.0,maxClamp)*brightness;
        
        float noise = 2.25;
        noise = 0.5*(newUv.y - 1.)/2.+1.0 -3.*(newUv.x - 1.)/2.;

        gl_FragColor = vec4(0.627,0.823,0.098,d*noise)*d*noise;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const blob4 = new THREE.Mesh(blob4Geometry, blob4Material)
  blob4.scale.set(4,4,1)

  scene.add(blob4)

  // Blob 5
  const blob5Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const blob5Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          vec3 newPosition = position;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
  
      varying vec2 vUv;
  
      vec2 blur(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -0.0 + 1.0 * fract(sin(p) * 43801.7208);
      }

      void main() {
        vec2 newUv = vUv * vec2(2., 2.) - vec2(1., 1.);
        
        float blurPower = 0.03;
        vec2 offset = blur(uTime + newUv) * blurPower;

        newUv += offset;
	
        float d = 0.;
        float inverseSize = 4.;
        int blobCount = 5;
          
        for (int i=0; i<blobCount; i++)
        {
          float speed = sin(0.1+float(i)/10.)*0.8;
          float fi = float(i);
          vec3 pos = speed*sin((uTime + 100.)*speed*vec3(0.5,0.9,0.75)+fi);
      
          d += pow(clamp((1.-abs(distance(vec3(newUv.x,newUv.y,0.0), pos))),0.0,1.),inverseSize);
        }
          
        float power = 10.;
        
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(newUv.x,-2.,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(2.,newUv.y,0.0)))),0.0,1.0),power);
        d += pow(clamp((1.0-abs(distance(vec3(newUv.x,newUv.y,0.0), vec3(-2.,newUv.y,0.0)))),0.0,1.0),power);
        
          float maxClamp = 0.125;
          float brightness = 4.;
          
        d = clamp(d,0.0,maxClamp)*brightness;
        
        float noise = 2.25;
        noise = 0.5*(newUv.y - 1.)/2.+1.0 -3.*(newUv.x - 1.)/2.;

        gl_FragColor = vec4(0.627,0.823,0.098,d*noise)*d*noise;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const blob5 = new THREE.Mesh(blob5Geometry, blob5Material)
  blob5.scale.set(10,10,1)

  scene.add(blob5)

  // Blob Positions
  blob1.position.set(visibleSizes.width * 0, 0, -1)
  blob2.position.set(-visibleSizes.width * 0.35, -visibleSizes.height * 0.8, 2)
  blob3.position.set(visibleSizes.width * 0.15, -visibleSizes.height* 0.9 * 2, -3)
  const mainHeight = document.querySelector('main').clientHeight
  blob4.position.set(visibleSizes.width * 0.5, -(mainHeight * visibleSizes.height/sizes.height - visibleSizes.height/2 * 3), 0)
  blob5.position.set(visibleSizes.width * 0, -(mainHeight * visibleSizes.height/sizes.height - visibleSizes.height/2), 2)

  // Golf Ball
  // const ballGeometry = new THREE.IcosahedronGeometry(0.2, 5)
  // const ballMaterial = new THREE.MeshStandardMaterial({
  //   color: new THREE.Color(0xA0D219),
  //   // wireframe: true,
  //   flatShading: true
  // })
  // const ball = new THREE.Mesh(ballGeometry, ballMaterial)
  // scene.add(ball)
  // ball.position.set(visibleSizes.width * 0., -visibleSizes.height * 1., 4)
  
  /**
   * Renderer Setup
   */
  // ----------------------------------------------------------------

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.shadowMap.enabled = false
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
   * Events
   */
  // ----------------------------------------------------------------
  
  let finishedStartAnimation = false
  
  // Mouse Setup
  const mouse = {
    x: 0,
    y: 0,
  }

  // Mouse Event Listeners Function
  let touch = false

  const pointerMoveEvents = () => {
    window.addEventListener('touchstart', () => {
      touch = true
    })

    // Pointer Events
    document.addEventListener("pointermove", (e) => {
      if (touch == false) {
        mouse.x = e.clientX / sizes.width - 0.5
        mouse.y = -(e.clientY / sizes.height - 0.5)
      }

      // Cursor Follower
      gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})

      // Camera
      gsap.to(camera.rotation, {duration: 1, y: -mouse.x * Math.PI/180 * 1, x: mouse.y * Math.PI/180 * 1})

      if (finishedStartAnimation == true) {
        // Hero Image
        gsap.to('.heroSectionImageContainer', {duration: 0.5, x: mouse.x * sizes.width * 0.5, y: -mouse.y * sizes.height * 0.5, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline1', {duration: 0.6, x: mouse.x * sizes.width * 0.48, y: -mouse.y * sizes.height * 0.48, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline2', {duration: 0.7, x: mouse.x * sizes.width * 0.46, y: -mouse.y * sizes.height * 0.46, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline3', {duration: 0.8, x: mouse.x * sizes.width * 0.44, y: -mouse.y * sizes.height * 0.44, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})

        // Intro & Features Parallax
        gsap.to('.introSectionImageContainer', {duration: 0.5, rotateX: mouse.y * 15, x: (mouse.x - 0.5) * 30, rotateY: (mouse.x - 0.5) * 15})
        gsap.to('.featuresSectionImageParallax', {duration: 0.5, rotateX: mouse.y * 30, rotateY: (mouse.x + 0.5) * 30})
      }
    })

    // Pointer Events - Touch
    document.addEventListener("touchmove", (e) => {
      if (touch == true) {
        mouse.x = e.touches[0].clientX / sizes.width - 0.5
        mouse.y = -(e.touches[0].clientY / sizes.height - 0.5)
      }

      // Cursor Follower
      gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})

      if (finishedStartAnimation == true) {
        // Hero Image
        gsap.to('.heroSectionImageContainer', {duration: 0.5, x: mouse.x * sizes.width * 0.5, y: -mouse.y * sizes.height * 0.5, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline1', {duration: 0.6, x: mouse.x * sizes.width * 0.48, y: -mouse.y * sizes.height * 0.48, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline2', {duration: 0.7, x: mouse.x * sizes.width * 0.46, y: -mouse.y * sizes.height * 0.46, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
        gsap.to('.heroImageContainerOutline3', {duration: 0.8, x: mouse.x * sizes.width * 0.44, y: -mouse.y * sizes.height * 0.44, rotateX: mouse.y * 30, rotateY: mouse.x * 30, rotateZ: mouse.x * 15})
      
        // Intro & Features Parallax
        gsap.to('.introSectionImageContainer', {duration: 0.5, rotateX: mouse.y * 15, x: (mouse.x - 0.5) * 30, rotateY: (mouse.x - 0.5) * 15})
        gsap.to('.featuresSectionImageParallax', {duration: 0.5, rotateX: mouse.y * 30, rotateY: (mouse.x + 0.5) * 30})
      }
    })
  }

  pointerMoveEvents()

  // Marquee Card Listeners
  const marqueeImage = document.querySelectorAll('.marqueeSectionImage')
  const marqueeImageContainer = document.querySelectorAll('.marqueeSectionImageContainer')
  const marqueeOutline1 = document.querySelectorAll('.marqueeSectionSliderCardOutline1')
  const marqueeOutline2 = document.querySelectorAll('.marqueeSectionSliderCardOutline2')
  const marqueeOutline3 = document.querySelectorAll('.marqueeSectionSliderCardOutline3')

  for (let i = 0; i < marqueeImageContainer.length; i++) {
    marqueeImageContainer[i].addEventListener('pointerenter', () => {
      gsap.to(marqueeImageContainer[i], {duration: 0.25, delay: 0, x: -20, y: -20, boxShadow: '0px 0px 10px 3px #A0D219ff'})
      gsap.to(marqueeImage[i], {duration: 0.25, delay: 0, y: 20})
      gsap.to(marqueeOutline1[i], {duration: 0.25, delay: 0, opacity: 1, x: -10, y: -10, boxShadow: '0px 0px 10px 3px #A0D219ff', scale: 1})
      gsap.to(marqueeOutline2[i], {duration: 0.25, delay: 0, opacity: 0.7, x: 0, y: 0, boxShadow: '0px 0px 10px 3px #A0D219ff', scale: 1})
      gsap.to(marqueeOutline3[i], {duration: 0.25, delay: 0, opacity: 0.4, x: 10, y: 10, boxShadow: '0px 0px 10px 3px #A0D219ff', scale: 1})
    })

    marqueeImageContainer[i].addEventListener('pointerleave', () => {
      gsap.to(marqueeImageContainer[i], {duration: 0.25, delay: 0, x: 0, y: 0, boxShadow: '0px 0px 10px 3px #A0D21900'})
      gsap.to(marqueeImage[i], {duration: 0.25, delay: 0, y: 0})
      gsap.to(marqueeOutline1[i], {duration: 0.25, delay: 0, opacity: 0, x: 0, y: 0, boxShadow: '0px 0px 10px 3px #A0D21900', scale: 1})
      gsap.to(marqueeOutline2[i], {duration: 0.25, delay: 0, opacity: 0, x: 0, y: 0, boxShadow: '0px 0px 10px 3px #A0D21900', scale: 1})
      gsap.to(marqueeOutline3[i], {duration: 0.25, delay: 0, opacity: 0, x: 0, y: 0, boxShadow: '0px 0px 10px 3px #A0D21900', scale: 1})
    })
  }

  // Work Text Listeners
  const workTexts = document.querySelectorAll('.workSectionText')
  const workSection = document.querySelector('.workSection')
  const workImageContainer = document.querySelector('.workSectionImageContainer')
  const workImage = document.querySelectorAll('.workSectionImage')
  let workIndex = -1

  // Change Work Image
  const changeWorkImage = (index) => {
    for (let i = 0; i < workImage.length; i++) {
      if (i == index) {
        gsap.to(workImage[i], {duration: 0, zIndex: 1})
        gsap.to(workImage[i], {duration: 0.35, opacity: 1})
      }
      else {
        gsap.to(workImage[i], {duration: 0, zIndex: 0})
        gsap.to(workImage[i], {duration: 0, delay: 0.35, opacity: 0})
      }
    }
  }

  workSection.addEventListener('pointerleave', () => {
    gsap.to('.cursorFollower', {duration: 0.25, width: '2.5rem', height: '2.5rem', borderRadius: '1.25rem'})
    gsap.to(workImageContainer, {duration: 0.25, opacity: 0})
    for (let j = 0; j < workTexts.length; j++) {
      gsap.to(workTexts[j], {duration: 0.25, color: '#000000', textShadow: '-1px -1px 0 #ffffffff, 1px -1px 0 #ffffffff, -1px 1px 0 #ffffffff, 1px 1px 0 #ffffffff'})
    }
  })

  for (let i = 0; i < workTexts.length; i++) {
    workTexts[i].addEventListener('pointerenter', () => {
      if (i != workIndex) {
        workIndex = i

        changeWorkImage(i)
      }

      for (let j = 0; j < workTexts.length; j++) {
        if (j == i) {
          gsap.to('.cursorFollower', {duration: 0.25, width: '30rem', height: '30rem', borderRadius: '1.5rem'})
          gsap.to(workTexts[j], {duration: 0.25, color: '#A0D219', textShadow: '-1px -1px 0 #000000ff, 1px -1px 0 #000000ff, -1px 1px 0 #000000ff, 1px 1px 0 #000000ff'})
          gsap.to(workImageContainer, {duration: 0.25, opacity: 1})
        }
        else {
          gsap.to(workTexts[j], {duration: 0.25, color: '#000000', textShadow: '-1px -1px 0 #ffffffff, 1px -1px 0 #ffffffff, -1px 1px 0 #ffffffff, 1px 1px 0 #ffffffff'})
        }
      }
    })
  }

  // Features Text Listeners
  const featuresText = document.querySelectorAll('.featuresSectionText')
  const featureCard1 = document.querySelector('#featuresSectionImageContainer1')
  let featuresIndex = 0
  const featureImage1 = document.querySelectorAll('.featuresSectionImage1')
  const featureLabel = document.querySelectorAll('.featuresSectionImageLabel')
  const halfFlip = 0.2
  
  for (let i = 0; i < featureImage1.length; i++) {
    if (i == 0) {
      gsap.to(featureImage1[i], {duration: 0, scale: 1, opacity: 1})
      gsap.to(featuresText[i], {duration: 0, color: '#A0D219', textShadow: '-1px -1px 0 #000000ff, 1px -1px 0 #000000ff, -1px 1px 0 #000000ff, 1px 1px 0 #000000ff'})
    }
    else {
      gsap.to(featureImage1[i], {duration: 0, delay: 0, scale: 1.5, opacity: 0})

      // Label
      gsap.to(featureLabel[i], {duration: 0, delay: halfFlip, x: -20, opacity: 0})
    }
  }

  let isFlipping = {value: false}

// Flip Card
const flipCard = (index) => {
  // Allow immediate flips by killing ongoing animations
  gsap.killTweensOf([featureCard1, featureImage1, featuresText, featureLabel]);

  // Start the flip animation
  gsap.to(featureCard1, {duration: halfFlip, rotateX: 90, z: '-25rem', ease: 'Power1.easeIn', onComplete: () => {
      gsap.set(featureCard1, {rotateX: 270});
      gsap.to(featureCard1, {duration: halfFlip, rotateX: 360, z: 0, ease: 'Power1.easeOut', onComplete: () => {
          gsap.set(featureCard1, {rotateX: 0});
      }});
  }});

  // Update images, text, and labels
  for (let i = 0; i < featureImage1.length; i++) {
    if (i === index) {
      gsap.set(featureImage1[i], {opacity: 1, scale: 1});
      gsap.to(featuresText[i], {duration: 0.25, color: '#A0D219', textShadow: '-1px -1px 0 #000000ff, 1px -1px 0 #000000ff, -1px 1px 0 #000000ff, 1px 1px 0 #000000ff'});
      gsap.to(featureLabel[i], {duration: halfFlip * 2, x: 0, opacity: 1, ease: 'Power1.easeOut'});
    } else {
      gsap.set(featureImage1[i], {opacity: 0, scale: 1.5});
      gsap.to(featuresText[i], {duration: 0.25, color: '#000000', textShadow: '-1px -1px 0 #ffffffff, 1px -1px 0 #ffffffff, -1px 1px 0 #ffffffff, 1px 1px 0 #ffffffff'});
      gsap.to(featureLabel[i], {duration: halfFlip * 2, x: 20, opacity: 0, ease: 'Power1.easeOut'});
      gsap.set(featureLabel[i], {delay: halfFlip * 2, x: -20});
    }
  }
};

// Event Listeners
for (let i = 0; i < featuresText.length; i++) {
  featuresText[i].addEventListener('pointerenter', () => {
    if (i !== featuresIndex) {
      featuresIndex = i;
      flipCard(featuresIndex);
    }
  });
}


  // CTA Listeners
  const cta = document.querySelector('.visitSectionCTA')
  const ctaCircle = document.querySelectorAll('.visitSectionCTACircle')
  const ctaCircleDuration = 0.4

  let ctaScale = 1
  if (sizes.width <= 1500) {
    ctaScale = 1.5
  }
  gsap.to(cta, {duration: 0, scale: 1 * ctaScale})

  gsap.to(ctaCircle[0], {duration: 0, scale: 0})
  gsap.to(ctaCircle[1], {duration: 0, scale: 0})
  gsap.to(ctaCircle[2], {duration: 0, scale: 0})

  cta.addEventListener('pointerenter', () => {
    gsap.to(ctaCircle[0], {duration: ctaCircleDuration, delay: 0, scale: 1})
    gsap.to(ctaCircle[1], {duration: ctaCircleDuration, delay: 0.1,  scale: 1})
    gsap.to(ctaCircle[2], {duration: ctaCircleDuration, delay: 0.2,  scale: 1})

    // Text
    gsap.to('#visitSectionCTATextWhite', {duration: ctaCircleDuration, delay: 0, y: -20, opacity: 0, scale: 1/0.9})
    gsap.to('#visitSectionCTATextBlack', {duration: ctaCircleDuration, delay: 0, y: 0, opacity: 1, scale: 1/0.9})

    // CTA
    gsap.to(cta, {duration: ctaCircleDuration, scale: 0.9 * ctaScale})
  })

  cta.addEventListener('pointerleave', () => {
    gsap.to(ctaCircle[0], {duration: ctaCircleDuration, delay: 0, scale: 0})
    gsap.to(ctaCircle[1], {duration: ctaCircleDuration, delay: 0.1,  scale: 0})
    gsap.to(ctaCircle[2], {duration: ctaCircleDuration, delay: 0.2,  scale: 0})

    // Text
    gsap.to('#visitSectionCTATextWhite', {duration: ctaCircleDuration, delay: 0, y: 0, opacity: 1, scale: 1})
    gsap.to('#visitSectionCTATextBlack', {duration: ctaCircleDuration, delay: 0, y: 20, opacity: 0, scale: 1})

    // CTA
    gsap.to(cta, {duration: ctaCircleDuration, scale: 1 * ctaScale})
  })

  // Cursor Golf Listeners
  const cursorGolf = document.querySelectorAll('.cursorGolf')
  
  for (let i = 0; i < cursorGolf.length; i++) {
    cursorGolf[i].addEventListener('pointerenter', () => {
      gsap.to('.cursorFollower', {duration: 0.25, width: '10rem', height: '10rem', backgroundColor: '#A0D21900', border: '1px solid #ffffff', boxShadow: '0 0 2px 0 #000000'})
      gsap.to('.cursorFollower', {duration: 0.25, width: '10rem', height: '10rem', borderRadius: '5rem'})
    })

    cursorGolf[i].addEventListener('pointerleave', () => {
      gsap.to('.cursorFollower', {duration: 0.25, width: '10rem', height: '10rem', backgroundColor: '#A0D219ff', border: '0px solid #ffffff', boxShadow: '0 0 2px 0 #000000'})
      gsap.to('.cursorFollower', {duration: 0.25, width: '2.5rem', height: '2.5rem', borderRadius: '1.25rem'})
    })
  }

  /**
   * Animate
   */
  // ----------------------------------------------------------------
  let elapsedTime
  const clock = new THREE.Clock()
  const scrollStart = document.querySelector('.scrollStartSection')
  let scrollValue = 0
  const tick = () => {
    elapsedTime = clock.getElapsedTime()

    // Scroll Value
    scrollValue = scrollStart.getBoundingClientRect().top
    camera.position.y = visibleSizes.height/sizes.height * scrollValue

    // Update Time
    blob1.material.uniforms.uTime.value = elapsedTime
    blob2.material.uniforms.uTime.value = elapsedTime
    blob3.material.uniforms.uTime.value = elapsedTime
    blob4.material.uniforms.uTime.value = elapsedTime
    blob5.material.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }

  tick()

  /**
   * ScrollTriggers
   */
  // ----------------------------------------------------------------
  // Intro Image ScrollTrigger
  gsap.fromTo(
    '.introSectionImageDiv',
    { y: 200 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",
        trigger: ".introSection",
        start: () => document.querySelector(".introSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".introSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100
    }
  )

  // Marquee Slider ScrollTrigger
  gsap.fromTo(
    '.marqueeSectionSlider',
    { x: 0, rotateX: -10 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",          
        trigger: ".marqueeSection",
        start: () => document.querySelector(".marqueeSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".marqueeSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -(document.querySelector(".marqueeSectionSlider").clientWidth - sizes.width),
      rotateX: 20
    }
  )
  
  const marqueeMoveValue = marqueeImage[0].clientWidth - document.querySelector('.marqueeSectionImageContainer').clientWidth

  for (let i = 0; i < marqueeImage.length; i++) {
    gsap.fromTo(
      marqueeImage[i],
      { x: 0 },
      {
        scrollTrigger: {
        scroller: "#body-wrap",            
          trigger: ".marqueeSection",
          start: () => document.querySelector(".marqueeSection").clientHeight * 0 + " bottom",
          end: () => document.querySelector(".marqueeSection").clientHeight * 1 + " top",
          // toggleActions: "play none none reverse",
          // snap: 1,
          scrub: true,
          // pin: true,
          // markers: true
        },
        x: marqueeMoveValue,
      }
    )
  }

  // Work Section ScrollTrigger
  for (let i = 0; i < workTexts.length; i++) {
    gsap.fromTo(
      workTexts[i],
      { x: (-1)**(i + 1) * 50, opacity: 0 },
      {
        scrollTrigger: {
        scroller: "#body-wrap",            
          trigger: ".workSection",
          start: () => document.querySelector(".workSection").clientHeight * 0.25 + " bottom",
          // end: () => document.querySelector(".marqueeSection").clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        duration: 1,
        delay: i * 0.2,
        x: 0,
        opacity: 1
      }
    )
  }

  // Mobile Section ScrollTrigger
  const mobileSlider = document.querySelectorAll('.mobileSectionSlider')

  for (let i = 0; i < mobileSlider.length; i++) {
    gsap.fromTo(
      mobileSlider[i],
      { y: 0 },
      {
        scrollTrigger: {
        scroller: "#body-wrap",            
          trigger: ".mobileSection",
          start: () => document.querySelector(".mobileSection").clientHeight * 0 + " bottom",
          end: () => document.querySelector(".mobileSection").clientHeight * 1 + " top",
          // toggleActions: "play none none reverse",
          // snap: 1,
          scrub: true,
          // pin: true,
          // markers: true
        },
        y: (-1)**(i + 1) * (mobileSlider[i].clientHeight * 3 / 5)/2,
      }
    )
  }

  // Features Section ScrollTrigger
  gsap.fromTo(
    '.featuresSectionParallax',
    { y: 100 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",          
        trigger: ".featuresSection",
        start: () => document.querySelector(".featuresSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".featuresSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0
    }
  )

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  gsap.to('.heroImageIntro', {duration: 0, y: -sizes.height})
  const startAnimation = () => {
    gsap.to('.transformTranslucent', {duration: 1.25, filter: 'brightness(1) blur(0px)', ease: 'Power1.easeOut'})
    gsap.to('.heroSectionHeaderTopOver', {duration: 1.25, scale: 1, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionHeaderMiddleOver', {duration: 1.25, scale: 1, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionHeaderBottomOver', {duration: 1.25, scale: 1, ease: 'Power1.easeOut'})
  gsap.to('.heroImageIntro', {duration: 0.5, delay: 0.5, y: 0, ease: 'Power1.easeOut'})

    setTimeout(() => {
      finishedStartAnimation = true
    }, 500);
  }

  startAnimation()
}

/**
 * Load
 */
 

  let imgs = document.images,
  len = imgs.length,
  counter = 0;

//   let imgs = document.querySelectorAll(".sidcupimg"),
//   len = imgs.length,
//   counter = 0;

//   [].forEach.call( imgs, (img) => {
//     if(img.complete) {
//       incrementCounter()
//     }
//     else {
//       img.addEventListener( 'load', incrementCounter, false )
//     }
//   })
imagesLoaded(imgs, { background: true }).on('progress', function(instance, image) {
  incrementCounter();
});

  function incrementCounter() {
    counter++;
    gsap.to(".loadingBall", { duration: 0.5, x: counter / len * 0.35 * window.innerWidth - 16 - 10 })

    // Done Loading
    if ( counter == len ) {
      gsap.to(".loadingBall", { duration: 0.25, delay: 0.5, y: 20, x: counter / len * 0.35 * window.innerWidth - 16 - 5 })
      gsap.to(".loadingFlagPoleBottom", { duration: 0.25, delay: 0.75, height: '18rem'})

      gsap.to(".loadingFlag", { duration: 0.125, delay: 0.75, skewY: 2})
      gsap.to(".loadingFlag", { duration: 0.125, delay: 0.875, skewY: 0})
      gsap.to(".loadingFlag", { duration: 0.125, delay: 1, skewY: -2})
      gsap.to(".loadingFlag", { duration: 0.25, delay: 1.125, skewY: 0})

      gsap.to(".loadingGround", { duration: 0.25, delay: 0.85, scaleX: 0.9 })
      gsap.to(".loadingGround", { duration: 0.5, delay: 1.1, scaleX: 3 })

      gsap.to(".loadingFlag", { duration: 0.5, delay: 1.7, skewY: -10, scaleX: 0.9})
      gsap.to(".loadingPageTopHalf", { duration: 0.5, delay: 1.7, y: -window.innerHeight/2, ease: 'Power1.easeIn'})
      gsap.to(".loadingPageBottomHalf", { duration: 0.5, delay: 1.7, y: window.innerHeight/2, ease: 'Power1.easeIn'})
      gsap.to(".loadingBlur", { duration: 1, delay: 2, opacity: 0 })
      gsap.to(".loadingPage", { duration: 0, delay: 3, display: 'none' })
      setTimeout(() => {
        main()
      }, 1600)
    }
  }
  

imagesLoaded( document.querySelector('body'), function( instance ) {
});