let looping = false;
let grimoire = false;
let tabsLoaded = false;
let gr;
let mode = 0;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/face-fog/face-fog";
let JSONs = [];
let maxFrames = Infinity;
let gl;
let time;
let positive = true;
let intensity;
let drawCount = 0;
let exportCount = 0;
let drawIncrement = 1;
let vertexBuffer;
let fvertices = [];
const openSimplex = openSimplexNoise(10);
let mS = 1;
let amountOfScratches = 3;
let fluctuation = 1;
let namedPrograms = {};

// a shader variable
let texcoordShader;
let dotsVBuf, termVBuf, dotsCBuf, bgVBuf;
let texture, texture2, framebuf, framebuf2;
let vb;
let nx, ny;
fvertices = [];
for (let i = 0; i < 1000000; i++) {
    fvertices.push(i);
}
fvertices = new Float32Array(fvertices);

let resolutionScalar = 1;
let resolutionBG;

let fmouse = [0, 0];
let pmouse = [0, 0];
let smouse = [0, 0];


// ------------------------------------------------------------
// Grimoire Animate
// ------------------------------------------------------------

var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;
var animationStart;
var framesRendered = 0;
var framesOfASecond = 0;
var secondStart, secondFrames;
var fps = 24;
var envirLooping = false;


startAnimating = function() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animationStart = Date.now();
    secondStart = Date.now();
    startTime = then;
    framesRendered = 0;
    envirLooping = true;
    animate();
}

function queryFrameRate() {
    let timeElapsed = Date.now() - animationStart;
    let seconds = timeElapsed / 1000;
    logJavaScriptConsole(framesRendered / seconds);
    // logJavaScriptConsole(timeElapsed);
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

function animate() {

    // request another frame
    if (envirLooping) {

        requestAnimationFrame(animate);


        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);
            // Put your drawing code here
            draw();
            framesRendered++;
            framesOfASecond++;
            if (framesOfASecond == fps) {
                secondFrames = fps / ((Date.now() - secondStart) * 0.001);
                // logJavaScriptConsole(secondFrames);
                framesOfASecond = 0;
                secondStart = Date.now();
            }
        }
    }
}

// ------------------------------------------------------------


function setup() {
    socket = io.connect('http://localhost:8080');
    socket.on('pushJSONs', function(data) {
        JSONs = data;
        // draw();
    });
    socket.emit('pullJSONs', "/Users/guillaumepelletier/Desktop/Dropbox/Art/p5/Les-nouvelles-galaxies/Vert/sessions");
    // socket.on('receiveOSC', receiveOSC);
    // pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // canvasDOM = document.getElementById('defaultCanvas0');
    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    pixelDensity(1);
    noCanvas();
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // cnvs = createCanvas(1280, 1280 * 9 / 16, WEBGL);
    cnvs = document.createElement('canvas');

    cnvs.id = "defaultCanvas0";
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(cnvs);
    canvasDOM = document.getElementById('defaultCanvas0');

    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    gl = cnvs.getContext('webgl');





    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });



    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);
    // background(0);
    // fill(255, 50);
    noStroke();
    vertex_buffer = gl.createBuffer();
    dotsVBuf = gl.createBuffer();
    bgVBuf = gl.createBuffer(); 
    dotsCBuf = gl.createBuffer();
    termVBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    if (!looping) {
        noLoop();
    }
    shadersReadyToInitiate = true;
    initializeShaders();
    createWhiteDots();
    time = gl.getUniformLocation(getProgram("pulsar-fog"), "time");
    resolutionBG = gl.getUniformLocation(getProgram("pulsar-fog"), "resolution");
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);

    setTimeout( function() {
        // keysControl.style.cursor = 'none';
        keysControl.addEventListener("mouseenter", function(event) {
        document.body.style.cursor = "none";
        document.body.style.backgroundColor = "#000000";
        appControl.setAttribute("style", "display:none;");
        let tabs = document.querySelector("#file-tabs");
        tabs.setAttribute("style", "display:none;");
        // let slider = document.querySelector("#timeline-slider");
        // slider.setAttribute("style", "display:none;");
        // slider.style.display = "none";
        // canvasDOM.style.bottom = "0";
        cinemaMode = true;
        scdArea.style.display = "none";
        scdConsoleArea.style.display = "none";
        jsArea.style.display = "none";
        jsConsoleArea.style.display = "none";
    }, false);
    keysControl.addEventListener("mouseleave", function(event) {
            if (!grimoire) {
                document.body.style.cursor = "default";
                document.body.style.backgroundColor = "#1C1C1C";
                appControl.setAttribute("style", "display:block;");
                let tabs = document.querySelector("#file-tabs");
                tabs.setAttribute("style", "display:block;");
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
                if (displayMode === "both") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                } else if (displayMode == "scd") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                } else if (displayMode == "js") {
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                }
                cinemaMode = false;
                clearSelection();
            }   
        }, false);
    }, 1);
    if (batchExport) {
        exportCount = batchMin;
        drawCount = exportCount;
        exporting = true;
        redraw();
        songPlay = false;
        noLoop();
        looping = false;
    }
    socket.on('getNextImage', function(data) {
        if (drawCount <= batchMax) {
            // redraw();
            window.setTimeout(function() {
                redraw();
            }, 10);
        }
    });
}

