// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

console.log("animations.js is live")

// Math Functions
const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

// Parameters
const parameters = {
  gap: 1,
  bobAmplitude: 0.05,
}

/**
 * Main JS
 */
/**
 * 3D Setup
 */
// ----------------------------------------------------------------

// Canvas
const canvas = document.querySelector(".webgl.mancorp")

// Scene
const scene = new THREE.Scene()

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.PointLight(0xffffff, 1)
scene.add(ambientLight)
scene.add(directionalLight)
directionalLight.position.z = 1

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

// Base camera
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  100
)
// camera.position.set(0, 0, (1.5 * 1690) / sizes.width)
camera.position.set(0, 0, 1.5)
const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

// Visible Sizes
const visibleSizes = {
  width: 0,
  height: 0,
  lightWidth: 0,
  lightHeight: 0,
}

const depth = camera.position.z

const vFOV = (camera.fov * Math.PI) / 180

visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height
visibleSizes.lightHeight = 2 * Math.tan(vFOV / 2) * Math.abs(2.5)
visibleSizes.lightWidth =
  (visibleSizes.lightHeight * sizes.width) / sizes.height

// Texture Loader
const textureLoader = new THREE.TextureLoader()
const testTexture = textureLoader.load("https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/1.jpg")

// GLTFLoader
const gltfLoader = new THREE.GLTFLoader()

/**
 * 3D Objects
 */
// ----------------------------------------------------------------

// Materials
const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xe2ac58),
  roughness: 0,
  metalness: 0.7,
})

const copperMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xb87333),
  roughness: 0,
  metalness: 0.7,
})

const aluminumMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xf0f5fb),
  roughness: 0,
  metalness: 0.8,
})

const materials = [goldMaterial, copperMaterial, aluminumMaterial]

// Box Test
const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.02, 0.02, 0.02),
  materials[0]
)
// scene.add(box)

// Plane Test
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.5, 0.5),
  new THREE.MeshStandardMaterial({
    map: testTexture,
  })
)
// scene.add(plane)

// 3D Logo
let logoScaleMultiplier = sizes.width / 1690
if (logoScaleMultiplier < 0.5) {
  logoScaleMultiplier = 0.5
}
const logoScale = 0.002 * logoScaleMultiplier

const m1aStart = new THREE.Group()
const m1bStart = new THREE.Group()
const m1cStart = new THREE.Group()
const iStart = new THREE.Group()
const m2Start = new THREE.Group()
const aStart = new THREE.Group()
const nStart = new THREE.Group()
scene.add(m1aStart)
scene.add(m1bStart)
scene.add(m1cStart)
scene.add(iStart)
scene.add(m2Start)
scene.add(aStart)
scene.add(nStart)

const logoStart = []
logoStart[0] = m1aStart
logoStart[1] = m1bStart
logoStart[2] = m1cStart
logoStart[3] = iStart
logoStart[4] = m2Start
logoStart[5] = aStart
logoStart[6] = nStart

const m1a = new THREE.Group()
m1aStart.add(m1a)
const m1b = new THREE.Group()
m1bStart.add(m1b)
const m1c = new THREE.Group()
m1cStart.add(m1c)
const i = new THREE.Group()
iStart.add(i)
const m2 = new THREE.Group()
m2Start.add(m2)
const a = new THREE.Group()
aStart.add(a)
const n = new THREE.Group()
nStart.add(n)

const logoModels = []
logoModels[0] = m1a
logoModels[1] = m1b
logoModels[2] = m1c
logoModels[3] = i
logoModels[4] = m2
logoModels[5] = a
logoModels[6] = n

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/M1a.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    m1a.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/M1b.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    m1b.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/M1c.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    m1c.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/I.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    i.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/M2.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    m2.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/A.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    a.add(obj.scene)
  }
)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/mancorp/3d/N.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = goldMaterial
    n.add(obj.scene)
  }
)

// Random Metal
const metalCount = 12

const randomMetalsGroup = new THREE.Group()
scene.add(randomMetalsGroup)
randomMetalsGroup.position.z = camera.position.z

const randomMetals = new THREE.Group()
randomMetalsGroup.add(randomMetals)

const metalCarousels = []

for (let i = 0; i < metalCount; i++) {
  const metalGeometry = new THREE.BoxGeometry(
    (Math.random() * 1.5 + 0.2) * logoScaleMultiplier * 0.3,
    (Math.random() * 0.15 + 0.05) * logoScaleMultiplier * 0.3,
    (Math.random() * 0.1 + 0.05) * logoScaleMultiplier * 0.3
  )

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xe2ac58),
    roughness: 0,
    metalness: 0.7,
    transparent: true,
    opacity: 0.5,
  })

  const metal = new THREE.Mesh(metalGeometry, metalMaterial)

  const metalCarousel = new THREE.Group()
  metalCarousel.add(metal)

  metal.position.set(
    0,
    (Math.random() - 0.5) * visibleSizes.height,
    visibleSizes.width * 2 + Math.random() * 2
  )

  metalCarousel.rotation.y = ((Math.PI * 2) / metalCount) * i
  metalCarousels[i] = metalCarousel

  randomMetals.add(metalCarousel)
}

// Cursor Follower
const followerGeometry = new THREE.IcosahedronGeometry(0.01, 0)
const followerMaterial = new THREE.MeshStandardMaterial({
  flatShading: true,
  color: new THREE.Color(0xe2ac58),
  roughness: 0,
  metalness: 0.7,
})

const follower = new THREE.Mesh(followerGeometry, followerMaterial)
scene.add(follower)

/**
 * Renderer Setup
 */
