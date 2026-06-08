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
const canvas = document.querySelector(".webgl")

// Scene
const scene = new THREE.Scene()

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
const directionalLight = new THREE.PointLight(0xffffff, 1)
scene.add(ambientLight)
// scene.add(directionalLight)

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

  imageData.size.w = (logoDOM.clientWidth * visibleSizes.width) / sizes.width
  imageData.size.h =
    (logoDOM.clientHeight * visibleSizes.height) / sizes.height

  imageData.position.x =
    -visibleSizes.width / 2 +
    (logoDOM.getBoundingClientRect().left * visibleSizes.width) /
      sizes.width +
    imageData.size.w / 2
  imageData.position.y = -(
    -visibleSizes.height / 2 +
    ((logoDOM.getBoundingClientRect().top + document.querySelector('#body-wrap').scrollTop) * visibleSizes.height) /
      sizes.height +
    imageData.size.h / 2
  )

  logo.scale.set(imageData.size.w, imageData.size.h, 1)
  logoGroup.position.x = imageData.position.x
  logoGroup.position.y = imageData.position.y

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
const logoTexture = textureLoader.load(
  "https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/avecoeur/avecoeur/logo.png"
)

/**
 * 3D Objects
 */
// ----------------------------------------------------------------

// Logo Group
const logoGroup = new THREE.Group()
scene.add(logoGroup)

logoGroup.add(directionalLight)
directionalLight.position.z = 5

// Logo
const logoG = new THREE.PlaneGeometry(1,1,32,32)
const logoM = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true
})
const logo = new THREE.Mesh(logoG, logoM)
const logoDOM = document.querySelector('.logo.logoImage')

const imageData = { size: { w: 0, h: 0 }, position: { x: 0, y: 0 } }

imageData.size.w = (logoDOM.clientWidth * visibleSizes.width) / sizes.width
imageData.size.h =
  (logoDOM.clientHeight * visibleSizes.height) / sizes.height

imageData.position.x =
  -visibleSizes.width / 2 +
  (logoDOM.getBoundingClientRect().left * visibleSizes.width) /
    sizes.width +
  imageData.size.w / 2
imageData.position.y = -(
  -visibleSizes.height / 2 +
  ((logoDOM.getBoundingClientRect().top + document.querySelector('#body-wrap').scrollTop) * visibleSizes.height) /
    sizes.height +
  imageData.size.h / 2
)

logo.scale.set(imageData.size.w, imageData.size.h, 1)
logoGroup.position.x = imageData.position.x
logoGroup.position.y = imageData.position.y

logoGroup.add(logo)


// Planes
const planeSize = 16
const flagPlanes = new THREE.Group()
logoGroup.add(flagPlanes)
// Plane 1
const plane1Scale = 0.15
const plane1G = new THREE.PlaneGeometry(
  0.1,
  0.6 + (Math.random() - 0.5) * 0.4,
  planeSize,
  planeSize
)
const plane1M = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0x002654),
  // wireframe: true,
  side: THREE.DoubleSide,
  roughness: 0,
  metalness: 0.7,
  opacity: 0.75,
  transparent: true
})
const plane1 = new THREE.Mesh(plane1G, plane1M)
const plane1Group = new THREE.Group()
flagPlanes.add(plane1Group)

const plane1Position = plane1.geometry.getAttribute("position")

for (let i = 0; i < plane1Position.count; i++) {
  const x = plane1Position.array[i * 3 + 0] - 0.2
  const y = plane1Position.array[i * 3 + 1]
  const z = (0.5 ** 2 - y ** 2) ** 0.5

  plane1Position.setXYZ(i, x, y, z)
}

plane1Group.scale.set(plane1Scale, plane1Scale, plane1Scale)
plane1Group.add(plane1)
const plane1RotationDirection = Math.random()
let plane1Rotation = Math.random() * 0.25 + 1.25
if (plane1RotationDirection < 0.5) {
  plane1Rotation *= -1
}

// Plane 2
const plane2Scale = 0.15
const plane2G = new THREE.PlaneGeometry(
  0.1,
  0.6 + (Math.random() - 0.5) * 0.4,
  planeSize,
  planeSize
)
const plane2M = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xffffff),
  // wireframe: true,
  side: THREE.DoubleSide,
  roughness: 0,
  metalness: 0.7,
  opacity: 0.75,
  transparent: true
})
const plane2 = new THREE.Mesh(plane2G, plane2M)
const plane2Group = new THREE.Group()
flagPlanes.add(plane2Group)

const plane2Position = plane2.geometry.getAttribute("position")

for (let i = 0; i < plane2Position.count; i++) {
  const x = plane2Position.array[i * 3 + 0]
  const y = plane2Position.array[i * 3 + 1]
  const z = (0.5 ** 2 - y ** 2) ** 0.5

  plane2Position.setXYZ(i, x, y, z)
}

plane2Group.scale.set(plane2Scale, plane2Scale, plane2Scale)
plane2Group.add(plane2)
const plane2RotationDirection = Math.random()
let plane2Rotation = Math.random() * 0.25 + 1.25
if (plane2RotationDirection < 0.5) {
  plane2Rotation *= -1
}

