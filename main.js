/* Riddhix Technology - main.js */
const CONFIG = { email: 'info@riddhix.com' }; // <-- change to your real email
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* entrance */
addEventListener('load', () => setTimeout(() => document.body.classList.add('ready'), reduce ? 0 : 1700));
setTimeout(() => document.body.classList.add('ready'), 4000);

/* mobile menu */
const nv = $('#nv'), bm = $('#bm');
bm.onclick = () => nv.classList.toggle('open');
nv.onclick = () => nv.classList.remove('open');

/* service rows */
$$('.row').forEach(r => r.firstElementChild.onclick = () => {
  const open = r.classList.contains('on');
  $$('.row').forEach(x => x.classList.remove('on'));
  if (!open) r.classList.add('on');
});
$('.row').classList.add('on');

/* cursor + magnetic buttons */
const cur = $('.cur');
addEventListener('pointermove', e => {
  cur.style.opacity = 1; cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  cur.classList.toggle('big', !!e.target.closest('a,button,.row'));
});
$$('.mag').forEach(b => {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});

/* headline reveal for section titles */
const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } }), { threshold: .3 });
$$('.split').forEach(h => {
  const words = h.textContent.trim().split(' '); h.innerHTML = '';
  words.forEach((w, i) => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-right:.26em'; s.innerHTML = `<span style="display:inline-block;transform:translateY(110%);transition:transform .9s cubic-bezier(.2,.8,.2,1) ${i * 60}ms">${w}</span>`; h.appendChild(s); });
  sio.observe(h);
});
const st = document.createElement('style'); st.textContent = '.split.in span span{transform:none!important}'; document.head.appendChild(st);

/* scroll: header, 3D layer stack, process line */
const hd = $('#hd'), stack = $('#layers'), iso = $('.iso'), layers = $$('.layer'), dots = $$('.dots i'), box = $('.sp-box'), pl = $('.pl');
const info = [
  ['Website Design', 'The layer your customers see first. Fast, responsive and built to turn visits into enquiries.'],
  ['IoT', 'Sensors and gateways feeding live data upward, so the site and apps always reflect what is really happening.'],
  ['Mobile Application', 'Phones put your product in people\u2019s hands. Apps connect to the same data and the same logic.'],
  ['Custom Software', 'The foundation: databases, APIs and business rules that every other layer relies on.']
];
let lastY = 0, cur_i = -1;
function setInfo(i) {
  if (i === cur_i) return; cur_i = i; box.classList.add('sw');
  setTimeout(() => { $('#sp-t').textContent = info[i][0]; $('#sp-d').textContent = info[i][1]; box.classList.remove('sw'); }, 220);
  layers.forEach(l => l.classList.toggle('on', l.style.getPropertyValue('--i') == 3 - i));
  dots.forEach((d, k) => d.classList.toggle('on', k === i));
}
function onScroll() {
  const y = scrollY; hd.classList.toggle('hide', y > lastY && y > 300); lastY = y;
  const p = clamp((y - stack.offsetTop) / (stack.offsetHeight - innerHeight), 0, 1);
  const ex = 1 - Math.pow(1 - clamp(p * 3, 0, 1), 3);
  iso.style.setProperty('--gap', (14 + ex * 96) + 'px');
  iso.style.transform = `rotateX(${58 - p * 8}deg) rotateZ(${-40 + p * 50}deg) translateZ(-90px)`;
  if (p > 0 && p < 1 || cur_i < 0) setInfo(Math.min(3, Math.floor(p * 4)));
  const r = $('.steps').getBoundingClientRect();
  pl.firstElementChild.style.height = clamp((innerHeight * .6 - r.top) / r.height, 0, 1) * 100 + '%';
}
addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true }); onScroll();

/* contact form -> opens email client (swap for Formspree if you prefer) */
$('#f').onsubmit = e => {
  e.preventDefault(); const f = e.target, m = $('#fm');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value)) { m.textContent = 'Please enter your name and a valid email address.'; return; }
  const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\nService: ${f.svc.value}\n\n${f.msg.value}`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Project enquiry from ' + f.name.value)}&body=${encodeURIComponent(body)}`;
  m.textContent = 'Opening your email app. Thank you!';
};

