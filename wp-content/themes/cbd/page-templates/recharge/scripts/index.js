import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import bubbleFragmentShader from './shaders/bubbleFragmentShader.js'
import bubbleVertexShader from './shaders/bubbleVertexShader.js'

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

      logoMaterial.uniforms.winResolution.value =
      new THREE.Vector2(sizes.width, sizes.height).multiplyScalar(
        Math.min(window.devicePixelRatio, 2)
      )

      backRenderTarget.setSize(sizes.width, sizes.height)
      frontRenderTarget.setSize(sizes.width, sizes.height)
    }

    else {
      if (sizes.prevHeight < window.innerHeight) {
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

        logoMaterial.uniforms.winResolution.value =
        new THREE.Vector2(sizes.width, sizes.height).multiplyScalar(
          Math.min(window.devicePixelRatio, 2)
        )

        backRenderTarget.setSize(sizes.width, sizes.height)
        frontRenderTarget.setSize(sizes.width, sizes.height)
      }
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
    startAnimations()

    camera.position.y = visibleSizes.height * -2
    renderer.render(scene, camera)
    camera.position.y = visibleSizes.height * 0

    changeColor(currentLogoIndex)
  }
    
  // Textures
  const textureLoader = new THREE.TextureLoader(loadingManager)
//  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)