// Plane 3
const plane3Scale = 0.15
const plane3G = new THREE.PlaneGeometry(
  0.1,
  0.6 + (Math.random() - 0.5) * 0.4,
  planeSize,
  planeSize
)
const plane3M = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xed2939),
  // wireframe: true,
  side: THREE.DoubleSide,
  roughness: 0,
  metalness: 0.7,
  opacity: 0.75,
  transparent: true
})
const plane3 = new THREE.Mesh(plane3G, plane3M)
const plane3Group = new THREE.Group()
flagPlanes.add(plane3Group)

const plane3Position = plane3.geometry.getAttribute("position")

for (let i = 0; i < plane3Position.count; i++) {
  const x = plane3Position.array[i * 3 + 0] + 0.2
  const y = plane3Position.array[i * 3 + 1]
  const z = (0.5 ** 2 - y ** 2) ** 0.5

  plane3Position.setXYZ(i, x, y, z)
}

plane3Group.scale.set(plane3Scale, plane3Scale, plane3Scale)
plane3Group.add(plane3)
const plane3RotationDirection = Math.random()
let plane3Rotation = Math.random() * 0.25 + 1.25
if (plane3RotationDirection < 0.5) {
  plane3Rotation *= -1
}

flagPlanes.rotation.y = Math.PI/4

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

      gsap.to(flagPlanes.rotation, {duration: 1, y: pointer.x * Math.PI/12 + Math.PI/3, x: pointer.y * Math.PI/12})
      // gsap.to(logo.rotation, {duration: 1, y: pointer.x * Math.PI/90, x: pointer.y * Math.PI/90})
      // gsap.to(logo.position, {duration: 1, x: pointer.x * 0.0025, y: pointer.y * 0.0025})
    })
  }

  // Mobile Changes
  else {
    // Pointer Events - Mobile
    document.addEventListener("touchmove", (e) => {
      pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

      gsap.to(flagPlanes.rotation, {duration: 1, y: pointer.x * Math.PI/12 + Math.PI/3, x: pointer.y * Math.PI/12})
      // gsap.to(logo.rotation, {duration: 1, y: pointer.x * Math.PI/90, x: pointer.y * Math.PI/90})
      // gsap.to(logo.position, {duration: 1, x: pointer.x * 0.0025, y: pointer.y * 0.0025})
    })
  }
}

pointerMoveEvents()

// Startup Animations
const rotationSpeedFactor1 = {
  value: 0.25
}
const rotationSpeedFactor2 = {
  value: 0.25
}
const rotationSpeedFactor3 = {
  value: 0.25
}

const startupAnimations = () => {
  console.log('start')
  gsap.to(logo.material, {duration: 0.5, delay: 0, opacity: 1, ease: 'Power1.easeOut'})
  gsap.to(plane1Group.scale, {duration: 0.5, delay: 0.5, x: plane1Scale, y: plane1Scale, z: plane1Scale, ease: 'Power1.easeOut'})
  gsap.to(rotationSpeedFactor1, {duration: 0.5, delay: 0.5, value: 0.025, ease: 'Power1.easeOut'})
  gsap.to(plane2Group.scale, {duration: 0.5, delay: 0.75, x: plane1Scale, y: plane1Scale, z: plane1Scale, ease: 'Power1.easeOut'})
  gsap.to(rotationSpeedFactor2, {duration: 0.5, delay: 0.75, value: 0.025, ease: 'Power1.easeOut'})
  gsap.to(plane3Group.scale, {duration: 0.5, delay: 1, x: plane1Scale, y: plane1Scale, z: plane1Scale, ease: 'Power1.easeOut'})
  gsap.to(rotationSpeedFactor3, {duration: 0.5, delay: 1, value: 0.025, ease: 'Power1.easeOut'})
}

plane1Group.scale.set(0, 0, 0)
plane2Group.scale.set(0, 0, 0)
plane3Group.scale.set(0, 0, 0)
logo.material.opacity = 0

window.addEventListener('load', () => {
  startupAnimations()
})

/**
 * Animate
 */
// ----------------------------------------------------------------

let elapsedTime
const clock = new THREE.Clock()

const tick = () => {
  elapsedTime = clock.getElapsedTime()

  // Plane Rotations
  plane1.rotation.x += plane1Rotation * plane1RotationDirection * rotationSpeedFactor1.value
  plane2.rotation.x += plane2Rotation * plane2RotationDirection * rotationSpeedFactor2.value
  plane3.rotation.x += plane3Rotation * plane3RotationDirection * rotationSpeedFactor3.value

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

// ScrollTriggers
// gsap.fromTo(
//   flagPlanes.rotation,
//   { x: 0, y: 0, z: -Math.PI / 4 },
//   {
//     scrollTrigger: {
//       scroller: "#body-wrap",
//       trigger: ".startSection",
//       start: () => window.innerHeight * 0 + " bottom",
//       toggleActions: "play none none reverse",
//       // scrub: 1,
//       // markers: true,
//     },
//     duration: 3,
//     x: Math.PI,
//     y: Math.PI,
//     z: -Math.PI / 4 + Math.PI,
//     ease: "Power1.easeInOut",
//   }
// )