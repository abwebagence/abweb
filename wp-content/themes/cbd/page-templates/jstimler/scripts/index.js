/**
 * Initial Settings
 */
import imageVertexShader from "./shaders/imageVertexShader.js"
import imageFragmentShader from "./shaders/imageFragmentShader.js"

// GSAP Settings
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

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

// Math Functions
const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

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
  // Type: Default
  // Array containing all HTML images
  const images = document.querySelectorAll(".webglActualImage")
  // Array to store all image data
  const imagesData = []
  // Array containing all WebGL images
  const webglImages = []
  // Array containing loaded textures
  const loadedTextures = []

  // Type: Frame
  // Array containing all itwFrames
  const itwFrames = document.querySelectorAll(".itwFrame")

  // Converts all images with class "webglActualImage" to WebGL meshes
  const convertImages = () => {
    for (let i = 0; i < images.length; i++) {
      // Instantiates an object that stores image data per image in images
      imagesData[i] = {
        position: { x: 0, y: 0 },
        size: { w: 0, h: 0 },
        src: "",
        type: "default",
        frameSize: { w: 0, h: 0 },
        framePosition: { x: 0, y: 0 },
        prlx: 0,
        xMovement: 0
      }

      // Gets and stores image type from data-itg
      imagesData[i].type = images[i].dataset.itw

      // Parallax
      if (images[i].dataset.prlx == 'true') {
        imagesData[i].prlx = 1
      }
      else {
        imagesData[i].prlx = 0
      }

      // X Movement
      if (images[i].dataset.xmv == 'both') {
        imagesData[i].xMovement = 1
      }
      else if (images[i].dataset.xmv == 'both-reverse') {
        imagesData[i].xMovement = 2
      }

      // Gets and stores converted image sizes
      imagesData[i].size.w =
        (images[i].clientWidth * visibleSizes.width) / sizes.width
      imagesData[i].size.h =
        (images[i].clientHeight * visibleSizes.height) / sizes.height

      // Gets and stores converted image positions from left and top
      imagesData[i].position.x =
        -visibleSizes.width / 2 +
        (images[i].getBoundingClientRect().left * visibleSizes.width) /
          sizes.width +
        imagesData[i].size.w / 2
      imagesData[i].position.y = -(
        -visibleSizes.height / 2 +
        (images[i].getBoundingClientRect().top * visibleSizes.height) /
          sizes.height +
        imagesData[i].size.h / 2
      )

      // Gets and stores loaded texture
      imagesData[i].src = images[i].src
      let texture
      texture = textureLoader.load(imagesData[i].src)
      loadedTextures[i] = texture

      // Gets and stores converted frame sizes
      imagesData[i].frameSize.w =
        (itwFrames[i].clientWidth * visibleSizes.width) / sizes.width
      imagesData[i].frameSize.h =
        (itwFrames[i].clientHeight * visibleSizes.height) / sizes.height

      // Gets and stores converted frame positions from left and top
      imagesData[i].framePosition.x =
        -visibleSizes.width / 2 +
        (itwFrames[i].getBoundingClientRect().left * visibleSizes.width) /
          sizes.width +
        imagesData[i].frameSize.w / 2
      imagesData[i].framePosition.y = -(
        -visibleSizes.height / 2 +
        (itwFrames[i].getBoundingClientRect().top * visibleSizes.height) /
          sizes.height +
        imagesData[i].frameSize.h / 2
      )

      // Aspect Ratios
      const aspect = { x: 0, y: 0 }
      aspect.x =
        ((imagesData[i].size.h / imagesData[i].size.w) *
          (imagesData[i].frameSize.w / imagesData[i].size.w)) /
        (imagesData[i].size.h / imagesData[i].size.w)
      aspect.y =
        (1 * imagesData[i].frameSize.h) /
        imagesData[i].size.w /
        (imagesData[i].size.h / imagesData[i].size.w)

      // Creates meshes using shader material and gathered image data
      const meshGeometry = new THREE.PlaneGeometry(1, 1, 64, 64)
      const meshMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xff0000) },
          uSize: {
            value: new THREE.Vector2(visibleSizes.width, visibleSizes.height),
          },
          uTexture: { value: texture },
          uWaveAmplitude: { value: 0.2 },
          uAspect: { value: new THREE.Vector2(aspect.x, aspect.y) },
          uFramePosition: {
            value: new THREE.Vector2(
              imagesData[i].framePosition.x,
              imagesData[i].framePosition.y
            ),
          },
          uFrameSize: {
            value: new THREE.Vector2(
              imagesData[i].frameSize.w,
              imagesData[i].frameSize.h
            ),
          },
          uResizeMultiplier: { value: 1 },
          uScrollProgress: { value: 0 },
          uParallax: { value: imagesData[i].prlx},
          uXMovement: { value: imagesData[i].xMovement }
        },
        vertexShader: imageVertexShader,
        fragmentShader: imageFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
        // wireframe: true,
      })
      webglImages[i] = new THREE.Mesh(meshGeometry, meshMaterial)
      webglImages[i].scale.set(
        imagesData[i].frameSize.w,
        imagesData[i].frameSize.h,
        1
      )
      webglImages[i].position.set(
        imagesData[i].framePosition.x,
        imagesData[i].framePosition.y,
        0
      )
      webglImages[i].frustumCulled = false

      scene.add(webglImages[i])
    }
  }

  convertImages()

  // WebGL Image Resize and Repositioning
  const webglImageResize = () => {
    for (let i = 0; i < webglImages.length; i++) {
      // Image Sizes
      imagesData[i].size.w =
        (images[i].clientWidth * visibleSizes.width) / sizes.width
      imagesData[i].size.h =
        (images[i].clientHeight * visibleSizes.height) / sizes.height

      // Image Positions from Top and Left
      imagesData[i].position.x =
        -visibleSizes.width / 2 +
        (images[i].getBoundingClientRect().left * visibleSizes.width) /
          sizes.width +
        imagesData[i].size.w / 2
      imagesData[i].position.y = -(
        -visibleSizes.height / 2 +
        (images[i].getBoundingClientRect().top * visibleSizes.height) /
          sizes.height +
        imagesData[i].size.h / 2
      )

      // Gets and stores converted frame sizes
      imagesData[i].frameSize.w =
        (itwFrames[i].clientWidth * visibleSizes.width) / sizes.width
      imagesData[i].frameSize.h =
        (itwFrames[i].clientHeight * visibleSizes.height) / sizes.height

      // Gets and stores converted frame positions from left and top
      imagesData[i].framePosition.x =
        -visibleSizes.width / 2 +
        (itwFrames[i].getBoundingClientRect().left * visibleSizes.width) /
          sizes.width +
        imagesData[i].frameSize.w / 2
      imagesData[i].framePosition.y = -(
        -visibleSizes.height / 2 +
        (itwFrames[i].getBoundingClientRect().top * visibleSizes.height) /
          sizes.height +
        imagesData[i].frameSize.h / 2
      )

      webglImages[i].material.uniforms.uFramePosition.value = new THREE.Vector2(
        imagesData[i].framePosition.x,
        imagesData[i].framePosition.y
      )

      webglImages[i].material.uniforms.uFrameSize.value = new THREE.Vector2(
        imagesData[i].frameSize.w,
        imagesData[i].frameSize.h
      )

      webglImages[i].material.uniforms.uSize.value = new THREE.Vector2(
        visibleSizes.width,
        visibleSizes.height
      )

      // Resize and Reposition Meshes
      webglImages[i].scale.set(
        imagesData[i].frameSize.w,
        imagesData[i].frameSize.h,
        1
      )
      webglImages[i].position.set(
        imagesData[i].framePosition.x,
        imagesData[i].framePosition.y,
        0
      )
    }
  }

  // HTML Image Resize
  const htmlImageResize = () => {
    for (let i = 0; i < webglImages.length; i++) {
      const originalAspect = images[i].clientWidth / images[i].clientHeight
      const screenAspect = sizes.width / sizes.height

      if (originalAspect < screenAspect) {
        gsap.to(images[i], {
          duration: 0,
          width: sizes.width,
          height: sizes.width / originalAspect,
          left: 0,
          top: -(images[i].clientHeight - sizes.height) / 2,
        })

        // Aspect Ratios
        const aspect = { x: 0, y: 0 }
        aspect.x = imagesData[i].frameSize.w / imagesData[i].size.w
        aspect.y = imagesData[i].frameSize.h / imagesData[i].size.h
        

        webglImages[i].material.uniforms.uAspect.value = new THREE.Vector2(
          aspect.x,
          aspect.y
        )

        webglImages[i].material.uniforms.uResizeMultiplier.value = 1/(screenAspect / originalAspect)
      } else {
        gsap.to(images[i], {
          duration: 0,
          width: sizes.height * originalAspect,
          height: sizes.height,
          left: -(images[i].clientWidth - sizes.width) / 2,
          top: 0,
        })

        // Aspect Ratios
        const aspect = { x: 0, y: 0 }
        aspect.x = imagesData[i].frameSize.w / imagesData[i].size.w
        aspect.y = imagesData[i].frameSize.h / imagesData[i].size.h

        webglImages[i].material.uniforms.uAspect.value = new THREE.Vector2(
          aspect.x,
          aspect.y
        )

        webglImages[i].material.uniforms.uResizeMultiplier.value =
          screenAspect / originalAspect
      }
    }
  }

  // Test
  const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial())
  // scene.add(box)

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
        // gsap.to(plane.material.uniforms.uMouse.value, {duration: 1, x: planeMouse.x, y: planeMouse.y})

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

