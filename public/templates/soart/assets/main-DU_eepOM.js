(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();function N(){const t=document.querySelector(".nav"),n=t==null?void 0:t.querySelector(".nav-toggle"),e=t==null?void 0:t.querySelectorAll(".nav-links a");if(!t||!n)return;const o=i=>{t.dataset.open=String(i),n.setAttribute("aria-expanded",String(i))};n.addEventListener("click",()=>{o(t.dataset.open!=="true")}),e==null||e.forEach(i=>{i.addEventListener("click",()=>o(!1))})}function U(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.querySelectorAll("[data-reveal]").forEach(n=>n.classList.add("reveal")),document.querySelectorAll("[data-reveal-group]").forEach(n=>{Array.from(n.children).forEach((e,o)=>{e.classList.add("reveal"),e.style.transitionDelay=`${Math.min(o*70,350)}ms`})});const t=new IntersectionObserver((n,e)=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("is-visible"),e.unobserve(o.target))})},{threshold:.15,rootMargin:"0px 0px -10% 0px"});document.querySelectorAll(".reveal").forEach(n=>t.observe(n))}function D(){var E;const t=document.querySelector("#product-modal");if(!t)return;const n=t.querySelector(".product-modal-panel"),e=t.querySelector(".product-modal-slides"),o=t.querySelector(".product-modal-dots"),i=t.querySelector(".product-modal-prev"),r=t.querySelector(".product-modal-next"),u=t.querySelector(".product-modal-caption"),b=t.querySelector(".product-modal-name"),w=t.querySelector(".product-modal-price"),x=t.querySelector(".product-modal-desc"),_=t.querySelector(".product-modal-cta");let v=null,l=0,p=[],L=[];const y=c=>{l=(c+p.length)%p.length,p.forEach((d,f)=>d.classList.toggle("is-active",f===l)),L.forEach((d,f)=>d.classList.toggle("is-active",f===l))},A=()=>{v&&window.clearInterval(v),v=null},h=()=>{A(),!(p.length<2)&&(v=window.setInterval(()=>y(l+1),3500))},m=c=>{y(c),h()},q=(c,d)=>{e.innerHTML="",o.innerHTML="",p=c.map((R,S)=>{const a=document.createElement("div");a.className="product-modal-slide";const C=document.createElement("img");return C.src=R,C.alt=d[S]||"",a.appendChild(C),e.appendChild(a),a}),L=c.map((R,S)=>{const a=document.createElement("button");return a.type="button",a.className="product-modal-dot",a.setAttribute("aria-label",`Foto ${S+1}`),a.addEventListener("click",()=>m(S)),o.appendChild(a),a});const f=c.length>1;i.hidden=!f,r.hidden=!f,o.hidden=!f},s=c=>{const{name:d,price:f,desc:R,img:S,images:a,detailImg:C,detailCaption:F}=c.dataset,P=a?a.split(",").map(O=>O.trim()).filter(Boolean):[S,C].filter(Boolean),M=P.map((O,B)=>B===0?d:`${d} -- foto ${B+1}`);q(P,M),u.textContent=!a&&F?F:"",u.hidden=!u.textContent,b.textContent=d,w.textContent=f,x.textContent=R,_.href=`mailto:contacto@sofart.com?subject=${encodeURIComponent(`Disponibilidad: ${d}`)}`,y(0),t.dataset.open="true",document.body.classList.add("modal-open"),h()},g=()=>{t.dataset.open="false",document.body.classList.remove("modal-open"),A()};document.querySelectorAll(".product-photo").forEach(c=>{c.addEventListener("click",()=>s(c.closest(".product-card")))}),(E=t.querySelector(".product-modal-close"))==null||E.addEventListener("click",g),t.addEventListener("click",c=>{n.contains(c.target)||g()}),i.addEventListener("click",()=>m(l-1)),r.addEventListener("click",()=>m(l+1)),document.addEventListener("keydown",c=>{t.dataset.open==="true"&&(c.key==="Escape"&&g(),c.key==="ArrowLeft"&&m(l-1),c.key==="ArrowRight"&&m(l+1))})}const k=`
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,H=`
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0) * 2.6;

  float t = uTime * 0.06;
  vec2 flow = vec2(fbm(p + t), fbm(p - t + 4.2));
  float field = fbm(p + flow * 1.3 + t * 0.25);

  float fringe = sin(field * 14.0 + uTime * 0.18) * 0.5 + 0.5;

  vec3 col = mix(uColorA, uColorB, fringe);
  col = mix(col, uColorC, pow(fringe, 2.2) * 0.6);

  float alpha = smoothstep(0.0, 1.0, field) * 0.7;
  gl_FragColor = vec4(col, alpha);
}
`,$=[.02,.01,.005],G=[.68,.4,.1],V=[1,.93,.68];function T(t,n){if(!t)return n;const e=t.split(",").map(o=>parseFloat(o.trim()));return e.length===3&&e.every(o=>!Number.isNaN(o))?e:n}function I(t,n,e){const o=t.createShader(n);return t.shaderSource(o,e),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.warn("sheen-effect: shader compile error",t.getShaderInfoLog(o)),t.deleteShader(o),null)}function z(t,n){const e=t.getContext("webgl",{alpha:!0,premultipliedAlpha:!1});if(!e)return;const o=I(e,e.VERTEX_SHADER,k),i=I(e,e.FRAGMENT_SHADER,H);if(!o||!i)return;const r=e.createProgram();if(e.attachShader(r,o),e.attachShader(r,i),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)){console.warn("sheen-effect: program link error",e.getProgramInfoLog(r));return}e.useProgram(r);const u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const b=e.getAttribLocation(r,"aPos");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0);const w=e.getUniformLocation(r,"uResolution"),x=e.getUniformLocation(r,"uTime"),_=T(t.dataset.sheenA,$),v=T(t.dataset.sheenB,G),l=T(t.dataset.sheenC,V),p=parseFloat(t.dataset.sheenSpeed)||1;e.uniform3f(e.getUniformLocation(r,"uColorA"),..._),e.uniform3f(e.getUniformLocation(r,"uColorB"),...v),e.uniform3f(e.getUniformLocation(r,"uColorC"),...l),e.clearColor(0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);function L(){const s=Math.min(window.devicePixelRatio||1,1.5),g=Math.max(1,Math.floor(t.clientWidth*s)),E=Math.max(1,Math.floor(t.clientHeight*s));(t.width!==g||t.height!==E)&&(t.width=g,t.height=E,e.viewport(0,0,g,E))}function y(s){L(),e.uniform2f(w,t.width,t.height),e.uniform1f(x,s*p),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,3)}if(y(0),n)return;let A=!0,h=null;function m(s){y(s*.001),A?h=requestAnimationFrame(m):h=null}new IntersectionObserver(s=>{A=s[0].isIntersecting,A&&!h&&(h=requestAnimationFrame(m))}).observe(t),window.addEventListener("resize",L)}function K(){const t=document.querySelectorAll("[data-sheen]");if(!t.length)return;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;t.forEach(e=>z(e,n))}"scrollRestoration"in history&&(history.scrollRestoration="manual");window.scrollTo(0,0);N();U();D();K();
