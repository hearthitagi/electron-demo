如果最新构筑的环境打包没问题，请忽略以下内容：

由于electron-builder的问题，windows下打包命令需要使用管理员权限，或者采用下面链接中的办法：
- 降级项目中electron-builder到@24.6.3
- 手动替换 [第二个zip文件](https://github.com/electron-userland/electron-builder-binaries/releases/tag/winCodeSign-2.6.0)到`%LOCALAPPDATA%\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0\`
