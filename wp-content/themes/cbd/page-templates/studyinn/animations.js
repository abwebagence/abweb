// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

// Math Functions
const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

/**
 * Main JS
 */
/**
 * 3D Setup
 */
// ----------------------------------------------------------------
// Canvas
const canvas = document.querySelector(".webgl")

// Scene
const scene = new THREE.Scene()

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(ambientLight)
scene.add(directionalLight)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

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

// 3D Cursor Follower
const cursorBoxMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xf1f1f1),
  flatShading: true,
})

const cursorBox1Geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
const cursorBox1Edges = new THREE.EdgesGeometry(cursorBox1Geometry)
const cursorBox1Lines = new THREE.LineSegments(
  cursorBox1Edges,
  new THREE.LineBasicMaterial({ color: 0xbb2525 })
)
// scene.add(cursorBox1Lines)

const cursorBox2Geometry = new THREE.BoxGeometry(0.025, 0.025, 0.025)
const cursorBox2 = new THREE.Mesh(cursorBox2Geometry, cursorBoxMaterial)
// scene.add(cursorBox2)

/**
 * Renderer Setup
 */
// ----------------------------------------------------------------

// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, 0, 1.5)
scene.add(camera)

// Controls
// const controls = new THREE.OrbitControls(camera, canvas)

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
 * Animations
 */

// Text Reveal Animations
const spansArray = []

// Text Convert Function
const convertToTextReveal = (qs, index) => {
  const text = document.querySelector(qs)
  spansArray[index] = []

  // Letters Array
  const lettersArray = text.innerText

  // Clear Text
  text.innerText = ""

  for (let i = 0; i < lettersArray.length; i++) {
    const letterSpan = document.createElement("div")
    letterSpan.classList.add("letterRevealSpan")
    text.appendChild(letterSpan)

    const letter = document.createElement("div")
    letter.classList.add("letterRevealDiv")

    if (lettersArray[i] == " ") {
      letter.classList.add("letterRevealDivSpace")
    }

    letter.innerText = lettersArray[i]

    letterSpan.appendChild(letter)

    spansArray[index][i] = letter

    gsap.to(letter, { duration: 0, y: 50, opacity: 0 })
  }
}

convertToTextReveal(".logoSub1", 0)
convertToTextReveal(".logoSub2", 1)

// Text Reveal Function
const textReveal = (index) => {
  const text = spansArray[index]

  for (let i = 0; i < text.length; i++) {
    gsap.to(text[i], { duration: 0.4, delay: 0.05 * i, opacity: 1 })
    gsap.to(text[i], { duration: 0.5, delay: 0.05 * i, y: 0, ease: "back" })
  }
}

setTimeout(() => {
  textReveal(0)
}, 2000)
setTimeout(() => {
  textReveal(1)
}, 4000)

// Logo Animations
const logoSplits = document.querySelectorAll(".logoSplit")

// Logo Start Animations
let isLogoSplitActive = false

for (let i = 0; i < logoSplits.length; i++) {
  gsap.fromTo(
    logoSplits[i],
    { scale: 0.5 },
    {
      duration: 1,
      delay: 3.5 + i * 0.2,
      scale: 1,
      ease: "Power1.easeOut",
    }
  )
}

setTimeout(() => {
  isLogoSplitActive = true
}, 4250)

// Mouse Event Listeners Function
const raycaster = new THREE.Raycaster()
const pointer = {
  x: 0,
  y: 0,
}

// Raycaster Mesh
const raycasterMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial()
)

