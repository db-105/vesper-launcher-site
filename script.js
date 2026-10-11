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
  // Independent release lanes: Stable stays on latest; Beta only uses its explicit tag.
  // Exact reviewed asset sizes/digests prevent an unexpected replacement enabling a download.
  const channels = {
    "stable": {
      "tag": "v0.4.0",
      "prerelease": false,
      "endpoint": "https://api.github.com/repos/db-105/vesper-launcher-releases/releases/latest",
      "label": "Vesper Launcher 0.4.0 — Stable",
      "assets": [
        {
          "name": "latest.json",
          "size": 1147,
          "digest": "sha256:8e1b5a11e88af4155f5d038af576904017ef9d75ad4ddff3c741e370c2a13b99"
        },
        {
          "name": "SHA256SUMS",
          "size": 369,
          "digest": "sha256:39d5118d920d49cc50392d850ad4d5d92df5eff7eb422dbdb887a649ab217d70"
        },
        {
          "name": "Vesper.Launcher_0.4.0_x64-setup.exe",
          "size": 8583770,
          "digest": "sha256:9a22e2cfe9d2bcc98db31a131649be3eeef6702af247b4d27952156a56804f1b"
        },
        {
          "name": "Vesper.Launcher_0.4.0_x64-setup.exe.sig",
          "size": 428,
          "digest": "sha256:7f6868236f8459b4c8b42ced3214b5a92f6bba3c87bb8ac3ed0791174e388f8e"
        }
      ]
    },
    "beta": {
      "tag": "v0.5.0",
      "prerelease": true,
      "endpoint": "https://api.github.com/repos/db-105/vesper-launcher-releases/releases/tags/v0.5.0",
      "label": "Vesper Launcher 0.5.0 — Public Beta (Manual Download)",
      "assets": [
        {
          "name": "Vesper.Launcher_0.5.0_x64-setup.exe",
          "size": 11532074,
          "digest": "sha256:ff0984f35355ad1fe22af59ec0201660c652ce66043190c6edbfbaf784971097"
        },
        {
          "name": "Vesper.Launcher_0.5.0_x64-setup.exe.sig",
          "size": 428,
          "digest": "sha256:2a25190d96e3aa51245de05f43050f23b340aa0fe46bdb2430aec0d032d39345"
        },
        {
          "name": "latest.json",
          "size": 7608,
          "digest": "sha256:a33095572b4c3a1da767e824422641244afeaca9c3fcd0a87f1019f82aa0e8da"
        },
        {
          "name": "RELEASE-NOTES.md",
          "size": 6783,
          "digest": "sha256:f3ac02383bc5ed3d541c8ac0af96c8de153cc690b27b66f9962bdc69fcc96dff"
        },
        {
          "name": "SHA256SUMS",
          "size": 369,
          "digest": "sha256:fd15dfdea3c40c4728f61b5622cc6a1ea361cc1ab4246fc54e8dd155f0d5892c"
        }
      ]
    }
  };
  function loadChannel(lane, config) {
    const select = name => document.querySelectorAll('[data-' + name + '="' + lane + '"]');
    const buttons = select('download'), labels = select('download-label'), statuses = select('release-status');
    const notes = select('release-notes'), sums = select('checksums');
    const disable = () => {
      [...buttons, ...notes, ...sums].forEach(link => { link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true'); link.classList.add('is-disabled'); });
      labels.forEach(label => label.textContent = config.label);
      statuses.forEach(status => status.textContent = lane === 'beta' ? 'Beta download temporarily unavailable' : 'Stable download temporarily unavailable');
    };
    disable();
    fetch(config.endpoint, { headers: { Accept: 'application/vnd.github+json' } }).then(response => {
      if (!response.ok) throw new Error('Release unavailable');
      return response.json();
    }).then(release => {
      const page = 'https://github.com/db-105/vesper-launcher-releases/releases/tag/' + config.tag;
      if (release.draft !== false || release.prerelease !== config.prerelease || release.tag_name !== config.tag || release.html_url !== page) throw new Error('Unexpected release');
      const base = 'https://github.com/db-105/vesper-launcher-releases/releases/download/' + config.tag + '/';
      const verified = config.assets.map(expected => {
        const matches = (release.assets || []).filter(asset => asset.name === expected.name);
        const asset = matches[0];
        if (matches.length !== 1 || asset.state !== 'uploaded' || asset.size !== expected.size || asset.digest !== expected.digest || asset.browser_download_url !== base + expected.name) throw new Error('Release assets differ from reviewed files');
        return asset;
      });
      const installer = verified.find(asset => asset.name.endsWith('-setup.exe'));
      const enable = (links, href) => links.forEach(link => { link.href = href; link.removeAttribute('aria-disabled'); link.classList.remove('is-disabled'); });
      enable(buttons, installer.browser_download_url);
      enable(notes, verified.find(asset => asset.name === 'RELEASE-NOTES.md')?.browser_download_url || page);
      enable(sums, verified.find(asset => asset.name === 'SHA256SUMS').browser_download_url);
      statuses.forEach(status => status.textContent = lane === 'beta' ? 'Manual installation · optional Client 0.1.0 · 26.1.2 / 26.3' : 'Latest Stable · existing automatic update channel unchanged');
    }).catch(disable);
  }
  Object.entries(channels).forEach(([lane, config]) => loadChannel(lane, config));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href'),t=id&&document.querySelector(id);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reducedMotion?'auto':'smooth'});}));
})();
