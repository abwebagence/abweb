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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

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

  const planeRatio = 1920/1076

  // Resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
    visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

    if (sizes.prevWidth !== sizes.width) {
      if (sizes.width/sizes.height >= planeRatio) {
        plane.scale.set(visibleSizes.width, visibleSizes.width/planeRatio, 1)
      }
      else {
        plane.scale.set(visibleSizes.height*planeRatio, visibleSizes.height, 1)
      }
      sizes.prevWidth = sizes.width
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
  const texture = textureLoader.load('/wp-content/themes/cbd/page-templates/fitzory/images/HeroBackground.png')
  const textTexture = textureLoader.load('/wp-content/themes/cbd/page-templates/fitzory/images/FitzroyCarousel.png')

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  const planeGeometry = new THREE.PlaneGeometry(1,1,64,64)
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uText: {value: textTexture },
      uMouse: { value: {x: 0, y: 0}},
      uMainColor: { value: new THREE.Color(0xaf9f72) },
      uColorProgress: { value: 0 }
    },
  vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
    
      varying vec2 vUv;
      varying float vZ;
  
      void main() {
        vec3 newPosition = position;

        newPosition.z += sin(1. - abs(uv.x - uMouse.x)) * 0.1;
        newPosition.z += sin(1. - abs(uv.y - uMouse.y)) * 0.1;
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

        vec2 textUv = vec2(vUv.x * 1.2 - 0.12, vUv.y * 2. - 0.5);
        vec4 text = texture(uText, textUv);

        vec3 finalColor = color.rgb;

        finalColor -= 0.175;
        finalColor += 2. * sin(vZ * 0.5);

        vec3 goldColor = vec3(dot(finalColor, vec3(0.75))) * uMainColor;

        finalColor = mix(goldColor, finalColor, uColorProgress);

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
  scene.add(plane)
  if (sizes.width/sizes.height >= planeRatio) {
    plane.scale.set(visibleSizes.width, visibleSizes.width/planeRatio, 1)
  }
  else {
    plane.scale.set(visibleSizes.height*planeRatio, visibleSizes.height, 1)
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

        planeMouse.x = (e.clientX / sizes.width) 
        planeMouse.y = 1 - (e.clientY / sizes.height)

        gsap.to(plane.material.uniforms.uMouse.value, {duration: 1, x: planeMouse.x, y: planeMouse.y})

        // Cursor Follower
        // gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})

        // Carousel Section
        gsap.to('.carouselSectionCarouselImage1', {duration: 1, x: -mouse.x * 20 * sizes.width/1920, scale: 1 - (mouse.x - 0.5) * 0.1})
        gsap.to('.carouselSectionCarouselImage2', {duration: 1, x: -mouse.x * 40 * sizes.width/1920, scale: 1 - (mouse.x - 0.5) * 0.1})
        gsap.to('.carouselSectionCarouselImage3', {duration: 1, x: -mouse.x * 80 * sizes.width/1920, scale: 1 + Math.sin(Math.abs(mouse.x)) * 0.1})
        gsap.to('.carouselSectionCarouselImage4', {duration: 1, x: -mouse.x * 40 * sizes.width/1920, scale: 1 + (mouse.x - 0.5) * 0.1})
        gsap.to('.carouselSectionCarouselImage5', {duration: 1, x: -mouse.x * 20 * sizes.width/1920, scale: 1 + (mouse.x - 0.5) * 0.1})

        // Map Section
        gsap.to('.mapSectionSelectDiv', {duration: 1, x: -mouse.x * 15 * sizes.width/1920, y: mouse.y * 15 * sizes.width/1920})
        gsap.to('.mapSectionBackgroundDiv', {duration: 1, x: -mouse.x * 15 * sizes.width/1920, y: mouse.y * 15 * sizes.width/1920})
        gsap.to('.mapSectionCircleOuterSelect', {duration: 0.75, x: mouse.x * 5 * sizes.width/1920, y: -mouse.y * 5 * sizes.width/1920})
        gsap.to('.mapSectionCircleOuter', {duration: 0.75, x: mouse.x * 5 * sizes.width/1920, y: -mouse.y * 5 * sizes.width/1920})
        gsap.to('.mapSectionCircleName', {duration: 0.75, x: mouse.x * 10 * sizes.width/1920, y: -mouse.y * 10 * sizes.width/1920})
        gsap.to('.mapSectionCircleOuterSelect', {duration: 0.75, x: mouse.x * 2 * sizes.width/1920, y: -mouse.y * 2 * sizes.width/1920})
        gsap.to('.mapSectionCircleNameSelect', {duration: 0.75, x: mouse.x * 5 * sizes.width/1920, y: -mouse.y * 5 * sizes.width/1920})
        gsap.to('.mapSectionSelectLine', {duration: 0.5, x: mouse.x * 20 * sizes.width/1920, y: -mouse.y * 20 * sizes.width/1920})
        gsap.to('.mapSectionSelectImageDiv', {duration: 0.5, x: mouse.x * 40 * sizes.width/1920, y: -mouse.y * 40 * sizes.width/1920})

        // Tablet Section
        gsap.to('.tabletSectionTablet', {duration: 0.5, x: mouse.x * 200, y: -mouse.y * 200, rotateX: mouse.y * 20, rotateY: mouse.x * 20})
        
        if (finishedStartAnimation == true) {
          gsap.to('.heroSectionScrollDownAfrica', {duration: 1, x: mouse.x * 10, y: -mouse.y * 10})
          gsap.to('.goalSectionScrollDownAfrica', {duration: 1, x: mouse.x * 10, y: -mouse.y * 10})
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

  // Random Pings
  const mapSectionCirclePings = document.querySelectorAll('.mapSectionCirclePing')

  const animatePing = (index) => {
    const randomTime = Math.random() * 2.5 + 2.5

    gsap.fromTo(mapSectionCirclePings[index], {scale: 1, opacity: 1}, {duration: 1, scale: 3, opacity: 0, ease: 'Power1.easeOut'})
    setTimeout(() => {
      animatePing(index)
    }, (randomTime + 1) * 1000)
  }

  for (let i = 0; i < mapSectionCirclePings.length; i++) {
    animatePing(i)
  }

  // Delivered Section Hover
  const deliveredSectionMarqueeTexts = document.querySelectorAll('.deliveredSectionMarqueeText')

  for (let i = 0; i < deliveredSectionMarqueeTexts.length; i++) {
    deliveredSectionMarqueeTexts[i].addEventListener("pointerenter", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#000000'})
    })
    deliveredSectionMarqueeTexts[i].addEventListener("pointerleave", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#ffffff'})
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

    plane.material.uniforms.uTime.value = elapsedTime

    // Constant Animations
    gsap.to('.heroSectionScrollDownText', {duration: 0, rotateZ: -elapsedTime * 10})
    gsap.to('.goalSectionScrollDownText', {duration: 0, rotateZ: -elapsedTime * 10})

    // Scroll Value
    scrollValue = scrollStart.getBoundingClientRect().top
    // camera.position.y = visibleSizes.height/sizes.height * scrollValue

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
    '.webgl',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector(".heroSection").clientHeight * 1+ " bottom",
        end: () => document.querySelector(".heroSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100
    }
  )

  gsap.fromTo(
    '.heroSectionScrollDownBorder',
    { rotateZ: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector(".heroSection").clientHeight * 1+ " bottom",
        end: () => document.querySelector(".heroSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: 90
    }
  )

  gsap.fromTo(
    '.heroSectionOverlayText',
    { y: 0},
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector(".heroSection").clientHeight * 1 + " bottom",
        end: () => document.querySelector(".heroSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -40,
    }
  )

  
  gsap.fromTo(
    '.heroSectionScrollDown',
    { y: 0},
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector(".heroSection").clientHeight * 1 + " bottom",
        end: () => document.querySelector(".heroSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -80,
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

  // Carousel Section
  gsap.fromTo(
    '.carouselSectionBackgroundImage',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      opacity: 1,
    }
  )

  gsap.fromTo(
    '.carouselSectionText',
    { y: "0rem" },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: "-5rem"
    }
  )

  gsap.fromTo(
    '.carouselSectionCarouselContainer1',
    { y: 0 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -25 * sizes.width/1920
    }
  )

  gsap.fromTo(
    '.carouselSectionCarouselContainer2',
    { y: 100 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
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
    '.carouselSectionCarouselContainer3',
    { y: 100 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100 * sizes.width/1920
    }
  )

  gsap.fromTo(
    '.carouselSectionCarouselContainer4',
    { y: 100 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
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
    '.carouselSectionCarouselContainer5',
    { y: 0 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: ".carouselSection",
        start: () => document.querySelector(".carouselSection").clientHeight * 0.25 + " bottom",
        end: () => document.querySelector(".carouselSection").clientHeight * 0.75 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -25 * sizes.width/1920
    }
  )

  // Map Section
  gsap.fromTo(
    '.mapSectionBackground',
    { scale: 1.5 },
    {
      scrollTrigger: {
        trigger: ".mapSection",
        start: () => document.querySelector(".mapSection").clientHeight * 0 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 2.75,
      scale: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.mapSectionBackground',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".mapSection",
        start: () => document.querySelector(".mapSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mapSection").clientHeight * 1 + " top",
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
    '.mapSectionSelect',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".mapSection",
        start: () => document.querySelector(".mapSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mapSection").clientHeight * 1 + " top",
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
    '.mapSectionCirclesContainer',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".mapSection",
        start: () => document.querySelector(".mapSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".mapSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -110
    }
  )

  gsap.fromTo(
    '#mapSectionTabParks',
    { opacity: 0, x: -20 },
    {
      scrollTrigger: {
        trigger: '#mapSectionTabParks',
        start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      opacity: 1,
      x: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#mapSectionTabSpecies',
    { opacity: 0, x: -20 },
    {
      scrollTrigger: {
        trigger: '#mapSectionTabParks',
        start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      delay: 0.25,
      opacity: 1,
      x: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '#mapSectionTabSites',
    { opacity: 0, x: -20 },
    {
      scrollTrigger: {
        trigger: '#mapSectionTabParks',
        start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      delay: 0.5,
      opacity: 1,
      x: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.mapSectionArrowImage',
    { scaleY: 0 },
    {
      scrollTrigger: {
        trigger: '#mapSectionTabParks',
        start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 1,
      delay: 0.75,
      scaleY: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.mapSectionBlur',
    { backdropFilter: 'blur(5px)' },
    {
      scrollTrigger: {
        trigger: '#mapSectionTabParks',
        start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
        // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 2.75,
      backdropFilter: 'blur(0px)',
      ease: 'Power1.easeInOut'
    }
  )

  const mapSectionTabPlaces = document.querySelectorAll('.mapSectionTabPlace')
  const mapSectionCircleOuters = document.querySelectorAll('.mapSectionCircleOuter')
  const mapSectionCircleNames = document.querySelectorAll('.mapSectionCircleName')
  const mapAnimationDelay = 0.25

  for (let i = 0; i < mapSectionTabPlaces.length; i++) {
    if (i < (mapSectionTabPlaces.length - 1)) {
      gsap.fromTo(
        mapSectionTabPlaces[i],
        { opacity: 0, x: -10 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          opacity: 1,
          x: 0,
          ease: 'Power1.easeInOut'
        }
      )

      gsap.fromTo(
        mapSectionCircleOuters[i],
        { scale: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          scale: 1,
          ease: 'back'
        }
      )

      gsap.fromTo(
        mapSectionCircleNames[i],
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          opacity: 1,
          ease: 'Power1.easeInOut'
        }
      )
    }
    else {
      gsap.fromTo(
        mapSectionTabPlaces[i],
        { opacity: 0, x: -10 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          opacity: 1,
          x: 0,
          ease: 'Power1.easeInOut'
        }
      )

      gsap.fromTo(
        '.mapSectionCircleOuterSelect',
        { scale: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          scale: 1,
          ease: 'back'
        }
      )

      gsap.fromTo(
        '.mapSectionCircleNameSelect',
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay,
          opacity: 1,
          ease: 'Power1.easeInOut'
        }
      )

      gsap.fromTo(
        '.mapSectionSelect',
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay + 0.5,
          opacity: 1,
          ease: 'Power1.easeInOut'
        }
      )

      gsap.fromTo(
        '.mapSectionSelectLine',
        { scaleX: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay + 0.25,
          scaleX: 1,
          ease: 'Power1.easeInOut'
        }
      )

      gsap.fromTo(
        '.mapSectionSelectImageDiv',
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#mapSectionTabParks',
            start: () => document.querySelector('#mapSectionTabParks').clientHeight * 1 + " bottom",
            // end: () => mapSectionCircleDivs[i].clientHeight * 1 + " top",
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: true,
            // markers: true
          },
          duration: 1,
          delay: 1.25 + i * mapAnimationDelay + 0.5,
          opacity: 1,
          ease: 'Power1.easeInOut'
        }
      )
    }
  }

  // Tablet Section
  gsap.fromTo(
    '.tabletSectionSand',
    { opacity: 0, y: -200 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: '.tabletSectionBackground',
        start: () => document.querySelector('.tabletSectionBackground').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.tabletSectionBackground').clientHeight * 1 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      opacity: 1,
      y: 0 * sizes.width/1920,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.tabletSectionNameImage',
    { y: 200 * sizes.width/1920, scale: 0.95 },
    {
      scrollTrigger: {
        trigger: '.tabletSection',
        start: () => document.querySelector('.tabletSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.tabletSection').clientHeight * 1 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -120 * sizes.width/1920,
      scale: 1,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.tabletSectionDesert',
    { y: 200 * sizes.width/1920 },
    {
      scrollTrigger: {
        trigger: '.tabletSection',
        start: () => document.querySelector('.tabletSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.tabletSection').clientHeight * 1 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: 'Power1.easeInOut'
    }
  )

  gsap.fromTo(
    '.tabletSectionTabletContainer',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: '.tabletSectionBackground',
        start: () => document.querySelector('.tabletSectionBackground').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.tabletSectionBackground').clientHeight * 1 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      y: -50 * sizes.width/1920,
      ease: 'Power1.easeInOut'
    }
  )

  // Goal Section
  gsap.fromTo(
    '.goalSectionScrollDownBorder',
    { rotateZ: 0 },
    {
      scrollTrigger: {
        trigger: ".infoSection",
        start: () => document.querySelector(".infoSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".infoSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: 90
    }
  )

  gsap.fromTo(
    '.goalSectionHeader',
    { y: 20 },
    {
      scrollTrigger: {
        trigger: ".goalSection",
        start: () => document.querySelector(".goalSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".goalSection").clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -20
    }
  )

  gsap.fromTo(
    '.goalSectionBody',
    { opacity: 0, y: 40 },
    {
      scrollTrigger: {
        trigger: ".goalSectionBody",
        start: () => document.querySelector(".goalSectionBody").clientHeight * 0.1 + " bottom",
        // end: () => document.querySelector(".goalSection").clientHeight * 1 + " top",
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

  // UI Section
  gsap.fromTo(
    '.uiSectionText1',
    { x: 20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionLeft",
        start: () => document.querySelector(".uiSectionLeft").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".uiSectionLeft").clientHeight * 0.5 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionText2',
    { x: -20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionLeft",
        start: () => document.querySelector(".uiSectionLeft").clientHeight * 0.1 + " bottom",
        end: () => document.querySelector(".uiSectionLeft").clientHeight * 0.6 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionText3',
    { x: 20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionLeft",
        start: () => document.querySelector(".uiSectionLeft").clientHeight * 0.2 + " bottom",
        end: () => document.querySelector(".uiSectionLeft").clientHeight * 0.7 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: 1,
        // pin: true,
        // markers: true
      },
      x: 0,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.uiSectionHeaderAfrica',
    { x: 50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".uiSectionLeft",
        start: () => document.querySelector(".uiSectionLeft").clientHeight * -0.5 + " bottom",
        end: () => document.querySelector(".uiSectionLeft").clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -10,
      opacity: 1,
      ease: 'Power1.easeOut'
    }
  )

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
    '.infoSectionLogo',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".infoSectionLogo",
        start: () => document.querySelector(".infoSectionLogo").clientHeight * 0 + " bottom",
        // end: () => document.querySelector(".infoSectionLogo").clientHeight * 1.5 + " ",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      delay: 0.5,
      duration: 2,
      opacity: 1,
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
  textSetup(document.querySelector("#textAnim1"), "up")
  textSetup(document.querySelector("#textAnim2"), "up")
  textSetup(document.querySelector("#textAnim3"), "up")
  textSetup(document.querySelector("#textAnim4"), "down")
  textSetup(document.querySelector("#textAnim5"), "type")
  textSetup(document.querySelector("#textAnim6"), "pop")

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
      animateText(4, 0.075, "type", 0.5)
    }
  })

  // Carousel Text
  ScrollTrigger.create({
    trigger: '.carouselSectionText',
    onEnter: () => {
      animateText(5, 0.055, "pop", 0)
    }
  })
  
  /**
   * Start Animation
   */
  // ----------------------------------------------------------------

  const startAnimation = () => {
    // Loading Page
    gsap.to('.loadingPage', {duration: 1, opacity: 0, ease: 'Power1.easeInOut'})

    // Hero Animation
    gsap.fromTo(plane.material.uniforms.uColorProgress, {value: 0}, {duration: 2.5, delay: 0.5, value: 1, ease: 'Power1.easeIn'})
    gsap.fromTo('.heroSectionAfricaImage', {scale: 0.9}, {duration: 3, delay: 0, scale: 1, ease: 'Power1.easeOut'})
    gsap.fromTo('.heroSectionLogoImage', {opacity: 0, scale: 0.9}, {duration: 1.5, delay: 0.75, opacity: 1, scale: 1, ease: 'Power1.easeInOut'})
    animateText(0, 0.06, "up", 0)
    animateText(1, 0.06, "up", (textAnimationDivs[0].length + 1) * 0.05)
    animateText(2, 0.06, "up", (textAnimationDivs[0].length + textAnimationDivs[1].length + 2) * 0.05)
    animateText(3, 0.06, "down", (textAnimationDivs[0].length + textAnimationDivs[1].length + textAnimationDivs[2].length + 3) * 0.05 + 0)
    gsap.fromTo('.heroSectionScrollDown', {y: 10, opacity: 0}, {duration: 1, delay: 1.8, y: 0, opacity: 1, ease: 'Power1.easeOut'})
  
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