import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Initial Settings
 */
// GSAP Settings
gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(false)
ScrollTrigger.config({ ignoreMobileResize: true })
ScrollTrigger.normalizeScroll(false)

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
  const webgl = document.querySelector(".webgl")

  // Scene
  const scene = new THREE.Scene()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  scene.add(ambientLight)
  // scene.add(directionalLight)
  directionalLight.position.set(0, 10, 10)

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: document.querySelector('.webgl').clientHeight,
    prevWidth: window.innerWidth,
    prevHeight: window.innerHeight
  }

  // iOS Check
  const iOS = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  // DOM Initializations
  const domResize = () => {
    
  }

  domResize()
  
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    500
  )
  camera.position.set(0, 0, 7.5)
  if (sizes.width <= 550) {
    camera.position.set(0, 0, 15)
  }

  const cameraGroup = new THREE.Group()
  cameraGroup.add(camera)
  scene.add(cameraGroup)
  camera.add(directionalLight)

  // Visible Sizes
  const visibleSizes = {
    width: 0,
    height: 0,
    coverWidth: 0,
    coverHeight: 0,
    backgroundWidth: 0,
    backgroundHeight: 0
  }

  const depth = camera.position.z
  const vFOV = (camera.fov * Math.PI) / 180
  visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

  visibleSizes.coverHeight = 2 * Math.tan(vFOV / 2) * Math.abs(1)
  visibleSizes.coverWidth = (visibleSizes.coverHeight * sizes.width) / sizes.height

  visibleSizes.backgroundHeight = 2 * Math.tan(vFOV / 2) * Math.abs(depth*2)
  visibleSizes.backgroundWidth = (visibleSizes.backgroundHeight * sizes.width) / sizes.height

  // Resize
  window.addEventListener("resize", () => {
    if (sizes.prevWidth != window.innerWidth) {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      sizes.prevWidth = sizes.width
      sizes.prevHeight = sizes.height

      visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
      visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // DOM Resize
      domResize()
    }
  })

  // Loading Manager
  const loadingManager = new THREE.LoadingManager()
  let loadProgress = 0
  let isDoneLoading = false
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    loadProgress = itemsLoaded / itemsTotal
    // console.log(url, itemsLoaded, itemsTotal)
  }
  loadingManager.onLoad = () => {
    window.history.scrollRestoration = "manual"
    isDoneLoading = true

    gsap.to('.loadingSection', {duration: 0.5, opacity: 0})

    preStartAnimations()
    setTimeout(() => {
      startAnimations()
    }, 1500)
  }
    
  // Textures
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)
  
  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  // Colors
  const colors = {
    cream: new THREE.Color(0xF4F2ED),
    white: new THREE.Color(0xffffff),
    green: new THREE.Color(0x135E5E),
  }

  let leafWidth = 1.2

  // Wave Pattern
  const waveGeometry = new THREE.PlaneGeometry(1,1)
  const waveMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;  

      void main() {
        vec3 localSpacePosition = position;

        vec4 worldPos = modelMatrix * vec4(localSpacePosition, 1.0);
        vec4 mvPosition = viewMatrix * worldPos;

        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      
      varying vec2 vUv;

      float PI = 3.1415926;

      void main() {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= PI * 2.;
        float frequency = PI * 48.;
        float wave = sin(angle * frequency);

        float ringCount = 100.;

        vec4 finalColor = vec4(0.);

        for (float i = 0.; i < ringCount; i++) {
          float amplitude = i * 0.00015;
          float startRadius = 0. + i * 0.005;
          float radius = startRadius + wave * amplitude;

          float thickness = 0.001;
          float strength = 1. - step(thickness, abs(distance(vUv, vec2(0.5)) - radius));

          finalColor.r += strength;
          finalColor.g += strength;
          finalColor.b += strength;
          finalColor.a += strength;
        }

        gl_FragColor = vec4(finalColor.rgb * uColor, finalColor.a);
      }
    `,
    blending: THREE.MultiplyBlending,
    transparent: true
  })
  const wavePlane = new THREE.Mesh(waveGeometry, waveMaterial)

  const allObjects = new THREE.Group()
  scene.add(allObjects)

  const wavePlaneSpin = new THREE.Group()
  allObjects.add(wavePlaneSpin)

  wavePlaneSpin.add(wavePlane)

  wavePlane.scale.set(12, 12, 1)
  wavePlane.position.z = leafWidth / 2

  wavePlane.rotation.z = Math.PI * 2 / 19

  // Leaf
  const leafGeometry = new THREE.PlaneGeometry(1,1)

  const leafTexture = textureLoader.load(`${themeUri}/page-templates/greenacres/images/LogoLeaf.png`)
  const leafMaterial = new THREE.MeshBasicMaterial({
    alphaMap: leafTexture,
    color: colors.green,
    transparent: true,
    side: THREE.DoubleSide
  })

  const leafCount = 8
  const leafArray = []

  const leafGroupSpin = new THREE.Group()
  allObjects.add(leafGroupSpin)

  const leafGroup = new THREE.Group()
  leafGroupSpin.add(leafGroup)

  const leafRotateArray = []

  for (let i = 0; i < leafCount; i++) {
    leafArray[i] = new THREE.Mesh(leafGeometry, leafMaterial)

    leafRotateArray[i] = new THREE.Group()
    leafGroup.add(leafRotateArray[i])

    leafRotateArray[i].add(leafArray[i])
    leafArray[i].scale.set(leafWidth, leafWidth * 534/244, 1)

    if (i == 3) {
      leafArray[i].position.y = -leafWidth * 2 * 1.71
    }
    else {
      leafArray[i].position.y = -leafWidth * 2
    }

    leafRotateArray[i].rotation.z = Math.PI * 2 / leafCount * i
  }

  leafGroup.scale.set(0.9, 0.9, 0.9)

  /**
   * Renderer Setup
   */
  // ----------------------------------------------------------------
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: webgl,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  THREE.ColorManagement.legacyMode = false
  renderer.outputEncoding = THREE.sRGBEncoding
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  
/**
 * Events
 */
// ----------------------------------------------------------------
  // Mouse Setup
  let touch = false

  const mouse = {
    x: 0,
    y: 0,
  }

  const pointer = {
    x: 0,
    y: 0,
  }

  // Mouse Event Listeners Function
  window.addEventListener('touchstart', (e) => {
    if (touch == false) {
      touch = true

      if (iOS() == true) {
        ScrollTrigger.normalizeScroll(false)
      }
    }
  })

  // Pointer Events
  const mobileSensitivity = 0.5
  document.addEventListener("pointermove", (e) => {
    if (touch == false && isDoneLoading == true) {
      mouse.x = e.clientX / sizes.width - 0.5
      mouse.y = -(e.clientY / sizes.height - 0.5)

      gsap.to(leafGroupSpin.rotation, {duration: 1, z: mouse.x * -0.5})

      gsap.to('.featureSectionMediaVideoMainA', {duration: 1, x: mouse.x * -50 * window.innerWidth/1690, y: mouse.y * 50 * window.innerWidth/1690})
      gsap.to('.featureSectionMediaImageA1', {duration: 1, x: mouse.x * -150 * window.innerWidth/1690})
      gsap.to('.featureSectionMediaVideoA2', {duration: 1, x: mouse.x * -200 * window.innerWidth/1690})

      gsap.to('.featureSectionDesktop', {duration: 1, x: mouse.x * -30 * window.innerWidth/1690, y: mouse.y * 30 * window.innerWidth/1690})
      gsap.to('.featureSectionMediaVideoB1', {duration: 1, x: (mouse.x * -100 + 35) * window.innerWidth/1690})


    }
  })

  window.addEventListener('touchmove', (e) => {
    if (touch == true) {
      mouse.x = e.touches[0].clientX / sizes.width - 0.5
      mouse.y = -(e.touches[0].clientY / sizes.height - 0.5)

      gsap.to(leafGroupSpin.rotation, {duration: 1, z: mouse.x * -0.5})

      // ScrollTrigger.normalizeScroll(false)
    }
  })

  window.addEventListener('touchend', (e) => {
    if (touch == false) {
      touch = true

      // ScrollTrigger.normalizeScroll(true)
    }
  })

  // CTA Button Listeners
  gsap.to('.ctaButtonBackground', {duration: 0.5, y: '-100%'})

  document.querySelector('.ctaButton').addEventListener('pointerenter', () => {
    gsap.to('.ctaButtonBackground', {duration: 0, delay: 0, y: '-100%'})
    gsap.to('.ctaButtonBackground', {duration: 0.2, y: '0%'})
    gsap.to('.ctaButton', {duration: 0.2, border: '1px solid #685BC7'})
  })

  document.querySelector('.ctaButton').addEventListener('pointerleave', () => {
    gsap.to('.ctaButtonBackground', {duration: 0.2, y: '100%'})
    gsap.to('.ctaButton', {duration: 0.2, border: '1px solid #ffffff'})
  })

  /**
   * Animate
   */
  // ----------------------------------------------------------------
  let scrollValue = 0
  let prevScrollValue = 0
  let elapsedTime
  const clock = new THREE.Clock()

  const tick = () => {
    elapsedTime = clock.getElapsedTime()

    // Wave
    waveMaterial.uniforms.uTime.value = elapsedTime
   
    // // Leaf Group
    // leafGroup.rotation.z = elapsedTime * -0.2
    wavePlaneSpin.rotation.z = elapsedTime * -0.1

    // for (let i = 0; i < leafCount; i++) {
    //   leafArray[i].rotation.y = elapsedTime
    // }

    renderer.setRenderTarget(null)
    renderer.render(scene, camera)

    // Scroll
    scrollValue = document.querySelector('.scrollStartSection').getBoundingClientRect().top
    // cameraGroup.position.y = scrollValue * visibleSizes.height/sizes.height
    // pointsGroup.position.y = -scrollValue * 0.1 * visibleSizes.height/sizes.height

    window.requestAnimationFrame(tick)
  }

  /**
   * Start Animation
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
    const divCs = document.createElement("div")
    divCs.classList.add("textAnimationClassContainer")
    e.appendChild(divCs)

    // Split string to words
    const wordsArray = string.split(" ")
    // console.log(wordsArray)

    textAnimationDivs[textAnimationIndex] = []
    let spanCount = 0

    // For every word, apply this logic
    for (let w = 0; w < wordsArray.length; w++) {
      if (w < wordsArray.length - 1) {
        wordsArray[w] = wordsArray[w].concat(' ')
      }
      // console.log(wordsArray[w])

      const letters = wordsArray[w]

      divs[w] = document.createElement("div")
      divs[w].classList.add("textAnimationClass")

      divCs.appendChild(divs[w])

      // For every letter in a word, apply this logic
      for (let i = 0; i < letters.length; i++) {
     

        spans[i] = document.createElement("span")
        spans[i].classList.add("textAnimationClassContent")
        // console.log(letters[i])

        if (letters[i] == ' ') {
          spans[i].innerHTML = '&nbsp;'
        }
        else {
          spans[i].innerHTML = letters[i]
  
          if (dir == "hero") {
            // gsap.to(divs[i], {duration: 0, overflow: 'hidden'})
  
            if (string[i] == 'T') {
              gsap.to(divs[i], {duration: 0, marginInline: '-1%'})
            }
          }
          if (dir == "down") {
            gsap.to(divs[w], {duration: 0, overflow: 'hidden'})
          }
        }

        divs[w].appendChild(spans[i])

        if (dir == "hero") {
          gsap.to(spans[i], { duration: 0, opacity: 0, y: 20, x: 0 })
        }
        else  if (dir == "heroReverse") {
          gsap.to(spans[i], { duration: 0, opacity: 0, y: 0, x: 20 })
        }
        else if (dir == "down") {
          gsap.to(spans[i], { duration: 0, opacity: 1, y: -20, x: 0 })
        }
        else if (dir == "mini") {
          gsap.to(spans[i], { duration: 0, opacity: 0, y: -20, x: 0 })
        }
        else if (dir == "pump") {
          gsap.to(spans[i], { duration: 0, opacity: 0, y: 0, x: 0, scaleY: 1.5 })
        }
        else if (dir == "fade") {
          gsap.to(spans[i], { duration: 0, opacity: 0.25, y: 0, x: 0 })
        }

        // console.log(spans[i])
        textAnimationDivs[textAnimationIndex][spanCount] = spans[i]
        spanCount++
      }
    }

    textAnimationIndex++
  }

  // Initial Text Setups for Affected Texts
  let scrubValue = true

  textSetup(document.querySelector("#textAnim1"), "down")
  textSetup(document.querySelector("#textAnim2"), "down")
  textSetup(document.querySelector("#textAnim3"), "down")
  textSetup(document.querySelector("#textAnim4"), "down")
  textSetup(document.querySelector("#textAnim5"), "hero")
  textSetup(document.querySelector("#textAnim6"), "hero")


  textSetup(document.querySelector("#textAnim7"), "fade")
  for (let i = 0; i < textAnimationDivs[6].length; i++) {
    gsap.fromTo(    
      textAnimationDivs[6][i],
      { opacity: 0.25 },
      {
        scrollTrigger: {
          trigger: "#textAnim7",
          start: () => document.querySelector('#textAnim7').clientHeight * (i + 1) / textAnimationDivs[6].length + sizes.height * 0.25 + " bottom",
          end: () => document.querySelector('#textAnim7').clientHeight * (i + 1) / textAnimationDivs[6].length + sizes.height * 0.35 + " bottom",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        opacity: 1,
        ease: 'none'
      }
    )
  }

  textSetup(document.querySelector("#textAnim8"), "fade")
  for (let i = 0; i < textAnimationDivs[7].length; i++) {
    gsap.fromTo(    
      textAnimationDivs[7][i],
      { opacity: 0.25 },
      {
        scrollTrigger: {
          trigger: "#textAnim8",
          start: () => document.querySelector('#textAnim8').clientHeight * (i + 1) / textAnimationDivs[7].length + sizes.height * 0.25 + " bottom",
          end: () => document.querySelector('#textAnim8').clientHeight * (i + 1) / textAnimationDivs[7].length + sizes.height * 0.35 + " bottom",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        opacity: 1,
        ease: 'none'
      }
    )
  }

  textSetup(document.querySelector("#textAnim9"), "hero")

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  // Animate Text Function
  const animateText = (e, td, dir, del) => {
    const spans = textAnimationDivs[e]
    for (let i = 0; i < spans.length; i++) {
      if (dir == "hero") {
        gsap.to(spans[i], {
          duration: 0.5,
          delay: i * td + del,
          y: 0,
          x: 0,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
      else if (dir == "heroReverse") {
        gsap.to(spans[i], {
          duration: 0.5,
          delay: i * td + del,
          y: 0,
          x: 0,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
      else if (dir == "down") {
        gsap.to(spans[i], {
          duration: 0.7,
          delay: i * td + del,
          y: 0,
          x: 0,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
      else if (dir == "mini") {
        gsap.to(spans[i], {
          duration: 0.5,
          delay: i * td + del,
          y: 0,
          x: 0,
          opacity: 1,
          ease: 'Power1.easeOut'
        })
      }
      else if (dir == "pump") {
        gsap.to(spans[i], {
          duration: 0.45,
          delay: i * td + del,
          y: 0,
          x: 0,
          opacity: 1,
          scaleY: 1,
          ease: 'Power1.easeOut'
        })
      }
    }
  }

  // Hero Text Animations
  gsap.to('.heroSectionLogo', {duration: 0, rotateZ: -90, opacity: 0})
  gsap.to('.heroSectionLogoName', {duration: 0, opacity: 0})
  gsap.to('.heroSectionLogoSub', {duration: 0, opacity: 0})

  gsap.to('.heroSectionStatBar', {duration: 0, opacity: 0, y: 0})
  gsap.to('.heroSectionStatRank', {duration: 0, opacity: 0, y: 20})
  gsap.to('.heroSectionStatLabel', {duration: 0, opacity: 0, y: 20})

  gsap.to('#swipeSectionImageContainerA1', {duration: 0, opacity: 0, y: '20%'})
  gsap.to('#swipeSectionImageContainerA2', {duration: 0, opacity: 0, y: '20%'})
  gsap.to('#swipeSectionImageContainerA3', {duration: 0, opacity: 0, y: '20%'})
  gsap.to('#swipeSectionImageContainerA4', {duration: 0, opacity: 0, y: '20%'})

  const startAnimations = () => {
    gsap.to('.heroSectionLogo', {duration: 1, delay: 1, rotateZ: 0, opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionLogoName', {duration: 1, delay: 1.25, opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionLogoSub', {duration: 1, delay: 1.5, opacity: 1, ease: 'Power1.easeOut'})

    gsap.to('.heroSectionStatBar', {duration: 1, delay: 1, rotateZ: 0, opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionStatRank', {duration: 1, delay: 1, opacity: 1, y: 0, ease: 'Power1.easeOut'})
    gsap.to('.heroSectionStatLabel', {duration: 1, delay: 1.5, opacity: 1, y: 0, ease: 'Power1.easeOut'})

    animateText(0, 0.05, "down", 2)
    animateText(1, 0.05, "down", 2)
    animateText(2, 0.05, "down", 2)
    animateText(3, 0.05, "down", 2)
    animateText(4, 0.05, "hero", 1)
    animateText(5, 0.01, "hero", 1)

    gsap.to('#swipeSectionImageContainerA1', {duration: 1, delay: 2.5, y: '0%', opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('#swipeSectionImageContainerA2', {duration: 1, delay: 2.75, y: '0%', opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('#swipeSectionImageContainerA3', {duration: 1, delay: 3, y: '0%', opacity: 1, ease: 'Power1.easeOut'})
    gsap.to('#swipeSectionImageContainerA4', {duration: 1, delay: 3.25, y: '0%', opacity: 1, ease: 'Power1.easeOut'})
    
  }

  const leafGap = 0.1

  const preStartAnimations = () => {
    gsap.fromTo('.heroSection', {backgroundColor: '#005151'}, {duration: 1, delay: 2, backgroundColor: '#f4f2ed'})
    gsap.fromTo(leafMaterial.color, {r: colors.green.r, g: colors.green.g, b: colors.green.b}, {duration: 1, delay: 2, r: colors.white.r, g: colors.white.g, b: colors.white.b})


   
    gsap.fromTo(leafArray[3].position, {y: -leafWidth * 2 * 2 * 1.71}, {duration: 2 + 7 * 0, delay: 0 + 7 * leafGap, y: -leafWidth * 2 * 1.71, ease: 'back.out'})
    gsap.fromTo(leafArray[4].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 6 * 0, delay: 0 + 6 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[5].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 5 * 0, delay: 0 + 5 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[6].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 4 * 0, delay: 0 + 4 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[7].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 3 * 0, delay: 0 + 3 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[0].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 2 * 0, delay: 0 + 2 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[1].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 1 * 0, delay: 0 + 1 * leafGap, y: -leafWidth * 2, ease: 'back.out'})
    gsap.fromTo(leafArray[2].position, {y: -leafWidth * 2 * 2},        {duration: 2 + 0 * 0, delay: 0 + 0 * leafGap, y: -leafWidth * 2, ease: 'back.out'})

    gsap.fromTo(leafGroup.rotation, {z: -Math.PI / 180 * 180}, {duration: 2, delay: 0, z: -Math.PI / 180 * 360, ease: 'Power1.easeOut'})
    gsap.fromTo(wavePlane.rotation, {z: -Math.PI / 180 * 180}, {duration: 2, delay: 0, z: -Math.PI / 180 * 360, ease: 'Power1.easeOut'})

    gsap.fromTo(allObjects.position, {x: visibleSizes.width * 0, y: visibleSizes.height * 0}, {duration: 2, delay: 0, x: visibleSizes.width * 0.25,  y: visibleSizes.height * 0, ease: 'Power1.easeOut'})

  }
 
   /**
   * ScrollTriggers
   */
  // ----------------------------------------------------------------
  
  // gsap.fromTo(
  //   mobileScreen1Blank.material,
  //   { opacity: 1 },
  //   {
  //     scrollTrigger: {
  //       trigger: "#phoneSection",
  //       start: () => document.querySelector('#phoneSection').clientHeight * 0.5 + " bottom",
  //       end: () => document.querySelector('#phoneSection').clientHeight * 0.9 + " bottom",
  //       // toggleActions: "play none none none",
  //       // snap: 1,
  //       scrub: scrubValue,
  //       // pin: true,
  //       // markers: true,
  //     },
  //     opacity: 0,
  //     ease: 'none'
  //   }
  // )

  // Parks Section
  gsap.fromTo(
    '#parksSectionEntry1',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry1",
        start: () => document.querySelector('#parksSectionEntry1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry1').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry1Video',
    { y: -(document.querySelector('#parksSectionEntry1Video').clientHeight - document.querySelector('#parksSectionEntry1').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry1",
        start: () => document.querySelector('#parksSectionEntry1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry1').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry1Counter',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry1",
        start: () => document.querySelector('#parksSectionEntry1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry1').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry2',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry2",
        start: () => document.querySelector('#parksSectionEntry2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry2').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry2Video',
    { y: -(document.querySelector('#parksSectionEntry2Video').clientHeight - document.querySelector('#parksSectionEntry2').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry2",
        start: () => document.querySelector('#parksSectionEntry2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry2').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry2Counter',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry2",
        start: () => document.querySelector('#parksSectionEntry2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry2').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry3',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry3",
        start: () => document.querySelector('#parksSectionEntry3').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry3').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry3Video',
    { y: -(document.querySelector('#parksSectionEntry3Video').clientHeight - document.querySelector('#parksSectionEntry3').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry3",
        start: () => document.querySelector('#parksSectionEntry3').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry3').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry3Counter',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry3",
        start: () => document.querySelector('#parksSectionEntry3').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry3').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry4',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry4",
        start: () => document.querySelector('#parksSectionEntry4').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry4').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry4Video',
    { y: -(document.querySelector('#parksSectionEntry4Video').clientHeight - document.querySelector('#parksSectionEntry4').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry4",
        start: () => document.querySelector('#parksSectionEntry4').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry4').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry4Counter',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry4",
        start: () => document.querySelector('#parksSectionEntry4').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry4').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry5',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry5",
        start: () => document.querySelector('#parksSectionEntry5').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry5').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry5Video',
    { y: -(document.querySelector('#parksSectionEntry5Video').clientHeight - document.querySelector('#parksSectionEntry5').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry5",
        start: () => document.querySelector('#parksSectionEntry5').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry5').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry5Counter',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry5",
        start: () => document.querySelector('#parksSectionEntry5').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry5').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry6',
    { x: '100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry6",
        start: () => document.querySelector('#parksSectionEntry6').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry6').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '#parksSectionEntry6Video',
    { y: -(document.querySelector('#parksSectionEntry6Video').clientHeight - document.querySelector('#parksSectionEntry6').clientHeight) },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry6",
        start: () => document.querySelector('#parksSectionEntry6').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry6').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: 0,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.parksSectionEntry6Counter',
    { x: '-100%' },
    {
      scrollTrigger: {
        trigger: "#parksSectionEntry6",
        start: () => document.querySelector('#parksSectionEntry6').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#parksSectionEntry6').clientHeight * 1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: '0%',
      ease: 'Power1.easeOut'
    }
  )

  // Swipe Section 1
  gsap.fromTo(
    '#swipeSectionMarquee1',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: "#swipeSection1",
        start: () => document.querySelector('#swipeSection1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#swipeSection1').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: -(document.querySelector('#swipeSectionMarquee1').clientWidth - window.innerWidth) * 2,
      ease: 'none'
    }
  )

  // Swipe Section 2
  gsap.fromTo(
    '#swipeSectionMarquee2',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: "#swipeSection2",
        start: () => document.querySelector('#swipeSection2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#swipeSection2').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: -(document.querySelector('#swipeSectionMarquee2').clientWidth - window.innerWidth) * 2,
      ease: 'none'
    }
  )

  // Deliverables Section
  gsap.fromTo(
    '.deliverableSectionMarquee',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".deliverableSection",
        start: () => document.querySelector('.deliverableSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.deliverableSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: -(document.querySelector('.deliverableSectionMarquee').clientWidth - window.innerWidth),
      ease: 'none'
    }
  )

  // Visit Section
  let isVisitSectionShown = false
  gsap.fromTo(
    '.visitSectionContainer',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".visitSectionContainer",
        start: () => document.querySelector('.visitSectionContainer').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.visitSectionContainer').clientHeight * 1 + " bottom",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
        onEnter: () => {
          if (isVisitSectionShown == false) {
            isVisitSectionShown = true
            console.log("loaded visit");
            animateText(8, 0.05, "hero", 0)
          }
        }
      },
      x: 0,
      ease: 'none'
    }
  )

  // Leaf Color Changes
  gsap.fromTo(
    leafMaterial.color,
    {
      r: colors.cream.r,
      g: colors.cream.g,
      b: colors.cream.b,
    },
    {
      scrollTrigger: {
        trigger: ".parksSection",
        start: () => document.querySelector('.parksSection').clientHeight * 0.1 + " top",
        end: () => document.querySelector('.parksSection').clientHeight * 0.2 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      r: colors.green.r,
      g: colors.green.g,
      b: colors.green.b,
      ease: 'none'
    }
  )

  gsap.fromTo(
    leafMaterial.color,
    {
      r: colors.white.r,
      g: colors.white.g,
      b: colors.white.b,
    },
    {
      scrollTrigger: {
        trigger: ".videoSection",
        start: () => document.querySelector('.videoSection').clientHeight * 0 + " center",
        end: () => document.querySelector('.videoSection').clientHeight * 0.1 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      r: colors.cream.r,
      g: colors.cream.g,
      b: colors.cream.b,
      ease: 'none'
    }
  )
    
  // Mobile Move
  let mobile1ScrollTrigger = null
  const makeMobileScrollTrigger = () => {

  }

  tick()

  makeMobileScrollTrigger()
}

window.addEventListener('load', () => {
  main()
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
})