gsap.registerPlugin(ScrollTrigger);
const interactiveJS = () => {
  // Clear Scroll Memory
  window.history.scrollRestoration = "manual"

  // Canvas
  // Change '.webgl' with a canvas querySelector
  const canvas = document.querySelector(".webgl")

  // Scene
  const scene = new THREE.Scene()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  scene.add(directionalLight)
  directionalLight.position.set(0, 0, 10)

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerWidth,
  }

  let prevWidth = sizes.width

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerWidth

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (sizes.width != prevWidth) {
      location.reload()
    }
  })

  //   // Texture Loader
  //   const textureLoader = new THREE.TextureLoader()

  //   const bottleWrapT = textureLoader.load("./images/bottleWrap.png")

  //   // GLTF Loader
  //   const gltfLoader = new THREE.GLTFLoader()

  // 3D Objects
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------

  // Base camera
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.set(0, 0, 10)
  scene.add(camera)

  // Controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.enabled = false

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

  // Animations

  // Header Animations
  let heroString = document.querySelector(".heroText").innerText

  document.querySelector(".heroText").innerText = ""

  const heroTextSpans = []
  let spanIndex = 0

  heroTextSpans[spanIndex] = ""

  for (let i = 0; i < heroString.length; i++) {
    if (heroString[i] != " ") {
      heroTextSpans[spanIndex] += heroString[i]
    } else {
      spanIndex++
      heroTextSpans[spanIndex] = ""
    }
  }

  for (let i = 0; i < heroTextSpans.length; i++) {
    document.querySelector(".heroText").innerHTML +=
      '<div class="heroTextSpan">' + heroTextSpans[i] + "</div>"
    if (i < heroTextSpans.length - 1) {
      document.querySelector(".heroText").innerHTML += "&nbsp;"
    }
  }

  const textSpans = document.querySelectorAll(".heroTextSpan")

  gsap.to(".heroTextSpan", { duration: 0, y: 20, opacity: 0 })

  // Startup Animations

  gsap.to(".heroCTAButton", { duration: 0, y: 20, opacity: 0 })
  gsap.to(".bottle", { duration: 0, x: -100 })

  const startupAnimations = () => {
    gsap.to(".heroCTAButton", {
      duration: 0.5,
      delay: 2 + textSpans.length * 0.2 + 0.5,
      y: 0,
      opacity: 1,
      ease: "Power1.easeOut",
    })
    gsap.to(".bottle", { duration: 1, delay: 1, x: 0, ease: "back" })

    for (let i = 0; i < textSpans.length; i++) {
      gsap.to(textSpans[i], {
        duration: 0.5,
        delay: 0.2 * i + 2,
        y: 0,
        opacity: 1,
        ease: "Power1.easeOut",
      })
    }
  }

  setTimeout(() => {
    startupAnimations()
  }, 1000)

  // Bubble Animations
  const bubbleDiv = document.querySelector(".bubbleDiv")

  let bubbleCounter = 0
  const bubbleArray = []

  const createBubble = () => {
    const bubble = document.createElement("div")
    bubble.classList.add("bubble")

    bubbleDiv.appendChild(bubble)

    bubbleArray[bubbleCounter] = bubble

    const timer = Math.random() * 2 + 1
    const bubbleScale = Math.random() * 1.5 + 0.5

    setTimeout(() => {
      bubbleDiv.removeChild(bubble)
    }, timer * 1000 + 250)

    gsap.fromTo(
      bubbleArray[bubbleCounter],
      {
        width: bubbleScale * 50,
        height: bubbleScale * 50,
        y: document.querySelector(".deliveredSection").clientHeight / 2 + 200,
        x: (Math.random() - 0.5) * window.innerWidth,
      },
      {
        duration: timer,
        y: -(
          document.querySelector(".deliveredSection").clientHeight / 2 +
          200
        ),
      }
    )

    bubbleCounter++

    setTimeout(() => {
      createBubble()
    }, Math.random() * 1.5 * 1000)
  }

  createBubble()

  const bubble2Div = document.querySelector(".bottleLiquidContent")

  let bubble2Counter = 0
  const bubble2Array = []

  const createBubble2 = () => {
    const bubble = document.createElement("div")
    bubble.classList.add("bubbleBottle")

    bubble2Div.appendChild(bubble)

    bubble2Array[bubble2Counter] = bubble

    const timer = Math.random() * 2 + 2
    const bubbleScale = Math.random() * 1.5 + 0.5

    setTimeout(() => {
      bubble2Div.removeChild(bubble)
    }, timer * 1000 + 250)

    gsap.fromTo(
      bubble2Array[bubble2Counter],
      {
        width: bubbleScale * 15,
        height: bubbleScale * 15,
        y:
          document.querySelector(".bottleLiquidContent").clientHeight / 2 + 200,
        x:
          ((Math.random() - 0.5) *
            document.querySelector(".bottleLiquidContent").clientWidth *
            3) /
          4,
      },
      {
        duration: timer,
        y: -(
          document.querySelector(".bottleLiquidContent").clientHeight / 2 +
          200
        ),
      }
    )

    bubble2Counter++

    setTimeout(() => {
      createBubble2()
    }, Math.random() * 0.5 * 1000)
  }

  createBubble2()

  // Events
  // --------------------------------------

  // Button Fills
  const buttonFills = document.querySelectorAll(".buttonFill")
  const buttonFillTexts = document.querySelectorAll(".buttonFillText")
  const CTAButtons = document.querySelectorAll(".heroCTAButton")

  for (let i = 0; i < buttonFills.length; i++) {
    gsap.to(buttonFills[i], { duration: 0, y: 90 })
    gsap.to(buttonFillTexts[i], { duration: 0, y: -90 })
  }

  let isMouseOnCTAButton = false

  for (let i = 0; i < CTAButtons.length; i++) {
    CTAButtons[i].addEventListener("mouseenter", () => {
      gsap.to(buttonFills[i], {
        duration: 0.35,
        y: 52.5,
        ease: "Power1.easeOut",
      })
      gsap.to(buttonFillTexts[i], {
        duration: 0.35,
        y: -52.5,
        ease: "Power1.easeOut",
      })
      gsap.to(CTAButtons[i], { duration: 0.35, y: -10, ease: "Power1.easeOut" })
      isMouseOnCTAButton = true
    })

    CTAButtons[i].addEventListener("mouseleave", () => {
      gsap.to(buttonFills[i], { duration: 0.35, y: 90, ease: "Power1.easeOut" })
      gsap.to(buttonFillTexts[i], {
        duration: 0.35,
        y: -90,
        ease: "Power1.easeOut",
      })
      gsap.to(CTAButtons[i], { duration: 0.35, y: 0, ease: "Power1.easeOut" })
      isMouseOnCTAButton = false
    })
  }

  // Mouse
  const mouse = {
    x: 0,
    y: 0,
  }

  // Pointer Events
  document.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5
    mouse.y = -(e.clientY / window.innerHeight - 0.5)

    // Camera
    // gsap.to(camera.rotation, {duration: 1, x: mouse.y * 0.02, y: -mouse.x * 0.02})

    // Bottle
    gsap.to(".bottle", {
      duration: 0.1,
      rotateZ: (mouse.x + 0.5) * 20,
      y: -mouse.y * 20,
      ease: "none",
    })
    gsap.to(".bottleLiquid", {
      duration: 0.1,
      rotateZ: -(mouse.x + 0.5) * 20,
      ease: "none",
    })

    // Showcase 1
    gsap.to(".showcase1PhotoFrame", { duration: 1, x: -mouse.x * 20 })
  })

  // Animate
  // --------------------------------------

  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Button Fills Sloshing
    for (let i = 0; i < buttonFills.length; i++) {
      gsap.to(buttonFills[i], {
        duration: 0,
        skewY: Math.sin(elapsedTime * 2.5) * 2,
      })
      gsap.to(buttonFillTexts[i], {
        duration: 0,
        skewY: -Math.sin(elapsedTime * 2.5) * 2,
      })
      if (isMouseOnCTAButton == true) {
        gsap.to(CTAButtons[i], {
          duration: 0,
          x: Math.sin(elapsedTime * 2.5 + 0.5) * 2,
        })
      }
    }

    gsap.to(".arrowDiv", {
      duration: 0,
      y: Math.sin(elapsedTime * 2) * 5 - 2.5,
    })
    gsap.to(".sideScrollCover", {
      duration: 0,
      x: Math.sin(elapsedTime * 2) * 5 - 2.5,
    })

    // Objects

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  // ScrollTriggers
  // -------------------------------------------------

  gsap.fromTo(
    ".showcase1Background",
    { width: document.querySelector(".showcase1Background").clientWidth * 0.9 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase1Section",
        start: () =>
          document.querySelector(".showcase1Section").clientHeight * 0.5 +
          " bottom",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: false,
        // markers: false
      },
      width: document.querySelector(".showcase1Background").clientWidth,
      // ease: 'Power2.easeOut',
    }
  )

  gsap.fromTo(
    ".showcase1Photo",
    { y: 500 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase1Section",
        start: () =>
          document.querySelector(".showcase1Section").clientHeight * 0.5 +
          " bottom",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: false,
        // markers: false
      },
      delay: 0.2,
      y: 0,
      // ease: 'Power2.easeOut',
    }
  )

  // Mobile

  gsap.fromTo(
    ".mobile1Photo",
    { y: 150 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase2Section",
        start: () =>
          document.querySelector(".showcase2Section").clientHeight * 0 +
          " bottom",
        end: () =>
          document.querySelector(".showcase2Section").clientHeight * 1 + " top",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      y: -150,
      ease: "none",
    }
  )

  gsap.fromTo(
    ".mobile2Photo",
    { y: -150 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase2Section",
        start: () =>
          document.querySelector(".showcase2Section").clientHeight * 0 +
          " bottom",
        end: () =>
          document.querySelector(".showcase2Section").clientHeight * 1 + " top",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      y: 150,
      ease: "none",
    }
  )

  gsap.fromTo(
    ".showcase2Photo",
    { y: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase2Section",
        start: () =>
          document.querySelector(".showcase2Section").clientHeight * 0 +
          " bottom",
        end: () =>
          document.querySelector(".showcase2Section").clientHeight * 1 + " top",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      y: -100,
      ease: "none",
    }
  )

  // Showcase 3

  gsap.fromTo(
    ".showcase3Photo",
    { y: -100 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase3Section",
        start: () =>
          document.querySelector(".showcase3Section").clientHeight * 0 +
          " bottom",
        end: () =>
          document.querySelector(".showcase3Section").clientHeight * 1 + " top",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      y: 220,
      ease: "none",
    }
  )

  // Delivered

  const deliveredItemTexts = document.querySelectorAll(".deliveredItemText")

  for (let i = 0; i < deliveredItemTexts.length; i++) {
    gsap.fromTo(
      deliveredItemTexts[i],
      { x: -20, opacity: 0 },
      {
        scrollTrigger: {
          scroller: "#body-wrap",trigger: ".deliveredSection",
          start: () =>
            document.querySelector(".deliveredSection").clientHeight * 0.5 +
            " bottom",
          // end: () =>  window.innerHeight*0.9 + ' bottom',
          toggleActions: "restart none none reverse",
          // snap: 1,
          // scrub: true,
          // pin: false,
          // markers: false
        },
        delay: 0.45 * i,
        x: 0,
        opacity: 1,
        // ease: 'Power2.easeOut',
      }
    )
  }

  // Side Scroll

  const sideScrollPhotos = document.querySelectorAll(".sideScrollPhoto")

  let photoWidth = 0

  if (window.innerWidth < 1300) {
    photoWidth = window.innerWidth * 0.9
  } else {
    photoWidth = 1070
  }

  let actualSSWidth = (photoWidth + 60) * (sideScrollPhotos.length - 1)

  let sideScrollCounter = 0
  let solvedSSWidth = 0

  const solveSSWidth = () => {
    if (sideScrollCounter * window.innerWidth < actualSSWidth) {
      sideScrollCounter++
      solveSSWidth()
    } else {
      solvedSSWidth = photoWidth + 60 + (actualSSWidth - window.innerWidth) + 60
    }
  }

  solveSSWidth()

  gsap.fromTo(
    ".sideScrollContents",
    { x: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",
        trigger: ".sideScrollSection",
        start: () =>
          document.querySelector(".sideScrollSection").clientHeight * 0.5 +
          " center",
        end: () =>
          document.querySelector(".sideScrollSection").clientHeight *
            (sideScrollPhotos.length - 1 - 0.5) +
          " center",
        // toggleActions: "restart none reverse none",
        // snap: 1,
        scrub: true,
        pin: true,
        pinType: "fixed",
        anticipatePin: 1
        // markers: true
      },
      x: -solvedSSWidth,
      ease: "none",
    }
  )

  // Camera

  gsap.fromTo(
    camera.position,
    { y: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".slantScrollSection",
        start: () =>
          document.querySelector(".slantScrollSection").clientHeight * 0.5 +
          " top",
        // end: () =>  document.querySelector('.slantScrollSection').clientHeight * (sideScrollPhotos.length - 1 - 0.5) + ' center',
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 0.75,
      y: -10,
      ease: "Power1.easeOut",
    }
  )

  // Banner Parallax

  gsap.fromTo(
    ".bannerPhoto",
    { y: (-400 * window.innerWidth) / 1920 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".bannerSection",
        start: () =>
          document.querySelector(".bannerSection").clientHeight * 0 + " bottom",
        end: () =>
          document.querySelector(".bannerSection").clientHeight * 1 + " top",
        // toggleActions: "restart none reverse none",
        // snap: 1,
        scrub: 0.1,
        // pin: true,
        // markers: true
      },
      y: 0,
      ease: "Power1.easeOut",
    }
  )

  // Slant Scroll
  const slantColumns = document.querySelectorAll(".slantColumn")

  gsap.to(".slantScrollContainer", { duration: 0, rotateZ: 30 })

  for (let i = 0; i < slantColumns.length; i++) {
    gsap.fromTo(
      slantColumns[i],
      { y: -500 * Math.sin(Math.PI / 3) * (-1) ** i },
      {
        scrollTrigger: {
          scroller: "#body-wrap",trigger: ".slantScrollSection",
          start: () =>
            document.querySelector(".slantScrollSection").clientHeight * 0 +
            " bottom",
          end: () =>
            document.querySelector(".slantScrollSection").clientHeight * 1 +
            " bottom",
          // toggleActions: "restart none reverse none",
          // snap: 1,
          scrub: true,
          // pin: true,
          // markers: true
        },
        y: 0 * Math.sin(Math.PI / 3) * (-1) ** i,
        ease: "Power1.easeOut",
      }
    )
  }

  // Showcase 4

  gsap.fromTo(
    ".showcase4Photo",
    { x: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".showcase4Section",
        start: () =>
          document.querySelector(".showcase4Section").clientHeight * 0 +
          " bottom",
        end: () =>
          document.querySelector(".showcase4Section").clientHeight * 1 + " top",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      x: -50,
      ease: "none",
    }
  )

  // Bottle Liquid
  gsap.fromTo(
    ".bottleLiquid",
    { y: 50 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".mainBody",
        start: () =>
          document.querySelector(".mainBody").clientHeight * 0 + " top",
        end: () =>
          document.querySelector(".mainBody").clientHeight * 1 +
          window.innerHeight * 6 +
          " bottom",
        // end: () =>  window.innerHeight*0.9 + ' bottom',
        // toggleActions: "play none none reverse",
        // snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
      },
      y: 1010,
      ease: "none",
    }
  )

  // Bottle Text
  const bottleTexts = document.querySelectorAll(".bottleTextRow")

  for (let i = 0; i < bottleTexts.length; i++) {
    gsap.fromTo(
      bottleTexts[i],
      { x: -100, opacity: 0 },
      {
        scrollTrigger: {
          scroller: "#body-wrap",trigger: ".slantScrollSection",
          start: () =>
            document.querySelector(".slantScrollSection").clientHeight * 0.5 +
            " bottom",
          // end: () =>  document.querySelector('.slantScrollSection').clientHeight * (sideScrollPhotos.length - 1 - 0.5) + ' center',
          toggleActions: "restart none none reverse",
          // snap: 1,
          // scrub: true,
          // pin: true,
          // markers: true
        },
        duration: 0.5,
        delay: 0.5 * i,
        x: 0,
        opacity: 1,
        ease: "Power1.easeOut",
      }
    )
  }

  gsap.fromTo(
    ".bottle",
    { opacity: 1 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",trigger: ".slantScrollSection",
        start: () =>
          document.querySelector(".slantScrollSection").clientHeight * 0.5 +
          " top",
        // end: () =>  document.querySelector('.slantScrollSection').clientHeight * (sideScrollPhotos.length - 1 - 0.5) + ' center',
        toggleActions: "play none none reverse",
        // snap: 1,
        // scrub: true,
        // pin: true,
        // markers: true
      },
      duration: 0.5,
      opacity: 0,
      ease: "Power1.easeOut",
    }
  )

  tick()
}

