# 渡物 Dimension · 站

一个家居设计经销商的概念站。六页：首页、商品、详情、工作室（2.5D 房间编辑器）、助手、关于。

## 怎么跑

纯静态，不需要构建环境。随便起一个本地服务即可：

```bash
python -m http.server 8080
# 打开 http://127.0.0.1:8080/
```

直接双击 `index.html` 也能看，但 `fetch` 读 JSON 需要 http 协议，双击会用 file:// 而拿不到数据。

## 结构

```
.
├── build_pages.py        生成六个 HTML 外壳（导航、页脚只在这里写一次）
├── data/
│   └── products.json     74 件商品：名称、设计师、价格、材质、尺寸、质保、安装方式
├── assets/
│   ├── css/site.css      全站样式（一个文件，按区块分段）
│   ├── js/
│   │   ├── main.js       外壳：导航状态、背景音乐、数据加载、按页挂载
│   │   ├── view-home.js      首页：精选、四季切换
│   │   ├── view-products.js  商品：品类筛选、关键词搜索
│   │   ├── view-detail.js    详情：按 ?id= 读一件
│   │   ├── view-studio.js    工作室：拖拽摆放
│   │   └── view-assistant.js 助手：按商品目录回答
│   ├── img/              商品图、等轴测白模、场景首帧、标志、卷尺人
│   ├── video/            四季场景（720p）与片头
│   └── audio/            背景音乐
└── *.html                生成产物，改了 build_pages.py 要重跑
```

## 改内容

- 改页面文案或结构：编辑 `build_pages.py`，然后 `python build_pages.py` 重新生成 HTML
- 改商品：编辑 `data/products.json`
- 改样式：`assets/css/site.css`
- 加一间房里的家具：在 `assets/js/view-studio.js` 的 `MODELS` 里加一条

## 素材来源

素材来自 2025 年 9 月那个 UI 设计比赛作品的原始文件，整理后放在 `渡物素材库`。商品名称、设计师、价格、质保、材质与安装方式都取自当年的《产品信息.xlsx》，没有编。四季场景是当年的实拍视频，重新压成 720p 放进来。

页面里的下单与支付是演示，不提交任何数据。
