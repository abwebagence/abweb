/**
 * Initial Settings
 */

// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

// Clear Scroll Memory
window.history.scrollRestoration = "manual"

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
  const texture = textureLoader.load(`${themeUri}/page-templates/wisterm/images/HeroBackground.webp`)

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
  // scene.add(planeGroup)

  // Plane Scale and Position
  const planeRatio = 1920/1080
  // Plane Resize
  if (sizes.width/sizes.height > planeRatio) {
    plane.scale.set(visibleSizes.width, visibleSizes.width/planeRatio, 1)
  }
  else {
    plane.scale.set(visibleSizes.height * planeRatio, visibleSizes.height, 1)
  }
 
  // W Planes
  const wPlane1Geometry = new THREE.PlaneGeometry(1,1,16,16)
  const wPlane1Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff0000),
    wireframe: true
  })
  const wPlane1 = new THREE.Mesh(wPlane1Geometry, wPlane1Material)
  // scene.add(wPlane1)
  wPlane1.scale.set(visibleSizes.height * 0.25, visibleSizes.height, 1)
  wPlane1.rotation.z = Math.PI/8
  wPlane1.position.x = -visibleSizes.width/4

  const wPlane2Geometry = new THREE.PlaneGeometry(1,1,16,16)
  const wPlane2Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff0000),
    wireframe: true
  })
  const wPlane2 = new THREE.Mesh(wPlane2Geometry, wPlane2Material)
  // scene.add(wPlane2)
  wPlane2.scale.set(visibleSizes.height * 0.25, visibleSizes.height, 1)
  wPlane2.rotation.z = -Math.PI/8
  wPlane2.position.x = -visibleSizes.width/4 + visibleSizes.height * 0.25

  const wPlane3Geometry = new THREE.PlaneGeometry(1,1,16,16)
  const wPlane3Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff0000),
    wireframe: true
  })
  const wPlane3 = new THREE.Mesh(wPlane3Geometry, wPlane3Material)
  // scene.add(wPlane3)
  wPlane3.scale.set(visibleSizes.height * 0.25, visibleSizes.height, 1)
  wPlane3.rotation.z = Math.PI/8
  wPlane3.position.x = -visibleSizes.width/4 + visibleSizes.height * 0.25 + visibleSizes.height * 0.25

  const wPlane4Geometry = new THREE.PlaneGeometry(1,1,16,16)
  const wPlane4Material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff0000),
    wireframe: true
  })
  const wPlane4 = new THREE.Mesh(wPlane4Geometry, wPlane4Material)
  // scene.add(wPlane4)
  wPlane4.scale.set(visibleSizes.height * 0.25, visibleSizes.height, 1)
  wPlane4.rotation.z = -Math.PI/8
  wPlane4.position.x = -visibleSizes.width/4 + visibleSizes.height * 0.25 + visibleSizes.height * 0.25 + visibleSizes.height * 0.25

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

        // Extra Section
        gsap.to('.extraImage', {duration: 1, rotateY: mouse.x * 2, rotateX: mouse.y * 2})

        // Visit Section
        gsap.to('.visitSectionImage', {duration: 1, rotateY: mouse.x * 2, rotateX: mouse.y * 2})

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

  // Visit Button
  document.querySelector('.visitSectionButton').addEventListener('pointerenter', () => {
    gsap.to('.visitSectionButton', {duration: 0.2, y: -5, scale: 1, backgroundColor: '#ffffffff', color: '#554D56'})
  })

  document.querySelector('.visitSectionButton').addEventListener('pointerleave', () => {
    gsap.to('.visitSectionButton', {duration: 0.2, y: 0, scale: 1, backgroundColor: '#ffffff00', color: '#ffffff'})
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

    gsap.to('.requirementsSectionAccent', {duration: 0, opacity: 0.2 * Math.sin(elapsedTime * 3) + 0.8})

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
  // Brown W Section
  gsap.fromTo(
    '.brownWSection',
    { y: sizes.height},
    {
      scrollTrigger: {
        trigger: ".brownSection",
        start: () => document.querySelector('.brownSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.brownSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.brownWSectionParallax',
    { y: -sizes.height},
    {
      scrollTrigger: {
        trigger: ".brownSection",
        start: () => document.querySelector('.brownSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.brownSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.brownWSectionColumnImage',
    { scale: 1},
    {
      scrollTrigger: {
        trigger: ".brownSection",
        start: () => document.querySelector('.brownSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.brownSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      scale: 1.2,
      ease: 'none'
    }
  )
  
   // Blue W Section
   gsap.fromTo(
    '.blueWSection',
    { y: sizes.height},
    {
      scrollTrigger: {
        trigger: ".requirementsSection",
        start: () => document.querySelector('.requirementsSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.requirementsSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.blueWSectionParallax',
    { y: -sizes.height},
    {
      scrollTrigger: {
        trigger: ".requirementsSection",
        start: () => document.querySelector('.requirementsSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.requirementsSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  // W 2 Section
  gsap.fromTo(
    '.w2Section',
    { y: sizes.height},
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.w2SectionParallax',
    { y: -sizes.height},
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  // Brown W 2 Section
  gsap.fromTo(
    '.brownW2Section',
    { y: sizes.height},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector('.visitSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.visitSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.brownW2SectionParallax',
    { y: -sizes.height},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector('.visitSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.visitSection').clientHeight * 0 + sizes.height + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'none'
    }
  )

  // Hero Section
  gsap.fromTo(
    '#heroSectionImageContainer1',
    { y: 0},
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
      y: -100,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#heroSectionImageContainer2',
    { y: 0},
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
      y: -100,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#heroSectionImageContainer3',
    { y: 0},
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
      y: -100,
      ease: 'none'
    }
  )

  // Extra Section
  gsap.fromTo(
    '.extraTextSection',
    { opacity: 0, y: 10},
    {
      scrollTrigger: {
        trigger: ".extraTextSection",
        start: () => document.querySelector('.extraTextSection').clientHeight * 0 + " center",
        // end: () => document.querySelector('.extraTextSection').clientHeight * 1 + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 0.6,
      opacity: 1,
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.extraImageContainer',
    { y: 200},
    {
      scrollTrigger: {
        trigger: ".brownSection",
        start: () => document.querySelector('.extraTextSection').clientHeight * 0 + " center",
        // end: () => document.querySelector('.extraTextSection').clientHeight * 1 + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      y: 0,
      ease: 'Power1.easeOut'
    }
  )
  
  // Mobile Section
  gsap.fromTo(
    '#mobileSectionImageContainer1',
    { y: 100, rotateY: -0},
    {
      scrollTrigger: {
        trigger: ".mobileSectionMain",
        start: () => document.querySelector('.mobileSectionMain').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.mobileSectionMain').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100,
      rotateY: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#mobileSectionImageContainer2',
    { y: -100, rotateY: -0},
    {
      scrollTrigger: {
        trigger: ".mobileSectionMain",
        start: () => document.querySelector('.mobileSectionMain').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.mobileSectionMain').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100,
      rotateY: 0,
      ease: 'Power1.easeOut'
    }
  )

  // Requirements Section
  gsap.fromTo(
    '.requirementsSectionMiniHeaderLogo',
    { rotateZ: -180},
    {
      scrollTrigger: {
        trigger: ".requirementsSectionMiniHeader",
        start: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + sizes.height + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      rotateZ: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.requirementsSectionMiniHeaderText',
    { x: -20, opacity: 0},
    {
      scrollTrigger: {
        trigger: ".requirementsSectionMiniHeader",
        start: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + sizes.height + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.requirementsSectionHeader',
    { x: 20, opacity: 0},
    {
      scrollTrigger: {
        trigger: ".requirementsSectionHeader",
        start: () => document.querySelector('.requirementsSectionHeader').clientHeight * 0.5 + " bottom",
        // end: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + sizes.height + " top",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  const requirementsSectionTabs = document.querySelectorAll('.requirementsSectionTab')

  for (let i = 0; i < requirementsSectionTabs.length; i++) {
    gsap.fromTo(
      requirementsSectionTabs[i],
      { width: requirementsSectionTabs[i].clientHeight, backgroundColor: '#ffffffff', opacity: 0},
      {
        scrollTrigger: {
          trigger: ".requirementsSectionHeader",
          start: () => document.querySelector('.requirementsSectionHeader').clientHeight * 0.5 + " bottom",
          // end: () => document.querySelector('.requirementsSectionMiniHeader').clientHeight * 0 + sizes.height + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        duration: 0.5,
        delay: i * 0.4,
        backgroundColor: '#ffffff00',
        width: requirementsSectionTabs[i].clientWidth,
        opacity: 1,
        ease: 'Power1.easeOut'
      }
    )
  }
  
  gsap.fromTo(
    '.requirementsSectionAccentImage',
    { opacity: 0, scale: 0.5},
    {
      scrollTrigger: {
        trigger: ".requirementsSection",
        start: () => document.querySelector('.requirementsSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.requirementsSection').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      opacity: 0.6,
      scale: 2,
      ease: 'Power1.easeOut'
    }
  )

  // Showcase Section
  gsap.fromTo(
    '#showcaseSectionImage1',
    { x: -100, y: 100, scale: 0.95},
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: 0,
      y: -100,
      scale: 1, 
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#showcaseSectionImage2',
    { x: 100, y: 100, scale: 0.95},
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: 0,
      y: -100,
      scale: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#showcaseSectionImage3',
    { y: 200, scale: 0.95},
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0 + sizes.height + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100,
      scale: 1,
      ease: 'Power1.easeOut'
    }
  )

  // Visit Section
  gsap.fromTo(
    '.visitSectionImage',
    { y: 100},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector('.visitSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.visitSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100,
      scale: 1,
      ease: 'Power1.easeOut'
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
  // textSetup(document.querySelector("#textAnim1"), "type")

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
  gsap.to('.heroSectionLogo', {duration: 0, opacity: 0})
  gsap.to('#heroSectionImageParallaxColumn1', {duration: 0, opacity: 0, x: -50, y: 50})
  gsap.to('#heroSectionImageParallaxColumn2', {duration: 0, opacity: 0, y: 100})
  gsap.to('#heroSectionImageParallaxColumn3', {duration: 0, opacity: 0, x: 50, y: 50})

  gsap.to('#wSectionColumnStart1', {duration: 0, scaleY: 0, transformOrigin: 'top'})
  gsap.to('#wSectionColumnImage1', {duration: 0, opacity: 0})
  gsap.to('#wSectionColumnStart2', {duration: 0, scaleY: 0, transformOrigin: 'bottom'})
  gsap.to('#wSectionColumnImage2', {duration: 0, opacity: 0})
  gsap.to('#wSectionColumnStart3', {duration: 0, scaleY: 0, transformOrigin: 'top'})
  gsap.to('#wSectionColumnImage3', {duration: 0, opacity: 0})
  gsap.to('#wSectionColumnStart4', {duration: 0, scaleY: 0, transformOrigin: 'bottom'})
  gsap.to('#wSectionColumnImage4', {duration: 0, opacity: 0})

  const startAnimation = () => {
    gsap.to('#wSectionColumnStart1', {duration: 1, delay: 1, scaleY: 1})
    gsap.to('#wSectionColumn1', {duration: 0, delay: 1.5, backgroundColor: '#E1F0F2'})
    gsap.to('#wSectionColumnStart1', {duration: 0, delay: 1.5, transformOrigin: 'bottom'})
    gsap.to('#wSectionColumnStart1', {duration: 1, delay: 1.5, scaleY: 0})

    gsap.to('#wSectionColumnStart2', {duration: 1, delay: 1.5, scaleY: 1})
    gsap.to('#wSectionColumn2', {duration: 0, delay: 2, backgroundColor: '#E1F0F2'})
    gsap.to('#wSectionColumnStart2', {duration: 0, delay: 2, transformOrigin: 'top'})
    gsap.to('#wSectionColumnStart2', {duration: 1, delay: 2, scaleY: 0})

    gsap.to('#wSectionColumnStart3', {duration: 1, delay: 2, scaleY: 1})
    gsap.to('#wSectionColumn3', {duration: 0, delay: 2.5, backgroundColor: '#E1F0F2'})
    gsap.to('#wSectionColumnStart3', {duration: 0, delay: 2.5, transformOrigin: 'bottom'})
    gsap.to('#wSectionColumnStart3', {duration: 1, delay: 2.5, scaleY: 0})

    gsap.to('#wSectionColumnStart4', {duration: 1, delay: 2.5, scaleY: 1})
    gsap.to('#wSectionColumn4', {duration: 0, delay: 3, backgroundColor: '#E1F0F2'})
    gsap.to('#wSectionColumnStart4', {duration: 0, delay: 3, transformOrigin: 'top'})
    gsap.to('#wSectionColumnStart4', {duration: 1, delay: 3, scaleY: 0})

    gsap.to('.heroSectionLogo', {duration: 2, delay: 3.25, opacity: 1})

    gsap.to('#heroSectionImageParallaxColumn1', {duration: 1.5, delay: 3.75, opacity: 1, x: 0, y: 0})
    gsap.to('#heroSectionImageParallaxColumn2', {duration: 1.5, delay: 3.5, opacity: 1, y: 0})
    gsap.to('#heroSectionImageParallaxColumn3', {duration: 1.5, delay: 4, opacity: 1, x: 0, y: 0})

    setTimeout(() => {
      finishedStartAnimation = true
    }, 500);
  }

  startAnimation()

}
window.addEventListener('load', () => {
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
});

/**
 * Load
 */

  let imgs = document.images,
  len = imgs.length,
  counter = 0;

//   [].forEach.call( imgs, (img) => {
//     if(img.complete) {
//       incrementCounter()
//       // console.log('yup')
//     }
//     else {
//       img.addEventListener( 'load', incrementCounter, false )
//       // console.log('nope')
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
