由于electron-builder的问题，windows下打包命令需要使用管理员权限，或者采用下面链接中的办法：
- 降级项目中electron-builder到@24.6.3
- 手动替换 [第二个zip文件](https://github.com/electron-userland/electron-builder-binaries/releases/tag/winCodeSign-2.6.0)到`%LOCALAPPDATA%\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0\`

<img src="https://lsky.kissshot.site/img/2025/02/07/67a56b2c9cb55.webp" alt="default-cover.webp" title="default-cover.webp" width="60%" />
