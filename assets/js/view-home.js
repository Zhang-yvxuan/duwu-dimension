import { $, $$, loadData, cardHTML } from './main.js';

const FEATURED = ['ch-001', 'sf-003', 'bd-001', 'lt-001', 'tb-003', 'cb-003', 'sh-006', 'dc-002'];

export async function mount() {
  const host = $('#featured');
  try {
    const { products } = await loadData('products');
    const byId = new Map(products.map((p) => [p.id.toLowerCase(), p]));
    const picks = FEATURED.map((id) => byId.get(id.toLowerCase())).filter(Boolean);
    host.innerHTML = picks.map(cardHTML).join('');
    host.removeAttribute('aria-busy');
  } catch {
    host.innerHTML = '<p class="loading">精选暂时读不出来，去商品页看看吧。</p>';
  }

  const video = $('#heroVideo');
  const buttons = $$('.season');
  if (video && buttons.length) {
    let current = 'spring';
    const swap = (key) => {
      if (key === current) return;
      current = key;
      video.classList.add('is-fading');
      const next = `assets/video/${key}.mp4`;
      const onReady = () => {
        video.classList.remove('is-fading');
        video.removeEventListener('canplay', onReady);
      };
      video.addEventListener('canplay', onReady);
      video.src = next;
      video.play().catch(() => {});
    };
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        swap(btn.dataset.season);
      });
    });
  }
}
