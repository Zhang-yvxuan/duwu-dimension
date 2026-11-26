# -*- coding: utf-8 -*-
"""生成渡物 Dimension 六个静态页面。页面内容在这里维护，导航和页脚只写一次。"""
from pathlib import Path

SITE = Path(__file__).resolve().parent

NAV = [
    ('products.html', '商品'),
    ('studio.html', '工作室'),
    ('assistant.html', '助手'),
    ('about.html', '关于'),
]

SEASONS = [('spring', '春'), ('summer', '夏'), ('autumn', '秋'), ('winter', '冬')]


def page(slug, title, desc, body, wide=False):
    links = ''.join(
        '<a href="%s"%s>%s</a>' % (href, ' aria-current="page"' if href == slug else '', label)
        for href, label in NAV
    )
    html = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · 渡物 Dimension</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/img/favicon.png" sizes="64x64">
<link rel="stylesheet" href="assets/css/site.css">
<script type="module" src="assets/js/main.js"></script>
</head>
<body data-page="{slug[:-5]}">
<a class="skip" href="#main">跳到正文</a>
<header class="top" id="top">
  <a class="brand" href="index.html">
    <img src="assets/img/logo-mark.png" alt="" width="30" height="30">
    <span>渡物<em>Dimension</em></span>
  </a>
  <nav class="nav" aria-label="站内导航">{links}</nav>
  <button class="sound" type="button" aria-pressed="false" aria-label="开关背景音乐">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h3l5-4v14l-5-4H4z"/><path class="wave" d="M16 8.5c1.6 1.7 1.6 5.3 0 7"/><path class="wave" d="M18.8 6c2.8 2.9 2.8 9.1 0 12"/></svg>
  </button>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="foot-main">
    <p class="foot-brand">渡物 <em>Dimension</em></p>
    <p class="foot-line">家居设计经销商 · 交互概念演示</p>
  </div>
  <div class="foot-links">
    <a href="about.html">关于这个站</a>
    <a href="https://github.com/Zhang-yvxuan/Dimension-UI-design-" target="_blank" rel="noopener">GitHub ↗</a>
    <a href="#top">回到顶部 ↑</a>
  </div>
</footer>
<audio id="bgm" src="assets/audio/piano-loop.mp3" loop preload="none"></audio>
</body>
</html>
'''
    (SITE / slug).write_text(html, encoding='utf8')
    return slug


# ---------------------------------------------------------------- 首页
home_hero = '''
<section class="hero">
  <video class="hero-video" id="heroVideo" muted loop playsinline autoplay preload="auto" poster="assets/img/scenes/spring.jpg">
    <source src="assets/video/spring.mp4" type="video/mp4">
  </video>
  <div class="hero-veil"></div>
  <div class="hero-body">
    <p class="kicker">家居设计经销商 · 二零一五 起</p>
    <h1>把一间房<br><span>放进你的尺度里</span></h1>
    <p class="hero-lead">七十四件来自意大利与北欧的家具，材质、色号、尺寸都能改。下单之前，先在等轴测房间里摆一遍，看看它到底占多大地方。</p>
    <div class="hero-actions">
      <a class="btn solid" href="products.html">看家具 ↗</a>
      <a class="btn ghost" href="studio.html">进工作室</a>
    </div>
    <div class="seasons" role="group" aria-label="切换季节场景">
      {seasons}
    </div>
  </div>
</section>
'''.replace('{seasons}', ''.join(
    '<button type="button" class="season" data-season="%s" aria-pressed="%s">%s</button>'
    % (key, 'true' if i == 0 else 'false', label) for i, (key, label) in enumerate(SEASONS)))

home_body = home_hero + '''
<section class="band">
  <div class="band-head">
    <div><p class="kicker">01 / 精选</p><h2>这几件，今年问得最多</h2></div>
    <a class="link" href="products.html">全部七十四件 ↗</a>
  </div>
  <div class="grid products-grid" id="featured" aria-busy="true">正在读取…</div>
</section>

<section class="band split-band">
  <div class="split-copy">
    <p class="kicker">02 / 为什么能改</p>
    <h2>同一件家具，跟着你的房间变</h2>
    <p>沙发可以换面料和皮衬垫，衣柜能改门板玻璃的颜色，桌子的台面在大理石、钢化玻璃、实木之间挑。尺寸也能按开间调，不行的我们会直接说不行。</p>
    <p class="muted">每件商品的改动范围写在详情页的「可定制」里，交付时间跟着变，报价按最终配置算。</p>
    <a class="link" href="studio.html">到工作室试试 ↗</a>
  </div>
  <ul class="facts">
    <li><b>74</b><span>件在售家具</span></li>
    <li><b>12</b><span>个品类</span></li>
    <li><b>4</b><span>个季节场景</span></li>
    <li><b>38</b><span>位设计师与品牌</span></li>
  </ul>
</section>

<section class="band">
  <div class="band-head"><div><p class="kicker">03 / 怎么用</p><h2>挑、摆、问</h2></div></div>
  <div class="entry-grid">
    <a href="products.html"><b>01</b><h3>挑</h3><p>按品类、设计师或材质找，十二类七十四件，每件都有尺寸和安装方式。</p><span>去商品页 ↗</span></a>
    <a href="studio.html"><b>02</b><h3>摆</h3><p>把家具拖进等轴测房间，按真实比例看它占多大地，摆歪了换个角度重来。</p><span>进工作室 ↗</span></a>
    <a href="assistant.html"><b>03</b><h3>问</h3><p>问尺寸、问材质、问能不能改，卷尺人会按商品目录里的真实参数回答。</p><span>找卷尺人 ↗</span></a>
  </div>