// Nav Events
const navBarChoices = document.querySelectorAll('.navBarChoice');
const navBar = document.querySelector('.navBar'); // Ensure you select the correct navBar element
const heroSection = document.querySelector('#heroSection'); // Select the hero section
let navChoice = 0;

const navChoiceIDs = ['#navChoice1', '#navChoice2', '#navChoice3', '#navChoice4', '#navChoice5'];
const navChoiceScrollValues = [];

gsap.to(navBarChoices[0], {
  duration: 0,
  backgroundColor: "#000000",
  color: "#ffffff",
  borderColor: '#D9D9D930',
  boxShadow: '0 0 10px 0px #D9D9D950'
});

for (let i = 0; i < navBarChoices.length; i++) {
  // Nav Scroll Values
  navChoiceScrollValues[i] = Math.floor(document.querySelector(navChoiceIDs[i]).getBoundingClientRect().top) - 10;

  // Nav Click
  navBarChoices[i].addEventListener('click', () => {
    if (i !== navChoice) {
      gsap.to(window, { duration: 2, scrollTo: navChoiceIDs[i], ease: 'Power1.easeInOut' });

      // Remove 'activenav' from all choices
      navBarChoices.forEach(choice => choice.classList.remove('activenav'));

      // Add 'activenav' to the clicked choice
      navBarChoices[i].classList.add('activenav');

      // Update the current choice index
      navChoice = i;
    }
  });
}

