import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.min.js' 
gsap.registerPlugin(ScrollTrigger)

const interactiveJS = () => {
    // Clear Scroll Memory
    window.history.scrollRestoration = 'manual'

    // Canvas
        // Change '.webgl' with a canvas querySelector
    const canvas = document.querySelector('.webgl')

    // Scene
    const scene = new THREE.Scene()

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {    
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

    // Loaders
    const textureLoader = new THREE.TextureLoader()
    const cloudTexture = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/first-jets/Cloud.webp')
    const floatingImages = []
    
    floatingImages[0] = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/first-jets/floatingImage1.webp')
    floatingImages[1] = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/first-jets/floatingImage2.webp')
    floatingImages[2] = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/first-jets/floatingImage3.webp')
    floatingImages[3] = textureLoader.load('https://www.cbwebsitedesign.co.uk/wp-content/themes/cbd/page-templates/first-jets/floatingImage4.webp')

    // 3D Objects
    // ----------------------------------------------------------------

    // Make Clouds
    const cloudParameters = {
        count: 1420,
        effectRadius: 0.75,
        effectPush: 5,
        effectDuration: 0.5,
    }

    const cloud1MeshArray = []
    const cloud2MeshArray = []
    const cloudInitialPositions = []
    const cloudRotationMultiplier = []
    const cloud1Group = new THREE.Group
    const cloud2Group = new THREE.Group

    const makeClouds = () => {
        for (let i = 0; i < cloudParameters.count; i++) {
            let scale = Math.random()*1 + 0.75
            let x = 0
            let y = 0
            let z = 0

            if (i < 300) {
                x = (Math.random() - 0.5)*20
                y = (Math.random() - 0.5)*(1 + Math.abs(x)*2) * 0.1 + 4.25 - Math.abs(x) * 0.1
                z = 0
            }

            else if (i >= 300 && i < 360) {
                x = -5 + 10/(60)*(i - 299)
                y = (Math.random() - 0.5)*0.5 + 1
                z = 0
                scale = Math.random()*2 + 0.75
            }

            else {
                x = (Math.random() - 0.5)*20
                y = (Math.random() - 0.5)*9
                z = 0
            }

            const cloudMaterial = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                transparent: true,
                depthWrite: false,
                opacity: Math.random()*0.2 + 0.2
            })
            const cloudGeometry = new THREE.PlaneGeometry(1*scale,1*scale,1,1)
            const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)

            cloudInitialPositions[i] = {
                x: x,
                y: y,
                z: z
            }

            cloudRotationMultiplier[i] = (Math.random() - 0.5) * 0.1 + 0.05
            cloudMesh.position.set(x,y,z)
            cloudMesh.scale.set(Math.random()*0.5 + 1, Math.random()*0.5 + 1, 1)
            scene.add(cloudMesh)
            
            if (i < 360) {
                cloud1Group.add(cloudMesh)
                cloud1MeshArray[i] = cloudMesh
            }
            else {
                cloud2Group.add(cloudMesh)
                cloud2MeshArray[i - 360] = cloudMesh
            }
        }
    }

    makeClouds()
    scene.add(cloud1Group)
    // scene.add(cloud2Group)

    // Make Floating Images
    const floatingImagesParameters = {
        count: 4
    }

    const floatingImagesDimensions = []
    floatingImagesDimensions[0] = {
        width: 386 * 0.009 * 1,
        height: 487 * 0.009 * 1
    }
    floatingImagesDimensions[1] = {
        width: 250 * 0.009 * 1.06,
        height: 162 * 0.009 * 1.06
    }
    floatingImagesDimensions[2] = {
        width: 249 * 0.009 * 1,
        height: 316 * 0.009 * 1
    }
    floatingImagesDimensions[3] = {
        width: 195 * 0.009 * 1.03,
        height: 194 * 0.009 * 1.03
    }

    const floatingImagesPositions = [
        {x: 5.5 * 1, y: 1 * 1, z: 0.5},
        {x: -1.25 * 1.06, y: 3 * 1.06, z: -0.6},
        {x: -5.5 * 1, y: 1.25 * 1, z: 0.2},
        {x: -2.25 * 1.03, y: -2 * 1.03, z: -0.3}
    ]

    const floatingImagesBobbing = [
        (Math.random() - 0.5) + 1,
        (Math.random() - 0.5) + 1,
        (Math.random() - 0.5) + 1,
        (Math.random() - 0.5) + 1
    ]

    const floatingImagesGroup = new THREE.Group

    const makeFloatingImages = () => {
        for (let i = 0; i < floatingImagesParameters.count; i++) {
            const FIGeometry = new THREE.PlaneGeometry(floatingImagesDimensions[i].width,floatingImagesDimensions[i].height,1,1)
            const FIMaterial = new THREE.MeshBasicMaterial({
                map: floatingImages[i],
                transparent: true
            })
            const FIMesh = new THREE.Mesh(FIGeometry, FIMaterial)
            let x = floatingImagesPositions[i].x
            let y = floatingImagesPositions[i].y
            let z = floatingImagesPositions[i].z
            FIMesh.position.set(x, y, z)
            scene.add(FIMesh)
            floatingImagesGroup.add(FIMesh)
        }
    }

    makeFloatingImages()

    scene.add(floatingImagesGroup)

    // ----------------------------------------------------------------

    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0,0,10)
    scene.add(camera)

    const cameraGroup = new THREE.Group
    cameraGroup.add(camera)
    scene.add(cameraGroup)

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enabled = false

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = false

    // Animations
    // --------------------------------------

    // Hero Logo Animations
    gsap.to('#heroNameLogoImage', {duration: 0, opacity: 0, y: 30})

    const heroLogoAnimations = () => {
        gsap.to('#heroNameLogoImage', {duration: 1.5, opacity: 1, y: 0})
    }

    // Search Bar Text Animations
    let searchBarTextString = 'https://www.first-jets.com'
    let textString = ''
    let currentStringIndex = 0
    let isTextDone = false

    const searchBarText = document.querySelector('.searchBarText')
    const searchBarTextAnimations = () => {
            if (isTextDone == false) {
                textString += searchBarTextString[currentStringIndex]
                searchBarText.innerText = textString
                currentStringIndex++

                if (currentStringIndex < searchBarTextString.length) {
                setTimeout(() => {
                    searchBarTextAnimations()
                }, 100) 
                }
                else {
                    isTextDone = true
                }
            }
            
            else {
                textString = ''
                searchBarText.innerText = textString
                currentStringIndex = 0
                isTextDone = false
                searchBarTextAnimations()
            }
    }

    ScrollTrigger.create({
        scroller: "#body-wrap",
        trigger: '.showcase1Div',
        start: () =>  window.innerHeight*0.25  + ' bottom',
        onEnter: searchBarTextAnimations,
    })

    // Image Slider Columns Animations
    const imageSliderColumnsAnimations = () => {
        gsap.to('.imageSliderColumns', {duration: 0, rotation: 30})
    }

    imageSliderColumnsAnimations()

    // Create Cloud Text
    const cloudTextString = 'Flying private made simple. '
    const heroSectionText = document.querySelector('.heroSectionText')

    for (let i = 0; i < cloudTextString.length; i = i+2) {
        const t = document.createElement('t')
        t.className = 'cloudText'
        t.innerText = cloudTextString[i] + cloudTextString[i+1]
        heroSectionText.appendChild(t)
    }

    // Underline Border Animations
    gsap.to('#underlineBorder1', {duration: 0, transformOrigin: 'left', scaleX: 0})
    gsap.to('#underlineBorder2', {duration: 0, transformOrigin: 'left', scaleX: 0})

    const underlineBorderAnimations = () => {
        gsap.to('#underlineBorder1', {duration: 1.25, transformOrigin: 'left', scaleX: 1})
        gsap.to('#underlineBorder1', {duration: 1.25, delay: 1.25, transformOrigin: 'right', scaleX: 0})

        gsap.fromTo('#underlineBorder2', {scaleX: 0}, {duration: 1.25, delay: 1.25, transformOrigin: 'left', scaleX: 1})
    }

    ScrollTrigger.create({
        scroller: "#body-wrap",
        trigger: '.showcase2Div',
        start: () =>  window.innerHeight*0.2  + ' center',
        onEnter: underlineBorderAnimations,
    })

    // Events
    // --------------------------------------

    // Raycast
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector3()
    const point = new THREE.Vector3()

    // Mouse
    const mouse = {
        x: 0,
        y: 0
    }

    // Cloud Initialization
    let cloudDistance = 0
    let cloudDirection = {
        x: 0,
        y: 0
    }
    let isLoadingFinished = false
    let isMouseOnHero2 = false
    let isMouseDownOnDragScroll = false


    // Pointer Events
    document.addEventListener('pointermove', (e) => {
        // 2D
        mouse.x = e.clientX/window.innerWidth - 0.5
        mouse.y = -(e.clientY/window.innerHeight - 0.5)

        // City Move
        if (isMouseOnHero2 == true) {
            gsap.to('#hero2CityImage', {duration: 1, x: -mouse.x * window.innerWidth/2, y: mouse.y * 9, ease: 'sine.out'})
        }

        // 3D
        // Update Pointer Coordinates
        pointer.set(
            ( e.clientX / window.innerWidth ) * 2 - 1,
            - ( e.clientY / window.innerHeight ) * 2 + 1,
            0.575
        )

        // Match Mouse and 3D Pointer Coordinates
        pointer.unproject(camera)
        pointer.sub(camera.position).normalize()
        let distance = -(camera.position.z) / pointer.z
        point.copy(camera.position).add((pointer.multiplyScalar(distance)))

        // Clouds
        if (isLoadingFinished == true) {
            for (let i = 0; i < cloud1MeshArray.length; i++) {
                cloudDirection.x = cloud1MeshArray[i].position.x - pointer.x
                cloudDirection.y = cloud1MeshArray[i].position.y - pointer.y
                cloudDistance = ((cloudDirection.x)**2 + (cloudDirection.y)**2)**0.5
                if (cloudDistance <= cloudParameters.effectRadius) {
                    gsap.to(cloud1MeshArray[i].position, {duration: cloudParameters.effectDuration * 2, x: cloudDirection.x * cloudParameters.effectPush + cloud1MeshArray[i].position.x, y: cloudDirection.y * cloudParameters.effectPush + cloud1MeshArray[i].position.y})
                    gsap.to(cloud1MeshArray[i].material, {duration: cloudParameters.effectDuration * 0.8, opacity: 0})
                    gsap.to(cloud1MeshArray[i].scale, {duration: cloudParameters.effectDuration * 1.25, x: 0, y: 0})
                }
            }

        }

        if (isLoadingFinished == true) {
            for (let i = 0; i < cloud2MeshArray.length; i++) {
                cloudDirection.x = cloud2MeshArray[i].position.x - pointer.x
                cloudDirection.y = cloud2MeshArray[i].position.y - pointer.y
                cloudDistance = ((cloudDirection.x)**2 + (cloudDirection.y)**2)**0.5
                if (cloudDistance <= cloudParameters.effectRadius) {
                    gsap.to(cloud2MeshArray[i].position, {duration: cloudParameters.effectDuration * 2, x: cloudDirection.x * cloudParameters.effectPush + cloud2MeshArray[i].position.x, y: cloudDirection.y * cloudParameters.effectPush + cloud2MeshArray[i].position.y})
                    gsap.to(cloud2MeshArray[i].material, {duration: cloudParameters.effectDuration * 0.8, opacity: 0})
                    gsap.to(cloud2MeshArray[i].scale, {duration: cloudParameters.effectDuration * 1.25, x: 0, y: 0})
                }
            }

            
        }

        // Aircraft Slider Drag Scroll
        if (isMouseDownOnDragScroll == true) {
            gsap.to('.dragScroll', {duration: 1, x: mouse.x * window.innerWidth*0.5, y: -mouse.y * innerHeight*0.1})
            gsap.to('.dragScrollContent', {duration: 1, x: -mouse.x * window.innerWidth*1, y: mouse.y * innerHeight*0.25})

            if (mouse.x >= 0.15) {
                gsap.to('#lightAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftImage', {duration: 1, scale: 1, opacity: 1, ease: 'Power1.easeOut'})

                gsap.to('#lightAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftType', {duration: 0.3, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
            }
            else if (mouse.x <= -0.15) {
                gsap.to('#lightAircraftImage', {duration: 1, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})

                gsap.to('#lightAircraftType', {duration: 0.3, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
            }
            else {
                gsap.to('#lightAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftImage', {duration: 1, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})

                gsap.to('#lightAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
                gsap.to('#midAircraftType', {duration: 0.3, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
                gsap.to('#heavyAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
            }
        }
    })

    // Cloud Texts Hovers
    const cloudTexts = document.querySelectorAll('.cloudText')
    let scrollValue = {value: 0}

    for (let i = 0; i < cloudTexts.length; i++) {
        cloudTexts[i].addEventListener('mouseenter', () => {
            if (scrollValue.value < 1 && isLoadingFinished == true) {
                gsap.to(cloudTexts[i], {duration: 0.3, opacity: 1})
            }
        })
    }

    // Image Slider Hovers
    const imageSliders = document.querySelectorAll('.imageSlider')

    for (let i = 0; i < imageSliders.length; i++) {
        imageSliders[i].addEventListener('mouseenter', () => {
            gsap.to(imageSliders[i], {duration: 0.5, boxShadow: '0 0 0 1rem #dbac7a, 0 0 5rem 0.25rem #dbac7ae0', scale: 1.025})
        })
        
        imageSliders[i].addEventListener('mouseleave', () => {
            gsap.to(imageSliders[i], {duration: 0.5, boxShadow: '0 0 0 1rem #dbac7a', scale: 1})
        })
    }

    // Scroll Down Hovers
    gsap.to('.circleText', {duration: 0, scale: 0.8})
    let isScrollDownArrowAnimating = false

    document.querySelector('.scrollDownDiv').addEventListener('mouseenter', () => {
        if (isScrollDownArrowAnimating == false) {
            isScrollDownArrowAnimating = true
            
            gsap.to('.scrollDownSVGContainer', {duration: 0.2, y: 70, ease: 'Power1.easeIn'})
            gsap.to('.scrollDownSVGContainer', {duration: 0, delay: 0.225, y: -70})
            gsap.to('.scrollDownSVGContainer', {duration: 0.2, delay: 0.25, y: 0, ease: 'Power1.easeOut'})

            gsap.to('#scrollDownArrowImage', {duration: 0.2, fill: '#dbac7a', ease: 'Power1.easeIn'})

            gsap.to('.circleText', {duration: 0.3, scale: 1, ease: 'Power1.easeOut'})

            gsap.to('.circleTextSVG', {duration: 0.3, fill: '#dbac7a', ease: 'Power1.easeOut'})
            setTimeout(() => {
                isScrollDownArrowAnimating = false
            }, 450)
        }
    })

    document.querySelector('.scrollDownDiv').addEventListener('mouseleave', () => {
        gsap.to('#scrollDownArrowImage', {duration: 0.3, delay: 0.1, fill: '#ffffff', ease: 'Power1.easeOut'})

        gsap.to('.circleText', {duration: 0.3, scale: 0.8, ease: 'Power1.easeIn'})

        gsap.to('.circleTextSVG', {duration: 0.3, delay: 0.1, fill: '#ffffff', ease: 'Power1.easeOut'})
    })

document.querySelector('.scrollDownDiv').addEventListener('click', () => {
    const targetSection = document.querySelector('#heroDescriptionSection');

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Scale animation for '.circleText'
    const circleText = document.querySelector('.circleText');
    if (circleText) {
        circleText.style.transition = 'transform 0.1s';
        circleText.style.transform = 'scale(0.8)';

        setTimeout(() => {
            circleText.style.transform = 'scale(1)';
        }, 100);
    }

    // Adjust `cloud1Group.position.y` if it's part of a Three.js scene
    if (typeof cloud1Group !== 'undefined' && cloud1Group.position) {
        cloud1Group.position.y += 10; // Modify as needed
    }
});

    
    // Window Hovers
    document.querySelector('.secondHero').addEventListener('mouseenter', () => {
        isMouseOnHero2 = true
    })

    document.querySelector('.secondHero').addEventListener('mouseleave', () => {
        isMouseOnHero2 = false
    })

    // Showcase 1

    gsap.fromTo('#showcase1', {y: 100, opacity: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.showcase1Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.9 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: 0, opacity: 1,
        ease: 'none',
    })

    // Aircraft Drag Scroll Events
    gsap.to('#lightAircraftImage', {duration: 0, scale: 0.5, opacity: 0.5})
    gsap.to('#heavyAircraftImage', {duration: 0, scale: 0.5, opacity: 0.5})
    gsap.to('#lightAircraftType', {duration: 0, scale: 0.8, opacity: 0.5})
    gsap.to('#heavyAircraftType', {duration: 0, scale: 0.8, opacity: 0.5})

    let isMouseOnDragScroll = false
    document.querySelector('.dragScroll').addEventListener('mouseenter', () => {
        isMouseOnDragScroll = true
        document.body.style.cursor = 'grab'
    })
    document.querySelector('.dragScroll').addEventListener('mouseleave', () => {
        isMouseOnDragScroll = false
    })

    document.querySelector('.aircraftSlider').addEventListener('mouseleave', () => {
        gsap.to('.dragScroll', {duration: 1, x: 0, y: 0})
        gsap.to('.dragScrollContent', {duration: 1, x: 0, y: 0})
        gsap.to('#lightAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
        gsap.to('#midAircraftImage', {duration: 1, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
        gsap.to('#heavyAircraftImage', {duration: 1, scale: 0.5, opacity: 0.5, ease: 'Power1.easeOut'})
        gsap.to('#lightAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
        gsap.to('#midAircraftType', {duration: 0.3, scale: 1, opacity: 1, ease: 'Power1.easeOut'})
        gsap.to('#heavyAircraftType', {duration: 0.3, scale: 0.8, opacity: 0.5, ease: 'Power1.easeOut'})
        document.body.style.cursor = 'default'
    })

    document.addEventListener('mousedown', () => {
        if (isMouseOnDragScroll == true) {
            isMouseDownOnDragScroll = true
            document.body.style.cursor = 'grabbing'
            gsap.to('.dragScroll', {duration: 0.25, scale: 1.025})
            gsap.to('.dragScrollContent', {duration: 0.25, scale: 1/1.025})
        }
    })
    document.addEventListener('mouseup', () => {
        if (isMouseOnDragScroll == true) {
            isMouseDownOnDragScroll = false
            document.body.style.cursor = 'grab'
            gsap.to('.dragScroll', {duration: 0.25, scale: 1})
            gsap.to('.dragScrollContent', {duration: 0.25, scale: 1})
        }
    })

    // Search Bar Events

    document.querySelector('.redCircle').addEventListener('mouseenter', () => {
        gsap.to('.redCircle', {duration: 0.5, scale: 1.5})
    })

    document.querySelector('.redCircle').addEventListener('mouseleave', () => {
        gsap.to('.redCircle', {duration: 0.5, scale: 1})
    })

    document.querySelector('.whiteCircle').addEventListener('mouseenter', () => {
        gsap.to('.whiteCircle', {duration: 0.5, scale: 1.5})
    })

    document.querySelector('.whiteCircle').addEventListener('mouseleave', () => {
        gsap.to('.whiteCircle', {duration: 0.5, scale: 1})
    })

    document.querySelector('.greenCircle').addEventListener('mouseenter', () => {
        gsap.to('.greenCircle', {duration: 0.5, scale: 1.5})
    })

    document.querySelector('.greenCircle').addEventListener('mouseleave', () => {
        gsap.to('.greenCircle', {duration: 0.5, scale: 1})
    })

    // Image Highlight Events
    const imageHighlighterDivs = document.querySelectorAll('.imageHighlighterDiv')
    
    if (window.innerWidth < 720) {
       for (let i = 0; i < imageHighlighterDivs.length; i++) {
        imageHighlighterDivs[i].addEventListener('mouseenter', () => {
            gsap.to(imageHighlighterDivs[i], {duration: 0.75, width: '100vw'})
        })

        imageHighlighterDivs[i].addEventListener('mouseleave', () => {
            gsap.to(imageHighlighterDivs[i], {duration: 0.75, width: '5vw'})
        })
        }        
    }
    else {
       for (let i = 0; i < imageHighlighterDivs.length; i++) {
        imageHighlighterDivs[i].addEventListener('mouseenter', () => {
            gsap.to(imageHighlighterDivs[i], {duration: 0.75, width: '50vw'})
        })

        imageHighlighterDivs[i].addEventListener('mouseleave', () => {
            gsap.to(imageHighlighterDivs[i], {duration: 0.75, width: '9vw'})
        })
        }
    }
    


    // Animate
    // --------------------------------------
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        const delta = clock.getDelta()

        // Circle Text Rotation
        gsap.to('.circleText', {duration: 0, rotate: elapsedTime * 10})

        // Cloud Rotations
        for (let c1r = 0; c1r < cloud1MeshArray.length; c1r++) {
            cloud1MeshArray[c1r].rotation.z = elapsedTime * cloudRotationMultiplier[c1r] * 0.5
        }

        for (let c2r = 0; c2r < cloud2MeshArray.length; c2r++) {
            cloud2MeshArray[c2r].rotation.z = elapsedTime * cloudRotationMultiplier[c2r] * 0.5
        }

        // Floating Images Bobbing
        floatingImagesGroup.children[0].position.y = Math.sin(elapsedTime * floatingImagesBobbing[0]) * 0.05 * 0.5 + floatingImagesPositions[0].y
        floatingImagesGroup.children[1].position.y = Math.sin(elapsedTime * floatingImagesBobbing[1]) * 0.05 * 1.6 + floatingImagesPositions[1].y
        floatingImagesGroup.children[2].position.y = Math.sin(elapsedTime * floatingImagesBobbing[2]) * 0.05 * 0.8 + floatingImagesPositions[2].y
        floatingImagesGroup.children[3].position.y = Math.sin(elapsedTime * floatingImagesBobbing[3]) * 0.05 * 1.3 + floatingImagesPositions[3].y

        // Camera Movement
        camera.rotation.y = -mouse.x * 0.003
        camera.rotation.x = mouse.y * 0.003

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    // ScrollTriggers
    // -------------------------------------------------

    // Cloud 1

    gsap.to(cloud1Group.position, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.heroSection',
            start: () =>  window.innerHeight*1.05  + ' bottom',
            toggleActions: "play none none none",
            // snap: 1,
            // scrub: true,
            // pin: false,
            // markers: true,
        },
        duration: 1,
        y: 10,
        ease: 'none',
    })

    for (let i = 0; i < Math.floor(cloudTextString.length/2); i++) {
        gsap.to(cloudTexts[i], {
            scrollTrigger: {
                scroller: "#body-wrap",
                trigger: '.heroSection',
                start: () =>  window.innerHeight*1.05  + ' bottom',
                toggleActions: "play none none none",
                // snap: 1,
                // scrub: true,
                // pin: false,
                // markers: true,
            },
            duration: 1,
            delay: 0.05 * i,
            opacity: 1,
            ease: 'none',
        })
    }

    // Scroll Value

    gsap.to(scrollValue, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.heroSection',
            start: () =>  window.innerHeight*1  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true,
        },
        value: 10,
        ease: 'none',
    })

    // Floating Images
    gsap.to(floatingImagesGroup.position, {duration: 0, y: -10})
    
    gsap.to(floatingImagesGroup.position, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.heroDescriptionSection',
            start: () =>  window.innerHeight*0.25  + ' bottom',
            end: () =>  window.innerHeight*1.25 + ' top',
            // toggleActions: 'play none none reverse',
            // snap: 1,
            scrub: 1.5,
            // pin: false,
            // markers: true,
        },
        y: 10,
    })

    // Hero Description Text

    gsap.to('.heroDescriptionText', {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.heroDescriptionSection',
            start: () =>  window.innerHeight*0.5  + ' bottom',
            end: () =>  window.innerHeight*0.325 + ' center',
            // snap: 1,
            scrub: 1.5,
            // pin: false,
            // markers: true,
        },
        opacity: 1,
        ease: 'none',
    })
    
    // Showcase 2 Div
    
    gsap.to('#whiteTextImage', {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.showcase2Div',
            start: () =>  window.innerHeight*0.5  + ' bottom',
            end: () =>  window.innerHeight*0.5 + ' top',
            // snap: 1,
            scrub: 3,
            // pin: false,
            // markers: true,
        },
        y: 10,
        ease: 'none',
    })

    // Aircraft Slider Underline
    gsap.to('.blackUnderline', {duration: 0, scaleX: 0})

    gsap.to('.blackUnderline', {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.aircraftSlider',
            start: () =>  window.innerHeight*0.3  + ' bottom',
            end: () =>  window.innerHeight*0.5 + ' center',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true,
        },
        scaleX: 1,
        ease: 'Power1.easeOut',
    })

     // Hero 2 Text Animations
    gsap.to('#hero2TextImage', {duration: 0, opacity: 0})

     gsap.to('#hero2TextImage', {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.secondHero',
            start: () =>  window.innerHeight*0.25  + ' center',
            toggleActions: 'play none none reverse',
            // snap: 1,
            // scrub: true,
            // pin: false,
            // markers: true,
        },
        duration:1,
        opacity: 1,
        ease: 'Power1.easeOut',
    })

    // Final Hero Section
    gsap.to(cloud2Group.position, {duration: 0, y: -10})

    gsap.to(cloud2Group.position, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.finalHeroSection',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1  + ' bottom',
            // toggleActions: "play none none reverse",
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true,
        },
        y: 0,
        ease: 'Power1.easeOut'
    })

    for (let i = 0; i < cloud2MeshArray.length; i++) {
        gsap.to(cloud2MeshArray[i].material, {duration: 0, opacity: 0})

        gsap.to(cloud2MeshArray[i].material, {
            scrollTrigger: {
                scroller: "#body-wrap",
                trigger: '.finalHeroSection',
                start: () =>  window.innerHeight*0.9  + ' bottom',
                toggleActions: "play none none reverse",
                // snap: 1,
                // scrub: true,
                // pin: false,
                // markers: true,
            },
            duration: 1,
            opacity: 0.2,
            ease: 'Power1.easeOut'
        })
    }

    // Marquee Slider

    gsap.to('.marqueeSliderDiv', {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.infiniteMarquee',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.8 + ' top',
            // snap: 1,
            scrub: 1,
            // pin: false,
            // markers: true
        },
        x: -window.innerWidth * 1.5,
        ease: 'none',
    })

    // Mobile Views

    gsap.fromTo('#mobile1', {y: -100}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.mobileShowcaseDiv',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.8 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true
        },
        y: 100,
        ease: 'none',
    })

    gsap.fromTo('#mobile2', {y: 100}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.mobileShowcaseDiv',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.8 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: -100,
        ease: 'none',
    })

    // Image Sliders

    gsap.fromTo('#imageSlider1', {y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.imageSlidersSection',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider2', {y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.imageSlidersSection',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider3', {y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.imageSlidersSection',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider4', {y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",
            trigger: '.imageSlidersSection',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    // Image Loader
    /*
    let images = document.images
    let len = images.length
    let counter = 0
    console.log("here");
    console.log(images);
    const incrementCounter = () => {
        counter++
        if ( counter >= len - 1 ) {
            gsap.to('.loadingPage', {duration: 1, delay: 1, opacity: 0})
            setTimeout(() => {
                isLoadingFinished = true
                heroLogoAnimations()
            }, 1000)
        }
    }

    for (let i = 0; i < images.length; i++) {
        if(images[i].complete) {
            incrementCounter()
            console.log("here");            
            console.log(i);
        }
        else {
            images[i].addEventListener( 'load', () => {
                incrementCounter()
            }, false )
        }
    }
    */
    imagesLoaded( document.querySelector('body'), function( instance ) {
          gsap.to('.loadingPage', {duration: 1, delay: 1, opacity: 0})
            setTimeout(() => {
                isLoadingFinished = true
                heroLogoAnimations()
            }, 1000)
    });
    
    tick()
}

interactiveJS()