//   const environmentMapBG = cubeTextureLoader.load([
//     ${themeUri}/page-templates/recharge/images/envMap2/px.png,
//     ${themeUri}/page-templates/recharge/images/envMap2/nx.png,
//     ${themeUri}/page-templates/recharge/images/envMap2/py.png,
//     ${themeUri}/page-templates/recharge/images/envMap2/ny.png,
//     ${themeUri}/page-templates/recharge/images/envMap2/pz.png,
//     ${themeUri}/page-templates/recharge/images/envMap2/nz.png,
//   ])
  
  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  // Logo Parameters
  const colorArray = [
    {logo: new THREE.Color(0x05E27E), point: new THREE.Color(0x05d26E), hex: '#05E27E'},
    {logo: new THREE.Color(0xFFBA00), point: new THREE.Color(0xeFaA00), hex: '#FFBA00'},
    {logo: new THREE.Color(0x0066FF), point: new THREE.Color(0x0056eF), hex: '#0066FF'},
    {logo: new THREE.Color(0x34CAA3), point: new THREE.Color(0x24bA93), hex: '#34CAA3'},
    {logo: new THREE.Color(0x0066FF), point: new THREE.Color(0x0056eF), hex: '#0066FF'},
    {logo: new THREE.Color(0x438EDF), point: new THREE.Color(0x337EcF), hex: '#438EDF'},
    {logo: new THREE.Color(0x03F6B6), point: new THREE.Color(0x03e676), hex: '#03F6B6'},
  ]
  let currentLogoIndex = 0

  // BG
  // const bgGeometry = new THREE.PlaneGeometry(1,1)
  const bgGeometry = new THREE.CylinderGeometry(1, 1, 32)
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: colorArray[currentLogoIndex],
    side: THREE.DoubleSide
  })
  const bg = new THREE.Mesh(bgGeometry, bgMaterial)
  camera.add(bg)
  bg.position.z = -camera.position.z
  bg.scale.set(40, 40, 40)

  // Points
  const pointsCount = 12
  const pointsArray = []
  const pointsGroup = new THREE.Group()
  scene.add(pointsGroup)
  // pointsGroup.position.z = -camera.position.z

  let touch = false
  const movePoint = (point) => {
    const time = Math.random() * 5 + 5
    const fadeTime = 1

    gsap.fromTo(point.position,
      {x: (Math.random() - 0.5) * visibleSizes.width * 2, y: (Math.random() - 0.5) * visibleSizes.height * 2, z: Math.random() * -5 -5}, 
      // {x: 0, y: 0, z: Math.random() * -5 -5}, 
      {duration: time, x: (Math.random() - 0.5) * visibleSizes.width * 2, y: (Math.random() - 0.5) * visibleSizes.height * 2, z: Math.random() * -5 -5, ease: 'none'},
    )

    gsap.fromTo(point.material,
      {opacity: 1},
      {duration: fadeTime, delay: time - fadeTime, opacity: 0, ease: 'Power1.easeOut'}
    )
    gsap.fromTo(point.material,
      {opacity: 0},
      {duration: fadeTime, opacity: 1, ease: 'Power1.easeIn'}
    )
    const size = Math.random() * 0.5 + 0.25
    gsap.fromTo(point.material,
      {size: size},
      {duration: time, size: size * 1.5, ease: 'Power1.easeIn'}
    )

    // if (touch == false) {
      setTimeout(() => {
        movePoint(point)
      }, time * 1000)
    // }
  }

  const pointAlpha = textureLoader.load(`${themeUri}/page-templates/recharge/images/PointAlpha.png`)
  
  const makePoints = () => {
    for (let i = 0; i < pointsCount; i++) {
      const pointGeometry = new THREE.BufferGeometry()
      const count = 1
      
      const positions = new Float32Array(count * 3)
    
      for (let i = 0; i < count * 3; i++) {
        positions[i] = 0
      }
    
      pointGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )
  
      const pointMaterial = new THREE.PointsMaterial({
        color: colorArray[currentLogoIndex].point,
        alphaMap: pointAlpha,
        transparent: true,
      })
  
      const point = new THREE.Points(pointGeometry, pointMaterial)
  
      pointsArray[i] = point
  
      pointsGroup.add(pointsArray[i])
      
      movePoint(pointsArray[i])
    }
  }

  makePoints()

  // Logo
  let logoScale = 0.05

  const logoGroup = new THREE.Group()
  scene.add(logoGroup)

  const logo1Move = new THREE.Group()
  logoGroup.add(logo1Move)
  const logo1 = new THREE.Group()
  logo1Move.add(logo1)
  const logo2Move = new THREE.Group()
  logoGroup.add(logo2Move)
  const logo2 = new THREE.Group()
  logo2Move.add(logo2)
  const logo3Move = new THREE.Group()
  logoGroup.add(logo3Move)
  const logo3 = new THREE.Group()
  logo3Move.add(logo3)

  
  let backRenderTarget = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,

    }
  )

  let frontRenderTarget = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    }
  )

  let logoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xfafafa) },
      uBlurPower: { value: 0.007},
      uRipple: { value: 0 },
      uTime: { value: 0 },
      uTexture: { value: null },
      uIorR: { value: 1.15 },
      uIorY: { value: 1.15 },
      uIorG: { value: 1.15 },
      uIorC: { value: 1.15 },
      uIorB: { value: 1.15 },
      uIorP: { value: 1.15 },
      uRefractPower: { value: 0.1 },
      uChromaticAberration: { value: 0.5 },
      uSaturation: { value: 1 },
      uShininess: { value: 12 },
      uDiffuseness: { value: 0.2 },
      uLightPower: { value: 1 },
      uFresnelPower: { value: 20 },
      uLight1: { value: new THREE.Vector3(0, 20, 15) },
      // uLight2: { value: new THREE.Vector3(15, 15, 15) },
      winResolution: {
        value: new THREE.Vector2(sizes.width, sizes.height).multiplyScalar(
          Math.min(window.devicePixelRatio, 2)
        ), // if DPR is 3 the shader glitches
      },
    },
    vertexShader: bubbleVertexShader,
    fragmentShader: bubbleFragmentShader,
  })

  gltfLoader.load(`${themeUri}/page-templates/recharge/3d/Logo1.glb`, (obj) => {
    obj.scene.children[0].material = logoMaterial

    obj.scene.scale.set(logoScale, logoScale, logoScale)

    logo1.add(obj.scene)
  })

  logo1.position.x = (48.75 - 25 * 2 - 5 - 12.5 * 2 - 5 - 6.25) * 0.05

  gltfLoader.load(`${themeUri}/page-templates/recharge/3d/Logo2.glb`, (obj) => {
    obj.scene.children[0].material = logoMaterial

    obj.scene.scale.set(logoScale, logoScale, logoScale)

    logo2.add(obj.scene)
  })

  logo2.position.x = (48.75 - 25 * 2 - 5 - 12.5) * 0.05

  gltfLoader.load(`${themeUri}/page-templates/recharge/3d/Logo3.glb`, (obj) => {
    obj.scene.children[0].material = logoMaterial

    obj.scene.scale.set(logoScale, logoScale, logoScale)

    logo3.add(obj.scene)
  })

  logo3.position.x = (48.75 - 25) * 0.05

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

      gsap.to(logoGroup.rotation, {duration: 1, y: mouse.x * mobileSensitivity * 0.75, x: -mouse.y * mobileSensitivity * 0.75 * sizes.height/sizes.width})
      gsap.to(pointsGroup.rotation, {duration: 1, y: mouse.x * mobileSensitivity * 0.5, x: -mouse.y * mobileSensitivity * 0.5 * sizes.height/sizes.width})
    }
  })

  window.addEventListener('touchmove', (e) => {
    if (touch == true) {
      mouse.x = e.touches[0].clientX / sizes.width - 0.5
      mouse.y = -(e.touches[0].clientY / sizes.height - 0.5)

      gsap.to(logoGroup.rotation, {duration: 1, y: mouse.x * mobileSensitivity * 0.75, x: -mouse.y * mobileSensitivity * 0.75 * sizes.height/sizes.width})
      gsap.to(pointsGroup.rotation, {duration: 1, y: mouse.x * mobileSensitivity * 0.5, x: -mouse.y * mobileSensitivity * 0.5 * sizes.height/sizes.width})

      // ScrollTrigger.normalizeScroll(false)
    }
  })

  window.addEventListener('touchend', (e) => {
    if (touch == false) {
      touch = true

      // ScrollTrigger.normalizeScroll(true)
    }
  })

  // Color Changes
  const currentColorValue = {logo: colorArray[currentLogoIndex].logo, point: colorArray[currentLogoIndex].point}
  let isDoneWithFirstChange = false

  const changeColor = (index) => {
    let nextIndex
    if (isDoneWithFirstChange == true) {
      nextIndex = index + 1
      if (index == colorArray.length - 1) {
        nextIndex = 0
      }

      // Colors
      const currentColors = {logo: colorArray[index].logo, point: colorArray[index].point}
      const nextColors = {logo: colorArray[nextIndex].logo, point: colorArray[nextIndex].point}

      gsap.to(currentColorValue, {duration: 0, delay: 0.6, logo: nextColors.logo, point: nextColors.point})
    }
    else {
      nextIndex = index
      isDoneWithFirstChange = true
    }

    // Logo
    gsap.fromTo(logo1.rotation, {y: 0}, {duration: 1.5, y: Math.PI * 2, ease: 'back.inOut'})
    gsap.fromTo(logo2.rotation, {y: 0}, {duration: 1.5, delay: 0.25, y: Math.PI * 2, ease: 'back.inOut'})
    gsap.fromTo(logo3.rotation, {y: 0}, {duration: 1.5, delay: 0.5, y: Math.PI * 2, ease: 'back.inOut'})

    setTimeout(() => {
      currentLogoIndex = nextIndex
      changeColor(currentLogoIndex)
    }, 5000 )
  }

  // CTA Listeners
  const ctaButtons = document.querySelectorAll('.ctaButton')
  const ctaButtonChangeDuration = 0.25
  for (let i = 0; i < ctaButtons.length; i++) {
    ctaButtons[i].addEventListener('pointerenter', () => {
      gsap.to(ctaButtons[i], {duration: ctaButtonChangeDuration, backgroundColor: '#000000', color: '#05E27E'})
    })

    ctaButtons[i].addEventListener('pointerleave', () => {
      gsap.to(ctaButtons[i], {duration: ctaButtonChangeDuration, backgroundColor: '#05E27E', color: '#000000'})
    })
  }

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
    
    // domResize()
    bg.visible = true

    bgMaterial.color.lerp(currentColorValue.logo, 0.01)
    for (let i = 0; i < pointsArray.length; i++) {
      pointsArray[i].material.color.lerp(currentColorValue.point, 0.01)
    }
    
    logo1.visible = false
    logo2.visible = false
    logo3.visible = false

    renderer.setRenderTarget(backRenderTarget)
    renderer.render(scene, camera)

    logoMaterial.side = THREE.BackSide
    logoMaterial.uniforms.uTexture.value = backRenderTarget.texture

    logo1.visible = true
    logo2.visible = true
    logo3.visible = true

    renderer.setRenderTarget(frontRenderTarget)
    renderer.render(scene, camera)
   
    logoMaterial.side = THREE.FrontSide
    logoMaterial.uniforms.uTexture.value = frontRenderTarget.texture

    renderer.setRenderTarget(null)

    bg.visible = false

    bgMaterial.color.lerp(new THREE.Color(0xffffff), 0.01)
    for (let i = 0; i < pointsArray.length; i++) {
      pointsArray[i].material.color.lerp(currentColorValue.logo, 0.01)
    }

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

    for (let i = 0; i < string.length; i++) {
      divs[i] = document.createElement("div")
      divs[i].classList.add("t" + textAnimationIndex)
      divCs.appendChild(divs[i])
      divs[i].classList.add("textAnimationClass")
      spans[i] = document.createElement("div")
      spans[i].classList.add("textAnimationClassContent")
      if (string[i] == ' ') {
        spans[i].innerHTML = '&nbsp;'
      }
      else {
        spans[i].innerHTML = string[i]

        if (dir == "hero") {
          // gsap.to(divs[i], {duration: 0, overflow: 'hidden'})

          if (string[i] == 'T') {
            gsap.to(divs[i], {duration: 0, marginInline: '-1%'})
          }
        }
        if (dir == "down") {
          gsap.to(divs[i], {duration: 0, overflow: 'hidden'})
        }
      }
      divs[i].appendChild(spans[i])
      if (dir == "hero") {
        gsap.to(spans[i], { duration: 0, opacity: 0, y: 0, x: -20 })
        gsap.to(divs[i], { duration: 0, x: '-0.7rem' })
      }
      else  if (dir == "heroReverse") {
        gsap.to(spans[i], { duration: 0, opacity: 0, y: 0, x: 20 })
        gsap.to(divs[i], { duration: 0, x: '-0.7rem' })
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
    }
    textAnimationDivs[textAnimationIndex] = spans
    textAnimationIndex++
  }

  // Initial Text Setups for Affected Texts
  textSetup(document.querySelector("#textAnim1"), "down")
  textSetup(document.querySelector("#textAnim2"), "down")
  textSetup(document.querySelector("#textAnim3"), "down")
  textSetup(document.querySelector("#textAnim4"), "down")

  if (sizes.width > 800) {
    textSetup(document.querySelector("#textAnim5"), "hero")
    textSetup(document.querySelector("#textAnim6"), "heroReverse")
  }
  else {
    gsap.to('#textAnim5', {duration: 0, opacity: 0})
    gsap.to('#textAnim6', {duration: 0, opacity: 0})
  }


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
  gsap.to('.heroSectionLogo', {duration: 0, opacity: 0})
  gsap.to('#heroSectionCTA', {duration: 0, opacity: 0, y: '20%'})

  const startAnimations = () => {
    animateText(0, 0.05, "down", 2)
    animateText(1, 0.05, "down", 2)
    animateText(2, 0.05, "down", 2)
    animateText(3, 0.05, "down", 2)

    if (sizes.width > 800) {
      animateText(4, 0.05, "hero", 1)
      animateText(5, 0.025, "hero", 1.5)
    }
    else {
      gsap.to('#textAnim5', {duration: 1, delay: 1.5, opacity: 1})
      gsap.to('#textAnim6', {duration: 1, delay: 2, opacity: 1})
    }

    gsap.to('.heroSectionLogo', {duration: 1, delay: 0.75, opacity: 1})
    gsap.to('#heroSectionCTA', {duration: 1, delay: 2.5, opacity: 1, y: '0%'})

    // animateText(1, 0.075, "hero", 0.5 + 1 + textAnimationDivs[0].length * 0.075)
  }
 
   /**
   * ScrollTriggers
   */
  // ----------------------------------------------------------------
  let scrubValue = true
  
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
    
  // Hero Section
  gsap.fromTo(
    camera.position,
    { y: 0, z: camera.position.z },
    {
      scrollTrigger: {
        trigger: ".heroSection",
        start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: -2,
      z: camera.position.z - 2,
      ease: 'none'
    }
  )

  // Showcase Section
  gsap.fromTo(
    '.showcaseSectionMobileImage',
    { y: '-20%' },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: '20%',
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.showcaseSectionMobileImage2',
    { y: '20%' },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      y: '-20%',
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.showcaseSectionMobileImage',
    { rotateY: 0, filter: 'brightness(0.2)' },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0.4 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0.65 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      rotateY: 0,
      filter: 'brightness(1)',
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.showcaseSectionMobileImage2',
    { rotateY: 0, filter: 'brightness(0.2)' },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector('.showcaseSection').clientHeight * 0.25 + " bottom",
        end: () => document.querySelector('.showcaseSection').clientHeight * 0.5 + " center",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      rotateY: 0,
      filter: 'brightness(1)',
      ease: 'Power1.easeOut'
    }
  )

  // DnD Section
  if (sizes.width > sizes.height) {
    gsap.fromTo(
      '.showcaseSectionBackgroundImage',
      { y: -sizes.height },
      {
        scrollTrigger: {
          trigger: ".showcaseSection",
          start: () => document.querySelector('.showcaseSection').clientHeight * 0 + " bottom",
          end: () => document.querySelector('.showcaseSection').clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        y: sizes.height,
        ease: 'none'
      }
    )

    gsap.fromTo(
      '.dndSectionBackgroundImage',
      { y: -sizes.height },
      {
        scrollTrigger: {
          trigger: ".dndSection",
          start: () => document.querySelector('.dndSection').clientHeight * 0 + " bottom",
          end: () => document.querySelector('.dndSection').clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        y: sizes.height,
        ease: 'none'
      }
    )
  }

  const dndSectionTextHeaders = document.querySelectorAll('.dndSectionTextHeader')
  const dndSectionTextItem1s = document.querySelectorAll('.dndSectionTextItem1')
  const dndSectionTextItem2s = document.querySelectorAll('.dndSectionTextItem2')
  const dndChangeDuration = 0.5

  for (let i = 0; i < dndSectionTextHeaders.length; i++) {
    gsap.fromTo(
      dndSectionTextHeaders[i],
      { opacity: 0, y: 10 },
      {
        scrollTrigger: {
          trigger: dndSectionTextHeaders[i],
          start: () => dndSectionTextHeaders[i].clientHeight * 0.5 + sizes.height * 0.25 + " bottom",
          // end: () => document.querySelector('.dndSection').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        // delay: i * dndChangeDuration,
        duration: dndChangeDuration,
        opacity: 1,
        y: 0,
        ease: 'back.out'
      }
    )
  }

  for (let i = 0; i < dndSectionTextItem1s.length; i++) {
    gsap.fromTo(
      dndSectionTextItem1s[i],
      { opacity: 0, x: -20 },
      {
        scrollTrigger: {
          trigger: dndSectionTextItem1s[i],
          start: () => dndSectionTextItem1s[i].clientHeight * 0.5 + sizes.height * 0.25 + " bottom",
          // end: () => document.querySelector('.dndSection').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        // delay: (i%4) * dndChangeDuration,
        duration: dndChangeDuration,
        opacity: 1,
        x: 0,
        ease: 'back.out'
      }
    )
  }

  for (let i = 0; i < dndSectionTextItem2s.length; i++) {
    gsap.fromTo(
      dndSectionTextItem2s[i],
      { opacity: 0, x: 20 },
      {
        scrollTrigger: {
          trigger: dndSectionTextItem2s[i],
          start: () => dndSectionTextItem2s[i].clientHeight * 0.5 + sizes.height * 0.25 + " bottom",
          // end: () => document.querySelector('.dndSection').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        // delay: (i%4) * dndChangeDuration,
        duration: dndChangeDuration,
        opacity: 1,
        x: 0,
        ease: 'Power1.easeOut'
      }
    )
  }

  // Video Section
  const videoSectionVideo = document.querySelector('.videoSectionVideo')

  gsap.fromTo(
		videoSectionVideo,
		{ volume: 0 },
		{
			scrollTrigger: {
        trigger: '.videoSection',
				start: () => document.querySelector('.videoSection').clientHeight * 0 + ' bottom',
				end: () => document.querySelector('.videoSection').clientHeight * 1 + ' top',
				// toggleActions: "play none none none",
				// snap: 2,
				scrub: scrubValue,
				// pin: true,
				// markers: true,
        onEnter: () => {
					videoSectionVideo.play()
        },
				onEnterBack: () => {
					videoSectionVideo.play()
				},
				onLeave: () => {
					videoSectionVideo.pause()
					videoSectionVideo.currentTime = 0
				},
				onLeaveBack: () => {
          videoSectionVideo.pause()
					videoSectionVideo.currentTime = 0
				},
			},
			volume: 0,
			ease: 'Power1.easeInOut',
		},
	)

  const videoSectionImageContainerParallaxs = document.querySelectorAll('.videoSectionImageContainerParallax')

  for (let i = 0; i < videoSectionImageContainerParallaxs.length; i++) {
    gsap.fromTo(
      videoSectionImageContainerParallaxs[i],
      { y: document.querySelector('.videoSection').clientHeight * (0.5 + Math.random() * 1) },
      {
        scrollTrigger: {
          trigger: ".videoSection",
          start: () => document.querySelector('.videoSection').clientHeight * 0 + " bottom",
          end: () => document.querySelector('.videoSection').clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        y: -document.querySelector('.videoSection').clientHeight * (0.5 + Math.random() * 1),
        ease: 'none'
      }
    )
  }

  // Focus Section
  gsap.fromTo(
    '.focusSectionMarqueeInner',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".focusSectionMarqueeInner",
        start: () => document.querySelector('.focusSectionMarqueeInner').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.focusSectionMarqueeInner').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: scrubValue,
        // pin: true,
        // markers: true,
      },
      x: -document.querySelector('.focusSectionMarquee').clientWidth,
      ease: 'none'
    }
  )

  const focusSectionImageContainer = document.querySelector('.focusSectionImageContainer')
  const focusSectionImage = document.querySelector('.focusSectionImage')

  if (focusSectionImage.clientHeight > focusSectionImageContainer.clientHeight) {
    gsap.fromTo(
      focusSectionImage,
      { y: 0 },
      {
        scrollTrigger: {
          trigger: focusSectionImageContainer,
          start: () => focusSectionImageContainer.clientHeight * 0 + " bottom",
          end: () => focusSectionImageContainer.clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        y: focusSectionImageContainer.clientHeight - focusSectionImage.clientHeight,
        ease: 'none'
      }
    )
  }

  // Slit Section
  // gsap.fromTo(
  //   '.slitSectionBackgroundImage',
  //   { y: -document.querySelector('.slitSection').clientHeight },
  //   {
  //     scrollTrigger: {
  //       trigger: ".slitSection",
  //       start: () => document.querySelector('.slitSection').clientHeight * 0 + " bottom",
  //       end: () => document.querySelector('.slitSection').clientHeight * 1 + " top",
  //       // toggleActions: "play none none none",
  //       // snap: 1,
  //       scrub: scrubValue,
  //       // pin: true,
  //       // markers: true,
  //     },
  //     y: sizes.height,
  //     ease: 'none'
  //   }
  // )

  // Get Font Size
  var el = document.querySelector('html');
  var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
  var fontSize = parseFloat(style); 
  // console.log(fontSize)

  gsap.fromTo(
    '.slitSectionImageContainerSolo',
    { y: -document.querySelector('.slitSectionImageContainerSolo').clientHeight - 4 * fontSize },
    {
      scrollTrigger: {
        trigger: ".slitSection",
        start: () => document.querySelector('.slitSection').clientHeight * 0.5 + " bottom",
        end: () => document.querySelector('.slitSection').clientHeight * 1 + " bottom",
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

  const swipeSectionImageContainers = document.querySelectorAll('.swipeSectionImageContainer')

  for (let i = 0; i < swipeSectionImageContainers.length; i++) {
    gsap.fromTo(
      swipeSectionImageContainers[i],
      { x: 0 },
      {
        scrollTrigger: {
          trigger: swipeSectionImageContainers[i],
          start: () => swipeSectionImageContainers[i].clientHeight * 0 + " bottom",
          end: () => swipeSectionImageContainers[i].clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: scrubValue,
          // pin: true,
          // markers: true,
        },
        x: -sizes.width,
        ease: 'none'
      }
    )
  }

  // Phone Cards

  const phoneCards = document.querySelectorAll('.phoneSectionCardRow')
  for (let i = 0; i < phoneCards.length; i++) {
    let xMove = '-91rem'
    let xEnd = '91rem'
    if (i % 2 == 1) {
      xMove = '91rem'
      xEnd = '-91rem'
    }
    gsap.fromTo(
      phoneCards[i],
      { x: xMove },
      {
        scrollTrigger: {
          trigger: ".phoneSection",
          start: () => document.querySelector('.phoneSection').clientHeight * 0 + " bottom",
          end: () => document.querySelector('.phoneSection').clientHeight * 1 + " top",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: true,
          // pin: true,
          // markers: true,
        },
        x: xEnd,
        ease: 'none'
      }
    )
  }

  
  // Mobile Move
  let mobile1ScrollTrigger = null
  const makeMobileScrollTrigger = () => {

  }

  tick()

  makeMobileScrollTrigger()
}

window.addEventListener('load', () => {
  main();
  
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
    
        // Determine direction based on body classes if direction is 0
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