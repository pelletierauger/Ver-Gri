drawSmoke = function(selectedProgram, dotAmount) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let t = drawCount * 0.00125 * 2 * 2 + 8;
    let t2 = t * 1e-4 * 20000 * 0.25;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 10;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let t3 = t * 1e1 * 2;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.025, 1.25);
    t *= 0.4;
    t += 115;
    for (let i = 0; i < 40000; i += 1) {
        x = fx * 0.16 + Math.sin(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.000022;
        y = fy * 0.16 + Math.cos(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.00005;
        //         x *= Math.cos(fx * fy * 0.001 * t * 5) * Math.sin(x + t * 10);
        //         x *= Math.cos(fx * fy * 0.001 * t * 7) * Math.sin(x + t * 15);
        //         y *= cos(fx * fy * 0.001) * cos(x + t + 2 * 10);
        //         x -= Math.sin(fx * fx * fy * Math.cos(fy * 400) * 0.018) * 7.5 * 2;
        //         y -= Math.sin(fy * fy * 0.018) * 7.5 * 2;
        // Below, I changed the range of the inner oscillator to [-0.65, 1]
        // to reduce the amount of time it destroys the harmonic shape.
        fx = tan(x * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        fy = tan(y * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        //         x += (Math.random() - 0.5) * 0.00005;
        //         y += (Math.random() - 0.5) * 0.00005;
        // x += xOffset * 0.125;
        // y += yOffset * 0.125;
        x += cos(t * -0.5e2 * 0.25) * i * 0.125e-4 * 2 * 0.5;
        y += sin(t * -0.5e2 * 0.25) * i * 0.125e-4 * 3 * 0.5;
        x += xOffset * 0.15 * 2 * 0.2 * 6.5 * 0.25;
        y += yOffset * 0.15 * 3 * 0.2 * 6.5 * 0.25;
        x += xOffset2 * 2 * 1e-3 * 0.5 * 6.5 * 0.25;
        y += yOffset2 * 3 * 1e-3 * 0.5 * 6.5 * 0.25;
        let xo = openSimplex.noise2D(i, t * 1e4) * 1e-3;
        let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 1e-3;
        let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 5;
        let s = 0.7;
        vertices.push((x + xo) * 1.3 * 1.5 * s, (y + yo) * 0.9 * 1.5 * s - 0.25, 15.0 + zo, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
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
    gl.drawArrays(gl.POINTS, 0, 40000);
};