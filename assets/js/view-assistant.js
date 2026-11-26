import { $, esc, loadData, priceText } from './main.js';

export async function mount() {
  const log = $('#log');
  const form = $('#form');
  const input = $('#msg');
  const suggest = $('#suggest');
  if (!log || !form) return;

  let products = [];
  try {
    ({ products } = await loadData('products'));
  } catch {
    /* 没数据也还能聊，走通用回答 */
  }

  const say = (text, mine = false) => {
    const el = document.createElement('div');
    el.className = 'msg' + (mine ? ' mine' : '');
    el.innerHTML = `<span class="who">${mine ? '你' : '卷尺人'}</span><p>${text}</p>`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  const findProduct = (text) => {
    const t = text.replace(/\s+/g, '');
    let best = null;
    for (const p of products) {
      const name = p.name.replace(/\s+/g, '');
      if (t.toUpperCase().includes(p.id.toUpperCase()) || t.includes(name)) {
        if (!best || name.length > best.name.replace(/\s+/g, '').length) best = p;
      }
    }
    return best;
  };

  const describe = (p) => {
    const bits = [
      `<b>${esc(p.name)}</b>（${esc(p.id)}）`,
      `设计师 ${esc(p.designer || '渡物自营')}`,
      `价格 ${priceText(p.price)}`,
      p.material ? `材质 ${esc(p.material)}` : '',
      p.size ? `尺寸 ${esc(p.size)}` : '',
      p.warranty ? `质保 ${esc(p.warranty)}` : '',
      p.install ? `安装方式 ${esc(p.install)}` : '',
    ].filter(Boolean);
    return bits.join('　·　') + (p.desc ? `<br><span class="muted">${esc(p.desc)}</span>` : '');
  };

  const answer = (raw) => {
    const text = raw.trim();
    const p = findProduct(text);
    if (p) return describe(p);
    if (/能改|定制|改尺寸|换色|换面|调整|改一下/.test(text)) {
      return '能改，但每件的范围不一样：沙发换面料和皮衬垫，衣柜改门板玻璃，台面在大理石、钢化玻璃、实木之间挑，尺寸按开间微调。改完交付时间会跟着变，报价按最终配置算。说个商品名，我把这件的可改范围翻出来给你。';
    }
    if (/多久|送货|安装|到货|周期|几天/.test(text)) {
      return '大型件一般走上门安装，中小件可以快递直送。每件商品页的「安装」那一栏写着具体方式，工期按配置算，改过尺寸的会多等一段时间。';
    }
    if (/材质|面料|色|颜色/.test(text)) {
      return '材质从布艺、皮革软包、羊羔绒，到大理石、钢化玻璃、橡木、金属都有。颜色以商品页的标签为准，同款常常有好几种色号。想按空间定色的话，进工作室摆一遍再定更直观。';
    }
    if (/多少钱|价格|贵|便宜|预算/.test(text)) {
      return '跨度挺大：曲木椅一千出头，沙发三万到十三万，雕塑类的两三十万也有。你可以先说说想要什么空间，我按品类帮你圈一个价格带。';
    }
    if (/谁设计|设计师|品牌/.test(text)) {
      return '在售的有三十八位设计师与品牌，包括文森特·范·杜伊森、吉奥·庞蒂、阿纳·雅各布森、莫尔蒂尼&卡、Klass 工作室这些。想看某一位的全部作品，在商品页搜他的名字就行。';
    }
    if (/你好|在吗|嗨|hallo|hello/i.test(text)) {
      return '在。想先看什么——挑家具、摆房间，还是问某一件的尺寸和材质？';
    }
    if (/尺寸|多大|占多大地|放得下/.test(text)) {
      return '每件的尺寸标签分了小型、中型、大型三档，具体数字在详情页的「尺寸」里。拿不准的话，把家具拖进工作室，按房间比例看一遍最直白。';
    }
    return '这句我没查到。我能回答的是：某件商品的价格、材质、尺寸、质保和安装方式，以及能不能改、工期多久。你报个名字或者编号（比如 SF-003），我翻目录给你。';
  };

  const ask = (text) => {
    say(esc(text), true);
    setTimeout(() => say(answer(text)), 420);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    ask(text);
  });

  const hints = products.length
    ? [products[0], products.find((p) => p.category === 'sf'), products.find((p) => p.category === 'ch')].filter(Boolean)
    : [];
  suggest.innerHTML = [
    ...hints.map((p) => `<button type="button">${esc(p.name)} 多少钱</button>`),
    '<button type="button">能按我的房间改尺寸吗</button>',
    '<button type="button">大型家具多久送到</button>',
  ].join('');
  suggest.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) ask(b.textContent);
  });

  say('我是卷尺人。商品目录里七十四件家具的参数都在我这儿，报名字或编号就行，问尺寸、材质、能不能改都可以。');

  const preset = new URLSearchParams(location.search).get('ask');
  if (preset) {
    input.value = preset;
    ask(preset);
    input.value = '';
  }
}
