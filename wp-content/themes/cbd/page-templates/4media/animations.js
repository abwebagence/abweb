gsap.registerPlugin(ScrollTrigger)
const vertexShader=`
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vPosition;

    float random(vec2 co){
        return 2. * fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        vPosition = position;

        vPosition.z += sin(uv.y * 576. / 433. + uTime * 1.5) * 0.01;
        vPosition.z += sin(uv.x * 5. + uTime * 1.5) * 0.01;

        vec4 mvPosition = modelViewMatrix * vec4( vPosition, 1.0 );
        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;
    }
`
const fragmentShader=`
    uniform sampler2D uTexture;
    uniform sampler2D uColor;
    uniform float uOpacity;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vec4 textureColor = texture2D(uColor, vUv);
        vec4 texture = texture2D(uTexture, vUv);
        gl_FragColor = vec4(textureColor.rgb * max((vPosition.z/0.01 + 0.5), 0.9), uOpacity * texture.a);
    }
`
const lerp=(a,b,n)=>{return(1-n)*a+n*b}
const parameters={gap:0.45,bobAmplitude:0.05,margin:0.05,}
const canvas=document.querySelector(".webgl")
const scene=new THREE.Scene()
const ambientLight=new THREE.AmbientLight(0xffffff,0.5)
const directionalLight=new THREE.DirectionalLight(0xffffff,1)
scene.add(ambientLight)
scene.add(directionalLight)
directionalLight.position.z=1
const sizes={width:window.innerWidth,height:window.innerHeight,}
window.addEventListener("resize",()=>{sizes.width=window.innerWidth
sizes.height=window.innerHeight
camera.aspect=sizes.width/sizes.height
camera.updateProjectionMatrix()
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))})
const camera=new THREE.PerspectiveCamera(20,sizes.width/sizes.height,0.1,100)
camera.position.set(0,0,1.5)
const cameraGroup=new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)
const visibleSizes={width:0,height:0,}
const depth=camera.position.z
const vFOV=(camera.fov*Math.PI)/180
visibleSizes.height=2*Math.tan(vFOV/2)*Math.abs(depth)
visibleSizes.width=(visibleSizes.height*sizes.width)/sizes.height
const textureLoader=new THREE.TextureLoader()
const fourBlendTexture=textureLoader.load("https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/4media/4Mask.png") 
const colorsTexture=textureLoader.load("https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/4media/colorsTexture.jpeg")
const objects=new THREE.Group()
scene.add(objects)
const four=new THREE.Group()
objects.add(four)
four.position.z=0
const fourBlendGeometry=new THREE.PlaneGeometry(0.18*visibleSizes.width,(0.18*visibleSizes.width*576)/433,64,64)
let fourOpacity={value:0}
const fourBlendMaterial=new THREE.ShaderMaterial({uniforms:{uTexture:{value:fourBlendTexture},uColor:{value:colorsTexture},uTime:{value:0},uOpacity:{value:fourOpacity.value},},vertexShader:vertexShader,fragmentShader:fragmentShader,transparent:true,})
const fourBlend=new THREE.Mesh(fourBlendGeometry,fourBlendMaterial)
four.add(fourBlend)
const colorsGeometry=new THREE.PlaneGeometry((((0.15*576)/433)*840)/280,(0.15*576)/433,64,64)
const colorsMaterial=new THREE.MeshBasicMaterial({map:colorsTexture,transparent:true,blending:THREE.MultiplyBlending,})
const colorsBlend=new THREE.Mesh(colorsGeometry,colorsMaterial)
colorsBlend.position.z=0.05
const circles=new THREE.Group()
objects.add(circles)
const circle1Geometry=new THREE.CircleGeometry(0.015*visibleSizes.width,64)
const circle1Material=new THREE.MeshStandardMaterial({color:new THREE.Color(0x6bc7c8),side:THREE.DoubleSide,})
const circle1=new THREE.Mesh(circle1Geometry,circle1Material)
circles.add(circle1)
const circle2Geometry=new THREE.CircleGeometry(0.015*visibleSizes.width,64)
const circle2Material=new THREE.MeshStandardMaterial({color:new THREE.Color(0x00b4e0),side:THREE.DoubleSide,})
const circle2=new THREE.Mesh(circle2Geometry,circle2Material)
circles.add(circle2)
const circle3Geometry=new THREE.CircleGeometry(0.015*visibleSizes.width,64)
const circle3Material=new THREE.MeshStandardMaterial({color:new THREE.Color(0x1f4494),side:THREE.DoubleSide,})
const circle3=new THREE.Mesh(circle3Geometry,circle3Material)
circles.add(circle3)
const circle4Geometry=new THREE.CircleGeometry(0.015*visibleSizes.width,64)
const circle4Material=new THREE.MeshStandardMaterial({color:new THREE.Color(0xd45180),side:THREE.DoubleSide,})
const circle4=new THREE.Mesh(circle4Geometry,circle4Material)
circles.add(circle4)
objects.position.x=visibleSizes.width/2-
(0.25*visibleSizes.width)/2-
0.1*visibleSizes.width
const renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled=false
renderer.shadowMap.type=THREE.PCFSoftShadowMap
const raycaster=new THREE.Raycaster()
const pointer={x:0,y:0,}
const raycasterMesh=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshBasicMaterial())
const pointerMoveEvents=()=>{if(window.innerWidth>900){document.addEventListener("pointermove",(e)=>{pointer.x=(e.clientX/window.innerWidth)*2-1
pointer.y=-(e.clientY/window.innerHeight)*2+1
gsap.to(colorsBlend.position,{duration:0.5,x:(pointer.x*((((0.15*576)/433)*840)/280-0.15))/2,})
gsap.to(objects.rotation,{duration:0.5,y:(pointer.x*Math.PI)/24,x:-(pointer.y*Math.PI)/24,})
raycaster.setFromCamera(pointer,camera)
const intersects=raycaster.intersectObjects([raycasterMesh])
if(intersects.length>0){}
gsap.to(".cursorFollower",{duration:0.1,x:(pointer.x*window.innerWidth)/2,y:-(pointer.y*window.innerHeight)/2,})})}
else{document.addEventListener("touchmove",(e)=>{pointer.x=(e.touches[0].clientX/window.innerWidth)*2-1
pointer.y=-(e.touches[0].clientY/window.innerHeight)*2+1
gsap.to(colorsBlend.position,{duration:0.5,x:(pointer.x*((((0.1*576)/433)*840)/280-0.15))/2,})
gsap.to(objects.rotation,{duration:0.5,y:(pointer.x*Math.PI)/24,x:-(pointer.y*Math.PI)/24,})
raycaster.setFromCamera(pointer,camera)
const intersects=raycaster.intersectObjects([raycasterMesh])
if(intersects.length>0){}})}}
pointerMoveEvents()
gsap.to(".circleFollowerPlacer2",{duration:0,rotateZ:90})
gsap.to(".circleFollowerPlacer3",{duration:0,rotateZ:180})
gsap.to(".circleFollowerPlacer4",{duration:0,rotateZ:270})
const cursorActivates=document.querySelectorAll(".cursorActivate")
for(let i=0;i<cursorActivates.length;i++){cursorActivates[i].addEventListener("pointerenter",()=>{gsap.to(".circleFollowerPlacer1",{duration:0.5,scale:2})
gsap.to(".circleFollowerPlacer2",{duration:0.5,scale:2})
gsap.to(".circleFollowerPlacer3",{duration:0.5,scale:2})
gsap.to(".circleFollowerPlacer4",{duration:0.5,scale:2})})
cursorActivates[i].addEventListener("pointerleave",()=>{gsap.to(".circleFollowerPlacer1",{duration:0.5,scale:1})
gsap.to(".circleFollowerPlacer2",{duration:0.5,scale:1})
gsap.to(".circleFollowerPlacer3",{duration:0.5,scale:1})
gsap.to(".circleFollowerPlacer4",{duration:0.5,scale:1})})}
gsap.to(".heroLogo",{duration:0,delay:0,opacity:0,y:20})
gsap.to(".heroText",{duration:0,delay:0,opacity:0,y:20})
gsap.to("#colorDot1",{duration:0,x:-document.querySelector("#colorDot1").clientWidth,})
gsap.to("#colorDot2",{duration:0,y:-document.querySelector("#colorDot1").clientWidth,})
gsap.to("#colorDot3",{duration:0,x:document.querySelector("#colorDot1").clientWidth,})
gsap.to("#colorDot4",{duration:0,y:document.querySelector("#colorDot1").clientWidth,})
const startAnimations=()=>{gsap.to(".heroLogo",{duration:0.5,delay:0.5,opacity:1,y:0})
gsap.to("#colorDot1",{duration:0.25,delay:3.5,x:0})
gsap.to("#colorDot2",{duration:0.25,delay:3.75,y:0})
gsap.to("#colorDot3",{duration:0.25,delay:4,x:0})
gsap.to("#colorDot4",{duration:0.25,delay:4.25,y:0})
gsap.to(".heroText",{duration:1,delay:3.75,opacity:1,y:0})
gsap.to(circle1.position,{duration:0.4,delay:0.3,x:-0.16*visibleSizes.width,y:0.16*visibleSizes.width,ease:"back",})
gsap.to(circle2.position,{duration:0.4,delay:0.4,x:0.16*visibleSizes.width,y:0.16*visibleSizes.width,ease:"back",})
gsap.to(circle3.position,{duration:0.4,delay:0.5,x:-0.16*visibleSizes.width,y:-0.16*visibleSizes.width,ease:"back",})
gsap.to(circle4.position,{duration:0.4,delay:0.6,x:0.16*visibleSizes.width,y:-0.16*visibleSizes.width,ease:"back",})
gsap.to(fourOpacity,{duration:1,delay:0.5,value:1,ease:"back",})}
let elapsedTime
const clock=new THREE.Clock()
const tick=()=>{elapsedTime=clock.getElapsedTime()
fourBlend.material.uniforms.uTime.value=elapsedTime
fourBlend.material.uniforms.uOpacity.value=fourOpacity.value
circles.rotation.z=elapsedTime*0.25
circle1.scale.set(0.85+Math.sin(elapsedTime)*0.1,0.85+Math.sin(elapsedTime)*0.1,0.85+Math.sin(elapsedTime)*0.1)
circle2.scale.set(0.85+Math.sin(elapsedTime+(Math.PI*2*1)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*1)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*1)/4)*0.3)
circle3.scale.set(0.85+Math.sin(elapsedTime+(Math.PI*2*2)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*2)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*2)/4)*0.3)
circle4.scale.set(0.85+Math.sin(elapsedTime+(Math.PI*2*3)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*3)/4)*0.3,0.85+Math.sin(elapsedTime+(Math.PI*2*3)/4)*0.3)
gsap.to(".circleFollowerContainer1",{duration:0,rotateZ:elapsedTime*50+" deg",})
gsap.to(".circleFollowerContainer2",{duration:0,rotateZ:elapsedTime*50+" deg",})
gsap.to(".circleFollowerContainer3",{duration:0,rotateZ:elapsedTime*50+" deg",})
gsap.to(".circleFollowerContainer4",{duration:0,rotateZ:elapsedTime*50+" deg",})
renderer.render(scene,camera)
window.requestAnimationFrame(tick)}
tick()
startAnimations()
gsap.fromTo(".cursorFollower",{scale:0},{scrollTrigger:{scroller:"#body-wrap",trigger:".startSection",start:()=>window.innerHeight*0.1+" bottom",toggleActions:"play none none reverse",},duration:1,scale:1,ease:"back",})