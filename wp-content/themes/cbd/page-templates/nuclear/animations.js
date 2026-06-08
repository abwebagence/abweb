// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

//console.log("animations.js is live")

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
const canvas = document.querySelector(".webgl")

// Scene
const scene = new THREE.Scene()

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.PointLight(0xffffff, 0.5)
scene.add(ambientLight)
const lighting = new THREE.Group()
lighting.add(directionalLight)
directionalLight.position.set(0, 5, 2)
scene.add(lighting)

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

  visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height
  visibleSizes.lightHeight = 2 * Math.tan(vFOV / 2) * Math.abs(2.5)
  visibleSizes.lightWidth =
    (visibleSizes.lightHeight * sizes.width) / sizes.height

  imageData.size.w =
    (logoBlankDiv.clientWidth * visibleSizes.width) / sizes.width
  imageData.size.h =
    (logoBlankDiv.clientHeight * visibleSizes.height) / sizes.height

  imageData.position.x =
    -visibleSizes.width / 2 +
    (logoBlankDiv.getBoundingClientRect().left * visibleSizes.width) /
      sizes.width +
    imageData.size.w / 2
  imageData.position.y = -(
    -visibleSizes.height / 2 +
    (logoBlankDiv.getBoundingClientRect().top * visibleSizes.height) /
      sizes.height +
    imageData.size.h / 2
  )

  logoGroup.position.x = imageData.position.x
  logoGroup.position.y = imageData.position.y

  logoGroup.scale.set(
    (logoBlankDiv.clientHeight / 236) * 0.6,
    (logoBlankDiv.clientHeight / 236) * 0.6,
    (logoBlankDiv.clientHeight / 236) * 0.6
  )

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

// GLTFLoader
const gltfLoader = new THREE.GLTFLoader()

/**
 * 3D Objects
 */
// ----------------------------------------------------------------

// Logo
const logoScale = 0.002

const logoGroup = new THREE.Group()
scene.add(logoGroup)

// Positions
const logoBlankDiv = document.querySelector(".logoBlankDiv")
const imageData = { size: { w: 0, h: 0 }, position: { x: 0, y: 0 } }

imageData.size.w = (logoBlankDiv.clientWidth * visibleSizes.width) / sizes.width
imageData.size.h =
  (logoBlankDiv.clientHeight * visibleSizes.height) / sizes.height

imageData.position.x =
  -visibleSizes.width / 2 +
  (logoBlankDiv.getBoundingClientRect().left * visibleSizes.width) /
    sizes.width +
  imageData.size.w / 2
imageData.position.y = -(
  -visibleSizes.height / 2 +
  (logoBlankDiv.getBoundingClientRect().top * visibleSizes.height) /
    sizes.height +
  imageData.size.h / 2
)

logoGroup.position.x = imageData.position.x
logoGroup.position.y = imageData.position.y

logoGroup.scale.set(
  (logoBlankDiv.clientHeight / 236) * 0.6,
  (logoBlankDiv.clientHeight / 236) * 0.6,
  (logoBlankDiv.clientHeight / 236) * 0.6
)

const logoBeat = new THREE.Group()
logoGroup.add(logoBeat)

const logoCenter = new THREE.Group()
logoBeat.add(logoCenter)
logoCenter.scale.set(0.9, 0.9, 0.9)

const logoMain = new THREE.Group()
logoCenter.add(logoMain)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/nuclear/3d/LogoMain.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x4e86fb),
    })
    logoMain.add(obj.scene)
  }
)

const logoSub = new THREE.Group()
logoCenter.add(logoSub)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/nuclear/3d/LogoSub.glb",
  (obj) => {
    obj.scene.scale.set(logoScale * 1.1, logoScale * 1.1, logoScale * 0.8)
    obj.scene.children[0].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0049a0),
    })
    logoSub.add(obj.scene)
  }
)

const logoText = new THREE.Group()
logoCenter.add(logoText)
logoText.rotation.y = Math.PI
logoText.position.z -= 0.001

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/nuclear/3d/LogoText.glb",
  (obj) => {
    obj.scene.scale.set(logoScale * 0.1, logoScale * 0.1, logoScale * 0.5)
    obj.scene.children[0].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x39c67f),
    })
    logoText.add(obj.scene)
  }
)

