import { $, esc, loadData, priceText } from './main.js';

export async function mount() {
  const host = $('#detail');
  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    host.innerHTML = '<p class="loading">没有指定商品。回<a href="products.html">商品页</a>挑一件吧。</p>';
    return;
  }
  let products;
  try {
    ({ products } = await loadData('products'));
  } catch {
    host.innerHTML = '<p class="loading">商品读不出来，刷新一次试试。</p>';
    return;
  }
  const p = products.find((x) => x.id.toLowerCase() === id.toLowerCase());
  if (!p) {
    host.innerHTML = `<p class="loading">没有找到编号 ${esc(id)}。回<a href="products.html">商品页</a>看看。</p>`;
    return;
  }
  document.title = `${p.name} · 渡物 Dimension`;

  const spec = [
    ['材质', p.material],
    ['颜色', p.color],
    ['尺寸', p.size],
    ['推出年份', p.year],
    ['质保', p.warranty],
    ['安装', p.install],
  ].filter(([, v]) => v);

  host.innerHTML = `
    <a class="back" href="products.html">← 回到商品</a>
    <div class="detail-layout">
      <div class="detail-media">${p.image ? `<img src="${p.image}" alt="${esc(p.name)}">` : ''}</div>
      <div class="detail-body">
        <p class="kicker">${esc(p.categoryName)} · ${esc(p.id)}</p>
        <h1>${esc(p.name)}</h1>
        <p class="detail-sub">${esc(p.designer || '渡物自营')}</p>
        <p class="detail-price">${priceText(p.price)}</p>
        <dl class="spec">${spec.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${p.desc ? `<p class="detail-desc">${esc(p.desc)}</p>` : ''}
        <div class="detail-actions">
          <a class="btn solid" href="studio.html?add=${encodeURIComponent(p.id)}">放进房间试试</a>
          <a class="btn ghost" href="assistant.html?ask=${encodeURIComponent(p.name)}">问卷尺人</a>
        </div>
      </div>
    </div>`;
  host.removeAttribute('aria-busy');
}