/* 3D hero (three.js) */
(function () {
  const cv = $('#gl'); if (!cv || typeof THREE === 'undefined') return;
  const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(40, 1, .1, 100); C.position.z = 9;
  S.add(new THREE.AmbientLight(0xffffff, .55));
  const k = new THREE.DirectionalLight(0xffffff, 1.1); k.position.set(4, 5, 6); S.add(k);
  const o = new THREE.PointLight(0xf7941d, 2.2, 30); o.position.set(-5, -3, 4); S.add(o);
  const b = new THREE.PointLight(0x1e88e5, 1.6, 30); b.position.set(5, -4, -2); S.add(b);
  const G = new THREE.Group(); S.add(G);
  const geo = new THREE.IcosahedronGeometry(1.7, 7), base = geo.attributes.position.array.slice();
  const core = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0b4aa8, metalness: .55, roughness: .22 })); G.add(core);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.25, 2), new THREE.MeshBasicMaterial({ color: 0xf7941d, wireframe: true, transparent: true, opacity: .3 })); G.add(shell);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.1, .03, 12, 220), new THREE.MeshBasicMaterial({ color: 0xf7941d })); ring.rotation.x = 1.25; G.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.7, .018, 12, 220), new THREE.MeshBasicMaterial({ color: 0x0b4aa8 })); ring2.rotation.set(1.9, .4, 0); G.add(ring2);
  const mat = c => new THREE.MeshStandardMaterial({ color: c, metalness: .4, roughness: .3 });
  const sats = [
    [new THREE.BoxGeometry(.9, .6, .06), 0xffffff, 0],            // browser
    [new THREE.BoxGeometry(.38, .72, .06), 0xf7941d, 1.57],       // phone
    [new THREE.OctahedronGeometry(.3), 0x1e88e5, 3.14],           // iot node
    [new THREE.TorusGeometry(.26, .1, 8, 6), 0x06173a, 4.71]      // gear
  ].map(([g, c, a]) => { const m = new THREE.Mesh(g, mat(c)); m.userData.a = a; G.add(m); return m; });
  const N = 260, pp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const r = 4.5 + Math.random() * 3, t = Math.random() * 6.28, u = Math.random() * 3.14; pp[i * 3] = r * Math.sin(u) * Math.cos(t); pp[i * 3 + 1] = r * Math.cos(u); pp[i * 3 + 2] = r * Math.sin(u) * Math.sin(t); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x0b4aa8, size: .05 })); S.add(pts);
  function size() { const w = cv.clientWidth, h = cv.clientHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); G.position.x = w < 700 ? 0 : -.3; G.scale.setScalar(w < 700 ? .8 : 1); }
  size(); addEventListener('resize', size);
  let mx = 0, my = 0, tx = 0, ty = 0, vis = true;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  new IntersectionObserver(e => vis = e[0].isIntersecting).observe(cv);
  const clock = new THREE.Clock(); const pos = geo.attributes.position;
  (function loop() {
    requestAnimationFrame(loop); if (!vis) return;
    const t = clock.getElapsedTime() * (reduce ? 0 : 1);
    for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2]; const d = 1 + .09 * Math.sin(x * 1.7 + t * 1.2) * Math.sin(y * 1.5 + t) + .05 * Math.sin(z * 2.6 - t * 1.4); pos.setXYZ(i, x * d, y * d, z * d); }
    pos.needsUpdate = true; geo.computeVertexNormals();
    core.rotation.y = t * .15; shell.rotation.y = -t * .1; shell.rotation.x = t * .07; ring.rotation.z = t * .25; ring2.rotation.z = -t * .18; pts.rotation.y = t * .03;
    sats.forEach((m, i) => { const a = m.userData.a + t * .4, rr = 3.1 + (i % 2) * .6; m.position.set(Math.cos(a) * rr, Math.sin(a * 1.3) * 1.2, Math.sin(a) * rr); m.rotation.x = t * .6 + i; m.rotation.y = t * .5; });
    tx += (mx - tx) * .05; ty += (my - ty) * .05;
    G.rotation.y = tx * .9 + scrollY * .0008; G.rotation.x = ty * .5;
    R.render(S, C);
  })();
})();
