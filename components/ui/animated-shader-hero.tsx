"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shadertoy-compatible WebGL2 harness.                                       */
/*                                                                            */
/*  Provides the iResolution / iTime / iMouse uniforms and the                 */
/*  `void mainImage(out vec4 fragColor, in vec2 fragCoord)` entry point, so a   */
/*  shader you have the rights to can be dropped into MAIN_IMAGE below. The     */
/*  default mainImage here is original brand work (gold on charcoal) — it does  */
/*  not reproduce any third-party Shadertoy shader.                            */
/* -------------------------------------------------------------------------- */

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

// ── Shadertoy mainImage. Provided by the site owner; attribution kept below. ──
// The only change from the source is zero-initialising i and z (the original
// relies on Shadertoy zero-initialising locals; WebGL2 doesn't guarantee that).
const MAIN_IMAGE = `
/*
    "Waveform" by @XorDev
    https://www.shadertoy.com/view/Wcc3z2
*/
void mainImage(out vec4 O, vec2 I)
{
    //Raymarch iterator, step distance, depth and reflection
    float i=0., d, z=0., r;
    //Clear fragcolor and raymarch 90 steps
    for(O*= i; i++<9e1;
    //Pick color and attenuate
    O += (cos(z*.5+iTime+vec4(0,2,4,3))+1.3)/d/z)
    {
        //Raymarch sample point
        vec3 p = z * normalize(vec3(I+I,0) - iResolution.xyy);
        //Shift camera and get reflection coordinates
        r = max(-++p, 0.).y;
        //Mirror
        p.y += r+r;
        //Sine waves
        for(d=1.; d<3e1; d+=d)
            p.y += cos(p*d+2.*iTime*cos(d)+z).x/d;
        //Step forward (reflections are softer)
        z += d = (.1*r+abs(p.y-1.)/ (1.+r+r+r*r) + max(d=p.z+3.,-d*.1))/8.;
    }
    //Tanh tonemapping
    O = tanh(O/9e2);
}`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
out vec4 _fragColor;
${MAIN_IMAGE}
void main(){ vec4 c = vec4(0.0); mainImage(c, gl_FragCoord.xy); _fragColor = c; }`;

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Full-bleed animated shader that fills its positioned parent. Decorative
 * (aria-hidden). Supplies iResolution/iTime/iMouse, tracks the pointer for
 * iMouse, caps devicePixelRatio for mobile performance, renders a single
 * static frame under prefers-reduced-motion, pauses when offscreen or the tab
 * is hidden, and degrades to nothing when WebGL2 is unavailable.
 */
export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    // iMouse in drawing-buffer pixels (origin bottom-left, like gl_FragCoord).
    const mouse = { x: 0, y: 0 };
    function centreMouse() {
      mouse.x = canvas!.width / 2;
      mouse.y = canvas!.height / 2;
    }

    function resize() {
      const w = Math.max(1, Math.floor(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw(now: number) {
      gl!.uniform3f(uResolution, canvas!.width, canvas!.height, 1);
      gl!.uniform1f(uTime, now * 1e-3);
      gl!.uniform4f(uMouse, mouse.x, mouse.y, 0, 0);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    let raf: number | null = null;
    function loop(now: number) {
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (raf === null && !reduce) raf = requestAnimationFrame(loop);
    }
    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = canvas!.height - (e.clientY - rect.top) * dpr;
    }

    resize();
    centreMouse();
    draw(0); // one static frame (also the reduced-motion result)

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce || raf === null) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      play();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-full w-full", className)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Optional full-screen hero built on the shader — brand palette + Turkish.   */
/*  Reusable (e.g. a campaign page); the marketing landing keeps its own Hero. */
/* -------------------------------------------------------------------------- */

interface ShaderHeroProps {
  trustBadge?: { text: string; icon?: ReactNode };
  headline: { line1: string; line2: string };
  subtitle: string;
  buttons?: {
    primary?: { text: string; href?: string };
    secondary?: { text: string; href?: string };
  };
  className?: string;
}

export function ShaderHero({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className,
}: ShaderHeroProps) {
  return (
    <section
      className={cn(
        "relative flex h-dvh w-full items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
      >
        <ShaderBackground className="opacity-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {trustBadge && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 text-sm text-accent animate-in fade-in slide-in-from-top-4 fill-mode-backwards duration-700">
            {trustBadge.icon}
            <span>{trustBadge.text}</span>
          </div>
        )}

        <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[1.02] tracking-tight">
          <span className="block animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-700 [animation-delay:150ms]">
            {headline.line1}
          </span>
          <span className="block italic text-accent animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-700 [animation-delay:300ms]">
            {headline.line2}
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-secondary md:text-xl animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-700 [animation-delay:450ms]">
          {subtitle}
        </p>

        {buttons && (
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-700 [animation-delay:600ms]">
            {buttons.primary && (
              <Button asChild size="lg">
                <a href={buttons.primary.href ?? "#"}>{buttons.primary.text}</a>
              </Button>
            )}
            {buttons.secondary && (
              <Button asChild variant="outline" size="lg">
                <a href={buttons.secondary.href ?? "#"}>
                  {buttons.secondary.text}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ShaderHero;