function clearSelection() {
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}

draw = function() {
    if (ge.t) {
        ge.t.display();
    } else {
        GrimoireTab.prototype.display();
    }
    if (tabsLoaded) {
        if (exporting && exportCount < maxFrames) {
            frameExport();
            exportCount++;
            drawCount = exportCount;
        } else {
            drawCount += drawIncrement;
        }    
    }
}

// function keyPressed() {
//     if (keysActive) {
//         if (keyCode === 32) {
//             if (looping) {
//                 noLoop();
//                 looping = false;
//             } else {
//                 loop();
//                 looping = true;
//             }
//         }
//         if (key == 'r' || key == 'R') {
//             window.location.reload();
//         }
//         if (key == 'm' || key == 'M') {
//             redraw();
//         }
//     }
// }


keyPressed = function() {
    if (keysActive) {
        // if (keyCode === 32) {
        //     if (looping) {
        //         noLoop();
        //         looping = false;
        //     } else {
        //         loop();
        //         looping = true;
        //     }
        // }
        // if (key == 'r' || key == 'R') {
        //     window.location.reload();
        // }
        // if (key == 'm' || key == 'M') {
        //     redraw();
        // }
        // if (key == 'a' || key == 'A') {
        //     logJavaScriptConsole("yur!");
        // }
        // logJavaScriptConsole(key);
    if (vtActive) {
                    // vt.update(event);
         // if (keyCode === 8) {
            // vt.update("delete");
             // // logJavaScriptConsole(event);
        // }  else {
            // vt.update(event);
        // }
                     // logJavaScriptConsole(event.key);
        // logJavaScriptConsole(event.shiftKey);
        // if (key == 'a' || key == 'A') {
            // vt.update("a");
            // logJavaScriptConsole(event.key);
        // }
        }
    }
}


tl = function(d = 0) {
    setTimeout(function() {
                if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
    }, d * 1e3);
};


tl = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};

tl0 = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                drawCount = 0;
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};


keyDown = function(e) {
    if (keysActive) {
        if (ge.recording) {
            ge.recordingSession.push([drawCount, {
                name: "keyDown",
                key: e.key,
                keyCode: e.keyCode,
                altKey: e.altKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey
            }]);
        }
        // console.log(event.keyCode);
        if (e.keyCode == 27 && ge.activeTab !== null) {
            mode = (mode + 1) % 3;
        }
        if (mode == 0) {
                if (vtActive) {
                    vt.update(e);
                    // ljs(event.keyCode);
                }
            updateDrawing(e);
        } else if (mode == 1) {
            ge.update(e);
        } else if (mode == 2) {
            paintingKeys(e);
        }
    }
}

document.onkeydown = keyDown;       




function setResolutionScalar(sc) {
    resolutionScalar = sc;
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);
    drawCount--;
    redraw();
}

function sr(sc) {
    setResolutionScalar(sc);
}

function exportOne() {
    exporting = true;
    redraw();
    exporting = false;
}

gr = function() {
    grimoire = !grimoire;
}

if (false) {


receiveOSC = function(s) {
    trigger(s);
    // logJavaScriptConsole(s);
    if (s.address == "/eval") {
        eval(s.args[0].value);
    }
};

trigger = function(s) {
    console.log(s);
};

socket.off('receiveOSC', receiveOSC);
socket.on('receiveOSC', receiveOSC);


buzz = 0.1;
scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
    for (let y = 20; y < 25; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, 0);
                let v = Math.round(Math.sin(d + drawCount * Math.cos(xx * buzz)) * 0.5 + 0.5);
                c[y][x][i] = v;
            }
        }
    }
}

buzz = 0.1;
buzzY = 1;
    scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
        let t = drawCount;
    for (let y = 20; y < 28; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, buzzY);
                let v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                v = Math.round(usin(Math.tan(d * buzz + t)));
                c[y][x][i] = v;
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}

}

