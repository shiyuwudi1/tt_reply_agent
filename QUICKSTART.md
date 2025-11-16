# 快速开始指南 (Quick Start Guide)

## 一分钟快速上手

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 API Key
```bash
# 复制配置文件模板
cp .env.example .env

# 编辑 .env 文件，填入你的 DeepSeek API Key
# DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. 运行测试
```bash
# 运行离线测试（不需要 API Key）
npm test
```

### 4. 运行示例
```bash
# 运行完整示例（需要配置 API Key）
npm start
```

## 基础使用示例

### 示例 1: 查看文章和评论

```javascript
import { ToutiaoReplyAgent } from './src/index.js';

const agent = new ToutiaoReplyAgent();

// 显示文章信息
const info = await agent.displayArticleInfo(
  'https://m.toutiao.com/is/Bcg6PuGgTnw/'
);
```

### 示例 2: 生成支持性回复

```javascript
import { ToutiaoReplyAgent } from './src/index.js';

const agent = new ToutiaoReplyAgent();

const result = await agent.processAndReply(
  'https://m.toutiao.com/is/Bcg6PuGgTnw/',  // 文章链接
  '1',                                        // 评论ID
  'support'                                   // 支持
);

console.log('生成的回复:', result.reply);
```

### 示例 3: 生成反驳性回复

```javascript
import { ToutiaoReplyAgent } from './src/index.js';

const agent = new ToutiaoReplyAgent();

const result = await agent.processAndReply(
  'https://m.toutiao.com/is/Bcg6PuGgTnw/',  // 文章链接
  '2',                                        // 评论ID
  'oppose'                                    // 反驳
);

console.log('生成的回复:', result.reply);
```

## 常见问题

### Q1: 如何获取 DeepSeek API Key?
访问 DeepSeek 官网注册并获取 API Key。

### Q2: 如何找到评论的 ID?
当前版本使用模拟数据进行演示。在实际使用中，评论 ID 会从 API 返回。

### Q3: 可以在没有 API Key 的情况下测试吗?
可以！运行 `npm test` 使用离线模式测试所有功能。

### Q4: 支持哪些回复类型?
- `support` - 生成支持性回复
- `oppose` - 生成反驳性回复

### Q5: 如何自定义提示词?
编辑 `src/deepseek.js` 中的 `buildPrompt` 方法。

## 项目命令

```bash
# 安装依赖
npm install

# 运行主程序
npm start

# 运行测试
npm test

# 运行示例
npm run examples
```

## 目录结构

```
tt_reply_agent/
├── src/
│   ├── index.js       # 主程序
│   ├── fetcher.js     # 文章/评论抓取
│   ├── deepseek.js    # AI 客户端
│   ├── examples.js    # 使用示例
│   └── test.js        # 测试
├── .env.example       # 配置模板
├── package.json       # 项目配置
├── README.md          # 详细文档
├── IMPLEMENTATION.md  # 实现说明
└── QUICKSTART.md      # 本文件
```

## 下一步

1. 查看 `README.md` 了解详细 API 文档
2. 查看 `IMPLEMENTATION.md` 了解实现细节
3. 查看 `src/examples.js` 了解更多使用示例
4. 开始构建你自己的自动回复机器人！

## 技术支持

遇到问题？
1. 查看 `README.md` 中的详细文档
2. 运行 `npm test` 检查环境配置
3. 检查 `.env` 文件中的 API Key 配置

Happy coding! 🚀
