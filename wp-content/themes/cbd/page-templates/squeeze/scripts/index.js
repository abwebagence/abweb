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

    plane.position.y = -visibleSizes.height * 1.7
    plane.scale.set(visibleSizes.width * 2, visibleSizes.height * 1.5, 1)

    plane2.position.y = -visibleSizes.height * 6
    plane2.scale.set(visibleSizes.width * 2, visibleSizes.height * 1.5, 1)
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // Texture Loader
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/wp-content/themes/cbd/page-templates/squeeze/images/LogoSVG.png')

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  const planeGeometry = new THREE.PlaneGeometry(1,1, 64, 64)
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xfcf8f3) },
    },
    vertexShader: `
        uniform float uTime;

        float PI = 3.141592;

        void main() {
            vec3 newPosition = position;

            newPosition.y += sin(uTime * 1. + uv.x * 40.) * (0.02 - 0.01 * sin(uTime));
            newPosition.z += sin(uTime * 1. + uv.x * 40. * uv.y * 40.) * (0.02 - 0.01 * sin(uTime)) * uv.x * sin(uTime);

            vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1. );

            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;

        void main() {
            gl_FragColor = vec4(uColor, 0.5);
            // gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
        }
    `,
    transparent: true,
    // side: THREE.DoubleSide,
    // wireframe: true,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.y = -visibleSizes.height * 1.7
  plane.scale.set(visibleSizes.width * 2, visibleSizes.height * 1.5, 1)
  scene.add(plane)

  const plane2 = new THREE.Mesh(planeGeometry, planeMaterial)
  plane2.position.y = -visibleSizes.height * 6
  plane2.scale.set(visibleSizes.width * 2, visibleSizes.height * 1.5, 1)
  scene.add(plane2)

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

        gsap.to(plane.rotation, {duration: 1, x: mouse.y * 0.75, y: mouse.x * 0.75})
        gsap.to(plane2.rotation, {duration: 1, x: mouse.y * 0.75, y: mouse.x * 0.75})

        // Extra Section
        gsap.to('.extraSectionBottle', {duration: 1, rotateZ: mouse.x * 20})
        gsap.to('.extraSectionIngredients', {duration: 1, rotateZ: mouse.x * 10, x: mouse.x * 20})

        // Showcase Section
        gsap.to('#showcaseBottle1', {duration: 1, rotateZ: mouse.x * 10 + 20})
        gsap.to('#showcaseBottle2', {duration: 1, rotateZ: mouse.x * 20 - 60})
        gsap.to('#showcaseBottle3', {duration: 1, rotateZ: mouse.x * 15 + 40})
        gsap.to('#showcaseBottle4', {duration: 1, rotateZ: mouse.x * 25 - 20})
        gsap.to('#showcaseMint1', {duration: 1, rotateZ: mouse.x * 10 - 40})
        gsap.to('#showcaseMint2', {duration: 1, rotateZ: mouse.x * 10 - 60})
        gsap.to('#showcaseMint3', {duration: 1, rotateZ: mouse.x * 10 + 40})

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
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#000000'})
    })
    deliveredSectionMarqueeTexts[i].addEventListener("pointerleave", () => {
      gsap.to(deliveredSectionMarqueeTexts[i], {duration: 0.15  , color: '#fcf8f3'})
    })
  }
  
  // Fruits Section Hover
  const fruitsSectionMarqueeTexts = document.querySelectorAll('.fruitsSectionMarqueeText')

  for (let i = 0; i < fruitsSectionMarqueeTexts.length; i++) {
    fruitsSectionMarqueeTexts[i].addEventListener("pointerenter", () => {
      gsap.to(fruitsSectionMarqueeTexts[i], {duration: 0.15  , color: '#000000'})
    })
    fruitsSectionMarqueeTexts[i].addEventListener("pointerleave", () => {
      gsap.to(fruitsSectionMarqueeTexts[i], {duration: 0.15  , color: '#ffffff'})
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
    plane2.material.uniforms.uTime.value = elapsedTime

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
    '.heroSectionFront',
    { y: 0, scale: 1, rotateZ: 0, opacity: 1},
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
        onLeaveBack: () => document.querySelector('header').classList.remove('scrolled')
      },
      y: 200,
      scale: 3,
      rotateZ: 40,
      opacity: 0,
      onComplete: () => document.querySelector('header').classList.add('scrolled') 
    }
  )

  gsap.fromTo(
    '.heroSectionBack',
    { y: 0, scale: 1, rotateZ: 0, opacity: 1},
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100,
      scale: 3,
      rotateZ: -40,
      opacity: 0
    }
  )

  gsap.fromTo(
    '.heroSectionBottlesContainer',
    { gap: 0 },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      gap: 200
    }
  )

  gsap.fromTo(
    '.scrollWhite',
    { rotateZ: '0deg' },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: '180deg'
    }
  )

  gsap.fromTo(
    '.scrollOrange',
    { rotateZ: '0deg' },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: '175deg'
    }
  )

  gsap.fromTo(
    '.scrollText',
    { rotateZ: '90deg' },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => 0 + " top",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: '-90deg'
    }
  )

  // Delivered Section
