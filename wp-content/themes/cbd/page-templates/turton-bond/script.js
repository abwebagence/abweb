import * as THREE from 'three'
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

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

    // 3D Objects
    // ----------------------------------------------------------------
    // Planes Parameters
    const planeGroup = new THREE.Group
    const planeParameters = {
        side: 0.75
    }

    const logoDataArray  = [
        {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75*0.5, y: 0, z: -0.75*0.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75*1.5, y: 0, z: 0.75*1.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75*2, y: 0, z: 0.75*2.5, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75*1, y: 0, z: -0.75*1, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75*1, y: -0.75*0.5, z: -0.75*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: 0.75/2, y: 0, z: 0.75/2, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.375*1.5, y: 0.75*0.75 - 0.375*0.5, z: 0.375*1.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*3.5, y: 0.75*0.75 - 0.375*0.5, z: 0.375*3.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*3.5, y: 0.75*0.75 - 0.375*2.5, z: 0.375*5.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*4.5, y: 0.75*0.75 - 0.375*2.5, z: 0.375*5.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*1.5, y: 0.75*0.75 - 0.375*0.5, z: -0.375*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*0.5, y: 0.75*0.75 - 0.375*0.5, z: -0.375*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*0.5, y: 0.75*0.75 - 0.375*0.5, z: -0.375*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*0.5, y: 0.75*0.75 - 0.375*0.5, z: -0.375*1.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*2.5, y: 0.75*0.75 - 0.375*0.5, z: -0.375*2.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*2.5, y: 0.75*0.75 - 0.375*2.5, z: -0.375*1.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*3.5, y: 0.75*0.75 - 0.375*2.5, z: -0.375*1.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*2.5, y: 0.75*0.75 - 0.375*2.5, z: -0.375*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0, y: -0.75, z: 0, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75, y: -0.75, z: 0, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: 0, y: -0.75, z: 0.75, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: 0.75, y: -0.75, z: 0.75, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 1.5, y: -0.75, z: 0.75 * 1.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 1.5, y: -0.75, z: 0.75 * 2.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 0.5, y: -0.75*1, z: 0.75 * 1.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 1.5, y: -0.75*2, z: 0.75 * 1.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 1, y: -0.75*2, z: 0.75 * 2, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: 0.75 * 0, y: -0.75*2, z: 0.75 * 2, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75 * 1, y: -0.75*2, z: 0.75 * 2, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.75 * 1.5, y: -0.75*2, z: 0.75 * 2.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: -0.75 * 0.5, y: -0.75*2, z: 0.75 * 1.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: -0.75 * 0.5, y: -0.75*2, z: 0.75 * 0.5, rx: 0, ry: Math.PI/2, rz: 0, sizeMultiplier: 1},
        {x: -0.75 * 1, y: -0.75*2, z: 0.75 * 0, rx: 0, ry: 0, rz: 0, sizeMultiplier: 1},
        {x: -0.375*2.5, y: 0.75*0.75 - 0.375*6.5, z: 0.375*0.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*2.5, y: 0.75*0.75 - 0.375*6.5, z: 0.375*1.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*1.5, y: 0.75*0.75 - 0.375*6.5, z: 0.375*4.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: 0.375*0.5, y: 0.75*0.75 - 0.375*6.5, z: 0.375*4.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
        {x: -0.375*3.5, y: 0.75*0.75 - 0.375*6.5, z: 0.375*5.5, rx: Math.PI/2, ry: 0, rz: 0, sizeMultiplier: 0.5},
    ]

    // Make Planes
    const planeArray = []
    const initialPositions = []
    const lineMaterial = []

    const randomPositionsArray1 = []
    const randomPositionsArray2 = []
    const randomPositionsArray3 = []

    const makePlanes = () => {
        for (let i = 0; i < logoDataArray.length; i++) {
            const plane = new THREE.BoxGeometry(planeParameters.side * logoDataArray[i].sizeMultiplier, planeParameters.side * logoDataArray[i].sizeMultiplier, 0.001);
            const edges = new THREE.EdgesGeometry(plane)
            lineMaterial[i] = new THREE.LineBasicMaterial({color: new THREE.Color(0xffffff).convertSRGBToLinear(), side: THREE.DoubleSide, opacity: 0, transparent: true})
            const line = new THREE.LineSegments(edges, lineMaterial[i])
            line.position.set((Math.random()-0.5)*16*3, (Math.random()-0.5)*9*3, (Math.random()-0.5)*60 - 20)

            randomPositionsArray1[i] = {
                x: (Math.random()*3 + 7)*(-1)**i,
                y: (Math.random()-0.5)*4,
                z: -Math.random()*10
            }

            randomPositionsArray2[i] = {
                x: (Math.random()*2.5 + 10)*(-1)**i,
                y: (Math.random()-0.5)*7,
                z: -Math.random()*10
            }

            randomPositionsArray3[i] = {
                x: (Math.random()*5 + 13)*(-1)**i,
                y: (Math.random()-0.5)*8,
                z: -10
            }

            initialPositions[i] = {
                x: line.position.x,
                y: line.position.y,
                z: line.position.z
            }
            planeGroup.add(line)
            planeArray[i] = line  
        }
    }

    scene.add(planeGroup)
    planeGroup.position.set(0,0,0)
    planeGroup.rotation.set(0,0,0)

    makePlanes()

    // Make Logo from Planes
    const fadeInPlanes = () => {
        for (let i = 0; i < logoDataArray.length; i++) {
            gsap.to(planeArray[i].material, {duration: 2, delay: 2 + Math.random()*2, opacity: 1})
        }
    }

    // ----------------------------------------------------------------

    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0,0,10)
    scene.add(camera)

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.CineonToneMapping

    // Animations
    // -----------------------------------------------

    // Parallax Image Animations
    let activateParallax = false

    gsap.to('#parallaxImages1', {duration: 0, y: 15})
    gsap.to('#parallaxImages2', {duration: 0, y: 35})
    gsap.to('#parallaxImages3', {duration: 0, y: 55})
    gsap.to('.blackLogoDiv', {duration: 0, y: 55})

    const parallaxImageAnimations = () => {
        gsap.to('#parallaxImages1', {duration: 2, delay: 0.4, y: 0})
        gsap.to('#parallaxImages2', {duration: 2, delay: 0.2, y: 0})
        gsap.to('#parallaxImages3', {duration: 2, delay: 0, y: 0})
        gsap.to('.blackLogoDiv', {duration: 2, delay: 0, y: 0})

        setTimeout(() => {
            activateParallax = true
        }, 2500)
    }

    // Fade Up Text Animations
    gsap.to('.blackLogo', {duration: 0, y: 200, opacity: 0})
    gsap.to('#fadeUpText1', {duration: 0, y: 100, opacity: 0})
    gsap.to('#fadeUpText2', {duration: 0, y: 100, opacity: 0})
    gsap.to('#heroCTAButton', {duration: 0, opacity: 0, scale: 0.975})

    const fadeUpTextAnimations = () => {
        gsap.to('.blackLogo', {duration: 2.5, delay: 0.8, y: 0, opacity: 1, ease: 'Power2.easeOut'})
        gsap.to('#fadeUpText1', {duration: 1.2, delay: 2, y: 0, opacity: 1, ease: 'Power2.easeOut'})
        gsap.to('#fadeUpText2', {duration: 1.2, delay: 2 + 1, y: 0, opacity: 1, ease: 'Power2.easeOut'})
        gsap.to('#heroCTAButton', {duration: 1, delay: 2 + 2, opacity: 1, scale: 1})
    }

    // Image Slider Columns Animations
    const imageSliderColumnsAnimations = () => {
        gsap.to('.imageSliderColumns', {duration: 0, rotation: 30})
    }

    // Search Bar Text Animations
    let searchBarTextString = 'https://www.turtonbond.com'
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

    // Meters Animations
    const metersAnimations = () => {
        gsap.to('#hex1', {duration: 0.5, delay: 0, scale: 0.8})
        gsap.to('#hex1', {duration: 0.5, delay: 0.5, scale: 1})
        gsap.to('#hex2', {duration: 0.5, delay: 0 + 0.25, scale: 0.8})
        gsap.to('#hex2', {duration: 0.5, delay: 0.5 + 0.25, scale: 1})
        gsap.to('#hex3', {duration: 0.5, delay: 0 + 0.5, scale: 0.8})
        gsap.to('#hex3', {duration: 0.5, delay: 0.5 + 0.5, scale: 1})

        gsap.to('#bar1', {duration: 0.5, delay: 0 + 0.5, x: 50})
        gsap.to('#bar1', {duration: 0.5, delay: 0.5 + 0.5, x: 0})
        gsap.to('#bar2', {duration: 0.5, delay: 0 + 0.25 + 0.5, x: 50})
        gsap.to('#bar2', {duration: 0.5, delay: 0.5 + 0.25 + 0.5, x: 0})
        gsap.to('#bar3', {duration: 0.5, delay: 0 + 0.5 + 0.5, x: 50})
        gsap.to('#bar3', {duration: 0.5, delay: 0.5 + 0.5 + 0.5, x: 0})
    }

    ScrollTrigger.create({
        scroller: "#body-wrap",
        trigger: '.showcase2Div',
        start: () =>  window.innerHeight*0.85  + ' bottom',
        onEnter: metersAnimations,
    })

    // Events
    // --------------------------------------

    // Mouse
    const mouse = {
        x: 0,
        y: 0
    }

    // Pointer Events
    let mouseOnSideScroller = false
    let mouseDrag = false
    document.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX/window.innerWidth - 0.5
        mouse.y = -(e.clientY/window.innerHeight - 0.5)

        // Parallax Images
        if (activateParallax == true) {
            gsap.to('#parallaxImages1', {duration: 1, y: mouse.y*10 - 5})
            gsap.to('#parallaxImages2', {duration: 1, delay: 0.15, y: mouse.y*10 - 5})
        }

        // Side Scroller Container Movement
        if (mouseDrag == true) {
            gsap.to('.sideScrollerContainer', {duration: 1, x: mouse.x * window.innerWidth/2, y: -mouse.y * window.innerHeight/2})
            gsap.to('.sideScrollerSteady', {duration: 1, x: -mouse.x * window.innerWidth, y: mouse.y * window.innerHeight})
            gsap.to('.sideScrollerText', {duration: 1, x: mouse.x * window.innerWidth, y: -mouse.y * window.innerHeight})
        }

        // Glow Ring
        gsap.to('.orangeGlowRing', {duration: 0, rotation: -Math.atan2(mouse.y, mouse.x) * 180/Math.PI - 270})
        gsap.to('.orangeGlowRing', {duration: 1.5, x: mouse.x*50, y: -mouse.y*50})
        
    })

    // Read More
    document.querySelector('#heroCTAButton').addEventListener('click', () => {
        gsap.to('#body-wrap', {
                duration: 1, 
                scrollTo: { y: window.innerHeight, autoKill: false }, 
                ease: "power1.inOut"
            });
    })

    // Search Bar
    document.querySelector('.searchBar').addEventListener('mouseenter', () => {
        gsap.to('.searchBar', {duration: 0.5, scale: 1.1})
    })

    document.querySelector('.searchBar').addEventListener('mouseleave', () => {
        gsap.to('.searchBar', {duration: 0.5, scale: 1})
    })

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

    // Side Scroller
    document.querySelector('.sideScrollerContainer').addEventListener('mouseenter', () => {
        mouseOnSideScroller = true
        document.body.style.cursor = 'grab'
    }) 

    document.querySelector('.sideScrollerContainer').addEventListener('mouseleave', () => {
        mouseDrag = false
        mouseOnSideScroller = false
        document.body.style.cursor = 'default'
        gsap.to('.sideScrollerContainer', {duration: 0.5, scale: 1})
        gsap.to('.sideScrollerSteady', {duration: 0.5, scale: 1})
        gsap.to('.sideScrollerText', {duration: 0.5, scale: 1})
        gsap.to('.sideScrollerContainer', {duration: 1, x: 0, y: 0})
        gsap.to('.sideScrollerSteady', {duration: 1, x: 0, y: 0})
        gsap.to('.sideScrollerText', {duration: 1, x: 0, y: 0})
    })

    document.addEventListener('mousedown', () => {
        if (mouseOnSideScroller == true) {
            gsap.to('.sideScrollerContainer', {duration: 0.5, scale: 0.95})
            gsap.to('.sideScrollerSteady', {duration: 0.5, scale: 1/0.95})
            gsap.to('.sideScrollerText', {duration: 0.5, scale: 1/0.95})
            mouseDrag = true
            document.body.style.cursor = 'grabbing'
        }
    })

    document.addEventListener('mouseup', () => {
        if (mouseOnSideScroller == true) {
            gsap.to('.sideScrollerContainer', {duration: 0.5, scale: 1})
            gsap.to('.sideScrollerSteady', {duration: 0.5, scale: 1})
            gsap.to('.sideScrollerText', {duration: 0.5, scale: 1})
            document.body.style.cursor = 'grab'
            mouseDrag = false
        }
    })

    // Image Slider Hovers
    const imageSliders = document.querySelectorAll('.imageSlider')

    for (let i = 0; i < imageSliders.length; i++) {
        imageSliders[i].addEventListener('mouseenter', () => {
            gsap.to(imageSliders[i], {duration: 0.5, boxShadow: '0 0 0 1rem #e17019, 0 0 5rem 0.25rem #e17019a0', scale: 1.025})
        })
        
        imageSliders[i].addEventListener('mouseleave', () => {
            gsap.to(imageSliders[i], {duration: 0.5, boxShadow: '0 0 0 1rem #e17019', scale: 1})
        })
    }

    // CTA Button Hovers
    const CTAButtons = document.querySelectorAll('.CTAButton')

    for (let i = 0; i < CTAButtons.length; i++) {
        if (i == 0) {
            CTAButtons[i].addEventListener('mouseenter', () => {
                gsap.fromTo(CTAButtons[i], {backgroundImage: 'none', y: 0, boxShadow: 'none'}, {duration: 0.25, backgroundImage: 'linear-gradient(to right, #ffffff70, #2c201970)', y: -5, boxShadow: '0 5px 1px 1px #00000010'})

                CTAButtons[i].addEventListener('mousedown', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: 0})
                })

                CTAButtons[i].addEventListener('mouseup', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: -5})
                })
            })
    
            CTAButtons[i].addEventListener('mouseleave', () => {
                gsap.to(CTAButtons[i], {duration: 0.25, backgroundImage: 'linear-gradient(to right, #ffffff00, #ffffff00)', y: 0, boxShadow: '0 0px 1px 1px #00000010'})
            })
        }
        else if (i == 3)  {
            CTAButtons[i].addEventListener('mouseenter', () => {
                gsap.fromTo(CTAButtons[i], {backgroundImage: 'none', y: 0, boxShadow: 'none'}, {duration: 0.25, backgroundImage: 'linear-gradient(to right, #ffffff70, #ebba9b70)', y: -5, boxShadow: '0 5px 1px 1px #00000010'})

                CTAButtons[i].addEventListener('mousedown', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: 0})
                })

                CTAButtons[i].addEventListener('mouseup', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: -5})
                })
            })
    
            CTAButtons[i].addEventListener('mouseleave', () => {
                gsap.to(CTAButtons[i], {duration: 0.25, backgroundImage: 'linear-gradient(to right, #ffffff00, #ffffff00)', y: 0, boxShadow: '0 0px 1px 1px #00000010'})
            })
        }
        else if (i == 2) {
            CTAButtons[i].addEventListener('mouseenter', () => {
                gsap.fromTo(CTAButtons[i], {backgroundImage: 'none', y: 0, boxShadow: 'none'}, {duration: 0.25, backgroundImage: 'linear-gradient(to right, #e1701970, #ffffff70)', y: -5, boxShadow: '0 5px 1px 1px #00000010'})

                CTAButtons[i].addEventListener('mousedown', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: 0})
                })

                CTAButtons[i].addEventListener('mouseup', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: -5})
                })
            })
    
            CTAButtons[i].addEventListener('mouseleave', () => {
                gsap.to(CTAButtons[i], {duration: 0.25, backgroundImage: 'linear-gradient(to right, #e1701900, #e1701900)', y: 0, boxShadow: '0 0px 1px 1px #00000010'})
            })
        }
        else {
            CTAButtons[i].addEventListener('mouseenter', () => {
                gsap.fromTo(CTAButtons[i], {backgroundImage: 'none', y: 0, boxShadow: 'none'}, {duration: 0.25, backgroundImage: 'linear-gradient(to right, #e1701970, #1d1d1b70)', y: -5, boxShadow: '0 5px 1px 1px #00000010'})

                CTAButtons[i].addEventListener('mousedown', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: 0})
                })

                CTAButtons[i].addEventListener('mouseup', () => {
                    gsap.to(CTAButtons[i], {duration: 0.25, y: -5})
                })
            })
    
            CTAButtons[i].addEventListener('mouseleave', () => {
                gsap.to(CTAButtons[i], {duration: 0.25, backgroundImage: 'linear-gradient(to right, #e1701900, #e1701900)', y: 0, boxShadow: '0 0px 1px 1px #00000010'})
            })
        }
    }

    // Animate
    // ---------------------------------------------
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        // Camera Movement
        gsap.to(camera.rotation, {duration: 1, x: mouse.y * 0.01, y: - mouse.x * 0.01})

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    // ScrollTriggers
    // -------------------------------------------------

    // Showcase 1

    gsap.fromTo('#showcase1', {y: 100, opacity: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap", trigger: '.showcase1Div',
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

    // Visit CTA 1

    gsap.fromTo('.orangeText', {opacity: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.visitCTA1Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.05 + ' center',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true
        },
        opacity: 1,
        ease: 'none',
    })

    gsap.fromTo('#visitCTA1Button', {opacity: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.visitCTA1Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0.05 + ' center',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true
        },
        opacity: 1,
        ease: 'none',
    })

    // Showcase 2

    gsap.fromTo('.imageContainer', {x: -100, opacity: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.showcase2Div',
            start: () =>  window.innerHeight*0.5  + ' bottom',
            end: () =>  window.innerHeight*0.55 + ' bottom',
            toggleActions: "restart none reverse none",
            // snap: 1,
            // scrub: true,
            // pin: false,
            // markers: true
        },
        x: 0, opacity: 1,
        ease: 'none',
    })

    gsap.to('.imageContainer', {duration: 0, x: -100, opacity: 0})

    // Image Sliders

    gsap.fromTo('#imageSlider1', {y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.showcase3Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider2', {y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.showcase3Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider3', {y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.showcase3Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    gsap.fromTo('#imageSlider4', {y: -250*Math.cos(Math.PI/6), x: 250*Math.sin(Math.PI/6)}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.showcase3Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: 250*Math.cos(Math.PI/6), x: -250*Math.sin(Math.PI/6),
        ease: 'none',
    })

    // Mobile Views

    gsap.fromTo('#mobile1', {y: -100 - 50}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.mobileShowcaseDiv',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: 100 - 50,
        ease: 'none',
    })

    gsap.fromTo('#mobile2', {y: 50}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.mobileShowcaseDiv',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: -100 - 50,
        ease: 'none',
    })

    // Bridge

    gsap.fromTo('#bridge', {y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.visitCTA3Div',
            start: () =>  window.innerHeight*0  + ' bottom',
            end: () =>  window.innerHeight*0 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            markers: false
        },
        y: 200,
        ease: 'none',
    })

    // Planes

    for (let i = 0; i < planeArray.length; i++) {
        
        // Plane Array Position

        gsap.fromTo(planeArray[i].position, {x: initialPositions[i].x, y: initialPositions[i].y, z: initialPositions[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*1  + ' bottom',
                end: () =>  window.innerHeight*1 + ' top',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: logoDataArray[i].x, y: logoDataArray[i].y, z: logoDataArray[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: logoDataArray[i].x, y: logoDataArray[i].y, z: logoDataArray[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*2  + ' bottom',
                end: () =>  window.innerHeight*2.75 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: randomPositionsArray1[i].x, y: randomPositionsArray1[i].y, z: randomPositionsArray1[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: randomPositionsArray1[i].x, y: randomPositionsArray1[i].y, z: randomPositionsArray1[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*2.75  + ' bottom',
                end: () =>  window.innerHeight*3.5 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: logoDataArray[i].x, y: logoDataArray[i].y, z: logoDataArray[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: logoDataArray[i].x, y: logoDataArray[i].y, z: logoDataArray[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*3.5  + ' bottom',
                end: () =>  window.innerHeight*4 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: randomPositionsArray2[i].x, y: randomPositionsArray2[i].y + 10*(-1)**i, z: randomPositionsArray2[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: randomPositionsArray2[i].x, y: randomPositionsArray2[i].y + 10*(-1)**i, z: randomPositionsArray2[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*4  + ' bottom',
                end: () =>  window.innerHeight*5 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: randomPositionsArray2[i].x, y: randomPositionsArray2[i].y - (10 + Math.random()*5)*(-1)**i, z: randomPositionsArray2[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: randomPositionsArray2[i].x, y: randomPositionsArray2[i].y - (10 + Math.random()*5)*(-1)**i, z: randomPositionsArray2[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*5.5  + ' bottom',
                end: () =>  window.innerHeight*6.25 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: randomPositionsArray3[i].x, y: randomPositionsArray3[i].y, z: randomPositionsArray3[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: randomPositionsArray3[i].x, y: randomPositionsArray3[i].y, z: randomPositionsArray3[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*6.25  + ' bottom',
                end: () =>  window.innerHeight*7.25 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: randomPositionsArray3[i].x + Math.random()*2 + 7*(-1)**i, y: randomPositionsArray3[i].y, z: randomPositionsArray3[i].z,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].position, {x: randomPositionsArray3[i].x + Math.random()*2 + 7*(-1)**i, y: randomPositionsArray3[i].y, z: randomPositionsArray3[i].z}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*7.25  + ' bottom',
                end: () =>  window.innerHeight*8 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: true
            },
            x: logoDataArray[i].x, y: logoDataArray[i].y, z: logoDataArray[i].z,
            ease: 'none',
        })

        gsap.to(planeArray[i].position, {x: initialPositions[i].x, y: initialPositions[i].y, z: initialPositions[i].z})

        // Plane Array Rotation

        gsap.fromTo(planeArray[i].rotation, {duration: 0, x: 0, y: 0, z: 0}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*1  + ' bottom',
                end: () =>  window.innerHeight*1  + ' top',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            x: logoDataArray[i].rx + Math.PI*2, y: logoDataArray[i].ry + Math.PI*2, z: logoDataArray[i].rz + Math.PI*2,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].rotation, {x: logoDataArray[i].rx + Math.PI*2, y: logoDataArray[i].ry + Math.PI*2, z: logoDataArray[i].rz + Math.PI*2}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*2  + ' bottom',
                end: () =>  window.innerHeight*2.75 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            x: 0, y: 0, z: 0,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].rotation, {x: 0, y: 0, z: 0}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*2.75  + ' bottom',
                end: () =>  window.innerHeight*3.5 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            x: logoDataArray[i].rx + Math.PI*2, y: logoDataArray[i].ry + Math.PI*2, z: logoDataArray[i].rz + Math.PI*2,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].rotation, {x: logoDataArray[i].rx + Math.PI*2, y: logoDataArray[i].ry + Math.PI*2, z: logoDataArray[i].rz + Math.PI*2}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*3.5  + ' bottom',
                end: () =>  window.innerHeight*4 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            x: 0, y: 0, z: 0,
            ease: 'none',
        })

        gsap.fromTo(planeArray[i].rotation, {x: 0, y: 0, z: 0}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*7.25  + ' bottom',
                end: () =>  window.innerHeight*8 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            x: logoDataArray[i].rx + Math.PI*2, y: logoDataArray[i].ry + Math.PI*2, z: logoDataArray[i].rz + Math.PI*2,
            ease: 'none',
        })

        gsap.to(planeArray[i].rotation, {duration: 0, x: 0, y: 0, z: 0})

        // Line Material Color

        gsap.fromTo(lineMaterial[i].color, {r: 1, g: 1, b: 1}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*2  + ' bottom',
                end: () =>  window.innerHeight*2.75 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            r: 225/255, g: 112/255, b: 25/255,
            ease: 'none',    
        })

        gsap.fromTo(lineMaterial[i].color, {r: 225/255, g: 112/255, b: 25/255}, {
            scrollTrigger: {
                scroller: "#body-wrap",             trigger: '.hero',
                start: () =>  window.innerHeight*7.25  + ' bottom',
                end: () =>  window.innerHeight*8 + ' bottom',
                // snap: 1,
                scrub: true,
                // pin: false,
                // markers: false
            },
            r: 1, g: 1, b: 1,
            ease: 'none',    
        })

        gsap.to(lineMaterial[i].color, {r: 1, g: 1, b: 1})
    }

    // Plane Group Position

    gsap.fromTo(planeGroup.position, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*1  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: -7,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: -7, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*2  + ' bottom',
            end: () =>  window.innerHeight*2.75 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 0,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*2.75  + ' bottom',
            end: () =>  window.innerHeight*3.5 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 7, y: -1,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 7, y: -1}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*3.5  + ' bottom',
            end: () =>  window.innerHeight*4 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 0, y: 0,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*4  + ' bottom',
            end: () =>  window.innerHeight*5 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 0, y: 0,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*6.25  + ' bottom',
            end: () =>  window.innerHeight*7.25 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 0, y: 0,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*7.25  + ' bottom',
            end: () =>  window.innerHeight*7.5 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true
        },
        x: 0, y: -10,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.position, {x: 0, y: -10}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*7.5  + ' bottom',
            end: () =>  window.innerHeight*8 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: true
        },
        x: 4, y: -1,
        ease: 'none',
    })

    gsap.to(planeGroup.position, {duration: 0, x: 0, y: 0})

    // Plane Group Rotation

    gsap.fromTo(planeGroup.rotation, {x: 0, y: 0}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*1  + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: Math.PI/6, y: Math.PI*(60/180) + Math.PI*2,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.rotation, {x: Math.PI/6, y: Math.PI*(60/180) + Math.PI*2}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*2  + ' bottom',
            end: () =>  window.innerHeight*2.75 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: Math.PI*2, y: Math.PI*4,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.rotation, {x: Math.PI*2, y: Math.PI*4}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*2.75  + ' bottom',
            end: () =>  window.innerHeight*3.5 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: Math.PI/6, y: Math.PI*4,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.rotation, {x: Math.PI/6, y: Math.PI*4}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*3.5  + ' bottom',
            end: () =>  window.innerHeight*4 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: 0, y: Math.PI*4,
        ease: 'none',
    })

    gsap.fromTo(planeGroup.rotation, {x: 0, y: Math.PI*4}, {
        scrollTrigger: {
            scroller: "#body-wrap",             trigger: '.hero',
            start: () =>  window.innerHeight*7.25  + ' bottom',
            end: () =>  window.innerHeight*8 + ' bottom',
            // snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        x: Math.PI/6, y: Math.PI*4,
        ease: 'none',
    })

    gsap.to(planeGroup.rotation, {duration: 0, x: 0, y: 0})

    // Image Loader
    /*
    let images = document.images
    let len = images.length
    let counter = 0

    const incrementCounter = () => {
        counter++
        if ( counter === len ) {
            gsap.to('.loadingPage', {duration: 1, delay: 1, opacity: 0})
            setTimeout(() => {
                fadeInPlanes()
                parallaxImageAnimations()
                fadeUpTextAnimations()
                imageSliderColumnsAnimations()
            }, 1000)
        }
    }

    for (let i = 0; i < images.length; i++) {
        if(images[i].complete) {
            incrementCounter()
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
                fadeInPlanes()
                parallaxImageAnimations()
                fadeUpTextAnimations()
                imageSliderColumnsAnimations()
            }, 1000)
    });    

    
    
    tick()
}

interactiveJS()