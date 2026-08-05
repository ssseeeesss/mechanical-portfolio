# 刘雨林机械结构设计作品集

面向具身智能机械结构岗位的个人作品集，重点展示机器人机构、传动系统、工程出图、样机调试及 ROS/URDF 工程协同经验。

## 技术栈

- React 19 + Vite 8
- Three.js / React Three Fiber
- GSAP + Lenis
- Motion

## 本地运行

```bash
npm install
npm run dev
```

常用检查命令：

```bash
npm run lint
npm run build
npm run preview
```

## 内容维护

- 项目信息：`src/data/projects.js`
- 技能信息：`src/data/skills.js`
- 奖项信息：`src/data/awards.js`
- 项目图片：`public/projects/`
- 公开个人图片：`public/personal/`
- 原始三维模型：`public/models/*.glb`，用于公开下载
- 轻量查看模型：`public/models/viewer/*.glb`，由 14-bit 位置量化与 Meshopt 自动生成
- 三维模型边线：`public/models/*.edges` 与 `public/models/viewer/*.edges`

更新原始 GLB 后运行 `npm run generate:model-assets`，依次重新生成轻量查看模型和对应边线。不要直接编辑 `public/models/viewer/` 中的生成文件。

不要将简历源文件、证明材料、成绩单或其他包含个人隐私的文档放入 `public/`。Vite 会将该目录中的所有内容原样复制到构建产物。

## 部署

项目使用 `/mechanical-portfolio/` 作为 Vite base，可通过以下命令部署到现有 GitHub Pages 仓库路径：

```bash
npm run deploy
```
