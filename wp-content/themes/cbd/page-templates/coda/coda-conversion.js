document.addEventListener("DOMContentLoaded", function () {
    
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    new SineWaves({
        el: document.querySelector(".waves"),
        speed: -3,
        width: function() {
            return viewportWidth + 100;
        },
        height: function() {
            return document.querySelector('.waves').offsetHeight;
        },
        rotate: 180,
        ease: "SineOut",
        waves: [
            {
                timeModifier: 1,
                lineWidth: 3,
                amplitude: 350,
                wavelength: 200,
                segmentLength: 20
            },
            { timeModifier: 1, lineWidth: 2, amplitude: 150, wavelength: 100 },
            {
                timeModifier: 1,
                lineWidth: 1,
                amplitude: -150,
                wavelength: 50,
                segmentLength: 10
            },
            {
                timeModifier: 1,
                lineWidth: 0.5,
                amplitude: -100,
                wavelength: 100,
                segmentLength: 10
            }
        ],
        initialize: function() {},
        resizeEvent: function() {
            var e = this.ctx.createLinearGradient(0, 0, this.width, 0);
            e.addColorStop(0, "rgba(187, 37, 38, 0.3)"),
                e.addColorStop(1, "rgba(255, 255, 255, 0.1)");
            for (var t = -1, i = this.waves.length; ++t < i; )
                this.waves[t].strokeStyle = e;
            (t = void 0), (i = void 0), (e = void 0);
        }
    });

});