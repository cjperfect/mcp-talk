import{d as a,z as c,f as l,o as i,g as d,j as u,k as p}from"../modules/vue-uvfpF4v6.js";import{u as m}from"./context-Bf8G3BIH.js";function n(e){return e.startsWith("/")?"/mcp-talk/"+e.slice(1):e}function f(e,s=!1){const o=e&&["#","rgb","hsl"].some(r=>e.indexOf(r)===0),t={background:o?e:void 0,color:e&&!o?"white":void 0,backgroundImage:o?void 0:e?s?`linear-gradient(#0005, #0008), url(${n(e)})`:`url("${n(e)}")`:void 0,backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundSize:"cover"};return t.background||delete t.background,t}const v={class:"my-auto w-full"},k=a({__name:"cover",props:{background:{default:"https://source.unsplash.com/collection/94734566/1920x1080"}},setup(e){m();const s=e,o=c(()=>f(s.background,!0));return(t,r)=>(i(),l("div",{class:"slidev-layout cover text-center",style:p(o.value)},[d("div",v,[u(t.$slots,"default")])],4))}});export{k as _};