buzz = 0.1;
buzzY = 1;
scdDisplay = function() {
    let t = drawCount;
    let c = ge.activeTab.canvas.data;
   c = ge.getTab("sh.js").canvas.data;
    let w = 100;
    let hw = w / 2;
    for (let y = 2; y < 23; y++) {
        for (let x = 31; x < 78; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx * 0.94, yy * (5 / 3), 109 * 7 / 2 - 26, 25 * 9 / 2 * (5/3));
                let v = Math.round(usin(d * 100 + drawCount * 0.5 + Math.sin(xx)));
                v *= Math.round(usin(d * 5 + drawCount * 1e-1));
                // v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                // v *= Math.round(usin(Math.sin(d * buzz + t)));
                
                if (d < 150.5) {
                    c[y][x][i] = v;
                } else {
                    // c[y][x][i] = 0;
                }
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}
// scdDisplay();





logLatency = function() {
    logJavaScriptConsole((Date.now() - animationStart)/1000 - (drawCount/24));
}

setTabs = function() {

if (false) {
drawTerminal = function(selectedProgram) {
    num = 0;
    vertices = [];
    colors = [];
    let nx = openSimplex.noise2D(drawCount * 0.5e-1, 1) * 0.01;
    let ny = openSimplex.noise2D(drawCount * 0.5e-1 + 1e4, 10) * 0.01;
    let c = ge.t.canvas.data;
    let cy = ge.t.scroll.y;
    let sc = 0.7; let tx = 0.09;
    for (let i = -5; i < 15; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    vertices.push((x / (109*7) * 2 - 1 + 0.1) * sc - tx + (Math.sin(drawCount*2e-2*1)*0), (-y/(25*9) * 2 * (0.9) + 1 + 0.05) * sc, 11 * sc, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    for (let i = -5; i < 15; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    x += Math.floor(Math.sin(drawCount * 1 + y * 1) * 10 * map(y,0, 110, 2, 0.35));
                    x += Math.floor(Math.sin(drawCount * 0.1 + y * 0.1) * 25 * map(y,0, 110, 2, 0.35));
                    vertices.push((x / (109*7) * 2 - 1 + 0.1) * sc - tx + (Math.sin(drawCount*2e-2*1)*0), (y/(25*9) * 2 * (0.9) - 1.15 + 0.05) * sc, 11 * sc, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    // vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 + ny) * sc, 11 * sc, 1);
                            // num++;
                            // colors.push(0.65, 0.65, 0.65);   
    // logJavaScriptConsole(colors.length);
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.uniform1f(time, drawCount);
    gl.uniform1f(disturb, glitchDist);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, termVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
//  ----
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsCBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Get the attribute location
    var cols = gl.getAttribLocation(selectedProgram, "colors");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(cols, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(cols);
// ----------
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
    if (vt.recording || vt.playback) {
        vt.recordingFrame++;
    }
    if (vt.playback) {
        vt.play();
    }
}
}

    roundedSquare.vertText = `
    // beginGLSL
    precision mediump float;
    attribute vec4 coordinates;
    attribute vec3 colors;
    uniform float time;
    uniform float resolution;
    uniform float disturb;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        // CRT curve
        // gl_Position.x += floor(sin(gl_Position.y * 1e2 + time)) * 0.1
        float disturbance = (floor(sin(gl_Position.y * 5. + time * 0.25 + tan(gl_Position.y * 1e3) * 0.125) * 2.)) * 0.125 * 0.125;
        float fluctuate = floor(mod(time * 1e5, 100.)/50.);
        float distr2 = (floor(sin(gl_Position.y * 1e-7 + time * 0.125 + tan(gl_Position.y * 2. + gl_Position.x * 1e-1) * 0.5) * 0.01)) * 10.1 * fluctuate;
        // distr2 *= 0.;
        gl_Position.x += disturbance * 0.1 * disturb * (1. + distr2);
        // gl_Position.x += tan(floor(sin(gl_Position.y * 1e3))) * 0.1;
        // gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = coordinates.z * resolution * 2.;
        size = gl_PointSize;
        cols = colors;
        t = time;
        float vig = (roundedRectangle(myposition, vec2(0.0, 0.0), vec2(1.95, 1.9) * 0.5, 0.001, 0.05));
        gl_PointSize *= vig;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
roundedSquare.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangleFlicker (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // vec2 uv = gl_PointCoord.xy;
        float t2 = mod(t * 0.125, 3.14159 * 2.) * 1.;
        // t = 100. + (t * 1e-4);
        float w = 0.15 + (sin(t2 * 1e-2 * tan(t2 * 2e-2)) + 1.0) * 0.25;
        float d = length(max(abs(uv - pos), size * 0.5) - size * 0.5) * w - radius * 0.01;
        float oscFull = (sin(t2) * 0.5 + 0.5) * 3.75 * 0.;
        float oscScanning = (sin(gl_FragCoord.y * 1e-2 + t2) * 0.5 + 0.5) * 4.;
        return smoothstep(2.99 + oscFull + 1., 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos), size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
         // float resolution = 1.0;
         vec2 screenSize = vec2(2560.0, 1440.0) * resolution;
         vec2 uv = gl_PointCoord.xy;
        uv = uv * 2. - 1.;
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.5);
        float rando = rand(uv * t) * 0.1;
        gl_FragColor = vec4(cols, color - rando);
    }
    // endGLSL
`;
roundedSquare.init();

    
GrimoireTab.prototype.display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    drawFaceFog(currentProgram);
    currentProgram = getProgram("old-flickering-dots");
    gl.useProgram(currentProgram);
    // drawSwirl2(currentProgram);
    // drawDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    // drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

tb("sssss");
ge.t.scroll.y = 407;
buildFace = function() {
    let face = [];
    let c = ge.t.canvas.data;
    let cy = ge.t.scroll.y;
    let sc = 0.75;
    for (let i = -5; i < 30; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    x = (x / (109*7) * 2 - 1 + 0.1) * sc - 0.05;
                    y = (-y/(25*9) * 2 * (0.9) + 1 + 0.05) * sc;
                    for (let l = 0; l < 4; l++) {
                         for (let m = 0; m < 4; m++) {
                             var xx = x+(l*0.01*1*Math.round(Math.random()));
                             var yy = y+(m*0.02*1*Math.round(Math.random()));
                             var shift = map(openSimplex.noise2D(xx, yy), -1, 1, 0.25, 3.25);
                             xx += map(openSimplex.noise2D(xx*1e2+1000, yy*1e3), -1, 1, 0.25, 3.25)*0.001;
                             yy += map(openSimplex.noise2D(xx*1e2, yy*1e3+1000), -1, 1, 0.25, 3.25)*0.001;
                            var size = Math.random()*4;
                             // if (Math.random() < 0.5) {
                                 face.push([xx, yy, 2 * sc, 4]);
                             // } else {
                                 // face.unshift(xx, yy, 2 * sc, 4);
                             // }
                             
                        }   
                    }
                    // face.push(x, y, 11 * sc, 1);
                }
            }
        }
    }
    shuffleArray(face);
    var face2 = [];
    for (let i = 0; i < face.length; i++) {
        face2.push(face[i][0]);
        face2.push(face[i][1]);
        face2.push(face[i][2]);
        face2.push(face[i][3]);
    }
    // shuffle(face2);
    faceArray = new Float32Array(face2);
}
buildFace();

drawFaceFog = function(selectedProgram) {
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, faceArray, gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    var time = gl.getUniformLocation(selectedProgram, "time");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(time, drawCount);    
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    // let dotsToDraw = Math.floor(map(drawCount, 0, 2400 - 672, 60000, 0));
    // dotsToDraw = 6000;
    // gl.drawArrays(gl.POINTS, 0, faceArray.length/4 * map(Math.sin(drawCount*0.1),-1,1,0.75,1));
    gl.drawArrays(gl.POINTS, 0, faceArray.length*0.25);
}





newFlickering.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float resolution;
    uniform float time;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-1;
        gl_Position = vec4(coordinates.x * 2. + 0.25*0., coordinates.y * 2., 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = (9. + coordinates.z / ((6.0 + alph) * 0.25)) * 2.0 * resolution;
        // cols = mix(cols, cols * floor(vig), 1.);
        vec2 pos = gl_Position.xy;
        // gl_PointSize *= noise(pos*1000.*vec2(cos(t*tan(pos.x*1e-1+1e1)),sin(t*tan(pos.x*1e-1+1e1))));
        // gl_Position.xy *= 1.0 - (noise(pos*1000.*vec2(cos(t*tan(pos.x)*1e-2),sin(t*tan(pos.x)*1e-2)))*0.1);
        gl_Position.xy += noise(pos*1e3+vec2(cos(t),sin(t)))*0.05;
        gl_PointSize += noise(pos*1e3+vec2(cos(t),sin(t)))*4.5;
        gl_PointSize *= 3.0;
        gl_Position.xy += vec2(noise(vec2(pos.x, t*1e-1)), noise(vec2(pos.x+1000., t*1e-1)))*0.25;
        alph *= 1. - noise(pos*5.+vec2(cos(t),sin(t)))*1.;
        alph *= 1. - noise(pos*1.+vec2(cos(t+1e3),sin(t+1e3)))*1.;
        float vig = (roundedRectangle(gl_Position.xy * 0.15, vec2(0.0, 0.0), vec2(2.01, 1.98) * 0.0712*1., 0.001, 0.05) + 0.0);
        gl_PointSize *= floor(vig);
        // gl_Position.xy += vec2(noise(vec2(pos.x, t*1e1)), noise(vec2(pos.x+1000., t*1e1)))*0.0625;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
newFlickering.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 1.25;
        gl_FragColor.rgb = gl_FragColor.rrr * 0.6;
        gl_FragColor.a *= 0.125*0.25;
    }
    // endGLSL
`;
newFlickering.init();

}


shuffleArray = function(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}