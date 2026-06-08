document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.title-bar > img')) {
    gsap.utils.toArray('.title-bar > img').forEach(el => {
      const section = el.closest('.title-bar')
      gsap.to(el, {
        scrollTrigger: {
          trigger: section,
          scrub: true,
          start: 'top top',
          end: 'bottom top-=20%'
        },
        yPercent: -100
      })
    })
  }
});
function getWebGLContext() {
    let canvas = document.createElement("canvas");
    return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}

function getGPUInfo(gl) {
    if (!gl) return { vendor: "Unknown", renderer: "Unknown" };
    let debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return debugInfo ? {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    } : { vendor: "Unavailable", renderer: "Unavailable" };
}

function isHighEndGPU(renderer) {
    const highEndGPUs = [
        "RTX", "Titan", "Quadro", "GeForce GTX", "GeForce RTX",
        "Radeon RX", "Radeon Pro", "M1", "M2", "A100", "Tesla", "Apple"
    ];
    return highEndGPUs.some(keyword => renderer.includes(keyword));
}

function runPerformanceTest(gl, callback) {
    let frameTimes = [];
    let startTime = performance.now();
    let frameCount = 0;

    function renderLoop() {
        let now = performance.now();
        frameTimes.push(now);
        
        frameTimes = frameTimes.filter(t => now - t < 1000);
        frameCount++;

        if (now - startTime > 2000) {
            let fps = frameTimes.length;
            callback(fps);
            return;
        }

        gl.clear(gl.COLOR_BUFFER_BIT);
        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}

function loadScript(scriptUrl) {
    let script = document.createElement("script");
    script.src = scriptUrl;
    script.type = "module";
    document.body.appendChild(script);
}

function setSession(type) {
    sessionStorage.setItem("gpuPerformance", type);
}

function getSession() {
    return sessionStorage.getItem("gpuPerformance");
}

function checkGraphicsCard() {
    let sessionValue = getSession();
    if (sessionValue) {
        console.log(`Session detected: ${sessionValue}. Loading appropriate script...`);
        if (sessionValue === "high") loadScript("/wp-content/themes/cbd/templates/blocks/title-bar/title-bar-fluid.js");
        return;
    }

    let gl = getWebGLContext();
    if (!gl) {
        console.log("WebGL is not supported. No script will be loaded.");
        return;
    }

    let { vendor, renderer } = getGPUInfo(gl);
    console.log("Detected GPU:", vendor, renderer);

    if (isHighEndGPU(renderer)) {
        console.log(`High-End GPU Detected (${renderer}). Loading fluid.js...`);
        setSession("high");
        loadScript("/wp-content/themes/cbd/templates/blocks/title-bar/title-bar-fluid.js");
        return;
    }

    runPerformanceTest(gl, (fps) => {
        if (fps > 45) {
            console.log(`Good performance detected (FPS: ${fps}). Loading fluid.js...`);
            setSession("high");
            loadScript("/wp-content/themes/cbd/templates/blocks/title-bar/title-bar-fluid.js");
        } else {
            console.log(`Low-end graphics detected (FPS: ${fps}). No script will be loaded.`);
            setSession("low");
        }
    });
}

checkGraphicsCard();

