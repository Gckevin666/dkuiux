// Shader代码
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float baseY = 0.6;
    float y = baseY + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

class Threads {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            color: options.color || [1, 1, 1],
            amplitude: options.amplitude || 1,
            distance: options.distance || 0,
            enableMouseInteraction: options.enableMouseInteraction || false
        };

        this.init();
    }

    init() {
        // 创建canvas和WebGL上下文
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl', { alpha: true });
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        // 设置WebGL
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.container.appendChild(this.canvas);

        // 创建着色器程序
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        // 创建三角形几何体
        this.createGeometry();
        
        // 设置uniforms
        this.uniforms = {
            iTime: gl.getUniformLocation(this.program, 'iTime'),
            iResolution: gl.getUniformLocation(this.program, 'iResolution'),
            uColor: gl.getUniformLocation(this.program, 'uColor'),
            uAmplitude: gl.getUniformLocation(this.program, 'uAmplitude'),
            uDistance: gl.getUniformLocation(this.program, 'uDistance'),
            uMouse: gl.getUniformLocation(this.program, 'uMouse')
        };

        // 设置鼠标交互
        this.currentMouse = [0.5, 0.5];
        this.targetMouse = [0.5, 0.5];
        if (this.options.enableMouseInteraction) {
            this.setupMouseInteraction();
        }

        // 设置尺寸并开始动画
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    createGeometry() {
        const gl = this.gl;
        
        // 创建三角形顶点
        const vertices = new Float32Array([
            -1, -1,
            3, -1,
            -1, 3
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const position = gl.getAttribLocation(this.program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    }

    setupMouseInteraction() {
        const handleMouseMove = (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            this.targetMouse = [x, y];
        };

        const handleMouseLeave = () => {
            this.targetMouse = [0.5, 0.5];
        };

        this.container.addEventListener('mousemove', handleMouseMove);
        this.container.addEventListener('mouseleave', handleMouseLeave);
    }

    resize() {
        const { clientWidth, clientHeight } = this.container;
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
        this.gl.viewport(0, 0, clientWidth, clientHeight);
    }

    animate(time = 0) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);

        // 更新uniforms
        if (this.options.enableMouseInteraction) {
            const smoothing = 0.05;
            this.currentMouse[0] += smoothing * (this.targetMouse[0] - this.currentMouse[0]);
            this.currentMouse[1] += smoothing * (this.targetMouse[1] - this.currentMouse[1]);
        }

        gl.uniform1f(this.uniforms.iTime, time * 0.001);
        gl.uniform3f(this.uniforms.iResolution, this.canvas.width, this.canvas.height, this.canvas.width / this.canvas.height);
        gl.uniform3fv(this.uniforms.uColor, new Float32Array(this.options.color));
        gl.uniform1f(this.uniforms.uAmplitude, this.options.amplitude);
        gl.uniform1f(this.uniforms.uDistance, this.options.distance);
        gl.uniform2fv(this.uniforms.uMouse, new Float32Array(this.currentMouse));

        // 绘制
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.resize);
        if (this.container.contains(this.canvas)) {
            this.container.removeChild(this.canvas);
        }
        this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
}

// 导出
window.Threads = Threads; 