// Function to check if the first nav choice OR the hero section is in view
const checkNavVisibility = () => {
  const firstNavChoice = document.querySelector(navChoiceIDs[0]);
  const firstNavRect = firstNavChoice.getBoundingClientRect();
  const heroRect = heroSection.getBoundingClientRect();

  const firstNavInView = firstNavRect.top >= 0 && firstNavRect.bottom <= window.innerHeight;
  const heroInView = heroRect.top >= 0 && heroRect.bottom > 0;

  if (firstNavInView || heroInView) {
    navBar.style.margin = "0"; // Apply margin 0 when either section is in view
  } else {
    navBar.style.margin = ""; // Remove inline margin when neither is visible
  }
};

// Listen for scroll events
window.addEventListener("scroll", checkNavVisibility);

// Initial check on load
checkNavVisibility();



  // Check Scroll
  const checkScroll = (currentScroll) => {
    let temp = 0
    for (let i = 0; i < navChoiceScrollValues.length; i++) {
      if (currentScroll >= navChoiceScrollValues[i]) {
        temp = i
      }
    }

    if (temp != navChoice) {
      navChoice = temp
  
      for (let i = 0; i < navBarChoices.length; i++) {
        if (i == navChoice) {
          gsap.to(navBarChoices[i], {duration: 0.1, backgroundColor: "#000000", color: "#ffffff", borderColor: '#D9D9D930', boxShadow: '0 0 10px 0px #D9D9D950'})
    
          navChoice = i
    
          for (let j = 0; j < navBarChoices.length; j++) {
            if (i != j) {
              gsap.to(navBarChoices[j], {duration: 0.1, backgroundColor: "#D9D9D950", color: "#000000", borderColor: '#D9D9D9a0', boxShadow: '0 0 10px 0px #D9D9D900'})
            }
          }
        }
      }
    }
  }
  
  // Visit Site
  gsap.to('.aboutSectionButtonLine', {duration: 0, scaleX: 0})

  document.querySelector('.aboutSectionButton').addEventListener('pointerover', () => {
    gsap.to('.aboutSectionButton', {duration: 0.2, y: -5})
    // gsap.to('.aboutSectionButtonLine', {duration: 0, transformOrigin: 'left center'})
    gsap.to('.aboutSectionButtonLine', {duration: 0.25, scaleX: 1})
  })

  document.querySelector('.aboutSectionButton').addEventListener('pointerleave', () => {
    gsap.to('.aboutSectionButton', {duration: 0.2, y: 0})
    // gsap.to('.aboutSectionButtonLine', {duration: 0, transformOrigin: 'right center'})
    gsap.to('.aboutSectionButtonLine', {duration: 0.25, scaleX: 0})
  })
 
  /**
   * Animate
   */
  // ----------------------------------------------------------------
  let elapsedTime
  const clock = new THREE.Clock()
  const scrollStart = document.querySelector('.scrollStartSection')
  let scrollValue = 0
  let webglScrollProgress = 0
  let scrollCurrent = 0
  let finalScroll = 0
  let targetScroll = 0
  let scrollEaseFactor = 0.01

  const tick = () => {
    elapsedTime = clock.getElapsedTime()

    // Test
    box.rotation.set(elapsedTime, elapsedTime, elapsedTime)

    // Scroll
    scrollValue = scrollStart.getBoundingClientRect().top
    checkScroll(-scrollValue)
    webglScrollProgress = scrollValue / sizes.height

    // Scroll Speed
    scrollCurrent = lerp(scrollCurrent, webglScrollProgress, 0.1)
    finalScroll = (webglScrollProgress - scrollCurrent) * 2

    // Smoothen Scroll Speed
    targetScroll += scrollEaseFactor * (finalScroll - targetScroll)

    // Simulate Scroll
    for (let i = 0; i < itwFrames.length; i++) {
      // Update uniforms
      webglImages[i].material.uniforms.uTime.value = elapsedTime
      webglImages[i].material.uniforms.uScrollProgress.value = targetScroll
    }

    // HTML Image Resize
    htmlImageResize()

    // WebGL Image Resize
    webglImageResize()


    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }

  tick()

  /**
   * ScrollTriggers
   */
  // ----------------------------------------------------------------
  const sizeMultiplier = sizes.width/1960
   
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
    
  // Nav
  gsap.fromTo(
    '.navBar',
    { y: sizes.height, marginTop: '1rem' },
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
          onLeaveBack: () => document.querySelector('.navBar').classList.remove('scrolled')
      },
      y: 0,
      marginTop: '0rem',
      ease: 'none',
      onComplete: () => document.querySelector('.navBar').classList.add('scrolled')
    }
  )

  // Slider Section
  gsap.fromTo(
    '.sliderSectionContainer',
    { x: 0 },
    {
      scrollTrigger: {
        trigger: ".sliderSection",
        start: () => document.querySelector('.sliderSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.sliderSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -(document.querySelector('.sliderSectionContainer').clientWidth - sizes.width),
      ease: 'none'
    }
  )

  // Pages Section
  gsap.fromTo(
    '#pagesSectionRow1',
    { x: -sizes.width/4 },
    {
      scrollTrigger: {
        trigger: ".pagesSection",
        start: () => document.querySelector('.pagesSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.pagesSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: sizes.width/4,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#pagesSectionRow2',
    { x: sizes.width/4 * 1.5 },
    {
      scrollTrigger: {
        trigger: ".pagesSection",
        start: () => document.querySelector('.pagesSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.pagesSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: sizes.width/4 * 1.5 - sizes.width/2,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#pagesSectionRow3',
    { x: -sizes.width/2 },
    {
      scrollTrigger: {
        trigger: ".pagesSection",
        start: () => document.querySelector('.pagesSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.pagesSection').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: 0,
      ease: 'none'
    }
  )

  // Mobile
  gsap.fromTo(
    '#feature1SectionMobile1',
    { y: -100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: "#feature1SectionFrame1",
        start: () => document.querySelector('#feature1SectionFrame1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#feature1SectionFrame1').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature1SectionMobile2',
    { y: 100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: "#feature1SectionFrame2",
        start: () => document.querySelector('#feature1SectionFrame2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#feature1SectionFrame2').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature2SectionMobile1',
    { y: 100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: "#feature2SectionFrame1",
        start: () => document.querySelector('#feature2SectionFrame1').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#feature2SectionFrame1').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature2SectionMobile2',
    { y: -100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: "#feature2SectionFrame2",
        start: () => document.querySelector('#feature2SectionFrame2').clientHeight * 0 + " bottom",
        end: () => document.querySelector('#feature2SectionFrame2').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature4SectionMobile1',
    { y: 100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: ".feature4SectionFrame",
        start: () => document.querySelector('.feature4SectionFrame').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature4SectionMobile2',
    { y: -100 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: ".feature4SectionFrame",
        start: () => document.querySelector('.feature4SectionFrame').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: 100 * sizeMultiplier,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '#feature4SectionMobile3',
    { x: 50 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: ".feature4SectionFrame",
        start: () => document.querySelector('.feature4SectionFrame').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      x: -50 * sizeMultiplier,
      ease: 'none'
    }
  )

  // Hero Section
  gsap.fromTo(
    '.heroSectionHeader',
    { y: 0 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: '.heroSection',
        start: () => document.querySelector('.heroSection').clientHeight * 1 + " bottom",
        end: () => document.querySelector('.heroSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -75 * sizeMultiplier,
      ease: 'none'
    }
  )

  // About Section
  const aboutSectionDetailsEntryHeaderBlackouts = document.querySelectorAll('.aboutSectionDetailsEntryHeaderBlackout')
  const aboutSectionDetailsEntryBodyTexts = document.querySelectorAll('.aboutSectionDetailsEntryBodyText')

  for (let i = 0; i < aboutSectionDetailsEntryHeaderBlackouts.length; i++) {
    gsap.fromTo(
      aboutSectionDetailsEntryHeaderBlackouts[i],
      { scaleX: 1},
      {
        scrollTrigger: {
          trigger: aboutSectionDetailsEntryHeaderBlackouts[i],
          start: () => aboutSectionDetailsEntryHeaderBlackouts[i].clientHeight * 0 + " bottom",
          // end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        delay: 0.25,
        duration: 0.5,
        scaleX: 0,
        ease: 'none'
      }
    )

    gsap.fromTo(
      aboutSectionDetailsEntryBodyTexts[i],
      { opacity: 0 },
      {
        scrollTrigger: {
          trigger: aboutSectionDetailsEntryHeaderBlackouts[i],
          start: () => aboutSectionDetailsEntryHeaderBlackouts[i].clientHeight * 0 + " bottom",
          // end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
          toggleActions: "play none none none",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        delay: 0.3,
        duration: 0.5,
        opacity: 1,
        ease: 'none'
      }
    )
  }

  gsap.fromTo(
    '.aboutSectionBodyText',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.aboutSectionBodyText',
        start: () => document.querySelector('.aboutSectionBodyText').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      delay: 0,
      duration: 1,
      opacity: 1,
      ease: 'none'
    }
  )

  gsap.fromTo(
    '.aboutSectionButtonLink',
    { opacity: 0, y: 10 },
    {
      scrollTrigger: {
        trigger: '.aboutSectionBodyText',
        start: () => document.querySelector('.aboutSectionBodyText').clientHeight * 0 + " bottom",
        // end: () => document.querySelector('.feature4SectionFrame').clientHeight * 1 + " top",
        toggleActions: "play none none none",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      delay: 1,
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'none'
    }
  )

  // Search Section
  gsap.fromTo(
    '.searchSectionContainer',
    { y: 200 * sizeMultiplier },
    {
      scrollTrigger: {
        trigger: '.searchSection',
        start: () => document.querySelector('.searchSection').clientHeight * 0 + " bottom",
        end: () => document.querySelector('.searchSection').clientHeight * 1 + " top",
        // toggleActions: "play none none none",
        // snap: 1,
        scrub: true,
        // pin: true,
        // markers: true
      },
      y: -200 * sizeMultiplier,
      ease: 'none'
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

  // Search Text
  ScrollTrigger.create({
    trigger: '.searchSectionTextbox',
    onEnter: () => {
      animateText(0, 0.075, "type", 0.5)
    }
  })

  /**
   * Start Animation
   */
  // ----------------------------------------------------------------
  const planeAnimationDelay = 3
  gsap.to('#heroSectionLine1', {duration: 0, height: "0%"})
  gsap.to('.heroSectionScrollLineContainer', {duration: 0, opacity: 0})

  const startAnimation = () => {
    gsap.to('.loadingBarBorder', {duration: 0.5, delay: 0.5, scaleX: 2})

    gsap.to('.heroSectionScrollLineContainer', {duration: 1, delay: 0.8 + 1, opacity: 1})
    gsap.to('#heroSectionLine1', {duration: 2, delay: 1.5, height: "100%", ease: 'Power1.easeOut'})

    setTimeout(() => {
      finishedStartAnimation = true
    }, 500);
  }

  startAnimation()

  // Loading Page
  gsap.to('.loadingPage', {duration: 1, delay: 1, opacity: 0, ease: 'Power1.easeOut'})
}

/**
 * Load
 */
  let imgs = document.images,
  len = imgs.length,
  counter = 0;

  gsap.to('.loadingBar', {duration: 0, scaleX: 0})

  if (len > 0) {
    // [].forEach.call( imgs, (img) => {
    //   if(img.complete) {
    //     incrementCounter()
    //   }
    //   else {
    //     img.addEventListener( 'load', incrementCounter, false )
    //   }
    // })
    imagesLoaded(imgs, { background: true }).on('progress', function(instance, image) {
      incrementCounter();
    });
  
    function incrementCounter() {
      counter++;

      gsap.to('.loadingBar', {duration: 0.2, scaleX: Math.floor(counter/len * 100)/100})
  
      // Done Loading
      if ( counter == len ) {
        setTimeout(() => {
          main()
        }, 100)
      }
    }
  }
  else {
    setTimeout(() => {
      main()
    }, 500)
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