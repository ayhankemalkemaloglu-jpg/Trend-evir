"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Brand-recoloured fragment shader (orig. nebula by @atzedent), gold on a    */
/*  near-charcoal field instead of the warm RGB original. Raw WebGL2 — no      */
/*  three.js dependency.                                                       */
/* -------------------------------------------------------------------------- */

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  // TrendÇevir gold (#d4af37) — single hue, kept subtle.
  vec3 gold=vec3(.831,.686,.216);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.0012/d*gold*(.65+.35*sin(i));
    float b=noise(i+p+bg*1.731);
    col+=.0016*b/length(max(p,vec2(b*p.x*.02,p.y)))*gold;
    // Dark, faintly warm charcoal background so it sits behind text.
    col=mix(col,vec3(bg*.13,bg*.10,bg*.04),d);
  }
  O=vec4(col,1);
}`;

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
 * Animated gold-light shader that fills its positioned parent. Decorative
 * (aria-hidden). Degrades to nothing when WebGL2 is unavailable, renders a
 * single static frame under prefers-reduced-motion, and pauses when offscreen
 * or the tab is hidden. Pixel ratio is capped for performance.
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

    const uResolution = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");

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
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, now * 1e-3);
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

    resize();
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

    play();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