interactiveJS()


          gsap.to('.loadingPage', {duration: 1, delay: 1, opacity: 0})
            setTimeout(() => {}, 1000)
 

// Image Loader
/*
let images = document.images
let len = images.length
let counter = 0

const incrementCounter = () => {
  counter++
  if (counter === len - 4) {
    // Remove Loading Page
    gsap.to(".loadingPage", { duration: 1, delay: 1, opacity: 0 })
    setTimeout(() => {}, 1000)
  }
}

for (let i = 0; i < images.length; i++) {
  if (images[i].complete) {
    incrementCounter()
  } else {
    images[i].addEventListener(
      "load",
      () => {
        incrementCounter()
      },
      false
    )
  }
}
*/
 

document.addEventListener("DOMContentLoaded", function () {

    //set scrolled flag
    var didScroll = false;
    var lastScrollTop = 0;
    var scrollDirection = 'DOWN';
    
    // On scroll, update the scroll flag and calculate direction
    document.querySelector('#body-wrap').addEventListener(
      'scroll',
      (evt) => {
        didScroll = true;
      },
      {
        capture: true,
        passive: true,
      }
    );
    
    // Function to handle scroll direction and sticky header logic
    function stickyHeader() {
      setInterval(function () {
        if (didScroll) {
          didScroll = false;
    
          // Get the current scroll position
          var scrollAmount = document.querySelector('#body-wrap').scrollTop;
    
          // Detect scroll direction
          if (scrollAmount > lastScrollTop) {
            scrollDirection = 'DOWN';
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
          } else if (scrollAmount < lastScrollTop) {
            scrollDirection = 'UP';
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
          }
          lastScrollTop = scrollAmount <= 0 ? 0 : scrollAmount; // Ensure no negative scroll values
    
          // Handle sticky header logic
          if (scrollAmount >= document.querySelector('#body-wrap').offsetHeight / 1.7) {
            document.body.classList.add('scrolled');
            if (document.querySelector('#cookieconsent')) {
              document.querySelector('#cookieconsent').classList.add('hide');
            }
          } else {
            document.body.classList.remove('scrolled');
          }
        }
      }, 250);
    }
    
    // Initialize sticky header handling
    stickyHeader();
});