gsap.fromTo(
  '.deliveredSectionMarquee',
  { x: 0 },
  {
    scrollTrigger: {
      trigger: ".deliveredSectionMarquee",
      start: "bottom bottom",
      end: () => Math.round(window.innerHeight + document.querySelector('.deliveredSectionMarquee').clientHeight * 2) + " bottom",
      scrub: 0.5, 
    },
    x: () => Math.round(-(document.querySelector('.deliveredSectionMarquee').clientWidth - window.innerWidth)),
    ease: "none"
  }
);

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
        scrub: 0.5,
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
    '.searchImageContainer',
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
    { y: 0},
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
      y: -20 * sizes.width/1920
    }
  )

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

  // Fruits Section
  gsap.fromTo(
    '.fruitsSectionMarquee1',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".fruitsSection",
        start: () => 0 + " bottom",
        end: () => window.innerHeight + document.querySelector('.fruitsSection').clientHeight * 0.5 + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -(document.querySelector('.fruitsSectionMarquee1').clientWidth - window.innerWidth)
    }
  )

  gsap.fromTo(
    '.fruitsSectionMarquee2',
    { x: -(document.querySelector('.fruitsSectionMarquee1').clientWidth - window.innerWidth)},
    {
      scrollTrigger: {
        trigger: ".fruitsSection",
        start: () => 0 + " bottom",
        end: () => window.innerHeight + document.querySelector('.fruitsSection').clientHeight * 2 + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: 0
    }
  )

  gsap.fromTo(
    '.fruitsSectionMarquee3',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".fruitsSection",
        start: () => 0 + " bottom",
        end: () => window.innerHeight + document.querySelector('.fruitsSection').clientHeight * 2 + " bottom",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 0.5,
        // pin: true,
        // markers: true
      },
      x: -(document.querySelector('.fruitsSectionMarquee3').clientWidth - window.innerWidth)
    }
  )

  // Showcase Section
  gsap.fromTo(
    '.showcaseSectionBack',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".showcaseSectionBack",
        start: () => 0 + " bottom",
        end: () => document.querySelector('.fruitsSection').clientHeight * 2 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: 0.5,
        // pin: true,
        // markers: true
      },
      y: -200
    }
  )

  // Wireframes Section
  gsap.fromTo(
    '#wireframesBottle1',
    { rotateZ: -10 },
    {
      scrollTrigger: {
        trigger: ".goalSectionWireframesBack",
        start: () => 0 + " bottom",
        end: () => document.querySelector('.goalSectionWireframesBack').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: -30
    }
  )

  gsap.fromTo(
    '#wireframesBottle2',
    { rotateZ: 10 },
    {
      scrollTrigger: {
        trigger: ".goalSectionWireframesBack",
        start: () => 0 + " bottom",
        end: () => document.querySelector('.goalSectionWireframesBack').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      rotateZ: 30
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

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  gsap.to('.heroSectionFront', {duration: 0, opacity: 0})
  gsap.to('.heroSectionBack', {duration: 0, opacity: 0})

  gsap.to('#heroSectionText1', {duration: 0, x: '0.5rem', y: '0.5rem', boxShadow: '0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000'})
  gsap.to('#heroSectionText2', {duration: 0, x: '0.5rem', y: '0.5rem', boxShadow: '0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000, 0rem 0rem 0 0 #00000000'})

  gsap.to('#heroSectionBottle1', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle2', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle3', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle4', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle5', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle6', {duration: 0, opacity: 0, scale: 0.8})
  gsap.to('#heroSectionBottle7', {duration: 0, opacity: 0, scale: 0.8})

  const startAnimation = () => {
    gsap.to('.heroSectionFront', {duration: 2, opacity: 1})
    gsap.to('.heroSectionBack', {duration: 2, opacity: 1})

    gsap.to('#heroSectionText1', {duration: 0.6, delay: 1, x: '0rem', y: '0rem', boxShadow: '0.1rem 0.1rem 0 0 #000000ff, 0.2rem 0.2rem 0 0 #000000ff, 0.3rem 0.3rem 0 0 #000000ff, 0.4rem 0.4rem 0 0 #000000ff, 0.5rem 0.5rem 0 0 #000000ff', ease: 'back'})
    gsap.to('#heroSectionText2', {duration: 0.6, delay: 1.1, x: '0rem', y: '0rem', boxShadow: '0.1rem 0.1rem 0 0 #000000ff, 0.2rem 0.2rem 0 0 #000000ff, 0.3rem 0.3rem 0 0 #000000ff, 0.4rem 0.4rem 0 0 #000000ff, 0.5rem 0.5rem 0 0 #000000ff', ease: 'back'})

    gsap.to('#heroSectionBottle1', {duration: 1, delay: 1 + 0.45, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle2', {duration: 1, delay: 1 + 0.3, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle3', {duration: 1, delay: 1 + 0.15, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle4', {duration: 1, delay: 1, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle5', {duration: 1, delay: 1 + 0.15, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle6', {duration: 1, delay: 1 + 0.3, opacity: 1, scale: 1, ease: 'back'})
    gsap.to('#heroSectionBottle7', {duration: 1, delay: 1 + 0.45, opacity: 1, scale: 1, ease: 'back'})

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