// ----------------------------------------------------------------

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

raycasterMesh.position.z = 1

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
        gsap.to(directionalLight.position, {
          duration: 1,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
        })

        gsap.to(follower.position, {
          duration: 0.1,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          // z: 1,
        })
      }

      // for (let i = 0; i < logoStart.length; i++) {
      //   gsap.to(logoStart[i].rotation, {
      //     duration: 1 + 0.5 * i,
      //     y: -pointer.x * 0.01,
      //     x: pointer.y * 0.01,
      //   })
      // }
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
        gsap.to(directionalLight.position, {
          duration: 1,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
        })

        gsap.to(follower.position, {
          duration: 0.1,
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          // z: 1,
        })
      }

      // for (let i = 0; i < logoStart.length; i++) {
      //   gsap.to(logoStart[i].rotation, {
      //     duration: 1 + 0.5 * i,
      //     y: -pointer.x * 0.01,
      //     x: pointer.y * 0.01,
      //   })
      // }
    })
  }
}

pointerMoveEvents()

// Startup Animations
const startupAnimations = () => {
  for (let i = 0; i < logoModels.length; i++) {
    gsap.to(logoModels[i].rotation, {
      duration: 0,
      delay: 0,
      // x: Math.PI * 2,
      // y: Math.PI * 2,
      // z: Math.PI * 2,
    })

    gsap.to(logoModels[i].position, {
      duration: 1,
      delay: 0.5 + i * 0.05,
      z: 0.25,
      ease: "back",
    })

    gsap.to(logoModels[i].rotation, {
      duration: 1,
      delay: 0.5 + i * 0.05,
      x: 0,
      // y: 0,
      // z: 0,
      ease: "Power1.easeOut",
    })
  }
}

startupAnimations()

/**
 * Animate
 */
// ----------------------------------------------------------------

let elapsedTime
const clock = new THREE.Clock()

const tick = () => {
  elapsedTime = clock.getElapsedTime()

  // Metal Carousel
  randomMetals.rotation.y = elapsedTime * 0.1

  // Follower
  follower.rotation.set(
    elapsedTime * 0.35 * 2,
    elapsedTime * 0.3 * 2,
    elapsedTime * 0.325 * 2
  )

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

// ScrollTriggers
for (let i = 0; i < logoStart.length; i++) {
  gsap.fromTo(
    logoStart[i].position,
    { x: 0, y: 0, z: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",
        trigger: ".startSection",
        start: () => window.innerHeight * 0.1 + " bottom",
        // end: () =>
        //   document.querySelector(".startSection").clientHeight * 0 + " top",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // markers: true,
      },
      duration: 2,
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: 2,
      ease: "Power1.easeInOut",
    }
  )

  gsap.fromTo(
    logoStart[i].rotation,
    { x: 0, y: 0, z: 0 },
    {
      scrollTrigger: {
        scroller: "#body-wrap",
        trigger: ".startSection",
        start: () => window.innerHeight * 0.1 + " bottom",
        // end: () => document.querySelector(".startSection").clientHeight * 0 + " top",
        toggleActions: "play none none reverse",
        // scrub: 1,
        // markers: true,
      },
      duration: 2,
      x: (Math.random() - 0.5) * Math.PI,
      y: (Math.random() - 0.5) * Math.PI,
      z: (Math.random() - 0.5) * Math.PI,
      ease: "Power1.easeInOut",
    }
  )
}

gsap.fromTo(
  randomMetalsGroup.rotation,
  { x: 0 },
  {
    scrollTrigger: {
      scroller: "#body-wrap",
      trigger: ".startSection",
      start: () => window.innerHeight * 0.1 + " bottom",
      // end: () =>
      //   document.querySelector(".startSection").clientHeight * 0 + " top",
      toggleActions: "play none none reverse",
      // scrub: 1,
      // markers: true,
    },
    duration: 2,
    x: Math.PI / 2,
    ease: "Power1.easeInOut",
  }
)

gsap.fromTo(
  randomMetalsGroup.position,
  { y: 0 },
  {
    scrollTrigger: {
      scroller: "#body-wrap",
      trigger: ".startSection",
      start: () => window.innerHeight * 0.1 + " bottom",
      // end: () =>
      //   document.querySelector(".startSection").clientHeight * 0 + " top",
      toggleActions: "play none none reverse",
      // scrub: 1,
      // markers: true,
    },
    duration: 2,
    y: visibleSizes.height * 1.5,
    ease: "Power1.easeInOut",
  }
)

gsap.fromTo(
  ".mancorp-portfolio .logo",
  { opacity: 0 },
  {
    scrollTrigger: {
      scroller: "#body-wrap",
      trigger: ".startSection",
      start: () => window.innerHeight * 0.1 + " bottom",
      // end: () =>
      //   document.querySelector(".startSection").clientHeight * 0 + " top",
      toggleActions: "play none none reverse",
      // scrub: 1,
      // markers: true,
    },
    duration: 1,
    opacity: 1,
    ease: "Power1.easeInOut",
  }
)

gsap.fromTo(
  follower.scale,
  { x: 0, y: 0, z: 0 },
  {
    scrollTrigger: {
      scroller: "#body-wrap",
      trigger: ".startSection",
      start: () => window.innerHeight * 0.1 + " bottom",
      // end: () =>
      //   document.querySelector(".startSection").clientHeight * 0 + " top",
      toggleActions: "play none none reverse",
      // scrub: 1,
      // markers: true,
    },
    duration: 1.5,
    x: 1,
    y: 1,
    z: 1,
    ease: "back",
  }
)
