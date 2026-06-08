// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

/*console.log("animations.js is live")*/

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

  // Positions
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 2; x++) {
      const index = y * 2 + x
      let xPos = visibleSizes.width/2
      let rot = Math.PI / 6
      let flip = 1
      if (x == 1) {
        xPos = -(visibleSizes.width/2)
        rot = -Math.PI/6
        flip = -1
      }

      const yPos = visibleSizes.height/6 * (y - 2)

      leaves[index].position.x = xPos
      leaves[index].position.y = yPos
      leaves[index].scale.set( (0.25 + 0.09 * (4 - y) * sizes.width/1690) * flip, 0.25 + 0.09 * (4 - y) * sizes.width/1690, 1)
    }
  }

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
}

const depth = camera.position.z
const vFOV = (camera.fov * Math.PI) / 180
visibleSizes.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
visibleSizes.width = (visibleSizes.height * sizes.width) / sizes.height

// Texture Loader
const textureLoader = new THREE.TextureLoader()

/**
 * 3D Objects
 */
// ----------------------------------------------------------------

// Make Leaves
const leafTexture = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/limepark/limepark/images/sketch-2.webp')
const leaves = []
const leafCount = 10

for (let i = 0; i < leafCount; i++) {
  const leafGeometry = new THREE.PlaneGeometry(0.219,0.403,32,32)
  const leafMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: leafTexture },
      uScroll: { value: 0 },
      uIndex: {value: 0}
    },
  vertexShader: `
      uniform float uTime;
      uniform float uScroll;
      uniform float uIndex;
  
      varying vec2 vUv;
  
      float PI = 3.141592;
  
      void main() {
          vec3 newPosition = position;
  
          newPosition.x += sin(uTime * 1. + uv.y * 4. + uIndex * PI / 5.) * 0.005 * uv.y * 2.;
          // newPosition.z +=  sin(uTime * 2. + uv.y * 4. + uIndex * PI / 5.) * 0.005;

          float scroll = clamp(uScroll, -1., 1.);
          newPosition.x += uv.y * -scroll * 0.1;
  
          vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.);
  
          gl_Position = projectionMatrix * mvPosition;
  
          vUv = uv;
      }
  `,
  fragmentShader: `
      uniform sampler2D uTexture;
  
      varying vec2 vUv;
  
      void main() {
          vec4 texture = texture2D(uTexture, vUv);

          float hl = vUv.y;
          gl_FragColor = vec4(texture.rgb + 0.4 * hl, texture.a * 0.9);
      }
  `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false
  })
  leaves[i] = new THREE.Mesh(leafGeometry, leafMaterial)
  scene.add(leaves[i])
}

// Positions
for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 2; x++) {
    const index = y * 2 + x
    let xPos = visibleSizes.width/2
    let rot = Math.PI / 6 + (4-y) * (Math.PI/6)/4
    let flip = 1
    if (x == 1) {
      xPos = -(visibleSizes.width/2)
      rot = -(Math.PI / 6 + (4-y) * (Math.PI/6)/4)
      flip = -1
    }

    const yPos = visibleSizes.height/6 * (y - 2)

    leaves[index].position.x = xPos
    leaves[index].position.y = yPos
    leaves[index].rotation.z = rot
    leaves[index].scale.set( (0.25 + 0.09 * (4 - y) * sizes.width/1690) * flip, 0.25 + 0.09 * (4 - y) * sizes.width/1690, 1)
    leaves[index].material.uniforms.uIndex.value = y
  }
}

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
 * Animations
 */

// Mouse Event Listeners Function
const pointer = {
  x: 0,
  y: 0,
}

const pointerMoveEvents = () => {
  // Not Mobile
  if (window.innerWidth > 900) {
    // Pointer Events
    document.addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
  }

  // Mobile Changes
  else {
    // Pointer Events - Mobile
    document.addEventListener("touchmove", (e) => {
      pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
    })
  }
}

pointerMoveEvents()

/**
 * Animate
 */
// ----------------------------------------------------------------
// Scrolling Variables
let scrollProgress = 0
let webglScrollProgress = 0
let scrollCurrent = 0
let finalScroll = 0
let targetScroll = 0
const scrollEaseFactor = 0.05

let elapsedTime
const clock = new THREE.Clock()

const tick = () => {
  elapsedTime = clock.getElapsedTime()

  // Scroll Values
  scrollProgress = document
  .querySelector(".scrollStart")
  .getBoundingClientRect().top

  webglScrollProgress = scrollProgress / sizes.height

  // Scroll Speed
  scrollCurrent = lerp(scrollCurrent, webglScrollProgress, 0.1)
  finalScroll = (webglScrollProgress - scrollCurrent) * 2

  // Smoothen Scroll Speed
  targetScroll += scrollEaseFactor * (finalScroll - targetScroll)

    for (let i = 0; i < leaves.length; i++) {
      leaves[i].material.uniforms.uTime.value = elapsedTime
      leaves[i].material.uniforms.uScroll.value = targetScroll
    }
  
  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

// ScrollTriggers
// gsap.fromTo(
//   logoCenter.scale,
//   { x: 0.9, y: 0.9, z: 0.9 },
//   {
//     scrollTrigger: {
//       scroller: "#body-wrap",
//       trigger: ".startSection",
//       start: () => window.innerHeight * 0 + " top",
//       end: () => window.innerHeight * 1 + " top",
//       // toggleActions: "play none none reverse",
//       scrub: 1,
//       // markers: true,
//     },
//     x: 0.6,
//     y: 0.6,
//     z: 0.6,
//     ease: "none",
//   }
// )
