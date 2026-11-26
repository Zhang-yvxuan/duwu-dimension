import { $, $$, esc } from './main.js';

/* 十二件家具：宽高都是相对画布宽度的百分比 */
const MODELS = [
  { key: 'rug', name: '地毯', src: 'assets/img/models/01-地毯.webp', w: 26, h: 20 },
  { key: 'lamp', name: '落地灯', src: 'assets/img/models/02-落地灯.webp', w: 9, h: 20 },
  { key: 'bed', name: '双人床', src: 'assets/img/models/03-双人床.webp', w: 24, h: 19 },
  { key: 'desk', name: '办公桌', src: 'assets/img/models/04-办公桌.webp', w: 20, h: 18 },
  { key: 'chair', name: '办公椅', src: 'assets/img/models/05-办公椅.webp', w: 11, h: 20 },
  { key: 'stool', name: '吧台凳', src: 'assets/img/models/06-吧台凳.webp', w: 10, h: 19 },
  { key: 'sofa', name: '单人沙发', src: 'assets/img/models/07-单人沙发.webp', w: 17, h: 16 },
  { key: 'fridge', name: '冰箱', src: 'assets/img/models/08-冰箱.webp', w: 11, h: 18 },
  { key: 'rack', name: '衣帽架', src: 'assets/img/models/09-衣帽架.webp', w: 8, h: 19 },
  { key: 'sculpt', name: '装饰摆件', src: 'assets/img/models/10-装饰摆件.webp', w: 9, h: 15 },
  { key: 'dining', name: '餐桌组', src: 'assets/img/models/11-餐桌组.webp', w: 20, h: 20 },
  { key: 'screen', name: '屏风', src: 'assets/img/models/12-屏风.webp', w: 14, h: 19 },
];

export async function mount() {
  const stage = $('#stage');
  const layer = $('#roomItems');
  const palette = $('#palette');
  const counter = $('#placedCount');
  const clearBtn = $('#clearBtn');
  if (!stage || !layer || !palette) return;

  let selected = null;
  let seq = 0;

  palette.innerHTML = MODELS.map((m) => `
    <button type="button" class="palette-item" data-key="${m.key}" aria-label="把${m.name}放进房间">
      <img src="${m.src}" alt="" draggable="false">
      <span>${m.name}</span>
    </button>`).join('');

  const byKey = new Map(MODELS.map((m) => [m.key, m]));

  function updateCount() {
    const n = layer.children.length;
    counter.textContent = `${n} 件`;
    stage.dataset.filled = n > 0 ? 'true' : 'false';
  }

  function restack() {
    [...layer.children]
      .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top))
      .forEach((el, i) => { el.style.zIndex = String(10 + i); });
  }

  function select(el) {
    if (selected === el) return;
    if (selected) selected.removeAttribute('data-selected');
    selected = el;
    if (selected) selected.setAttribute('data-selected', 'true');
  }

  function place(model, pctX, pctY) {
    const el = document.createElement('div');
    el.className = 'room-item';
    el.dataset.key = model.key;
    el.dataset.id = 'it' + (++seq);
    el.style.width = model.w + '%';
    el.style.left = pctX + '%';
    el.style.top = pctY + '%';
    el.innerHTML = `<img src="${model.src}" alt="${esc(model.name)}" draggable="false">`;
    layer.appendChild(el);
    restack();
    updateCount();
    select(el);
    return el;
  }

  /* 从右侧面板拖进画布 */
  palette.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.palette-item');
    if (!btn) return;
    e.preventDefault();
    const model = byKey.get(btn.dataset.key);
    if (!model) return;
    const ghost = document.createElement('img');
    ghost.src = model.src;
    ghost.className = 'drag-ghost';
    ghost.style.width = model.w + 'px';
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '.85';
    ghost.style.zIndex = '999';
    ghost.style.translate = '-50% -50%';
    document.body.appendChild(ghost);
    const move = (ev) => { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; };
    move(e);
    const up = (ev) => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      ghost.remove();
      const r = stage.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) return;
      const pctX = ((ev.clientX - r.left) / r.width) * 100;
      const pctY = ((ev.clientY - r.top) / r.height) * 100;
      place(model, Math.min(96, Math.max(4, pctX)), Math.min(94, Math.max(6, pctY)));
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  });

  /* 画布里的拖动 */
  layer.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.room-item');
    if (!el) return;
    e.preventDefault();
    select(el);
    const r = stage.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startLeft = parseFloat(el.style.left), startTop = parseFloat(el.style.top);
    el.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = ((ev.clientX - startX) / r.width) * 100;
      const dy = ((ev.clientY - startY) / r.height) * 100;
      el.style.left = Math.min(97, Math.max(3, startLeft + dx)) + '%';
      el.style.top = Math.min(95, Math.max(5, startTop + dy)) + '%';
      restack();
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.releasePointerCapture?.(e.pointerId);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });

  /* 点空白取消选中 */
  stage.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.room-item')) select(null);
  });

  /* 键盘删除 */
  addEventListener('keydown', (e) => {
    if (!selected) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selected.remove();
      selected = null;
      restack();
      updateCount();
    }
  });

  clearBtn?.addEventListener('click', () => {
    layer.innerHTML = '';
    selected = null;
    updateCount();
  });

  /* 从详情页跳过来时带一件商品 */
  const addId = new URLSearchParams(location.search).get('add');
  if (addId) {
    const guess = { ch: 'chair', st: 'stool', sf: 'sofa', bd: 'bed', tb: 'desk', cb: 'fridge', sh: 'rack', lt: 'lamp', dc: 'sculpt', su: 'dining', ot: 'screen', bs: 'screen' }[addId.split('-')[0].toLowerCase()];
    const model = byKey.get(guess || 'chair');
    if (model) place(model, 48, 58);
  }

  updateCount();
}
