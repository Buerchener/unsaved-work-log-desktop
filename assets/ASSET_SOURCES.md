# 图片来源与生成记录

## 桌面壁纸：网络下载，Microsoft 原作

以下图片下载到项目本地，不需要在线加载。不是本项目原创，也不是生成图片；Microsoft 及相关作者保留权利。

- `wallpapers/bloom-light.jpg`：Windows 11 Bloom 浅色。
  - 来源页面：https://news.microsoft.com/windows11-general-availability/
  - 原图：https://msftstories.thesourcemediaassets.com/sites/620/2021/09/Windows-11-Bloom-Screensaver-Light-1.jpg
- `wallpapers/bloom-dark.jpg`：Windows 11 Bloom 深色。
  - 来源页面：同上（官方品牌图片下载区域）。
  - 原图：https://msftstories.thesourcemediaassets.com/sites/620/2021/09/Windows-11-Bloom-Screensaver-Dark.jpg
- `wallpapers/bloom-hub.png`：Surface Hub 官方蓝紫背景。
  - 来源页面：https://learn.microsoft.com/en-us/surface-hub/install-wallpaper-surface-hub
  - 原图：https://learn.microsoft.com/en-us/surface-hub/images/oembackgroundimage.png

外观参考：微软官方 Windows 11 Start Screen：
https://msftstories.thesourcemediaassets.com/sites/620/2021/10/Windows-11-Start-1000x563.jpg

Bloom 是常见的 Windows 11 默认背景；蓝紫款为补充选择，并非依据网络下载量排行选取。

## 相册：内置 image_gen 生成

三张图片均由内置图片生成功能生成，1536×1024 PNG。虚构生活照片，不是主角或用户真实照片。原手绘 SVG 不再用于相册，保留仅供旧版回退。

### photos/lakeside.png

Use case: photorealistic-natural. Generate one landscape 3:2 photograph for a fictional young office worker's personal photo album in a narrative game. A quiet lakeside on a Sunday afternoon in a subtropical Chinese city, wooded low hills beyond calm water, a few reeds near the shore, soft warm late afternoon sunlight reflecting on ripples. Casual believable smartphone travel snapshot, subtle natural colors, real texture, unpretentious personal memory rather than tourism advertising. Eye-level from a walking path, no people necessary. Full-frame photograph only, no UI, no collage, no text, no watermark, no illustration or vector style.

### photos/court.png

Use case: photorealistic-natural. One landscape 3:2 full-frame photograph for the same kind of fictional ordinary young office worker's private album. A modest outdoor neighborhood basketball court in a subtropical Chinese city at dusk, slightly worn muted terracotta and green court surface, accurate white basketball court lines, one ordinary basketball resting close to the sideline in foreground, a believable regulation hoop and backboard, chain-link fencing and leafy trees, court floodlights just switched on under a pale blue evening sky. Natural casual smartphone snapshot taken after playing with a friend, intimate everyday memory, realistic materials and perspective, soft restrained color. No posed people, no readable signs, no brand logos, no text overlay, no border, no UI, no illustration, no collage, no watermark.

### photos/desk.png

Use case: photorealistic-natural. Generate one landscape 3:2 photograph, a quiet personal smartphone snapshot in an ordinary young adult's small apartment on a weekend. An unpretentious wooden desk beside a window, one small green potted plant, a paperback book with no legible title, an open sketchbook with a faint unfinished pencil landscape, a pencil resting naturally across it, and a simple ceramic cup. Soft afternoon window light, subtle warm wood and muted green, lived-in believable textures, lightly imperfect casual framing viewed diagonally downward from a seated person's position. This is a private memory in a fictional character's photo album, not a luxury interior or staged commercial product photo. No person, no laptop or office branding, no text overlays, no readable typography, no watermark, no vector or painted illustration, no collage, no UI. Full-frame photographic realism.

## 消息通知音

`wechat-notification.mp3`：第三方音效站标注的 WeChat notification 音效，约 2.18 秒。来源：https://tiengdong.com/am-thanh-thong-bao-wechat 。下载原链接：https://tiengdong.com/wp-content/uploads/am-thanh-thong-bao-wechat-www_tiengdong_com.mp3 。去掉内嵌封面和元数据，音轨未重编码。不是本项目原创或腾讯官方授权声明。

播放音量为 45%，默认开启；快速设置中可以关闭或试听。旧版存档首次载入本次更新时启用一次，此后手动静音会保留。只在新通知横幅展示时触发，当前会话不额外响铃。连续通知不叠音，静音立刻停止提示音。保存的开启偏好在刷新后通过第一次用户点击或键盘操作恢复播放能力，不追播历史通知。
