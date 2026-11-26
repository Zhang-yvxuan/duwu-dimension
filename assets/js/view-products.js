import { $, $$, esc, loadData, cardHTML, priceText } from './main.js';

export async function mount() {
  const grid = $('#grid');
  const chips = $('#cats');
  const count = $('#count');
  const input = $('#q');

  let data;
  try {
    data = await loadData('products');
  } catch {
    grid.innerHTML = '<p class="loading">商品读不出来，刷新一次试试。</p>';
    return;
  }

  const { categories, products } = data;
  let cat = 'all';
  let keyword = '';

  chips.innerHTML = [
    `<button type="button" class="chip" data-cat="all" aria-pressed="true">全部 74</button>`,
    ...categories.map((c) => {
      const n = products.filter((p) => p.category === c.key).length;
      return `<button type="button" class="chip" data-cat="${c.key}" aria-pressed="false">${esc(c.name)} ${n}</button>`;
    }),
  ].join('');

  const normal = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, '');

  function render() {
    const q = normal(keyword);
    const rows = products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (!q) return true;
      return normal([p.name, p.id, p.designer, p.material, p.color, p.categoryName, p.desc].join(' ')).includes(q);
    });
    count.textContent = q || cat !== 'all'
      ? `筛出 ${rows.length} 件${q ? ` · 关键词「${keyword}」` : ''}`
      : `${products.length} 件在售`;
    grid.innerHTML = rows.length
      ? rows.map(cardHTML).join('')
      : '<p class="loading">没有匹配的家具，换个词或点「全部」试试。</p>';
    grid.removeAttribute('aria-busy');
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    cat = btn.dataset.cat;
    $$('[data-cat]', chips).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    render();
  });

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      keyword = input.value.trim();
      render();
    }, 140);
  });

  render();
}
