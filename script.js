'use strict';
document.documentElement.classList.add('js');

/* ===== BUSINESS SETTINGS: edit these before launch ===== */
const CONFIG = {
  currency: 'UGX',
  pricesArePlaceholders: true,     // set false once the prices below are real
  whatsappNumber: '',              // international format, digits only, e.g. '256700000000'
  phone: '',                       // e.g. '+256 700 000000'
  email: '',                       // e.g. 'hello@yourdomain.com'
  location: '',                    // e.g. 'Kampala, delivery within town'
  hours: '',                       // e.g. 'Mon-Sat, 7am-7pm'
  formEndpoint: '',                // e.g. a Formspree URL; leave empty until you have one
  social: { Instagram: '', Facebook: '', TikTok: '' },
  autoplayMs: 6000
};

/* ===== PRODUCTS: edit names, descriptions, prices and photos here ===== */
const PRODUCTS = [
  { id: 'mango', name: 'Golden Mango', cat: 'tropical', label: 'Tropical', price: 8000, img: 'assets/images/golden-mango.jpg', c1: '#FF9F43', c2: '#FFD166',
    desc: 'Fresh mango juice. Sweet, tropical and naturally refreshing.', promo: 'Sweet, golden and full of tropical sunshine.', alt: 'Glass of mango juice beside ripe mangoes', featured: true },
  { id: 'orange', name: 'Sunrise Orange', cat: 'citrus', label: 'Citrus', price: 7000, img: 'assets/images/sunrise-orange.jpg', c1: '#F28C28', c2: '#FFD166',
    desc: 'Fresh orange juice. Bright, citrusy and refreshing.', promo: 'A bright, citrusy start to any morning.', alt: 'Glass of fresh orange juice with orange slices', featured: true },
  { id: 'pineapple', name: 'Tropical Pineapple', cat: 'tropical', label: 'Tropical', price: 8000, img: 'assets/images/tropical-pineapple.jpg', c1: '#E8B923', c2: '#FFF1A8',
    desc: 'Fresh pineapple juice with a sweet, refreshing finish.', promo: 'Sweet and zesty, straight from the tropics.', alt: 'Pineapple juice with fresh pineapple slices', featured: true },
  { id: 'watermelon', name: 'Watermelon Splash', cat: 'blend', label: 'Fruit Blend', price: 7500, img: 'assets/images/watermelon-splash.jpg', c1: '#E5566D', c2: '#FF9AA8',
    desc: 'Light, fruity watermelon juice, perfect for warm days.', promo: 'Light, juicy and made for warm afternoons.', alt: 'Watermelon juice with watermelon wedges', featured: true },
  { id: 'passion', name: 'Passion Burst', cat: 'tropical', label: 'Tropical', price: 8500, img: 'assets/images/passion-burst.jpg', c1: '#E8751A', c2: '#FFB347',
    desc: 'Passion fruit juice. Tangy, vibrant and full of character.', alt: 'Passion fruit juice with halved passion fruits' },
  { id: 'green', name: 'Green Garden', cat: 'blend', label: 'Fruit Blend', price: 9000, img: 'assets/images/green-garden.jpg', c1: '#4F9D69', c2: '#B7E4C7',
    desc: 'A refreshing green fruit blend for lovers of green flavors.', alt: 'Glass of green juice with mint and lime' }
];

/* ===== helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = n => CONFIG.currency + ' ' + new Intl.NumberFormat('en-US').format(n);
const byId = id => PRODUCTS.find(p => p.id === id);

/* Graceful image fallback: a branded illustration replaces any photo that fails to load */
function fallbackArt(c1, c2, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="610" cy="170" r="120" fill="#fff" opacity=".2"/><circle cx="610" cy="170" r="92" fill="#fff" opacity=".25"/><circle cx="150" cy="470" r="150" fill="#fff" opacity=".12"/><path d="M300 130h200l-24 330q-2 24-26 24h-100q-24 0-26-24z" fill="#fff" opacity=".35"/><path d="M312 230h176l-16 230q-2 24-26 24h-92q-24 0-26-24z" fill="${c1}"/><text x="400" y="545" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#174D35">${name || 'BHT Juice'}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName !== 'IMG' || img.dataset.fb) return;
  img.dataset.fb = '1';
  img.src = fallbackArt(img.dataset.c1 || '#4F9D69', img.dataset.c2 || '#FFD166', img.dataset.name);
}, true);

const imgTag = (p, extra = '') => `<img src="${p.img}" alt="${p.alt}" data-c1="${p.c1}" data-c2="${p.c2}" data-name="${p.name}" ${extra}>`;

