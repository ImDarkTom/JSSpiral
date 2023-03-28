console.log("You can use custom colors like this: /?color=purple&bgColor=#f1f1f1")

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createZoomingSpiral(centerX, centerY, angle, spiralSize, dots, red, green, blue) {
    let redShade = red;
    let greenShade = green
    let blueShade = blue;
    let reducingAmount = 5;

    return function drawSpiral() {

        ctx.fillStyle = `rgb(${redShade}, ${greenShade}, ${blueShade})`;
        const x = centerX + spiralSize * Math.cos(angle);
        const y = centerY + spiralSize * Math.sin(angle);
        ctx.fillRect(x, y, 2, 2);

        dots.push({
            x: x,
            y: y,
            opacity: 1
        });

        dots.forEach(function (dot, index) {
            ctx.fillStyle = `rgba(${redShade}, ${greenShade}, ${blueShade}, ${dot.opacity})`;
            ctx.fillRect(dot.x, dot.y, 2, 2);
            reducingAmount += 0.00001;
            dot.opacity -= reducingAmount/1000;
            if (dot.opacity <= 0) {
                dots.splice(index, 1);
            }
        });

        angle += 0.1;
        spiralSize += 0.1;

        // Check if the spiral is off the screen
        const maxRadius = Math.max(canvas.width, canvas.height);
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (distanceFromCenter > maxRadius) {
            // Remove the spiral
            drawSpiral = null;
            dots.length = 0;
        }
    };
}

let spirals = [];
const paramColor = new URL(window.location.toString()).searchParams.get('color');
const bgColor = new URL(window.location.toString()).searchParams.get('bgColor');

document.querySelector(':root').style.setProperty('--bgcolor', bgColor);

canvas.addEventListener("click", function (event) {
    const centerX = event.clientX;
    const centerY = event.clientY;
    const dots = [];
    let red, green, blue;
    //chroma().get('rgb.g')
    if (paramColor==null) {
        red = Math.round(Math.random()*255);
        green = Math.round(Math.random()*255);
        blue = Math.round(Math.random()*255);
    } else {
        red = chroma(paramColor).get('rgb.r');
        green = chroma(paramColor).get('rgb.g');
        blue = chroma(paramColor).get('rgb.b');
    }

    const drawSpiral = createZoomingSpiral(centerX, centerY, 0, 1, dots, red, green, blue);
    spirals.push(drawSpiral);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        spirals.forEach(function (drawSpiral) {
            drawSpiral();
        });

        requestAnimationFrame(animate);
    }

    animate();
});
