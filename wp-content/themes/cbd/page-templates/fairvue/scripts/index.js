/**
 * Initial Settings
 */

// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

// Clear Scroll Memory
// window.history.scrollRestoration = "manual"

// Lenis Smooth Scrolling
const lenis = new Lenis({
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
  const ambientLight = new THREE.AmbientLight(0x0f0f0f, 0.5)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    prevWidth: window.innerWidth
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
  directionalLight.position.set(5, 5, 10)

  // Visible Sizes
  const visibleSizes = {
    width: 0,
    height: 0,
  }

  const depth = camera.position.z
  const vFOV = (camera.fov * Math.PI) / 180
  visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

  const planeRatio = 822/303
  const plane2Ratio = 1824/576

  // Resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
    visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

    // Logo Group Position
    logoPosition = ((document.querySelector('.descriptionSectionContainer').getBoundingClientRect().top - sizes.height/2 + document.querySelector('.descriptionSectionContainer').clientHeight/2) - document.querySelector('.scrollStartSection').getBoundingClientRect().top) * visibleSizes.height/sizes.height
    logoGroup.position.y = -logoPosition

    // Plane 1 Scale and Position
    plane.scale.set(visibleSizes.width * 1.1, visibleSizes.width * 1.1/planeRatio, 1)

    // Plane 2 Scale and Position
    plane2.scale.set(visibleSizes.width, visibleSizes.width/plane2Ratio, 1)
    textPosition = (document.querySelector('.descriptionSection').getBoundingClientRect().top + document.querySelector('.descriptionSection').clientHeight - document.querySelector('.scrollStartSection').getBoundingClientRect().top - 30 * sizes.width/1960) * visibleSizes.height/sizes.height - (visibleSizes.height - visibleSizes.width/plane2Ratio)/2 - visibleSizes.width/plane2Ratio/2
    plane2.position.y = -textPosition
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // Texture Loader
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/wp-content/themes/cbd/page-templates/fairvue/images/HeroBackground.png')
  const textTexture = textureLoader.load('/wp-content/themes/cbd/page-templates/fairvue/images/FairvueText.png')
  
  const video = document.getElementById( 'video' )

  // GLTF Loader
  const gltfLoader = new THREE.GLTFLoader()
  const logoGroup = new THREE.Group
  scene.add(logoGroup)
  const logoContainer = new THREE.Group
  logoGroup.add(logoContainer)
  const logoTop = new THREE.Group
  logoContainer.add(logoTop)
  const logoBottom = new THREE.Group
  logoContainer.add(logoBottom)

  const logoScale = 0.0275
  // const logoMaterial = new THREE.MeshStandardMaterial({
  //   color: new THREE.Color(0x1a0a44)
  // })
  const logoMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x1a0a44),
    iridescence: 10,
    transmission: 0.5,
    opacity: 1,
    clearcoat: 2,
    ior: 2,

    transparent: true
  })

  gltfLoader.load("/wp-content/themes/cbd/page-templates/fairvue/images/LogoTop.glb", (obj) => {
    logoTop.add(obj.scene)
    obj.scene.children[0].position.z = -5
    logoTop.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = logoMaterial
  })

  gltfLoader.load("/wp-content/themes/cbd/page-templates/fairvue/images/LogoBottom.glb", (obj) => {
    logoBottom.add(obj.scene)
    obj.scene.children[0].position.z = -5
    logoBottom.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = logoMaterial
  })

  // Logo Position
  let logoPosition = ((document.querySelector('.descriptionSectionContainer').getBoundingClientRect().top - sizes.height/2 + document.querySelector('.descriptionSectionContainer').clientHeight/2) - document.querySelector('.scrollStartSection').getBoundingClientRect().top) * visibleSizes.height/sizes.height
  logoGroup.position.y = -logoPosition
  logoGroup.position.z = -2.5

  // Play Video
  document.querySelector('.playSectionButton').addEventListener('click', () => {
    video.playbackRate = 2;
    video.play()
    gsap.to('.playSection', {duration: 1, opacity: 0, pointerEvents: 'none', ease: 'Power1.easeInOut'})
    gsap.to('.playSectionButton', {duration: 0.1, y: 2, scale: 0.99, ease: 'Power1.easeOut'})
    gsap.to('.playSectionButton', {duration: 0.1, delay: 0.1, y: 0, scale: 1, ease: 'Power1.easeOut'})

    
    startAnimation()
  })

  document.querySelector('.playSectionButton').addEventListener('pointerover', () => {
    gsap.to('.playSectionButton', {duration: 0.2, y: -4, backgroundImage: 'linear-gradient(to bottom right, #FFF9E940 0%, #D8FFFF40 50%, #FFD9FF40 100%)', ease: 'Power1.easeOut'})
  })

  document.querySelector('.playSectionButton').addEventListener('pointerleave', () => {
    gsap.to('.playSectionButton', {duration: 0.2, y: 0, backgroundImage: 'linear-gradient(to bottom right, #FFF9E920 0%, #D8FFFF20 50%, #FFD9FF10 200%)', ease: 'Power1.easeOut'})
  })

  const textureVid = new THREE.VideoTexture( video )

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------
  // Plane
  const planeGeometry = new THREE.PlaneGeometry(1,1,64,64)
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: textureVid },
      uMouse: { value: {x: 0, y: 0}},
      uMainColor: { value: new THREE.Color(0xaf9f72) },
      uColorProgress: { value: 0 },
      uStartProgress:  { value: 2 }
    },
  vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uStartProgress;
    
      varying vec2 vUv;
      varying float vZ;
  
      void main() {
        vec3 newPosition = position;

        newPosition.y += sin(uTime * uStartProgress + uv.x * 5.) * 0.01;

        vZ = newPosition.z;

        vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
      uniform sampler2D uTexture;
      uniform sampler2D uText;
      uniform vec3 uMainColor;
      uniform float uColorProgress;

      varying vec2 vUv;
      varying float vZ;

      void main() {
        
        vec4 color = texture(uTexture, vUv);

        vec3 finalColor = color.rgb;

        gl_FragColor = vec4(finalColor, color.g * 2.);
        // gl_FragColor = vec4(finalColor, 1.);
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
    // wireframe: true,
    // depthTest: false,
    // depthWrite: false
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)

  const planeGroup = new THREE.Group
  planeGroup.add(plane)
  scene.add(planeGroup)

  // Plane Scale and Position
  plane.scale.set(visibleSizes.width * 1.1, visibleSizes.width * 1.1/planeRatio, 1)
  plane.rotation.x = Math.PI/2.2

  // Plane 2
  const plane2Geometry = new THREE.PlaneGeometry(1,1,32,32)
  const plane2Material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: textureVid },
      uMouse: { value: {x: 0, y: 0}},
      uMainColor: { value: new THREE.Color(0xaf9f72) },
      uColorProgress: { value: 0 },
      uStartProgress:  { value: 2 },
      uTextTexture: { value: textTexture }
    },
  vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uStartProgress;
    
      varying vec2 vUv;
      varying float vZ;
  
      void main() {
        vec3 newPosition = position;

        vZ = newPosition.z;

        vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;
      }
  `,
  fragmentShader: `
      uniform float uTime;
      uniform sampler2D uTexture;
      uniform sampler2D uTextTexture;
      uniform sampler2D uText;
      uniform vec3 uMainColor;
      uniform float uColorProgress;

      varying vec2 vUv;
      varying float vZ;

      void main() {
        vec4 text = texture(uTextTexture, vUv);
        vec4 color = texture(uTexture, vUv);

        vec3 backColor = color.rgb;

        vec4 finalColor = vec4(backColor * 1.1, text.a * (color.r + color.g + color.b));
        // vec4 finalColor = vec4(backColor, 1.);
        // finalColor.rgb += text.rgb;

        gl_FragColor = finalColor;
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
    // wireframe: true,
    // depthTest: false,
    // depthWrite: false
  })
  const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)

  const plane2Group = new THREE.Group
  plane2Group.add(plane2)
  scene.add(plane2Group)

  plane2.rotation.x = Math.PI

  // Plane 2 Scale and Position
  plane2.scale.set(visibleSizes.width, visibleSizes.width/plane2Ratio, 1)
  let textPosition = (document.querySelector('.descriptionSection').getBoundingClientRect().top + document.querySelector('.descriptionSection').clientHeight - document.querySelector('.scrollStartSection').getBoundingClientRect().top - 30 * sizes.width/1960) * visibleSizes.height/sizes.height - (visibleSizes.height - visibleSizes.width/plane2Ratio)/2 - visibleSizes.width/plane2Ratio/2
  plane2.position.y = -textPosition

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
  // renderer.setClearColor(0x0000ff)
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

  const planeMouse = {
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

        planeMouse.x = ((e.clientX / sizes.width) - 0.5) * visibleSizes.width
        planeMouse.y = 1 - (e.clientY / sizes.height)

        // Plane
        gsap.to(plane.material.uniforms.uMouse.value, {duration: 1, x: planeMouse.x, y: planeMouse.y})

        // Logo Container
        gsap.to(logoContainer.rotation, {duration: 1, y: mouse.x * 1, x: -mouse.y * 1})

        // Bubbles
        gsap.to('.extraSectionBubble1', {duration: 1, x: -mouse.x * 40})
        gsap.to('.extraSectionBubble2', {duration: 1, x: -mouse.x * 20})
        gsap.to('.extraSectionBubble3', {duration: 1, x: -mouse.x * 10})

        // Cursor Follower
        // gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})
        
        if (finishedStartAnimation == true) {
   
        }
      }
    })

    // Pointer Events - Touch
    document.addEventListener("touchmove", (e) => {
      if (touch == true) {
        mouse.x = e.touches[0].clientX / sizes.width - 0.5
        mouse.y = -(e.touches[0].clientY / sizes.height - 0.5)

        if (finishedStartAnimation == true) {
      
        }
      }
    })
  }

  pointerMoveEvents()

  // Delivered Section Hover
  const deliveredSectionMarqueeTexts = document.querySelectorAll('.deliveredSectionMarqueeText')

  for (let i = 0; i < deliveredSectionMarqueeTexts.length; i++) {
    deliveredSectionMarqueeTexts[i].addEventListener("pointerenter", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#ffffff'})
    })
    deliveredSectionMarqueeTexts[i].addEventListener("pointerleave", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#250e61'})
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

    gsap.to('.heroSectionScrollDownText', {duration: 0, rotateZ: elapsedTime * 30})

    plane.material.uniforms.uTime.value = elapsedTime

    // Scroll Value
    scrollValue = scrollStart.getBoundingClientRect().top
    camera.position.y = visibleSizes.height/sizes.height * scrollValue

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }

  tick()

  /**
   * ScrollTriggers
   */
  // ----------------------------------------------------------------
   // Header
    let previousScroll = window.scrollY;
    
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        
        if (currentScroll > 100) {
          if (currentScroll > previousScroll) {
            // Scrolling down
            document.body.classList.remove('scroll-up');
            document.body.classList.add('scroll-down');
          } else if (currentScroll < previousScroll) {
            // Scrolling up
            document.body.classList.remove('scroll-down');
            document.body.classList.add('scroll-up');
          }
        } else {
          document.body.classList.remove('scroll-up', 'scroll-down');
        }
    
        previousScroll = currentScroll;
      }
    });
  // Hero Section
  gsap.fromTo(
    plane.position,
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -visibleSizes.height * 0.15
    }
  )

  gsap.fromTo(
    planeGroup.rotation,
    { x: 0, z: 0, },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      // x: Math.PI/2.3,
      z: -Math.PI/6
    }
  )

  gsap.fromTo(
    planeGroup.scale,
    { x: 1, y: 1 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: 1.25,
      y: 0.8
    }
  )

  // Delivered Section
  gsap.fromTo(
    '.deliveredSectionMarquee',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".deliveredSectionMarquee",
        start: () => 0 + " bottom",
        end: () => window.innerHeight + document.querySelector('.deliveredSectionMarquee').clientHeight * 2 + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -(document.querySelector('.deliveredSectionMarquee').clientWidth - window.innerWidth)
    }
  )

  // Search Section
  gsap.fromTo(
    '.searchSectionContainer',
    { y: 50 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".searchSection",
        start: () => document.querySelector('.searchSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.searchSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -50 * sizes.width/1920
    }
  )

  gsap.fromTo(
    '.searchSectionBar',
    { y: 30 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".searchSection",
        start: () => document.querySelector('.searchSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.searchSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -30 * sizes.width/1920
    }
  )

  gsap.fromTo(
    '.searchImage',
    { y: 30 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".searchSection",
        start: () => document.querySelector('.searchSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.searchSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -30 * sizes.width/1920
    }
  )

  // Description Section
  gsap.fromTo(
    logoTop.rotation,
    { y: Math.PI/2 },
    {
      scrollTrigger: {
        trigger: ".descriptionSectionContainer",
        start: () => document.querySelector('.descriptionSectionContainer').clientHeight * 0.5 - window.innerHeight/2 + " bottom",
        end: () => document.querySelector('.descriptionSectionContainer').clientHeight * 0.5 + window.innerHeight/2 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: Math.PI * 2 + Math.PI/2
    }
  )

  gsap.fromTo(
    logoBottom.rotation,
    { y: -Math.PI/2 },
    {
      scrollTrigger: {
        trigger: ".descriptionSectionContainer",
        start: () => document.querySelector('.descriptionSectionContainer').clientHeight * 0.5 - window.innerHeight/2 + " bottom",
        end: () => document.querySelector('.descriptionSectionContainer').clientHeight * 0.5 + window.innerHeight/2 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -(Math.PI * 2 + Math.PI/2)
    }
  )

  // Assumption Section
  gsap.fromTo(
    '.assumptionsSectionRight',
    { y: 100 },
    {
      scrollTrigger: {
        trigger: ".assumptionsSection",
        start: () => document.querySelector(".assumptionsSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".assumptionsSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -100,
      ease: 'Power1.easeOut'
    }
  )

  // Extra Section
  gsap.fromTo(
    '.extraSectionBubble1',
    { y: 180 },
    {
      scrollTrigger: {
        trigger: ".extraSection",
        start: () => document.querySelector('.extraSection').clientHeight * -0.5 + " bottom",
        end: () => document.querySelector('.extraSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -180
    }
  )

  gsap.fromTo(
    '.extraSectionBubble2',
    { y: 100 },
    {
      scrollTrigger: {
        trigger: ".extraSection",
        start: () => document.querySelector('.extraSection').clientHeight * -0.5 + " bottom",
        end: () => document.querySelector('.extraSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -100
    }
  )

  gsap.fromTo(
    '.extraSectionBubble3',
    { y: 40 },
    {
      scrollTrigger: {
        trigger: ".extraSection",
        start: () => document.querySelector('.extraSection').clientHeight * -0.5 + " bottom",
        end: () => document.querySelector('.extraSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -40
    }
  )

  gsap.fromTo(
    '.extraSectionImage',
    { scale: 1.1, rotateZ: 0 },
    {
      scrollTrigger: {
        trigger: ".extraSection",
        start: () => document.querySelector(".extraSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".extraSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      scale: 1.3,
      rotateZ: 10,
      ease: 'Power1.easeOut'
    }
  )

  const extraSectionIcons = document.querySelectorAll('.extraSectionIcon')
  const extraSectionIconLabels = document.querySelectorAll('.extraSectionIconLabel')
  const extraSectionIconSets = document.querySelectorAll('.extraSectionIconSet')

  for (let i = 0; i < extraSectionIcons.length; i++) {
    gsap.fromTo(
      extraSectionIconSets[i],
      { y: 0 },
      {
        scrollTrigger: {
          trigger: ".extraSectionExtras",
          start: () => document.querySelector(".extraSection").clientHeight * 0 + " bottom",
          end: () => document.querySelector(".extraSection").clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: true,
          // pin: true,
        },
        y: -30 + i * 20,
        ease: 'Power1.easeOut'
      }
    )

    gsap.fromTo(
      extraSectionIcons[i],
      { scale: 0 },
      {
        scrollTrigger: {
          trigger: ".extraSectionExtras",
          start: () => document.querySelector(".extraSection").clientHeight * 0.25 + " bottom",
          // end: () => document.querySelector(".extraSection").clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
        },
        delay: i * 0.2,
        duration: 0.6,
        scale: 1,
        ease: 'back'
      }
    )

    gsap.fromTo(
      extraSectionIconLabels[i],
      { opacity: 0, y: 20},
      {
        scrollTrigger: {
          trigger: ".extraSectionExtras",
          start: () => document.querySelector(".extraSection").clientHeight * 0.25 + " bottom",
          // end: () => document.querySelector(".extraSection").clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
        },
        delay: i * 0.2 + 0.1,
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: 'Power1.easeOut'
      }
    )
  }

  // UI Section
  gsap.fromTo(
    '#uiSectionMobileImage1',
    { y: -50 },
    {
      scrollTrigger: {
        trigger: ".uiSectionRight",
        start: () => document.querySelector(".uiSectionRight").clientHeight * -0.5 + " bottom",
        end: () => document.querySelector(".uiSectionRight").clientHeight * 1.5 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 50,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#uiSectionMobileImage2',
    { y: 50 },
    {
      scrollTrigger: {
        trigger: ".uiSectionRight",
        start: () => document.querySelector(".uiSectionRight").clientHeight * -0.5 + " bottom",
        end: () => document.querySelector(".uiSectionRight").clientHeight * 1.5 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -50,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionText1',
    { x: -20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionText1",
        start: () => document.querySelector(".uiSectionText1").clientHeight * 1 + " bottom",
        // end: () => document.querySelector(".uiSectionText1").clientHeight * 1 + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
      },
      duration: 0.6,
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionText2',
    { x: 20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionText2",
        start: () => document.querySelector(".uiSectionText2").clientHeight * 1 + " bottom",
        // end: () => document.querySelector(".uiSectionText1").clientHeight * 1 + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
      },
      duration: 0.6,
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  // Mobile Section
  gsap.fromTo(
    '#mobileSectionColumn1',
    { y: 200 },
    {
      scrollTrigger: {
        trigger: ".mobileSection",
        start: () => document.querySelector(".mobileSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -200,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#mobileSectionColumn2',
    { y: -200 },
    {
      scrollTrigger: {
        trigger: ".mobileSection",
        start: () => document.querySelector(".mobileSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 200,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#mobileSectionColumn3',
    { y: 200 },
    {
      scrollTrigger: {
        trigger: ".mobileSection",
        start: () => document.querySelector(".mobileSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -200,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#mobileSectionColumn4',
    { y: -200 },
    {
      scrollTrigger: {
        trigger: ".mobileSection",
        start: () => document.querySelector(".mobileSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 200,
      ease: 'Power1.easeOut'
    }
  )
  
  gsap.fromTo(
    '.mobileSectionLogoContainer',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".mobileSection",
        start: () => document.querySelector(".mobileSection").clientHeight * -0.5 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
      },
      duration: 0.1,
      opacity: 1,
    }
  )

  // Wireframes
  gsap.fromTo(
    '#goalSectionWireframeImage1',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".goalSectionWireframes",
        start: () => document.querySelector(".goalSectionWireframes").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".goalSectionWireframes").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -100,
    }
  )

  gsap.fromTo(
    '#goalSectionWireframeImage2',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".goalSectionWireframes",
        start: () => document.querySelector(".goalSectionWireframes").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".goalSectionWireframes").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -100,
    }
  )

  gsap.fromTo(
    '#goalSectionWireframeImage3',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".goalSectionWireframes",
        start: () => document.querySelector(".goalSectionWireframes").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".goalSectionWireframes").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 100,
    }
  )

  /**
   * Text Animation
   */
  // ----------------------------------------------------------------

  // Text Animations
  const textAnimationDivs = []
  let textAnimationIndex = 0

  // Text Setup Function
  const textSetup = (e, dir) => {
    const string = e.innerText
    // console.log(string)
    e.innerText = ""
    const spans = []
    const divs = []
    const divCs = document.createElement("span")
    divCs.classList.add("textAnimationClassContainer")
    e.appendChild(divCs)

    for (let i = 0; i < string.length; i++) {
      divs[i] = document.createElement("span")
      divs[i].classList.add("t" + textAnimationIndex)
      divCs.appendChild(divs[i])
      divs[i].classList.add("textAnimationClass")
      spans[i] = document.createElement("span")
      if (string[i] == ' ') {
        spans[i].innerHTML = '&nbsp;'
      }
      else {
        spans[i].innerHTML = string[i]
      }
      divs[i].appendChild(spans[i])
      if (dir == "up") {
        gsap.to(spans[i], { duration: 0, y: 270, scaleY: 1, opacity: 0 })
      }
      else if (dir == "down") {
        gsap.to(spans[i], { duration: 0, y: -270, scaleY: 1, opacity: 0 })
      }
      else if (dir == "right") {
        gsap.to(spans[i], { duration: 0, x: -10, scale: 0.8, opacity: 0 })
      }
      else if (dir == "type") {
        gsap.to(spans[i], { duration: 0, opacity: 0 })
      }
      else if (dir == "pop") {
        gsap.to(spans[i], { duration: 0, scale: 0, opacity: 0 })
      }
    }
    textAnimationDivs[textAnimationIndex] = spans
    textAnimationIndex++
  }

  // Initial Text Setups for Affected Texts
  textSetup(document.querySelector("#textAnim1"), "type")
  textSetup(document.querySelector("#textAnim2"), "right")
  textSetup(document.querySelector("#textAnim3"), "right")
  textSetup(document.querySelector("#textAnim4"), "right")
  textSetup(document.querySelector("#textAnim5"), "right")
  textSetup(document.querySelector("#textAnim6"), "right")
  textSetup(document.querySelector("#textAnim7"), "right")
  textSetup(document.querySelector("#textAnim8"), "right")

  // Animate Text Function
  const animateText = (e, td, dir, del) => {
    const spans = textAnimationDivs[e]
    for (let i = 0; i < spans.length; i++) {
      if (dir == "up") {
        gsap.to(spans[i], {
          duration: 0.75,
          delay: i * td + del,
          y: 0,
          scaleY: 1,
          ease: 'Power1.easeOut'
        })
        gsap.to(spans[i], {
          duration: 1.5,
          delay: i * td + del,
          opacity: 1,
        })
      }
      else if (dir == "down") {
        gsap.to(spans[i], {
          duration: 0.75,
          delay: i * td + del,
          y: 0,
          scaleY: 1,
          ease: 'Power1.easeOut'
        })
        gsap.to(spans[i], {
          duration: 1.5,
          delay: i * td + del,
          opacity: 1,
        })
      }
      else if (dir == "right") {
        gsap.to(spans[i], {
          duration: 0.3,
          delay: i * td + del,
          x: 0,
          scale: 1,
          ease: 'Power1.easeOut'
        })
        gsap.to(spans[i], {
          duration: 0.6,
          delay: i * td + del,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
      else if (dir == "type") {
        gsap.to(spans[i], {
          duration: 0,
          delay: i * td + del,
          opacity: 1,
        })
      }
      else if (dir == "pop") {
        gsap.to(spans[i], {
          duration: 0.35,
          delay: i * td + del,
          scale: 1,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
    }
  }

  // Trigger Text Animation

  // Browser Text
  const searchSectionDots = document.querySelectorAll('.searchSectionDot')
  const resetSearchAnimation = () => {
    for (let i = 0; i < searchSectionDots.length; i++) {
      gsap.to(searchSectionDots[i], {duration: 0, scale: 0})
    }
    gsap.to('.searchSectionPrivateImage', {duration: 0, opacity: 0, y: -10})
    gsap.to('.searchSectionTextbox', {duration: 0, marginRight: "30%"})
  }
  resetSearchAnimation()

  // Search Text
  ScrollTrigger.create({
    trigger: '.searchSectionTextbox',
    onEnter: () => {
      for (let i = 0; i < searchSectionDots.length; i++) {
        gsap.to(searchSectionDots[i], {duration: 0.5, delay: i * 0.5 + 0.5, scale: 1, ease: 'back'})
      }
      gsap.to('.searchSectionPrivateImage', {duration: 0.3, delay: 0.5, opacity: 1, y: 0})
      gsap.to('.searchSectionTextbox', {duration: 2, delay: 0, marginRight: "0%", ease: 'Power1.easeOut'})
      animateText(0, 0.075, "type", 0.5)
    }
  })

  // Description Text
  ScrollTrigger.create({
    trigger: '.descriptionSectionContainer',
    onEnter: () => {
      animateText(4, 0.02, "right", 0)
      animateText(5, 0.02, "right", textAnimationDivs[4].length * 0.02 + 0)
      animateText(6, 0.02, "right", textAnimationDivs[4].length * 0.02 + textAnimationDivs[5].length * 0.02 + 0)
      animateText(7, 0.02, "right", textAnimationDivs[4].length * 0.02 + textAnimationDivs[5].length * 0.02 + textAnimationDivs[6].length * 0.02 + 0)
    }
  })

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  const planeAnimationDelay = 3

  const startAnimation = () => {
    // Plane Transformation
    gsap.to(plane.rotation, {duration: 3, delay: 1 + planeAnimationDelay, x: 0, ease: 'back'})
    gsap.to(video, {duration: 1, delay: 0 + planeAnimationDelay, playbackRate: 5})
    gsap.to(video, {duration: 1, delay: 2 + planeAnimationDelay, playbackRate: 2})

    // Hero Logo
    gsap.to('.heroSectionLogoImage', {duration: 1, delay: 0.5, opacity: 1})

    // Hero Text
    animateText(1, 0.035, "right", 1.35)
    animateText(2, 0.035, "right", textAnimationDivs[1].length * 0.035 + 1.35)
    animateText(3, 0.035, "right", textAnimationDivs[1].length * 0.035 + textAnimationDivs[2].length * 0.035 + 1.35 + 0.5)
    animateText(4, 0.035, "right", textAnimationDivs[1].length * 0.035 + textAnimationDivs[2].length * 0.035 + 1.35 + 0.5)

    // Hero Scroll Down
    gsap.to('.heroSectionScrollDown', {duration: 1, delay: textAnimationDivs[1].length * 0.035 + textAnimationDivs[2].length * 0.035 + 1.35 + 0.5 + 2.5, opacity: 1})
  
    setTimeout(() => {
      finishedStartAnimation = true
    }, 500);
  }

}

/**
 * Load
 */

  let imgs = document.images,
  len = imgs.length,
  counter = 0;
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

    // Done Loading
    if ( counter == len ) {
      setTimeout(() => {
        // Loading Page
        gsap.to('.loadingPage', {duration: 1, opacity: 0, ease: 'Power1.easeInOut'})
        // PLay Button
        gsap.to('.playSectionButton', {duration: 1, delay: 0.35, opacity: 1, ease: 'Power1.easeInOut'})
        main()
      }, 500)
    }
  }

// Scroll to section #sectiontwo when .heroSectionBottom is clicked
document.querySelector('.heroSectionBottom').addEventListener('click', () => {
  lenis.scrollTo('#sectiontwo', {
    duration: 1.5,   // How long the scroll should take (seconds)
    offset: 0,       // Optional offset from the top
    immediate: false // Set to true to jump immediately without animation
  })
})

const Scroller = {
scrolled: 0,
direction: 'DOWN',
scroller: null,
disableEvents: false,
lenis: null,

  init: function () {
    const _ = this;

    // Initialize Lenis
    _.lenis = new Lenis();

    // Attach Lenis scroll events to ScrollTrigger
    _.lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker to update Lenis
    gsap.ticker.add(function (time) {
      _.lenis.raf(time * 1000);
    });

    // Prevent GSAP from lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Custom scroll handling
    _.lenis.on('scroll', function (e) {
      _.handle(e);
    });
  },
  handle: function (e) {
    const _ = this;

    _.scrolled = e?.targetScroll || window.scrollY;
     _.scrolled = e?.targetScroll || window.scrollY;
    _.direction = e?.direction;

    // Determine direction based on body classes if `direction` is `0`
    if (_.direction === 0) {
        const bodyClasses = document.body.classList;
        if (bodyClasses.contains('scrolling-up')) {
            _.direction = 'UP';
        } else if (bodyClasses.contains('scrolling-down')) {
            _.direction = 'DOWN';
        }
    } else {
        _.direction = _.direction === 1 ? 'DOWN' : 'UP';
    }

    if (_.direction === 'UP') {
      document.body.classList.add('scrolling-up');
      document.body.classList.remove('scrolling-down');
    } else {
      document.body.classList.add('scrolling-down');
      document.body.classList.remove('scrolling-up');
    }

    if (_.scrolled > window.innerHeight) {
      document.body.classList.add('viewport-scrolled');
    } else {
      document.body.classList.remove('viewport-scrolled');
    }

    if (_.scrolled > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }

    _.lastScrollPos = _.scrolled <= 0 ? 0 : _.scrolled;
  },
  disable: function () {
    if (this.lenis) {
      this.lenis.stop();
    }
  },

  enable: function () {
    if (this.lenis) {
      this.lenis.start();
    }
  },

  scrollTo: function (target) {
    const _ = this;
    const headerHeight = document.querySelector('#header').offsetHeight || 0;

    if (_.lenis) {
      _.lenis.scrollTo(target, {
        offset: -1 * headerHeight
      });
    }
  },

  scrollTop: function (transition) {
    if (this.lenis) {
      if (transition) {
        this.lenis.scrollTo(0, { duration: 1 });
      } else {
        this.lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }
    }
  },

  kill: function () {
    ScrollTrigger.killAll();
  },

  refresh: function () {
    ScrollTrigger.refresh();
  }
};

// Initialize the Scroller
Scroller.init();