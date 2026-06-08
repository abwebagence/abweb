import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// GSAP & ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(false)
ScrollTrigger.config({ ignoreMobileResize: true })
ScrollTrigger.normalizeScroll(false)
window.history.scrollRestoration = "manual"

// Lenis – smooth scrolling (single instance)
const lenis = new Lenis({
  duration: 1.5,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});
(function raf(t){lenis.raf(t); requestAnimationFrame(raf);})(0);

// Main code optimized for speed
const main = () => {
  // Cache common DOM elements & constants
  const w = window, d = document,
        webgl = d.querySelector(".webgl"),
        dqm = selector => d.querySelector(selector),
        sizes = { w: w.innerWidth, h: webgl.clientHeight, pw: w.innerWidth, ph: w.innerHeight },
        dpr = Math.min(w.devicePixelRatio, 2);
  
  // Create scene, camera, lighting
  const scene = new THREE.Scene(),
        ambL = new THREE.AmbientLight(0xffffff, 1),
        dirL = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(ambL); scene.add(dirL);
  dirL.position.set(0, 0, 10);
  
  // Create camera – fov 30 as given
  const cam = new THREE.PerspectiveCamera(30, sizes.w/sizes.h, 0.1, 500);
  cam.position.set(0,0,10);
  const camGrp = new THREE.Group(); camGrp.add(cam); scene.add(camGrp);
  
  // Calculate visible sizes
  const depth = cam.position.z, vFOV = (cam.fov*Math.PI)/180,
        vis = { h: 2*Math.tan(vFOV/2)*Math.abs(depth) };
  vis.w = (vis.h * sizes.w) / sizes.h;
  vis.ch = 2*Math.tan(vFOV/2)*1;
  vis.cw = (vis.ch * sizes.w) / sizes.h;
  vis.bh = 2*Math.tan(vFOV/2)*Math.abs(depth*2);
  vis.bw = (vis.bh * sizes.w) / sizes.h;
  
  // (iOS check – inline as arrow function)
  const iOS = () => ["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)
              || (navigator.userAgent.includes("Mac") && "ontouchend" in d);
  
  // Resize – update sizes, camera, renderer, and (if needed) DOM operations
  const updateResize = () => {
    const nw = w.innerWidth, nh = w.innerHeight;
    if(sizes.pw !== nw || sizes.ph < nh){
      sizes.w = nw; sizes.h = nh; sizes.pw = nw; sizes.ph = nh;
      vis.h = 2*Math.tan(vFOV/2)*Math.abs(depth);
      vis.w = (vis.h * sizes.w) / sizes.h;
      cam.aspect = sizes.w/sizes.h; cam.updateProjectionMatrix();
      renderer.setSize(sizes.w, sizes.h);
      renderer.setPixelRatio(dpr);
      // Example DOM resize for .aboutSectionRight:
      if(sizes.w>=750){
        gsap.to('.aboutSectionRight', {duration:0, height: dqm('.aboutSectionLeft').clientHeight});
      } else {
        gsap.to('.aboutSectionRight', {duration:0, height: dqm('.aboutSectionRight').clientWidth});
      }
    }
  }
  w.addEventListener("resize", updateResize);

  // Loading Manager & Asset loaders
  const loadMgr = new THREE.LoadingManager();
  let isLoaded = false;
  loadMgr.onProgress = (url,loaded,total)=>{};
  loadMgr.onLoad = () => {
    window.history.scrollRestoration = "manual";
    isLoaded = true;
    gsap.to('.loadingSection', {duration:0.5, opacity:0});
    startAnimations();
  }
  const texLdr = new THREE.TextureLoader(loadMgr);
  const cubeTexLdr = new THREE.CubeTextureLoader(loadMgr);
  const gltfLdr = new GLTFLoader(loadMgr);
  
  // Points – create group and array
  const pCount = 12, pArr = [];
  const pGrp = new THREE.Group(); scene.add(pGrp);
  const ptAlpha = texLdr.load(`${themeUri}/page-templates/nif/images/PointAlpha.png`),
        ptMap   = texLdr.load(`${themeUri}/page-templates/nif/images/PointMap.png`);
  const movePoint = pt => {
    const t = Math.random()*5+5, ft = 1;
    gsap.fromTo(pt.position,
      { x: 0, y: 0, z: Math.random()*-5-5 },
      { duration: t, x: (Math.random()-0.5)*vis.w*2, y: (Math.random()-0.5)*vis.h*2, z: Math.random()*-5-5, ease:'none' }
    );
    gsap.fromTo(pt.material, {opacity:1}, {duration:ft, delay: t-ft, opacity:0, ease:'Power1.easeOut'});
    gsap.fromTo(pt.material, {opacity:0}, {duration:ft, opacity:1, ease:'Power1.easeIn'});
    const s = Math.random()*0.5+0.25;
    gsap.fromTo(pt.material, {size: s}, {duration:t, size: s*1.5, ease:'Power1.easeIn'});
    setTimeout(()=>{ movePoint(pt) }, t*1000);
  }
  for(let i=0;i<pCount;i++){
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ alphaMap: ptAlpha, map: ptMap, transparent: true });
    const pt = new THREE.Points(geo, mat);
    pArr[i] = pt; pGrp.add(pt); movePoint(pt);
  }
  
  // Logo – one logo loaded via GLTF with a MeshStandardMaterial
  const logoGrp = new THREE.Group(); scene.add(logoGrp);
  const logo = new THREE.Group(); logoGrp.add(logo);
  const logoMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x2894F8),
    roughness: 0.5, metalness: 0.5,
    emissive: new THREE.Color(0x2894F8), emissiveIntensity: 0.5
  });
  gltfLdr.load(`${themeUri}/page-templates/nif/3d/Logo.glb`, obj=>{
    obj.scene.children[0].material = logoMat;
    obj.scene.rotation.y = Math.PI;
    obj.scene.scale.set(0.10745, 0.10745, 0.10745);
    logo.add(obj.scene);
  });
  
  // Renderer – create after scene setup for speed
  const renderer = new THREE.WebGLRenderer({ canvas: webgl, antialias: true, alpha: true });
  renderer.setSize(sizes.w, sizes.h);
  renderer.setPixelRatio(dpr);
  THREE.ColorManagement.legacyMode = false;
  renderer.outputEncoding = THREE.sRGBEncoding;
  
  // Mouse/Touch events – cache sizes; note: pointer events only run after load
  const m = { x:0, y:0 };
  const ms = 0.5;
  let touch = false;
  w.addEventListener('touchstart', e => { if(!touch){ touch=true; if(iOS()) ScrollTrigger.normalizeScroll(false); } });
  document.addEventListener("pointermove", e => {
    if(!touch && isLoaded){
      m.x = e.clientX/sizes.w - 0.5;
      m.y = -(e.clientY/sizes.h - 0.5);
      gsap.to(logoGrp.rotation, {duration:1, y: m.x*ms*0.75, x: -m.y*ms*0.75*(sizes.h/sizes.w)});
      gsap.to(pGrp.rotation, {duration:1, y: m.x*ms*0.5, x: -m.y*ms*0.5*(sizes.h/sizes.w)});
    }
  });
  w.addEventListener('touchmove', e => {
    if(touch){
      m.x = e.touches[0].clientX/sizes.w - 0.5;
      m.y = -(e.touches[0].clientY/sizes.h - 0.5);
      gsap.to(logoGrp.rotation, {duration:1, y: m.x*ms*0.75, x: -m.y*ms*0.75*(sizes.h/sizes.w)});
    }
  });
  
  // Button events (no optimization changes)
  dqm('.aboutSectionLeftHeaderButton').addEventListener('pointerenter', ()=> {
    gsap.to('.aboutSectionLeftHeaderButton', {duration:0.25, backgroundColor:'#050505'});
    gsap.to('.aboutSectionLeftHeaderButtonArrow', {duration:0.25, rotateZ:'45deg'});
  });
  dqm('.aboutSectionLeftHeaderButton').addEventListener('pointerleave', ()=> {
    gsap.to('.aboutSectionLeftHeaderButton', {duration:0.25, backgroundColor:'#0080F7'});
    gsap.to('.aboutSectionLeftHeaderButtonArrow', {duration:0.25, rotateZ:'0deg'});
  });
  dqm('.revealSectionButton').addEventListener('pointerenter', ()=> {
    gsap.to('.revealSectionButton', {duration:0.25, backgroundColor:'#050505'});
    gsap.to('.revealSectionButtonArrow', {duration:0.25, rotateZ:'45deg'});
  });
  dqm('.revealSectionButton').addEventListener('pointerleave', ()=> {
    gsap.to('.revealSectionButton', {duration:0.25, backgroundColor:'#0080F7'});
    gsap.to('.revealSectionButtonArrow', {duration:0.25, rotateZ:'0deg'});
  });
  
  // Tick – minimal render loop; scrollStartSection used for scroll trigger (if any)
  const clock = new THREE.Clock();
  const tick = () => {
    // (Any per-frame operations go here)
    renderer.setRenderTarget(null);
    renderer.render(scene, cam);
    requestAnimationFrame(tick);
  }
  
  // Text Animations – inline textSetup and animateText functions
  const txtDivs = [], tIdx = { i: 0 };
  const textSetup = (el, dir) => {
    let str = el.innerText; el.innerText = "";
    const spans = [], divs = [], con = d.createElement("span");
    con.classList.add("textAnimationClassContainer"); el.appendChild(con);
    for(let i=0; i<str.length; i++){
      divs[i] = d.createElement("span");
      divs[i].classList.add("t"+tIdx.i);
      con.appendChild(divs[i]);
      divs[i].classList.add("textAnimationClass");
      spans[i] = d.createElement("span");
      spans[i].classList.add("textAnimationClassContent");
      spans[i].innerHTML = (str[i]==' ')?'&nbsp;':str[i];
      divs[i].appendChild(spans[i]);
      if(dir=="hero"){
        gsap.to(spans[i], {duration:0, opacity:0, y:0, x:-20});
        gsap.to(divs[i], {duration:0, x:'-0.7rem'});
      } else if(dir=="down"){
        gsap.to(spans[i], {duration:0, opacity:1, y:-20, x:0});
      } else if(dir=="mini"){
        gsap.to(spans[i], {duration:0, opacity:0, y:-20, x:0});
      } else if(dir=="pump"){
        gsap.to(spans[i], {duration:0, opacity:0, y:0, x:0, scaleY:1.5});
      }
    }
    txtDivs.push(spans); tIdx.i++;
  }
  // Setup texts (as in original)
  textSetup(dqm("#textAnim1"), "hero");
  textSetup(dqm("#textAnim2"), "hero");
  textSetup(dqm("#textAnim3"), "hero");
  textSetup(dqm("#textAnim4"), "down");
  textSetup(dqm("#textAnim5"), "down");
  textSetup(dqm("#textAnim6"), "down");
  textSetup(dqm("#textAnim7"), "mini");
  textSetup(dqm("#textAnim8"), "mini");
  textSetup(dqm("#textAnim9"), "pump");
  textSetup(dqm("#textAnim10"), "mini");
  textSetup(dqm("#textAnim11"), "mini");
  textSetup(dqm("#textAnim12"), "mini");
  textSetup(dqm("#textAnim13"), "mini");
  textSetup(dqm("#textAnim14"), "hero");
  textSetup(dqm("#textAnim15"), "hero");
  const animateText = (idx, td, dir, del) => {
    const sp = txtDivs[idx];
    for(let i=0;i<sp.length;i++){
      gsap.to(sp[i], {
        duration: (dir=="hero")?0.5:(dir=="down"?0.7:(dir=="mini"||dir=="pump")?0.5:0.5),
        delay: i*td+del, y:0, x:0, opacity:1, ease:'Power1.easeOut',
        ...(dir=="pump"?{scaleY:1}:{})
      });
    }
  }
  
  // startAnimations function – unchanged logic
  const startAnimations = () => {
    gsap.fromTo(logo.rotation, {y:-Math.PI/2}, {duration:3.75, y: Math.PI*3, ease:'Power1.easeOut'});
    animateText(0,0.075,"hero",1.5);
    animateText(1,0.075,"hero",1.5+txtDivs[0].length*0.075);
    animateText(2,0.075,"hero",1.5+txtDivs[0].length*0.075+txtDivs[1].length*0.075);
    animateText(3,0.025,"down",0.5);
    animateText(4,0.025,"down",0.5);
    animateText(5,0.025,"down",0.5);
    gsap.to('.heroSectionBodyLeft',{duration:0, opacity:0, x:-15});
    gsap.to('.heroSectionBodyLeft',{duration:1, delay:1, opacity:1, x:0});
    let cw1 = dqm('#heroSectionCategoryEntryText1').clientWidth;
    gsap.to('#heroSectionCategoryEntryText1',{duration:0, width:0, marginLeft:'-1.2rem', opacity:0});
    gsap.to('#heroSectionCategoryEntryText1',{duration:0.5, delay:3, width:cw1, marginLeft:'0rem', opacity:1, ease:'Power1.easeOut'});
    gsap.fromTo('#heroSectionCategoryEntryArrow1',{x:'-2rem', y:'2rem'},{duration:0.25, delay:3.25, x:'0rem', y:'0rem', ease:'back.out'});
    gsap.fromTo('#heroSectionCategoryEntryArrow1',{x:'0rem', y:'0rem'},{duration:0.25, delay:3, x:'2rem', y:'-2rem', ease:'back.in'});
    let cw2 = dqm('#heroSectionCategoryEntryText2').clientWidth;
    gsap.to('#heroSectionCategoryEntryText2',{duration:0, width:0, marginLeft:'-1.2rem', opacity:0});
    gsap.to('#heroSectionCategoryEntryText2',{duration:0.5, delay:3.5, width:cw2, marginLeft:'0rem', opacity:1, ease:'Power1.easeOut'});
    gsap.fromTo('#heroSectionCategoryEntryArrow2',{x:'-2rem', y:'2rem'},{duration:0.25, delay:3.75, x:'0rem', y:'0rem', ease:'back.out'});
    gsap.fromTo('#heroSectionCategoryEntryArrow2',{x:'0rem', y:'0rem'},{duration:0.25, delay:3.5, x:'2rem', y:'-2rem', ease:'back.in'});
    let cw3 = dqm('#heroSectionCategoryEntryText3').clientWidth;
    gsap.to('#heroSectionCategoryEntryText3',{duration:0, width:0, marginLeft:'-1.2rem', opacity:0});
    gsap.to('#heroSectionCategoryEntryText3',{duration:0.5, delay:4, width:cw3, marginLeft:'0rem', opacity:1, ease:'Power1.easeOut'});
    gsap.fromTo('#heroSectionCategoryEntryArrow3',{x:'-2rem', y:'2rem'},{duration:0.25, delay:4.25, x:'0rem', y:'0rem', ease:'back.out'});
    gsap.fromTo('#heroSectionCategoryEntryArrow3',{x:'0rem', y:'0rem'},{duration:0.25, delay:4, x:'2rem', y:'-2rem', ease:'back.in'});
    // About Section Right Image scaling
    if(sizes.w>=750){
      gsap.to('.aboutSectionRight', {duration:0, height: dqm('.aboutSectionLeft').clientHeight});
    } else {
      gsap.to('.aboutSectionRight', {duration:0, height: dqm('.aboutSectionRight').clientWidth});
    }
    gsap.fromTo('.aboutSectionRightImage',{y:0},{
      scrollTrigger:{
        trigger:".aboutSectionRight",
        start: () => dqm('.aboutSectionRight').clientHeight*0+" bottom",
        end: () => dqm('.aboutSectionRight').clientHeight*1+" top",
        scrub:true,
      },
      y: dqm('.aboutSectionRight').clientHeight - dqm('.aboutSectionRightImage').clientHeight,
      ease:'none'
    });
    gsap.to('.aboutSectionLeftHeader',{duration:0, opacity:0, y:10});
    ScrollTrigger.create({
      trigger:'.aboutSectionLeftHeader',
      onEnter: ()=>{ gsap.to('.aboutSectionLeftHeader',{duration:0.75, delay:0.7, opacity:1, y:0, ease:'Power1.easeOut'}); },
    });
    gsap.to('.aboutSectionLeftHeaderBody',{duration:0, opacity:0, y:5});
    ScrollTrigger.create({
      trigger:'.aboutSectionLeftHeaderBody',
      onEnter: ()=>{ gsap.to('.aboutSectionLeftHeaderBody',{duration:0.75, delay:0.8, opacity:1, y:0, ease:'Power1.easeOut'}); },
    });
    gsap.to('.brandingSectionMiniHeaderIcon',{duration:0, scale:0, rotateZ:'-90deg'});
    ScrollTrigger.create({
      trigger:'.brandingSectionMiniHeader',
      onEnter: ()=>{ animateText(7,0.015,"mini",0.2); gsap.to('.brandingSectionMiniHeaderIcon',{duration:0.5, delay:0.2, scale:1, rotateZ:'0deg', ease:'Power1.easeOut'}); },
    });
    ScrollTrigger.create({
      trigger:'.brandingSectionFont',
      onEnter: ()=>{ animateText(8,0.02,"pump",0.4); },
    });
    ScrollTrigger.create({
      trigger:'.brandingSectionColors',
      onEnter: ()=>{ 
        animateText(9,0.015,"mini",0.6);
        animateText(10,0.015,"mini",0.8);
        animateText(11,0.015,"mini",1.0);
        animateText(12,0.015,"mini",1.2);
      },
    });
    gsap.fromTo('.videoSectionBackground',{scale:1.25},{
      scrollTrigger:{
        trigger:".videoSection",
        start: () => dqm('.videoSection').clientHeight*0+" bottom",
        end: () => dqm('.videoSection').clientHeight*1+" top",
        scrub:true,
      },
      scale:1, ease:'none'
    });
    gsap.fromTo('.aboutSectionRightImage',{y:0},{
      scrollTrigger:{
        trigger:".aboutSectionRight",
        start: () => dqm('.aboutSectionRight').clientHeight*0+" bottom",
        end: () => dqm('.aboutSectionRight').clientHeight*1+" top",
        scrub:true,
      },
      y: dqm('.aboutSectionRight').clientHeight - dqm('.aboutSectionRightImage').clientHeight,
      ease:'none'
    });
    gsap.fromTo('.textSectionImage',{y:-100},{
      scrollTrigger:{
        trigger:".textSection",
        start: () => dqm('.textSection').clientHeight*0+" bottom",
        end: () => dqm('.textSection').clientHeight*1+" top",
        scrub:true,
      },
      y:100, ease:'none'
    });
    // Showcase Section triggers
    const makeShow1 = () => {
      if(dqm('#mobileTexture1').clientHeight===0){ makeShow1(); }
      else { gsap.fromTo('#mobileTexture1',{y:0},{
        scrollTrigger:{
          trigger:".showcaseSection",
          start: () => dqm('.showcaseSection').clientHeight*0+" top",
          end: () => dqm('.showcaseSectionDesktop').clientHeight - dqm('#mobileTexture1').clientHeight+" top",
          scrub:true,
        },
        y: dqm('.showcaseSectionDesktop').clientHeight - dqm('#mobileTexture1').clientHeight,
        ease:'none'
      }); }
    }
    makeShow1();
    const makeShow2 = () => {
      if(dqm('#showcaseSectionDesktopImage2').clientHeight===0 && dqm('#showcaseSectionDesktopImage1').clientHeight===0){ makeShow2(); }
      else {
        if(sizes.w>=750){
          gsap.fromTo('#showcaseSectionDesktopImage1',{marginTop:0},{
            scrollTrigger:{
              trigger:".showcaseSection",
              start: () => dqm('.showcaseSection').clientHeight*0+" bottom",
              end: () => dqm('.showcaseSection').clientHeight*1+" top",
              scrub:true,
            },
            marginTop: - (dqm('#showcaseSectionDesktopImage1').clientHeight + dqm('#showcaseSectionDesktopImage2').clientHeight - dqm('.showcaseSectionDesktop').clientHeight),
            ease:'none'
          });
        }
      }
    }
    makeShow2();
    gsap.fromTo('#mobileTexture2',{y:-100},{
      scrollTrigger:{
        trigger:".mobileSection",
        start: () => dqm('.mobileSection').clientHeight*0+" bottom",
        end: () => dqm('.mobileSection').clientHeight*1+" top",
        scrub:true,
      },
      y:100, ease:'Power1.easeInOut'
    });
    gsap.fromTo('#mobileTexture3',{y:100},{
      scrollTrigger:{
        trigger:".mobileSection",
        start: () => dqm('.mobileSection').clientHeight*0+" bottom",
        end: () => dqm('.mobileSection').clientHeight*1+" top",
        scrub:true,
      },
      y:-100, ease:'Power1.easeInOut'
    });
    gsap.fromTo('#transitionSectionHalf1',{x:-sizes.w/2},{
      scrollTrigger:{
        trigger:".transitionSection",
        start: () => dqm('.transitionSection').clientHeight*0+" bottom",
        end: () => dqm('.transitionSection').clientHeight*0.5+" center",
        scrub:true,
      },
      x:0, ease:'Power1.easeOut'
    });
    gsap.fromTo('#transitionSectionHalf2',{x:sizes.w/2},{
      scrollTrigger:{
        trigger:".transitionSection",
        start: () => dqm('.transitionSection').clientHeight*0+" bottom",
        end: () => dqm('.transitionSection').clientHeight*0.5+" center",
                scrub:true,
      },
      x:0, ease:'Power1.easeOut'
    });
    let revTl = gsap.timeline();
    revTl.fromTo('.revealSectionContainer',{y:0,rotateZ:0,scale:1},{
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0+" bottom",
        end: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        scrub:true,
      },
      y:0,rotateZ:0,scale:1, ease:'Power1.easeOut'
    });
    revTl.fromTo('.revealSectionOverlayTextHeader',{y:0},{
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0+" bottom",
        end: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        scrub:true,
        onEnter: ()=>{
          animateText(13,0.015,"hero",0.4);
          animateText(14,0.015,"hero",0.4);
        }
      },
      y:0, ease:'Power1.easeOut'
    });
    revTl.fromTo('#textAnim14',{color:'#000000ff'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*0.9+" bottom",
        scrub:true,
      },
      color:'#00000000', ease:'Power3.easeIn'
    });
    revTl.fromTo('#textAnim15',{color:'#0080F7ff'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*0.9+" bottom",
        scrub:true,
      },
      color:'#0080F700', ease:'Power3.easeIn'
    });
    revTl.fromTo('.revealSectionBackground',{scale:2},{
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0+" bottom",
        end: () => dqm('.revealSection').clientHeight*1+" bottom",
        scrub:true,
      },
      scale:1, ease:'Power1.easeIn'
    });
    revTl.fromTo('.revealSectionBackground',{opacity:0},{
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1+" bottom",
        scrub:true,
      },
      opacity:1, ease:'Power3.easeIn'
    });
    revTl.fromTo('.revealSectionOverlayVisit',{opacity:0},{
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1+" bottom",
        scrub:true,
      },
      opacity:1, ease:'Power3.easeIn'
    });
    revTl.fromTo('#revealSectionBlock1',{borderRadius:'0 0 10vw 0'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1.1+" bottom",
        scrub:true,
      },
      borderRadius:'0 0 300vw 0', ease:'Power3.easeIn'
    });
    revTl.fromTo('#revealSectionBlock2',{borderRadius:'0 10vw 0 0'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1.1+" bottom",
        scrub:true,
      },
      borderRadius:'0 300vw 0 0', ease:'Power3.easeIn'
    });
    revTl.fromTo('#revealSectionBlock3',{borderRadius:'0 0 0 10vw'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1.1+" bottom",
        scrub:true,
      },
      borderRadius:'0 0 0 300vw', ease:'Power3.easeIn'
    });
    revTl.fromTo('#revealSectionBlock4',{borderRadius:'10vw 0 0 0'},{ 
      scrollTrigger:{
        trigger:".revealSection",
        start: () => dqm('.revealSection').clientHeight*0.75+" bottom",
        end: () => dqm('.revealSection').clientHeight*1.1+" bottom",
        scrub:true,
      },
      borderRadius:'300vw 0 0 0', ease:'Power3.easeIn'
    });
  }
  
  tick();
  
  // (Optional: mobile scroll trigger setup could be inlined here)
}