</section>
'''

# ---------------------------------------------------------------- 商品页
products_body = '''
<header class="page-head">
  <p class="kicker">商品</p>
  <h1>七十四件家具</h1>
  <p>按品类筛，也可以直接搜名字、设计师或材质。点开一件看尺寸、质保和能改到哪一步。</p>
</header>

<div class="toolbar">
  <div class="chips" id="cats" role="group" aria-label="品类筛选"></div>
  <label class="search">
    <span class="sr">搜索</span>
    <input id="q" type="search" placeholder="搜名称、设计师、材质" autocomplete="off">
  </label>
</div>
<p class="count" id="count" role="status"></p>
<div class="grid products-grid" id="grid" aria-busy="true">正在读取…</div>
'''

# ---------------------------------------------------------------- 详情页
detail_body = '''
<section class="detail" id="detail" aria-busy="true">
  <p class="loading">正在读取商品…</p>
</section>
'''

# ---------------------------------------------------------------- 工作室
studio_body = '''
<header class="page-head">
  <p class="kicker">工作室</p>
  <h1>2.5D 房间编辑器</h1>
  <p>从右边把家具拖进房间。选中一件可以按 Delete 删掉，或者拖出去。房间按等轴测画，物体越靠下越靠前。</p>
</header>

<div class="studio" id="studio">
  <div class="stage" id="stage" aria-label="房间画布">
    <div class="floor" id="floor"></div>
    <div class="room-items" id="roomItems"></div>
    <p class="stage-hint" id="stageHint">把右边的家具拖进来</p>
  </div>
  <aside class="palette">
    <div class="palette-head">
      <p class="kicker">家具</p>
      <span class="palette-count" id="placedCount">0 件</span>
    </div>
    <div class="palette-grid" id="palette"></div>
    <div class="palette-actions">
      <button type="button" class="btn small" id="clearBtn">清空房间</button>
    </div>
  </aside>
</div>
'''

# ---------------------------------------------------------------- 助手
assistant_body = '''
<header class="page-head">
  <p class="kicker">助手</p>
  <h1>问一句</h1>
  <p>尺寸、材质、能不能改、多久送到——卷尺人只答商品目录里写着的参数，查不到会直说。</p>
</header>

<div class="chat">
  <div class="chat-figure">
    <img src="assets/img/bot.png" alt="卷尺人，渡物的 AI 助手" width="220" height="220">
    <p class="chat-name">卷尺人</p>
  </div>
  <div class="chat-main">
    <div class="chat-log" id="log" aria-live="polite"></div>
    <form class="chat-form" id="form">
      <label class="sr" for="msg">输入问题</label>
      <input id="msg" type="text" placeholder="例如：Theo 床能改尺寸吗" autocomplete="off">
      <button class="btn solid" type="submit">发送</button>
    </form>
    <div class="chat-suggest" id="suggest"></div>
  </div>
</div>
'''

# ---------------------------------------------------------------- 关于
about_body = '''
<article class="prose">
  <p class="kicker">关于</p>
  <h1>这个站是怎么来的</h1>
  <p>渡物 Dimension 起初是一个 UI 设计比赛的参赛作品，写于 2025 年 9 月。那时候的目标很朴素：把一套平面稿变成能点的网页，给评委看清楚这个家居定制 App 长什么样。</p>
  <p>二十多个页面，靠 HTML 一份份手写，导航在每一页里各复制一遍，样式挤在一个文件里。做完那阵子确实能点完一遍流程，但改一个链接要改二十处，往后就没人敢动了。</p>
  <p>这次重做没有换想法，只换了骨架：外壳、样式、数据各管一件事，页面只写内容。东西还是那些东西——原来的家具图、原来的等轴测白模、原来四季场景视频，连卷尺人也是当年那个。</p>

  <h2>素材从哪来</h2>
  <ul>
    <li>家具图与商品参数：项目原始素材库，七十四件，含设计师、价格、质保、材质与安装方式</li>
    <li>四季场景：四段实拍视频，重新压成 720p 放到网页里</li>
    <li>等轴测白模：十二件家具的灰白模型，抠掉黑底后用进工作室</li>
    <li>标志与卷尺人：比赛时的原始设计稿</li>
  </ul>

  <h2>哪些是真的，哪些是演示</h2>
  <p>商品名称、设计师、价格、质保年限、材质和安装方式，都来自当年的产品信息表，没有编。页面里的购物流程、下单和支付是演示，不会保存任何信息。</p>

  <h2>旧版</h2>
  <p>旧版已经被这一版覆盖了，代码还留在同一个仓库的提交历史里，翻到 2025 年 9 月那几次提交就能看到当年那二十几个页面。它不完美，但它是第一个。</p>
  <p class="prose-links">
    <a class="btn ghost" href="https://github.com/Zhang-yvxuan/Dimension-UI-design-/commits/main" target="_blank" rel="noopener">翻提交历史 ↗</a>
    <a class="btn ghost" href="index.html">回首页</a>
  </p>
</article>
'''

if __name__ == '__main__':
    made = [
        page('index.html', '把一间房放进你的尺度里', '七十四件可定制的家具，先在等轴测房间里摆一遍。', home_body),
        page('products.html', '七十四件家具', '按品类、设计师与材质浏览渡物的在售家具。', products_body),
        page('detail.html', '商品详情', '尺寸、材质、质保与可定制范围。', detail_body),
        page('studio.html', '2.5D 房间编辑器', '把家具拖进等轴测房间，按真实比例摆一摆。', studio_body),
        page('assistant.html', '问一句', '卷尺人按商品目录回答尺寸、材质与定制问题。', assistant_body),
        page('about.html', '关于这个站', '渡物 Dimension 的来路、素材来源与旧版入口。', about_body),
    ]
    print('生成：', ' '.join(made))