/* ===== toast ===== */
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ===== carousel ===== */
function initCarousel() {
  const root = $('#carousel'); if (!root) return;
  const items = PRODUCTS.filter(p => p.featured);
  root.innerHTML = items.map((p, i) => `
    <article class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
      ${imgTag(p, `width="800" height="830" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}`)}
      <div class="slide-panel"><h3>${p.name}</h3><p>${p.promo}</p><button class="btn btn-accent" data-add="${p.id}">Order This Juice</button></div>
    </article>`).join('') +
    `<button class="arrow prev" aria-label="Previous flavor">&#8592;</button><button class="arrow next" aria-label="Next flavor">&#8594;</button>
     <div class="dots" role="tablist" aria-label="Choose a slide">${items.map((p, i) => `<button class="dot" role="tab" aria-label="Show ${p.name}" aria-selected="false" data-i="${i}"></button>`).join('')}</div>`;
  const slides = $$('.slide', root), dots = $$('.dot', root);
  let cur = 0, timer = null;
  const show = n => {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => { s.classList.toggle('active', i === cur); s.setAttribute('aria-hidden', i !== cur); });
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === cur));
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const play = () => { if (reduceMotion || timer) return; timer = setInterval(() => show(cur + 1), CONFIG.autoplayMs); };
  const restart = () => { stop(); play(); };
  root.addEventListener('click', e => {
    if (e.target.closest('.prev')) { show(cur - 1); restart(); }
    else if (e.target.closest('.next')) { show(cur + 1); restart(); }
    else { const d = e.target.closest('.dot'); if (d) { show(+d.dataset.i); restart(); } }
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { show(cur - 1); restart(); }
    if (e.key === 'ArrowRight') { show(cur + 1); restart(); }
  });
  ['mouseenter', 'focusin'].forEach(ev => root.addEventListener(ev, stop));
  ['mouseleave', 'focusout'].forEach(ev => root.addEventListener(ev, play));
  let x0 = null;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', e => {
    if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); }
    x0 = null; play();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
  show(0); play();
}

/* ===== products + filters ===== */
function renderProducts(filter = 'all') {
  const list = PRODUCTS.filter(p => filter === 'all' || p.cat === filter);
  $('#grid').innerHTML = list.map((p, i) => `
    <article class="card" style="--accent:${p.c1};animation-delay:${i * 60}ms">
      <div class="card-img">${imgTag(p, 'width="600" height="450" loading="lazy"')}<span class="tag">${p.label}</span></div>
      <div class="card-body"><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="buy"><span class="price">${money(p.price)}${CONFIG.pricesArePlaceholders ? '<small>Sample price</small>' : ''}</span>
        <button class="btn btn-primary" data-add="${p.id}" aria-label="Add ${p.name} to order">Add to Order</button></div></div>
    </article>`).join('');
}
function initFilters() {
  renderProducts();
  $('#priceNote').textContent = CONFIG.pricesArePlaceholders ? 'Prices shown are sample placeholders and will be confirmed by BHT Juice when you order.' : '';
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => {
    $$('[data-filter]').forEach(o => o.setAttribute('aria-pressed', o === b));
    renderProducts(b.dataset.filter);
  }));
}

/* ===== cart / order summary ===== */
const cart = new Map();
const drawer = $('#drawer'), overlay = $('#overlay');
let lastFocus = null;

