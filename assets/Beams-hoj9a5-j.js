import{a as e,c as t,n}from"./index-C6iwrPgK.js";import{H as r,d as i,gt as a,n as o,o as s,ot as c,p as l,t as u,u as d}from"./react-three-fiber.esm-SgNMxxfi.js";var f=t(e(),1),p=Math.PI/180;180/Math.PI;function m(e){return e*p}var h=n();function g(e,t){let{vertexShader:n,fragmentShader:r,uniforms:i}=s.physical,o=a.clone(i),l=new e(t.material||{});l.color&&(o.diffuse.value=l.color),`roughness`in l&&(o.roughness.value=l.roughness),`metalness`in l&&(o.metalness.value=l.metalness),`envMap`in l&&(o.envMap.value=l.envMap),`envMapIntensity`in l&&(o.envMapIntensity.value=l.envMapIntensity),Object.entries(t.uniforms??{}).forEach(([e,t])=>{o[e]=typeof t==`object`&&t&&`value`in t?t:{value:t}});let u=`${t.header}\n${t.vertexHeader??``}\n${n}`,d=`${t.header}\n${t.fragmentHeader??``}\n${r}`;for(let[e,n]of Object.entries(t.vertex??{}))u=u.replace(e,`${e}\n${n}`);for(let[e,n]of Object.entries(t.fragment??{}))d=d.replace(e,`${e}\n${n}`);return new c({defines:{},uniforms:o,vertexShader:u,fragmentShader:d,lights:!0,fog:!!t.material?.fog})}var _=({children:e})=>(0,h.jsx)(u,{camera:{position:[0,0,20],fov:30},dpr:[1,1.25],frameloop:`always`,gl:{antialias:!1,powerPreference:`low-power`},performance:{min:.55},className:`beams-container`,children:e}),v=`
float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123); }
float noise (in vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0); vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1); vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0); float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z)); float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z)); float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz)); float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`,y=({beamWidth:e=2.5,beamHeight:t=20,beamNumber:n=10,lightColor:i=`#00c6ff`,speed:a=1,noiseIntensity:o=1,scale:s=.1,rotation:c=0})=>{let u=(0,f.useRef)(null),d=(0,f.useMemo)(()=>g(r,{header:`varying vec3 vEye; varying float vNoise; varying vec2 vUv; varying vec3 vPosition;
uniform float time; uniform float uSpeed; uniform float uNoiseIntensity; uniform float uScale;
${v}`,vertexHeader:`
float getPos(vec3 pos) {
  vec3 noisePos = vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
  return cnoise(noisePos);
}
vec3 getCurrentPos(vec3 pos) { vec3 newpos = pos; newpos.z += getPos(pos); return newpos; }
vec3 getNormal(vec3 pos) {
  vec3 curpos = getCurrentPos(pos);
  vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
  vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
  vec3 tangentX = normalize(nextposX - curpos);
  vec3 tangentZ = normalize(nextposZ - curpos);
  return normalize(cross(tangentZ, tangentX));
}`,fragmentHeader:``,vertex:{"#include <begin_vertex>":`transformed.z += getPos(transformed.xyz);`,"#include <beginnormal_vertex>":`objectNormal = getNormal(position.xyz);`},fragment:{"#include <dithering_fragment>":`
float randomNoise = noise(gl_FragCoord.xy);
gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`},material:{fog:!0},uniforms:{diffuse:new l(0),time:{shared:!0,mixed:!0,linked:!0,value:0},roughness:.3,metalness:.3,uSpeed:{shared:!0,mixed:!0,linked:!0,value:a},envMapIntensity:10,uNoiseIntensity:o,uScale:s}}),[a,o,s]);return(0,f.useEffect)(()=>()=>d.dispose(),[d]),(0,h.jsxs)(_,{children:[(0,h.jsxs)(`group`,{rotation:[0,0,m(c)],children:[(0,h.jsx)(S,{ref:u,material:d,count:n,width:e,height:t}),(0,h.jsx)(C,{color:i,position:[0,3,10]})]}),(0,h.jsx)(`ambientLight`,{intensity:1}),(0,h.jsx)(`color`,{attach:`background`,args:[`#000000`]})]})};function b(e,t,n,r,a){let o=new i,s=e*(a+1)*2,c=e*a*2,l=new Float32Array(s*3),u=new Uint32Array(c*3),f=new Float32Array(s*2),p=0,m=0,h=0,g=-(e*t+(e-1)*r)/2;for(let i=0;i<e;i++){let e=g+i*(t+r),o=Math.random()*300,s=Math.random()*300;for(let r=0;r<=a;r++){let i=n*(r/a-.5);l.set([e,i,0,e+t,i,0],p*3);let c=r/a;if(f.set([o,c+s,o+1,c+s],h),r<a){let e=p,t=p+1,n=p+2,r=p+3;u.set([e,t,n,n,t,r],m),m+=6}p+=2,h+=4}}return o.setAttribute(`position`,new d(l,3)),o.setAttribute(`uv`,new d(f,2)),o.setIndex(new d(u,1)),o.computeVertexNormals(),o}var x=(0,f.forwardRef)(({material:e,width:t,count:n,height:r},i)=>{let a=(0,f.useRef)(null);(0,f.useImperativeHandle)(i,()=>a.current);let s=(0,f.useMemo)(()=>b(n,t,r,0,48),[n,t,r]);return o((e,t)=>{a.current&&(a.current.material.uniforms.time.value+=.1*t)}),(0,h.jsx)(`mesh`,{ref:a,geometry:s,material:e})});x.displayName=`MergedPlanes`;var S=(0,f.forwardRef)((e,t)=>(0,h.jsx)(x,{ref:t,material:e.material,width:e.width,count:e.count,height:e.height}));S.displayName=`PlaneNoise`;var C=({position:e,color:t})=>{let n=(0,f.useRef)(null);return(0,f.useEffect)(()=>{if(!n.current)return;let e=n.current.shadow.camera;e&&(e.top=24,e.bottom=-24,e.left=-24,e.right=24,e.far=64,n.current.shadow.bias=-.004)},[]),(0,h.jsx)(`directionalLight`,{ref:n,color:t,intensity:1,position:e})};export{y as default};