const pointerMoveEvents = () => {
  // Not Mobile
  if (window.innerWidth > 900) {
    // Pointer Events
    document.addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

      // Raycaster
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects([raycasterMesh])
      if (intersects.length > 0) {
        gsap.to(cursorBox1Lines.position, {
          duration: 0.25,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
        })

        gsap.to(cursorBox2.position, {
          duration: 0.5,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
        })
      }

      // Logo Animations
      // Logo Splits
      if (isLogoSplitActive == true) {
        for (let i = 0; i < logoSplits.length; i++) {
          gsap.to(logoSplits[3 - i], {
            duration: 1,
            x: -pointer.x * 20 * i,
            y: pointer.y * 20 * i,
            ease: "Power2.easeOut",
          })
        }

        // Logo Perspective
        gsap.to(".perspectiveInner", {
          duration: 1,
          rotateY: 30 * pointer.x,
          rotateX: 30 * pointer.y,
          ease: "Power2.easeOut",
        })

        // Perspective Outer
        gsap.to(".perspectiveOuter", {
          duration: 1,
          x: pointer.x * window.innerWidth * 0.1,
          y: -pointer.y * window.innerHeight * 0.1,
          ease: "none",
        })
      }

      // Cursor Follower
      gsap.to(".cursorFollower1", {
        duration: 0.1,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower2", {
        duration: 0.2,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower3", {
        duration: 0.3,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower4", {
        duration: 0.4,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      // Perspective Banner
      gsap.to(".bannerPerspectiveInner", {
        duration: 1,
        rotateY: -3 * pointer.x,
        rotateX: -3 * pointer.y,
        ease: "Power2.easeOut",
      })
    })
  }

  // Mobile Changes
  else {
    // Pointer Events - Mobile
    document.addEventListener("touchmove", (e) => {
      pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

      // Raycaster
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects([raycasterMesh])
      if (intersects.length > 0) {
        gsap.to(cursorBox1Lines.position, {
          duration: 0.25,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
        })

        gsap.to(cursorBox2.position, {
          duration: 0.5,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
        })
      }

      // Logo Animations
      // Logo Splits
      if (isLogoSplitActive == true) {
        for (let i = 0; i < logoSplits.length; i++) {
          gsap.to(logoSplits[3 - i], {
            duration: 1,
            x: -pointer.x * 20 * i,
            y: pointer.y * 20 * i,
            ease: "Power2.easeOut",
          })
        }

        // Logo Perspective
        gsap.to(".perspectiveInner", {
          duration: 1,
          rotateY: 30 * pointer.x,
          rotateX: 30 * pointer.y,
          ease: "Power2.easeOut",
        })

        // Perspective Outer
        gsap.to(".perspectiveOuter", {
          duration: 1,
          x: pointer.x * window.innerWidth * 0.1,
          y: -pointer.y * window.innerHeight * 0.1,
          ease: "none",
        })
      }

      // Cursor Follower
      gsap.to(".cursorFollower1", {
        duration: 0.1,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower2", {
        duration: 0.2,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower3", {
        duration: 0.3,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      gsap.to(".cursorFollower4", {
        duration: 0.4,
        x: (pointer.x * window.innerWidth) / 2,
        y: (-pointer.y * window.innerHeight) / 2,
        ease: "none",
      })

      // Perspective Banner
      gsap.to(".bannerPerspectiveInner", {
        duration: 1,
        rotateY: 3 * pointer.x,
        rotateX: 3 * pointer.y,
        ease: "Power2.easeOut",
      })
    })
  }
}

pointerMoveEvents()

// Cursor Follower Events
const cursorPointers = document.querySelectorAll(".cursorPointer")

gsap.to(".cursorFollower2", { duration: 0, delay: 0, scale: 1.2 })
gsap.to(".cursorFollower3", { duration: 0, delay: 0, scale: 1.4 })
gsap.to(".cursorFollower4", { duration: 0, delay: 0, scale: 1.6 })

for (let i = 0; i < cursorPointers.length; i++) {
  cursorPointers[i].addEventListener("pointerenter", () => {
    gsap.to(".cursorFollower1", {
      duration: 0.4,
      delay: 0,
      scale: 1.5,
      opacity: 0,
    })
    gsap.to(".cursorFollower2", { duration: 0.4, delay: 0.1, scale: 2.2 })
    gsap.to(".cursorFollower3", { duration: 0.4, delay: 0.2, scale: 2.4 })
    gsap.to(".cursorFollower4", { duration: 0.4, delay: 0.3, scale: 2.6 })
  })

  cursorPointers[i].addEventListener("pointerleave", () => {
    gsap.to(".cursorFollower1", {
      duration: 0.4,
      delay: 0,
      scale: 1,
      opacity: 0.5,
    })
    gsap.to(".cursorFollower2", { duration: 0.4, delay: 0.1, scale: 1.2 })
    gsap.to(".cursorFollower3", { duration: 0.4, delay: 0.2, scale: 1.4 })
    gsap.to(".cursorFollower4", { duration: 0.4, delay: 0.3, scale: 1.6 })
  })
}

// Parallax Photo Events
// const parallaxPhotos = document.querySelectorAll(".parallaxPhoto")

// for (let i = 0; i < parallaxPhotos.length; i++) {
//   parallaxPhotos[i].addEventListener("pointerenter", () => {
//     gsap.to(parallaxPhotos[i], { duration: 0.4, scale: 1.5, ease: "back" })
//   })

//   parallaxPhotos[i].addEventListener("pointerleave", () => {
//     gsap.to(parallaxPhotos[i], { duration: 0.4, scale: 1, ease: "back" })
//   })
// }

/**
 * Animate
 */
// ----------------------------------------------------------------
let elapsedTime
const clock = new THREE.Clock()

const tick = () => {
  elapsedTime = clock.getElapsedTime()

  // Cursor Box Rotation
  cursorBox1Lines.rotation.set(elapsedTime, elapsedTime, elapsedTime)
  cursorBox2.rotation.set(elapsedTime, elapsedTime, elapsedTime)

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
