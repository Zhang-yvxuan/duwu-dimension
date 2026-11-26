/* 站点外壳：导航状态、背景音乐、数据加载、按页挂载 */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const cache = new Map();
export function loadData(name) {
  if (!cache.has(name)) {
    cache.set(name, fetch(`data/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`${name}: ${r.status}`);
      return r.json();
    }).catch((e) => { cache.delete(name); throw e; }));
  }
  return cache.get(name);
}

export function priceText(p) {
  if (!p) return '面议';
  const n = Number(String(p).replace(/[^\d.]/g, ''));
  if (!n) return p;
  return '¥ ' + n.toLocaleString('zh-CN');
}

export function cardHTML(p) {
  return `<a class="card" href="detail.html?id=${encodeURIComponent(p.id)}">
    <div class="card-media">${p.image ? `<img src="${p.image}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : ''}</div>
    <div class="card-body">
      <span class="card-cat">${esc(p.categoryName)}</span>
      <h3>${esc(p.name)}</h3>
      <div class="card-meta"><span>${esc(p.designer || '渡物自营')}</span><span class="card-price">${priceText(p.price)}</span></div>
    </div>
  </a>`;
}

/* 顶部导航滚动状态 */
const topBar = $('.top');
if (topBar) {
  const sync = () => topBar.toggleAttribute('data-stuck', scrollY > 8);
  addEventListener('scroll', sync, { passive: true });
  sync();
}

/* 背景音乐 */
const bgm = $('#bgm');
const soundBtn = $('.sound');
if (bgm && soundBtn) {
  soundBtn.addEventListener('click', async () => {
    if (bgm.paused) {
      try {
        await bgm.play();
        soundBtn.setAttribute('aria-pressed', 'true');
        soundBtn.setAttribute('aria-label', '关闭背景音乐');
      } catch {
        soundBtn.setAttribute('aria-pressed', 'false');
      }
    } else {
      bgm.pause();
      soundBtn.setAttribute('aria-pressed', 'false');
      soundBtn.setAttribute('aria-label', '打开背景音乐');
    }
  });
}

/* 按页挂载 */
const mounters = {
  index: () => import('./view-home.js'),
  products: () => import('./view-products.js'),
  detail: () => import('./view-detail.js'),
  studio: () => import('./view-studio.js'),
  assistant: () => import('./view-assistant.js'),
};
const page = document.body.dataset.page;
const factory = mounters[page];
if (factory) {
  factory().then((m) => m.mount()).catch((err) => {
    console.error(err);
    const host = $('#grid') || $('#featured') || $('#detail') || $('#log');
    if (host) host.innerHTML = '<p class="loading">这部分暂时没加载成功，刷新一下试试。</p>';
  });
}
