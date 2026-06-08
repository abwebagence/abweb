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

  // Resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
    visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

    // Plane Resize
    if (sizes.width/sizes.height > planeRatio) {
      plane.scale.set(visibleSizes.width, visibleSizes.width/planeRatio, 1)
    }
    else {
      plane.scale.set(visibleSizes.height * planeRatio, visibleSizes.height, 1)
    }

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // Texture Loader
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/wp-content/themes/cbd/page-templates/wfuna/images/HeroBackground.png')

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------
  // Plane
  const planeGeometry = new THREE.PlaneGeometry(1,1,64,64)
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: {x: 0, y: 0}},
      uMainColor: { value: new THREE.Color(0xaf9f72) },
      uColorProgress: { value: 0 },
      uStartProgress:  { value: 2 },
      uColorTint: { value: new THREE.Color(0x0f0f0f) },
    },
  vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uStartProgress;
    
      varying vec2 vUv;
      varying float vZ;
      varying float vMouseDistance;
  
      void main() {
        vec3 newPosition = position;


        vMouseDistance = distance(newPosition.xy, uMouse.xy);

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
      uniform vec3 uColorTint;
      uniform vec2 uMouse;

      varying vec2 vUv;
      varying float vZ;
      varying float vMouseDistance;

      void main() {
        
        vec4 color = texture(uTexture, vUv);

        vec3 finalColor = color.rgb;

        finalColor *= 0.4;
        finalColor += 0.05;

        gl_FragColor = vec4(finalColor, 1.);
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
  const planeRatio = 1920/1080
  // Plane Resize
  if (sizes.width/sizes.height > planeRatio) {
    plane.scale.set(visibleSizes.width, visibleSizes.width/planeRatio, 1)
  }
  else {
    plane.scale.set(visibleSizes.height * planeRatio, visibleSizes.height, 1)
  }

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

        planeMouse.x = mouse.x
        planeMouse.y = mouse.y 

        // Plane
        gsap.to(plane.material.uniforms.uMouse.value, {duration: 1, x: planeMouse.x, y: planeMouse.y})

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
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#1a1919'})
    })
    deliveredSectionMarqueeTexts[i].addEventListener("pointerleave", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#d6dadc'})
    })
  }

  // About Section Button
  gsap.to('.aboutSectionButtonBackground', {duration: 0, transformOrigin: 'bottom', scaleY: 0})

  document.querySelector('.aboutSectionButton').addEventListener('pointerover', () => {
    gsap.to('.aboutSectionButtonBackground', {duration: 0, transformOrigin: 'bottom'})
    gsap.to('.aboutSectionButtonBackground', {duration: 0.25, scaleY: 1})
    gsap.to('.aboutSectionButton', {duration: 0.25, color: '#0089BD', y: 0})
  })

  document.querySelector('.aboutSectionButton').addEventListener('pointerleave', () => {
    gsap.to('.aboutSectionButtonBackground', {duration: 0, transformOrigin: 'top'})
    gsap.to('.aboutSectionButtonBackground', {duration: 0.25, scaleY: 0})
    gsap.to('.aboutSectionButton', {duration: 0.25, color: '#ffffff', y: 0})
  })
 
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
  // ----------------------------------------------------------------
  // Hero Section
  // gsap.fromTo(
  //   plane.position,
  //   { y: 0 },
  //   {
  //     scrollTrigger: {
  //       trigger: ".heroSection",
  //       start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
  //       end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
  //       // toggleActions: "play none none reverse",
  //       // snap: 1,
  //       scrub: true,
  //       // pin: true,
  //       // markers: true
  //     },
  //     y: -visibleSizes.height * 0.15
  //   }
  // )

  // Hero Section
  gsap.fromTo(
    '.heroSectionSearchText',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100
    }
  )

  gsap.fromTo(
    '.heroSearchImageContainer',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100
    }
  )

  // About Section
  gsap.fromTo(
    '.aboutSectionHeaderText',
    { opacity: 0, y: -50 },
    {
      scrollTrigger: {
        trigger: ".aboutSection",
        start: () => document.querySelector('.aboutSectionHeader').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.aboutSection').clientHeight * 1 + " bottom",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      y: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.aboutSectionBody',
    { opacity: 0, x: 50},
    {
      scrollTrigger: {
        trigger: ".aboutSectionBody",
        start: () => document.querySelector('.aboutSectionBody').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.aboutSection').clientHeight * 1 + " bottom",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      delay: 0.45,
      duration: 0.75,
      opacity: 1,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.aboutSectionBackground',
    { y: 50 },
    {
      scrollTrigger: {
        trigger: ".aboutSectionMap",
        start: () => document.querySelector('.aboutSectionMap').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.aboutSectionMap').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -50,
    }
  )

  const aboutSectionMapPins = document.querySelectorAll('.aboutSectionMapPin')

  for (let i = 0; i < aboutSectionMapPins.length; i++) {
    gsap.fromTo(
      aboutSectionMapPins[i],
      { scale: 0, opacity: 0},
      {
        scrollTrigger: {
          trigger: aboutSectionMapPins[i],
          start: () => aboutSectionMapPins[i].clientHeight * 0 + " bottom",
          // end: () => document.querySelector('.aboutSectionMap').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        delay: i * 0.25, 
        duration: 0.5,
        scale: 1,
        opacity: 1,
        ease: 'back'
      }
    )
  }

  // Delivered Section
  gsap.fromTo(
    '.deliveredSectionMiniHeader',
    { x: -100 },
    {
      scrollTrigger: {
        trigger: ".deliveredSectionMiniHeader",
        start: () => document.querySelector('.deliveredSectionMiniHeader').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.deliveredSectionMiniHeaderText').clientHeight * 3 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1, 
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

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

  // Display Section
  gsap.fromTo(
    '#displaySectionImageContainer1',
    { rotateX: '30deg' },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 0.5  + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      rotateX: '0deg',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#displaySectionImageContainer2',
    { rotateX: '30deg' },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 0.75  + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      rotateX: '0deg',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#displaySectionImageContainer3',
    { rotateX: '30deg' },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      rotateX: '0deg',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#displaySectionImageContainer1',
    { y: 200 },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 1  + " top",
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
    '#displaySectionImageContainer2',
    { y: 200 },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 1.25  + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -100,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#displaySectionImageContainer3',
    { y: 200 },
    {
      scrollTrigger: {
        trigger: ".displaySection",
        start: () => document.querySelector(".displaySection").clientHeight * 0.5 + " bottom",
        end: () => document.querySelector(".displaySection").clientHeight * 1.5 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 0,
      ease: 'Power1.easeOut'
    }
  )

  // Showcase Section
  gsap.fromTo(
    '#showcaseSectionImageContainer1',
    { y: 0, x: -100 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector(".showcaseSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".showcaseSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: -120 * sizes.width/1920,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#showcaseSectionImageContainer2',
    { y: 0, x: 100 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector(".showcaseSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".showcaseSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 120 * sizes.width/1920,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  // Functionality Section
  gsap.fromTo(
    '.functionalitySectionHeader',
    { y: -100, opacity: 0},
    {
      scrollTrigger: {
        trigger: ".functionalitySection",
        start: () => document.querySelector('.functionalitySection').clientHeight * 0.5 + " bottom",
        // end: () => document.querySelector('.deliveredSectionMiniHeaderText').clientHeight * 3 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1, 
      y: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  const functionalitySectionBodyListEntrys = document.querySelectorAll('.functionalitySectionBodyListEntry')

  for (let i = 0; i < functionalitySectionBodyListEntrys.length; i++) {
    gsap.fromTo(
      functionalitySectionBodyListEntrys[i],
      { x: -20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".functionalitySection",
          start: () => document.querySelector('.functionalitySection').clientHeight * 0.5 + " bottom",
          // end: () => document.querySelector('.deliveredSectionMiniHeaderText').clientHeight * 3 + " bottom",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        delay: i * 0.25,
        duration: 0.5, 
        x: 0,
        opacity: 1, 
        ease: 'Power1.easeOut'
      }
    )
  }
  
  // UI Section
  gsap.fromTo(
    '#uiSectionMobileImage1',
    { y: -70 },
    {
      scrollTrigger: {
        trigger: ".uiSectionRight",
        start: () => document.querySelector(".uiSectionRight").clientHeight * -0.5 + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".uiSectionRight").clientHeight * 1.5 + window.innerHeight * 2 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 70,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#uiSectionMobileImage2',
    { y: 70 },
    {
      scrollTrigger: {
        trigger: ".uiSectionRight",
        start: () => document.querySelector(".uiSectionRight").clientHeight * -0.5 + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".uiSectionRight").clientHeight * 1.5 + window.innerHeight * 2 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -70,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionText1',
    { x: -20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionText1",
        start: () => document.querySelector(".uiSectionText1").clientHeight * 1  + window.innerHeight * 2 + " bottom",
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
        start: () => document.querySelector(".uiSectionText2").clientHeight * 1  + window.innerHeight * 2 + " bottom",
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
        start: () => document.querySelector(".mobileSection").clientHeight * 0  + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1  + window.innerHeight * 2 + " top",
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
        start: () => document.querySelector(".mobileSection").clientHeight * 0  + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1  + window.innerHeight * 2 + " top",
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
        start: () => document.querySelector(".mobileSection").clientHeight * 0  + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1  + window.innerHeight * 2 + " top",
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
        start: () => document.querySelector(".mobileSection").clientHeight * 0  + window.innerHeight * 2 + " bottom",
        end: () => document.querySelector(".mobileSection").clientHeight * 1  + window.innerHeight * 2 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
      },
      y: 200,
      ease: 'Power1.easeOut'
    }
  )

  // Timeline Section
  gsap.fromTo(
    '.timelineSectionMapContainer',
    { x: 100, scale: 0.95 },
    {
      scrollTrigger: {
        trigger: ".timelineSection",
        start: () => document.querySelector('.timelineSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.timelineSection').clientHeight * 2 + " top",
        // toggleActions: "play none none reverse",
        scrub: 1,
        // markers: true
      },
      x: -100,
      scale: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.timelineSectionHeader',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".timelineSection",
        start: () => document.querySelector('.timelineSection').clientHeight * 0 + " top",
        end: () => document.querySelector('.timelineSection').clientHeight * 2 + " top",
        // toggleActions: "play none none reverse",
        scrub: 1,
        // markers: true
      },
      x: -document.querySelector('.timelineSectionHeaderEntry').clientWidth * 2,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.timelineSectionBody',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".timelineSection",
        start: () => document.querySelector('.timelineSection').clientHeight * 0 + " top",
        end: () => document.querySelector('.timelineSection').clientHeight * 2 + " top",
        // toggleActions: "play none none reverse",
        scrub: 1,
        pin: true,
        // markers: true
      },
      x: -document.querySelector('.timelineSectionBodyEntry').clientWidth * 2,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing1',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 7/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing2',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 6/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing3',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 5/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing4',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 4/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing5',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 3/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing6',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 2/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing7',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 1/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPing8',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 0/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing1',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 7/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing2',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 6/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing3',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 5/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing4',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 4/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing5',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 3/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing6',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 2/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing7',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 1/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#timelineSectionMapPingRing8',
    { scale: 1, opacity: 1 },
    {
      scrollTrigger: {
        trigger: ".uiSection",
        start: () => 0 - sizes.height * (0.5 + 0/8) + " bottom",
       // end: () => sizes.height * (1.5 + 0/8) + " bottom",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // pin: true,
        // markers: true
      },
      duration: 1,
      scale: 10,
      opacity: 0,
      ease: 'Power1.easeInOut'
    }
  )

  // Large Section
  gsap.fromTo(
    '.largeSectionImage',
    { scale: 1 },
    {
      scrollTrigger: {
        trigger: ".largeSection",
        start: () => document.querySelector('.largeSection').clientHeight * 0  + " bottom",
        end: () => document.querySelector('.largeSection').clientHeight * 1  + " top",
        // toggleActions: "play none none reverse",
        scrub: true,
        // pin: true,
        // markers: true
      },
      scale: 1.1,
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

  // // Browser Text
  // const searchSectionDots = document.querySelectorAll('.searchSectionDot')
  // const resetSearchAnimation = () => {
  //   for (let i = 0; i < searchSectionDots.length; i++) {
  //     gsap.to(searchSectionDots[i], {duration: 0, scale: 0})
  //   }
  //   gsap.to('.searchSectionPrivateImage', {duration: 0, opacity: 0, y: -10})
  //   gsap.to('.searchSectionTextbox', {duration: 0, marginRight: "30%"})
  // }
  // resetSearchAnimation()

  // Search Text
  // ScrollTrigger.create({
  //   trigger: '.searchSectionTextbox',
  //   onEnter: () => {
  //     for (let i = 0; i < searchSectionDots.length; i++) {
  //       gsap.to(searchSectionDots[i], {duration: 0.5, delay: i * 0.5 + 0.5, scale: 1, ease: 'back'})
  //     }
  //     gsap.to('.searchSectionPrivateImage', {duration: 0.3, delay: 0.5, opacity: 1, y: 0})
  //     gsap.to('.searchSectionTextbox', {duration: 2, delay: 0, marginRight: "0%", ease: 'Power1.easeOut'})
  //     animateText(0, 0.075, "type", 0.5)
  //   }
  // })

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  const planeAnimationDelay = 3

  gsap.to('.heroSectionLogo', {duration: 0, opacity: 0})
  gsap.to('.heroSectionLine', {duration: 0, scaleY: 0})
  gsap.to('.heroSectionTextTop', {duration: 0, opacity: 0, x: -20})
  gsap.to('.heroSectionTextBottom', {duration: 0, opacity: 0, x: -20})
  gsap.to(camera.position, {duration: 0, z: 10 - 1})

  const startAnimation = () => {
    gsap.to('.heroSectionLogo', {duration: 1, delay: 0.25, opacity: 1})
    gsap.to('.heroSectionLine', {duration: 1.5, delay: 1, scaleY: 1,})
    gsap.to('.heroSectionTextTop', {duration: 1.25, delay: 1, opacity: 1, x: 0})
    gsap.to('.heroSectionTextBottom', {duration: 1.25, delay: 1 + 0.5, opacity: 1, x: 0})
    animateText(0, 0.05, "type", 2.5)
    gsap.to(camera.position, {duration: 5, z: 10})

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

//   [].forEach.call( imgs, (img) => {
//     if(img.complete) {
//       incrementCounter()
//     //   console.log('yup')
//     }
//     else {
//       img.addEventListener( 'load', incrementCounter, false )
//     //   console.log('nope')
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
        main()
      }, 500)
    }
  }
 
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
