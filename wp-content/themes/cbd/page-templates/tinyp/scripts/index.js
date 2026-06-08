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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  let shaderOpacity = 1
  if (sizes.width < sizes.height) {
    shaderOpacity = 0
  }
  else {
    shaderOpacity = 1
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

    // Resolution Resize
    fireFlies.scale.set(visibleSizes.width, visibleSizes.height, 1)
    fireFlies.material.uniforms.uResolution.value = new THREE.Vector2(visibleSizes.width, visibleSizes.height)

    // Slider Resize
    specialCardWidth = document.querySelector('.specialSectionCard').clientWidth
    specialIncrement = (document.querySelector('.specialSectionCardContainer').clientWidth - specialCardWidth)/60
    gsap.to('.specialSectionCardContainer', {duration: 1, x: -specialIncrement * sliderValue })

    // Shader Opacity
    if (sizes.width < sizes.height) {
      shaderOpacity = 0
    }
    else {
      shaderOpacity = 1
    }
    fireFlies.material.uniforms.uDesktop.value = shaderOpacity
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // Texture Loader
  const textureLoader = new THREE.TextureLoader()

  /**
   * 3D Objects
   */
  // ----------------------------------------------------------------

  // Fireflies
  const pointer1 = {
    x: 0,
    y: 0,
  }

  const pointer2 = {
    x: 0,
    y: 0,
  }

  const pointer3 = {
    x: 0,
    y: 0,
  }

  const fireFliesG = new THREE.PlaneGeometry(1,1,32,32)
  const fireFliesM = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uGlowTime: { value: 0 },
      uResolution: {value: new THREE.Vector2(visibleSizes.width, visibleSizes.height)},
      uPointer1: {value: new THREE.Vector2(pointer1.x, pointer1.y)},
      uPointer2: {value: new THREE.Vector2(pointer2.x, pointer2.y)},
      uPointer3: {value: new THREE.Vector2(pointer3.x, pointer3.y)},
      uColor: {value: new THREE.Color(0xaaff00)},
      uDispersion: {value: 0.025},
      uSpeed: {value: 2},
      uRadius: {value: 0.15},
      uCount: {value: 5},
      uDesktop: {value: shaderOpacity}
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
      uniform float uGlowTime;
      uniform vec2 uResolution;
      uniform vec2 uPointer1;
      uniform vec2 uPointer2;
      uniform vec2 uPointer3;
      uniform vec3 uColor;
      uniform float uDispersion;
      uniform float uSpeed;
      uniform float uRadius;
      uniform float uCount;
      uniform float uDesktop;
  
      varying vec2 vUv;

      float N21(vec2 p) {
        vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
          a += dot(a, a.yzx + 79.76);
          return fract((a.x + a.y) * a.z);
      }

      vec2 N22(vec2 p){
          float n = N21(p);
          return vec2(n,N21(n+p));
      }

      void main() {

        float radius = uRadius;
        float count = uCount;
        float dispersion = uDispersion;
        float speed = uSpeed;
        float PI = 3.141592;

        vec2 newUv = vUv * 2. - 1.;
        newUv.x *= uResolution.x/uResolution.y;
          
        vec3 pointLight1;
        for (float i=1.; i<count; i+=1.)
        {
          vec2 rnd = N22(vec2(i,i*2.0));
          vec2 point = vec2(cos(uTime* speed *rnd.x+i) * dispersion + uPointer1.x * uResolution.x/uResolution.y * 2.,sin(uTime* speed *rnd.y+i) * dispersion + uPointer1.y * 2.);
          float distanceToPoint = distance(newUv, point);
          pointLight1 += vec3(radius/distanceToPoint) * vec3(clamp(sin(uGlowTime+i)/2.0+0.6,0.1,1.0));
        }
        
        pointLight1 *= uColor * 0.1 * uDesktop;

        vec3 pointLight2;
        for (float i=1.; i<count; i+=1.)
        {
          vec2 rnd = N22(vec2(i,i*2.0));
          vec2 point = vec2(cos(uTime* speed *rnd.x+i+10.) * dispersion + uPointer2.x * uResolution.x/uResolution.y * 2.,sin(uTime* speed *rnd.y+i+10.) * dispersion + uPointer2.y * 2.);
          float distanceToPoint = distance(newUv, point);
          pointLight2 += vec3(radius/distanceToPoint) * vec3(clamp(sin(uGlowTime+i * PI * 2. / 3.)/2.0+0.6,0.1,1.0));
        }
        
        pointLight2 *= uColor * 0.1 * uDesktop;

        vec3 pointLight3;
        for (float i=1.; i<count; i+=1.)
        {
          vec2 rnd = N22(vec2(i,i*2.0));
          vec2 point = vec2(cos(uTime* speed *rnd.x+i+20.) * dispersion + uPointer3.x * uResolution.x/uResolution.y * 2.,sin(uTime* speed *rnd.y+i+20.) * dispersion + uPointer3.y * 2.);
          float distanceToPoint = distance(newUv, point);
          pointLight3 += vec3(radius/distanceToPoint) * vec3(clamp(sin(uGlowTime+i * PI * 4. / 3.)/2.0+0.6,0.1,1.0));
        }
        
        pointLight3 *= uColor * 0.1 * uDesktop;

        vec3 pointLight4;
        for (float i=1.; i<count * 3.; i+=1.)
        {
          vec2 rnd = N22(vec2(i,i*2.0));
          vec2 point = vec2(cos(uTime * 0.1 * speed *rnd.x+i+20.) * 1. * uResolution.x/uResolution.y, sin(uTime * 0.1 * speed *rnd.y+i+20.) * 1.);
          float distanceToPoint = distance(newUv, point);
          pointLight4 += vec3(radius/distanceToPoint) * vec3(clamp(sin(uGlowTime+i * PI * 4. / 3.)/2.0+0.6,0.1,1.0));
        }
        
        pointLight4 *= uColor * 0.1;

        vec3 pointLight = pointLight1 + pointLight2 + pointLight3 + pointLight4;
        pointLight /= 2.;
          
        gl_FragColor = vec4(pointLight, pointLight.g * pointLight.r);
      }


  `,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const fireFlies = new THREE.Mesh(fireFliesG, fireFliesM)
  fireFlies.scale.set(visibleSizes.width, visibleSizes.height, 1)
  scene.add(fireFlies)
  
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

        gsap.to(pointer1, {duration: 0.15, x: mouse.x, y: mouse.y})
        gsap.to(pointer2, {duration: 0.40, x: mouse.x, y: mouse.y})
        gsap.to(pointer3, {duration: 0.65, x: mouse.x, y: mouse.y})

        // Cursor Follower
        gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})

        if (finishedStartAnimation == true) {
          // Intro & Features Parallax
          gsap.to('.introSectionImageContainer', {duration: 0.5, rotateZ: mouse.x * 10})
          gsap.to('.introSectionProtectorImage', {duration: 0.5, rotateZ: -mouse.x * 10})

          // Hero Section
          gsap.to('.heroBackLayerDiv', {duration: 1, x: -(mouse.x * 16 + 8), y: mouse.y * 30 + 15})
          gsap.to('.heroLeftMidLayerDiv', {duration: 1, x: -(mouse.x * 8 + 4), y: mouse.y * 20 + 10})
          gsap.to('.heroRightMidLayerDiv', {duration: 1, x: -(mouse.x * 4 + 2), y: mouse.y * 10 + 5})

          gsap.to('.mossLottieDiv', {duration: 1, x: mouse.x * 50})
          gsap.to('.heroLargeLotusPhotoDiv', {duration: 1, x: -mouse.x * 30})
          gsap.to('.heroSmallLotusPhotoDiv', {duration: 1, x: mouse.x * 15})
        }
      }
    })

    // Pointer Events - Touch
    document.addEventListener("touchmove", (e) => {
      if (touch == true) {
        mouse.x = e.touches[0].clientX / sizes.width - 0.5
        mouse.y = -(e.touches[0].clientY / sizes.height - 0.5)

        if (finishedStartAnimation == true) {
          // Intro & Features Parallax
          gsap.to('.introSectionImageContainer', {duration: 0.5, rotateX: mouse.y * 15, x: (mouse.x - 0.5) * 30, rotateY: (mouse.x - 0.5) * 15})
        }
      }
      // Cursor Follower
      // gsap.to('.cursorFollower', {duration: 0.15, x: mouse.x * sizes.width, y: -mouse.y * sizes.height, rotateZ: mouse.x * 15})
    })
  }

  pointerMoveEvents()

  // Marquee Card Listeners
  const marqueeImage = document.querySelectorAll('.marqueeSectionImage')
  const marqueeImageContainer = document.querySelectorAll('.marqueeSectionImageContainer')

  for (let i = 0; i < marqueeImageContainer.length; i++) {
    marqueeImageContainer[i].addEventListener('pointerenter', () => {
      // Pointer On
      gsap.to(marqueeImageContainer[i], {duration: 0.25, delay: 0, x: 0, y: -20, scale: 1.01})
      gsap.to(marqueeImage[i], {duration: 0.25, delay: 0, y: 20})
    })

    marqueeImageContainer[i].addEventListener('pointerleave', () => {
      // Pointer Off
      gsap.to(marqueeImageContainer[i], {duration: 0.25, delay: 0, x: 0, y: 0, scale: 1})
      gsap.to(marqueeImage[i], {duration: 0.25, delay: 0, y: 0})
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
    // Pointer Off
    gsap.to('.cursorFollower', {duration: 0.25, width: '0rem', height: '0rem', borderRadius: '0rem'})
    gsap.to(workImageContainer, {duration: 0.25, opacity: 0})
    for (let j = 0; j < workTexts.length; j++) {
      // Pointer Off
      gsap.to(workTexts[j], {duration: 0.25, opacity: 0.35})
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
          // Pointer On
          gsap.to('.cursorFollower', {duration: 0.25, width: '30rem', height: '30rem', borderRadius: '1.5rem'})
          gsap.to(workTexts[j], {duration: 0.25, opacity: 1})
          gsap.to(workImageContainer, {duration: 0.25, opacity: 1})
        }
        else {
          // Pointer Off
          gsap.to(workTexts[j], {duration: 0.25, opacity: 0.35})
        }
      }
    })
  }

  // CTA Listeners
  const CTAButtons = document.querySelectorAll('.CTAButton')

  for (let i = 0; i < CTAButtons.length; i++) {
    CTAButtons[i].addEventListener('pointerenter', () => {
      gsap.to(CTAButtons[i], {duration: 0.15, scale: 1.1, filter: 'brightness(1.25)', boxShadow: '0 1rem 1rem 0 #00000077', y: '-1rem', textShadow: '0 0.2rem 0.2rem #00000077'})
    })

    CTAButtons[i].addEventListener('pointerleave', () => {
      gsap.to(CTAButtons[i], {duration: 0.15, scale: 1, filter: 'brightness(1)', boxShadow: '0 0rem 0rem 0 #00000077', y: '0rem', textShadow: '0 0.1rem 0.1rem #00000077'})
    })
  }

  // Firefly Listeners
  const fireflyEffect = document.querySelectorAll('.fireflyEffect')

  for (let i = 0; i < fireflyEffect.length; i++) {
    fireflyEffect[i].addEventListener('pointerenter', () => {
      gsap.to(fireFlies.material.uniforms.uDispersion, {duration: 0.5, value: 0.15, ease: 'back'})
      gsap.to(fireFlies.material.uniforms.uRadius, {duration: 0.5, value: 0.3, ease: 'back'})
    })

    fireflyEffect[i].addEventListener('pointerleave', () => {
      gsap.to(fireFlies.material.uniforms.uDispersion, {duration: 0.5, value: 0.025, ease: 'back'})
      gsap.to(fireFlies.material.uniforms.uRadius, {duration: 0.5, value: 0.15, ease: 'back'})
    })
  }

  // Special Section
  const specialSlider = document.querySelector('.specialSectionSlider')
  const specialCards = document.querySelectorAll('.specialSectionCard')
  const specialCardTexts = document.querySelectorAll('.specialSectionCardText')
  const specialCardBackgrounds = document.querySelectorAll('.specialCardBackgroundImage')
  const specialCardImages = document.querySelectorAll('.specialCardImage')
  let specialCardWidth = document.querySelector('.specialSectionCard').clientWidth
  let specialIncrement = (document.querySelector('.specialSectionCardContainer').clientWidth - specialCardWidth)/60
  let sliderValue = 0

  specialSlider.oninput = () => {
    sliderValue = specialSlider.value

    gsap.to('.specialSectionCardContainer', {duration: 1, x: -specialIncrement * sliderValue })
    for (let i = 0; i < specialCards.length; i++) {
      gsap.to(specialCards[i], {duration: 1, rotateZ: (sliderValue - (i - 3) * 10) * -Math.PI/4, y: (sliderValue - (i - 3) * 10) * 5})
    }
  }

  for (let i = 0; i < specialCards.length; i++) {
    specialCards[i].addEventListener('pointerenter', () => {
      gsap.to(specialCardTexts[i], {duration: 0.5, opacity: 1})
      gsap.to(specialCardBackgrounds[i], {duration: 0.5, scale: 1.1})
      gsap.to(specialCardImages[i], {duration: 0.5, scale: 1.2})
    })
    specialCards[i].addEventListener('pointerleave', () => {
      gsap.to(specialCardTexts[i], {duration: 0.5, opacity: 0})
      gsap.to(specialCardBackgrounds[i], {duration: 0.5, scale: 1})
      gsap.to(specialCardImages[i], {duration: 0.5, scale: 1})
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

    // Update Times
    fireFlies.material.uniforms.uTime.value = elapsedTime
    fireFlies.material.uniforms.uGlowTime.value = elapsedTime
    fireFlies.material.uniforms.uPointer1.value = new THREE.Vector2(pointer1.x, pointer1.y)
    fireFlies.material.uniforms.uPointer2.value = new THREE.Vector2(pointer2.x, pointer2.y)
    fireFlies.material.uniforms.uPointer3.value = new THREE.Vector2(pointer3.x, pointer3.y)

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
  // Intro Image ScrollTrigger
  gsap.fromTo(
    '.introSectionImageDiv',
    { y: 200 },
    {
      scrollTrigger: {
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
    { x: 0},
    {
      scrollTrigger: {
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
    }
  )
  
  const marqueeMoveValue = marqueeImage[0].clientWidth - document.querySelector('.marqueeSectionImageContainer').clientWidth

  for (let i = 0; i < marqueeImage.length; i++) {
    gsap.fromTo(
      marqueeImage[i],
      { x: 0 },
      {
        scrollTrigger: {
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
        opacity: 0.35
      }
    )
  }

  // Showcase Section
  gsap.fromTo(
    '.showcaseSectionImage',
    { y: 0 },
    {
      scrollTrigger: {
        trigger: ".showcaseSection",
        start: () => document.querySelector(".showcaseSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".showcaseSection").clientHeight * 1 + " top",
        // snap: 1,
        scrub: 1,
        // pin: true,
      },
      y: -document.querySelector('.showcaseSectionImageContainer').clientHeight,
    }
  )

  // Special Section
  gsap.fromTo(
    '.specialSectionCardContainer',
    { y: document.querySelector('.specialSectionCardContainer').clientHeight/4 },
    {
      scrollTrigger: {
        trigger: ".specialSection",
        start: () => document.querySelector(".specialSection").clientHeight * 0 + " bottom",
        end: () => document.querySelector(".specialSection").clientHeight * 1 + " top",
        // snap: 1,
        scrub: 1,
        // pin: true,
        },
      y: -document.querySelector('.specialSectionCardContainer').clientHeight/4,
    }
  )

  for (let i = 0; i < specialCards.length; i++) {
    gsap.fromTo(
      specialCards[i],
      { x: (sliderValue - (i - 3) * 10)/10 * specialCardWidth, y: 0, rotateZ: 0 },
      {
        scrollTrigger: {
          trigger: ".specialSection",
          start: () => document.querySelector(".specialSection").clientHeight * 0.35 + " center",
          // end: () => document.querySelector(".showcaseSection").clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: 1,
          // pin: true,
        },
        duration: 1.5,
        x: 0,
        y: (sliderValue - (i - 3) * 10) * 5,
        rotateZ: (sliderValue - (i - 3) * 10) * -Math.PI/4,
      }
    )
  }

  // Visit Section
  const visitCards = document.querySelectorAll('.visitSectionCard')
  let visitCardHeight = visitCards[0].clientHeight

  for (let i = 0; i < visitCards.length; i++) {
    gsap.fromTo(
      visitCards[i],
      { y: -((visitCardHeight - 100)* i)},
      {
        scrollTrigger: {
          trigger: ".visitSection",
          start: () => document.querySelector(".visitSection").clientHeight * 0 + " bottom",
          end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
          // toggleActions: "play none none none",
          // snap: 1,
          scrub: 1,
          // pin: true,
        },
        y: 0,
      }
    )
  }

  gsap.fromTo(
    '.visitSectionEndMountain',
    { y: 100},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector(".visitSection").clientHeight * 0.9 + " bottom",
        // end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: 1,
        // pin: true,
      },
      duration: 1,
      y: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.visitSectionEndHill',
    { y: 100},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector(".visitSection").clientHeight * 0.925 + " bottom",
        // end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: 1,
        // pin: true,
      },
      duration: 1,
      y: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.visitSectionEndRockLeft',
    { y: 100, x: -100},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector(".visitSection").clientHeight * 0.95 + " bottom",
        // end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: 1,
        // pin: true,
      },
      duration: 1,
      y: 0,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.visitSectionEndRockMid',
    { y: 100, x: 0},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector(".visitSection").clientHeight * 0.95 + " bottom",
        // end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: 1,
        // pin: true,
      },
      duration: 1,
      y: 0,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  gsap.fromTo(
    '.visitSectionEndRockRight',
    { y: 100, x: 100},
    {
      scrollTrigger: {
        trigger: ".visitSection",
        start: () => document.querySelector(".visitSection").clientHeight * 0.95 + " bottom",
        // end: () => document.querySelector(".visitSection").clientHeight * 1 + " bottom",
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: 1,
        // pin: true,
      },
      duration: 1,
      y: 0,
      x: 0,
      ease: 'Power1.easeOut'
    }
  )

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  gsap.to('.smallLogoDiv', {duration: 0, opacity: 0, y: 25})
  gsap.to('.largeLogoDiv', {duration: 0, opacity: 0, y: 25})
  gsap.to('.heroSectionText', {duration: 0, opacity: 0, y: 25})
  gsap.to('.heroBackLayerDiv', {duration: 0, y: 100})
  gsap.to('.heroLeftMidLayerDiv', {duration: 0, y: 50})
  gsap.to('.heroRightMidLayerDiv', {duration: 0, y: 50})
  gsap.to('.heroFrontLayerDiv', {duration: 0, y: 100})
  gsap.to('.lottieDiv', {duration: 0, y: 22.5/100 * window.innerHeight + 100})
  gsap.to('.heroBushDiv', {duration: 0, x: -100})
  gsap.to('.heroPondDiv', {duration: 0, x: 100})

  gsap.to(".loadingPage", { duration: 1, delay: 0, opacity: 0 })
  gsap.to(".loadingPage", { duration: 0, delay: 1, display: 'none' })

  const startAnimation = () => {
    gsap.to('.smallLogoDiv', {duration: 1, delay: 0.5, opacity: 1, y: 0})
    gsap.to('.largeLogoDiv', {duration: 1, delay: 0.7, opacity: 1, y: 0})
    gsap.to('.heroSectionText', {duration: 1, delay: 1.5, opacity: 1, y: 0})

    gsap.to('.heroBackLayerDiv', {duration: 1, delay: 0, y: 0})
    gsap.to('.heroLeftMidLayerDiv', {duration: 1, delay: 0.25, y: 0})
    gsap.to('.heroRightMidLayerDiv', {duration: 1, delay: 0.5, y: 0})
    gsap.to('.heroFrontLayerDiv', {duration: 1, delay: 0.75, y: 0})
    gsap.to('.lottieDiv', {duration: 1, delay: 0.75, y: 22.5/100 * window.innerHeight})
    
    gsap.to('.heroBushDiv', {duration: 1, delay: 0.7, x: 0})
    gsap.to('.heroPondDiv', {duration: 1, delay: 0.7, x: 0})
    
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