const orbit1 = new THREE.Group()
logoGroup.add(orbit1)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/nuclear/3d/LogoOrbit1.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x39c67f),
    })
    obj.scene.children[1].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x39c67f),
    })
    orbit1.add(obj.scene)
  }
)

const orbit2 = new THREE.Group()
logoGroup.add(orbit2)

gltfLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/nuclear/3d/LogoOrbit2.glb",
  (obj) => {
    obj.scene.scale.set(logoScale, logoScale, logoScale)
    obj.scene.children[0].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x39c67f),
    })
    obj.scene.children[1].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x39c67f),
    })
    orbit2.add(obj.scene)
  }
)

/**
 * Renderer Setup
 */
// ----------------------------------------------------------------

// Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enabled = false
controls.enableZoom = false
controls.minPolarAngle = Math.PI / 2
controls.maxPolarAngle = Math.PI / 2

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

      gsap.to(logoCenter.rotation, {
        duration: 1,
        x: -(pointer.y * Math.PI) / 12,
        y: (pointer.x * Math.PI) / 12,
      })

      gsap.to(orbit1.rotation, {
        duration: 1,
        x: -(pointer.y * Math.PI) / 6,
        y: (pointer.x * Math.PI) / 6,
      })

      gsap.to(orbit2.rotation, {
        duration: 1,
        x: (pointer.y * Math.PI) / 6,
        y: -(pointer.x * Math.PI) / 6,
      })

      // Raycaster
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects([raycasterMesh])
      if (intersects.length > 0) {
      }
    })
  }

  // Mobile Changes
  else {
    // Pointer Events - Mobile
    document.addEventListener("touchmove", (e) => {
      pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

      gsap.to(logoCenter.rotation, {
        duration: 1,
        x: -(pointer.y * Math.PI) / 12,
        y: (pointer.x * Math.PI) / 12,
      })

      gsap.to(orbit1.rotation, {
        duration: 1,
        x: -(pointer.y * Math.PI) / 6,
        y: (pointer.x * Math.PI) / 6,
      })

      gsap.to(orbit2.rotation, {
        duration: 1,
        x: (pointer.y * Math.PI) / 6,
        y: -(pointer.x * Math.PI) / 6,
      })

      // Raycaster
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects([raycasterMesh])
      if (intersects.length > 0) {
      }
    })
  }
}

pointerMoveEvents()

// Startup Animations
const startupAnimations = () => {}

startupAnimations()

// Hover Events
// document.querySelector(".switchOuter").addEventListener("pointerenter", () => {
//   gsap.to(logoBeat.rotation, { duration: 1, y: Math.PI, ease: "back" })
// })
// document.querySelector(".switchOuter").addEventListener("pointerleave", () => {
//   gsap.to(logoBeat.rotation, { duration: 1, y: 0, ease: "back" })
// })

/**
 * Animate
 */
// ----------------------------------------------------------------

let elapsedTime
const clock = new THREE.Clock()

const tick = () => {
  elapsedTime = clock.getElapsedTime()

  orbit1.scale.set(
    1.025 + 0.025 * Math.sin(elapsedTime),
    1.025 + 0.025 * Math.sin(elapsedTime),
    1
  )

  orbit2.scale.set(
    1.025 + 0.025 * Math.sin(elapsedTime + (Math.PI * 2) / 3),
    1.025 + 0.025 * Math.sin(elapsedTime + (Math.PI * 2) / 3),
    1
  )

  logoBeat.scale.set(
    1.025 + 0.025 * Math.sin(elapsedTime + (Math.PI * 4) / 3),
    1.025 + 0.025 * Math.sin(elapsedTime + (Math.PI * 4) / 3),
    1
  )

//  gsap.to(".switchOuter", { duration: 0, rotateZ: elapsedTime * 30 })

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

// ScrollTriggers
gsap.fromTo(
  logoCenter.scale,
  { x: 0.9, y: 0.9, z: 0.9 },
  {
    scrollTrigger: {
      scroller: "#body-wrap",
      trigger: ".startSection",
      start: () => window.innerHeight * 0 + " top",
      end: () => window.innerHeight * 1 + " top",
      // toggleActions: "play none none reverse",
      scrub: 1,
      // markers: true,
    },
    x: 0.6,
    y: 0.6,
    z: 0.6,
    ease: "none",
  }
)