window.addEventListener('load', () => {
  main();
 const Scroller = {
    scrolled:0,
    direction:'DOWN',
    scroller:null,
    disableEvents:false,
    lenis:null,
    init: function(){
      const _ = this;
      _.lenis = new Lenis();
      _.lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(t=>{ _.lenis.raf(t*1000); });
      gsap.ticker.lagSmoothing(0);
      _.lenis.on('scroll',e=>{ _.handle(e); });
    },
    handle: function(e){
      const _ = this;
      _.scrolled = e?.targetScroll || window.scrollY;
      _.direction = e?.direction;
      if(_.direction===0){
        const bc = document.body.classList;
        if(bc.contains('scrolling-up')) _.direction='UP'; else if(bc.contains('scrolling-down')) _.direction='DOWN';
      } else { _.direction = _.direction===1?'DOWN':'UP'; }
      if(_.direction==='UP'){
        document.body.classList.add('scrolling-up');
        document.body.classList.remove('scrolling-down');
      } else {
        document.body.classList.add('scrolling-down');
        document.body.classList.remove('scrolling-up');
      }
      document.body.classList.toggle('viewport-scrolled', _.scrolled>window.innerHeight);
      document.body.classList.toggle('scrolled', _.scrolled>100);
      _.lastScrollPos = _.scrolled<=0?0:_.scrolled;
    },
    disable: function(){ this.lenis && this.lenis.stop(); },
    enable: function(){ this.lenis && this.lenis.start(); },
    scrollTo: function(target){
      const hh = document.querySelector('#header')?.offsetHeight||0;
      this.lenis && this.lenis.scrollTo(target,{offset:-hh});
    },
    scrollTop: function(trans){
      if(this.lenis){ this.lenis.scrollTo(0, trans?{duration:1}:{immediate:true}); window.scrollTo(0,0); }
    },
    kill: function(){ ScrollTrigger.killAll(); },
    refresh: function(){ ScrollTrigger.refresh(); }
  };
  Scroller.init();
});
