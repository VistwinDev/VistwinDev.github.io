document.addEventListener("nav", () => {
  const canvas = document.getElementById("dna-home-shader") as HTMLCanvasElement | null
  if (!canvas) return

  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false })
  if (!gl) return

  const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`
  const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289v2(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289v3(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
  i=mod289v2(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x2=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x2)-0.5;
  vec3 ox=floor(x2+0.5);
  vec3 a0=x2-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.03;a*=0.5;}
  return v;
}
void main(){
  vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/min(u_res.x,u_res.y);
  float t=u_time*0.018;
  vec2 flow=vec2(fbm(p*0.7+vec2(t,0.0)),fbm(p*0.7+vec2(0.0,t)+7.3));
  vec2 q=p+flow*0.45;
  float n=fbm(q*1.1+t*0.9);
  n+=0.35*fbm(q*2.3-t*0.5);
  n=smoothstep(-0.9,0.9,n);
  float nb=pow(clamp(n,0.0,1.0),1.8);
  // dark teal-green palette
  vec3 colA=vec3(0.02,0.05,0.08);
  vec3 colB=vec3(0.28,0.55,0.0);
  vec3 col=mix(colA,colB,nb);
  col*=1.0-0.25*length(p);
  col=pow(max(col,0.0),vec3(0.9));
  gl_FragColor=vec4(col,1.0);
}`

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src); gl.compileShader(s); return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)

  const buf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)

  const aLoc   = gl.getAttribLocation(prog, "a")
  const resLoc = gl.getUniformLocation(prog, "u_res")
  const timeLoc = gl.getUniformLocation(prog, "u_time")

  const start = performance.now()
  let rafId = 0

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.floor(window.innerWidth * dpr)
    const h = Math.floor(window.innerHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
    }
  }

  const render = (now: number) => {
    resize()
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.enableVertexAttribArray(aLoc)
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(resLoc, canvas.width, canvas.height)
    gl.uniform1f(timeLoc, (now - start) / 1000)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    rafId = requestAnimationFrame(render)
  }

  resize()
  rafId = requestAnimationFrame(render)
  window.addCleanup(() => cancelAnimationFrame(rafId))
})