function renderCart() {
  let count = 0, total = 0;
  const rows = [...cart].map(([id, q]) => {
    const p = byId(id); count += q; total += p.price * q;
    return `<div class="line">${imgTag(p, 'width="60" height="60"')}<div><b>${p.name}</b><small>${money(p.price)} each</small></div>
      <div class="qty"><button data-dec="${id}" aria-label="Decrease ${p.name}">&minus;</button><span aria-live="polite">${q}</span><button data-inc="${id}" aria-label="Increase ${p.name}">+</button><button class="rm" data-rm="${id}" aria-label="Remove ${p.name}">Remove</button></div></div>`;
  });
  $('#cartItems').innerHTML = rows.length ? rows.join('') : '<p class="empty">Your order is empty.<br>Add a juice from the menu to get started.</p>';
  $('#subtotal').textContent = money(total);
  $$('[data-cart-count]').forEach(c => { c.textContent = count; c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 220); });
  $('#clearCart').hidden = !rows.length;
  const wa = $('#waBtn'), num = CONFIG.whatsappNumber.replace(/\D/g, '');
  const lines = [...cart].map(([id, q]) => `- ${q} x ${byId(id).name} (${money(byId(id).price * q)})`);
  const msg = `Hello BHT Juice, I'd like to order:\n${lines.join('\n')}\nSubtotal: ${money(total)}${CONFIG.pricesArePlaceholders ? ' (sample prices, please confirm)' : ''}\nPlease confirm availability and delivery details.`;
  const ready = rows.length && num;
  wa.setAttribute('aria-disabled', !ready);
  wa.href = ready ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#';
  $('#cartNote').textContent = !num ? 'WhatsApp ordering is not configured yet. The business owner must add a number in js/script.js.'
    : 'This prepares a message only. Your order is confirmed once BHT Juice replies. No payment is taken here.';
}
function add(id) { cart.set(id, (cart.get(id) || 0) + 1); renderCart(); toast(`${byId(id).name} added to your order`); }
function openCart() {
  lastFocus = document.activeElement;
  drawer.hidden = overlay.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('show'); overlay.classList.add('show'); });
  $('#closeCart').focus(); document.body.style.overflow = 'hidden';
}
function closeCart() {
  drawer.classList.remove('show'); overlay.classList.remove('show');
  setTimeout(() => { drawer.hidden = overlay.hidden = true; }, reduceMotion ? 0 : 350);
  document.body.style.overflow = ''; if (lastFocus) lastFocus.focus();
}
function initCart() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) return add(a.dataset.add);
    if (e.target.closest('[data-open-cart]')) { closeMenu(); return openCart(); }
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
    if (inc) cart.set(inc.dataset.inc, cart.get(inc.dataset.inc) + 1);
    if (dec) { const id = dec.dataset.dec, q = cart.get(id) - 1; q > 0 ? cart.set(id, q) : cart.delete(id); }
    if (rm) cart.delete(rm.dataset.rm);
    if (inc || dec || rm) renderCart();
  });
  $('#closeCart').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#clearCart').addEventListener('click', () => { cart.clear(); renderCart(); });
  $('#waBtn').addEventListener('click', e => { if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  drawer.addEventListener('keydown', e => {          // keep focus inside the open drawer
    if (e.key === 'Escape') return closeCart();
    if (e.key !== 'Tab') return;
    const f = $$('button:not([hidden]),a[href]', drawer).filter(x => x.getAttribute('aria-disabled') !== 'true');
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  renderCart();
}

/* ===== navigation ===== */
const burger = $('#burger'), nav = $('#nav');
function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
function initNav() {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); burger.focus(); } });
  const header = $('#header');
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });
  const links = $$('a', nav);
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));
  $('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

/* ===== scroll reveals ===== */
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ===== contact details + social (filled from CONFIG; placeholders stay if empty) ===== */
function initContact() {
  const href = { phone: v => 'tel:' + v.replace(/\s/g, ''), email: v => 'mailto:' + v, whatsappNumber: v => 'https://wa.me/' + v.replace(/\D/g, '') };
  $$('[data-contact]').forEach(el => {
    const k = el.dataset.contact, v = CONFIG[k];
    if (v) { el.textContent = v; if (el.tagName === 'A' && href[k]) el.href = href[k](v); }
    else el.classList.add('ph');
  });
  $('#social').innerHTML = Object.entries(CONFIG.social).filter(([, u]) => u)
    .map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join('');
  $('#year').textContent = new Date().getFullYear();
}

/* ===== contact form (validation only; delivery needs a backend or form service) ===== */
function initForm() {
  const form = $('#form'), status = $('#formStatus');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    contact: v => /^\S+@\S+\.\S+$/.test(v.trim()) || /^[+\d][\d\s()-]{6,}$/.test(v.trim()) || 'Enter a valid email address or phone number.',
    message: v => v.trim().length >= 10 || 'Please write a message of at least 10 characters.'
  };
  const ids = { name: 'name', contact: 'contact', message: 'msg' };
  form.addEventListener('submit', async e => {
    e.preventDefault(); status.textContent = '';
    let ok = true;
    for (const k in rules) {
      const input = form.elements[k], res = rules[k](input.value), err = $('#e-' + ids[k]);
      err.textContent = res === true ? '' : res; input.setAttribute('aria-invalid', res !== true);
      if (res !== true && ok) { input.focus(); ok = false; }
    }
    if (!ok) return;
    if (!CONFIG.formEndpoint) {
      status.textContent = 'This form is not connected to a delivery service yet, so nothing was sent. Please use WhatsApp, phone or email instead.';
      return;
    }
    try {
      const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!r.ok) throw new Error();
      status.textContent = 'Thank you. Your message was sent.'; form.reset();
    } catch { status.textContent = 'Sorry, the message could not be sent. Please try again or contact us directly.'; }
  });
}

/* ===== start ===== */
initCarousel(); initFilters(); initCart(); initNav(); initReveal(); initContact(); initForm();
