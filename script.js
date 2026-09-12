(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0, height = 0, dpr = 1, raf = 0;
    const start = performance.now();
    const rand = (() => { let seed = 0x5e5f3a1; return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); })();
    const centers = [[.09,.15],[.28,.29],[.51,.12],[.73,.27],[.92,.13],[.17,.61],[.57,.53],[.84,.69]];
    const stars = Array.from({ length: 340 }, () => {
      const clustered = rand() < .64;
      let x, y;
      if (clustered) {
        const [cx,cy] = centers[Math.floor(rand()*centers.length)];
        const a = rand()*Math.PI*2, r = Math.pow(rand(),1.8)*(.035+rand()*.12);
        x = Math.max(.005,Math.min(.995,cx+Math.cos(a)*r));
        y = Math.max(.01,Math.min(.86,cy+Math.sin(a)*r));
      } else { x=rand(); y=Math.pow(rand(),1.2)*.86; }
      return { x,y,r:.32+Math.pow(rand(),2.35)*1.85,a:.24+rand()*.76,phase:rand()*Math.PI*2,speed:.28+rand()*.86,cool:rand()>.76 };
    });
    const resize=()=>{ dpr=Math.min(devicePixelRatio||1,2); width=innerWidth; height=innerHeight; canvas.width=width*dpr; canvas.height=height*dpr; canvas.style.width=width+'px'; canvas.style.height=height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const draw=(now)=>{ ctx.clearRect(0,0,width,height); const t=(now-start)/1000, shift=scrollY*.018; for(const s of stars){ const tw=reducedMotion?1:.82+Math.sin(t*s.speed+s.phase)*.18, alpha=s.a*tw, x=s.x*width, y=s.y*height-shift*(.25+s.r*.25); if(y<-5||y>height+5) continue; ctx.beginPath(); ctx.fillStyle=s.cool?`rgba(161,205,255,${alpha})`:`rgba(238,247,255,${alpha})`; ctx.arc(x,y,s.r,0,Math.PI*2); ctx.fill(); if(s.r>1.25){ ctx.strokeStyle=`rgba(205,231,255,${alpha*.32})`; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(x-s.r*3,y); ctx.lineTo(x+s.r*3,y); ctx.moveTo(x,y-s.r*3); ctx.lineTo(x,y+s.r*3); ctx.stroke(); }} if(!reducedMotion) raf=requestAnimationFrame(draw); };
    resize(); addEventListener('resize',resize,{passive:true}); draw(start); addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }
  const reveals=document.querySelectorAll('[data-reveal]');
  if(reducedMotion) reveals.forEach(n=>n.classList.add('is-visible'));
  else if('IntersectionObserver'in window){ const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');o.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'}); reveals.forEach(n=>o.observe(n)); } else reveals.forEach(n=>n.classList.add('is-visible'));
  const nav=document.querySelector('.nav-wrap'); const sync=()=>nav?.classList.toggle('nav-scrolled',scrollY>24); sync(); addEventListener('scroll',sync,{passive:true});
  if(!reducedMotion){ const p=document.querySelector('[data-parallax]'); if(p) addEventListener('pointermove',e=>{ const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2; p.style.setProperty('--px',`${x*8}px`);p.style.setProperty('--py',`${y*6}px`); },{passive:true}); }
  const buttons=document.querySelectorAll('[data-download]'), labels=document.querySelectorAll('[data-download-label]'), versions=document.querySelectorAll('[data-version]'), status=document.querySelector('[data-release-status]');
  const disable=()=>{ buttons.forEach(b=>{b.removeAttribute('href');b.setAttribute('aria-disabled','true');b.classList.add('is-disabled')}); labels.forEach(n=>n.textContent='Public release coming soon'); versions.forEach(n=>n.textContent='Preview'); if(status)status.textContent='Release candidate in final testing'; };
  fetch('https://api.github.com/repos/db-105/vesper-launcher-releases/releases/latest',{headers:{Accept:'application/vnd.github+json'}}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(rel=>{const asset=(rel.assets||[]).find(a=>/\.exe$/i.test(a.name)&&!/\.sig$/i.test(a.name));if(!asset?.browser_download_url)throw 0;const v=String(rel.tag_name||rel.name||'Latest').replace(/^v/i,'');buttons.forEach(b=>{b.href=asset.browser_download_url;b.removeAttribute('aria-disabled');b.classList.remove('is-disabled')});labels.forEach(n=>n.textContent=`Download Vesper ${v}`);versions.forEach(n=>n.textContent=`v${v}`);if(status)status.textContent='Latest signed Windows release';}).catch(disable);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href'),t=id&&document.querySelector(id);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reducedMotion?'auto':'smooth'});}));
})();
