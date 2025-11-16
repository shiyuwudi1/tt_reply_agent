# tt_reply_agent
头条自动评论回复机 (Toutiao Article Comment Auto-Reply Agent)

一个基于 Node.js 的今日头条文章评论自动回复工具，集成 DeepSeek AI，能够智能分析文章内容和评论上下文，生成有理有据的回复。

## 功能特性

1. **文章内容读取** - 从今日头条分享链接读取文章标题和内容
2. **评论区读取** - 获取文章评论列表及评论的上下文
3. **AI 智能回复** - 使用 DeepSeek AI 根据文章内容和评论上下文，自动生成支持或反驳的回复

## 安装

```bash
npm install
```

## 配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 DeepSeek API Key：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

## 使用方法

### 方式一：直接运行示例

```bash
npm start
```

这将运行示例代码，展示完整的功能流程。

### 方式二：在代码中使用

```javascript
import { ToutiaoReplyAgent } from './src/index.js';

const agent = new ToutiaoReplyAgent();

// 显示文章和评论信息
const { article, comments } = await agent.displayArticleInfo(
  'https://m.toutiao.com/is/Bcg6PuGgTnw/'
);

// 生成回复
const result = await agent.processAndReply(
  'https://m.toutiao.com/is/Bcg6PuGgTnw/',  // 文章链接
  '1',                                        // 评论ID
  'support'                                   // 回复类型: 'support' 或 'oppose'
);

console.log('生成的回复:', result.reply);
```

## API 说明

### ToutiaoReplyAgent

主要的代理类，包含以下方法：

#### `displayArticleInfo(articleUrl)`
显示文章和评论信息

**参数:**
- `articleUrl` (string): 今日头条文章分享链接

**返回:** 
- `Promise<Object>`: 包含 article 和 comments 的对象

#### `processAndReply(articleUrl, commentId, replyType)`
处理文章并生成评论回复

**参数:**
- `articleUrl` (string): 今日头条文章分享链接
- `commentId` (string): 要回复的评论ID
- `replyType` (string): 回复类型，'support' (支持) 或 'oppose' (反驳)

**返回:**
- `Promise<Object>`: 包含生成的回复和相关信息

### ToutiaoFetcher

文章和评论抓取器

#### `fetchArticle(url)`
获取文章内容

#### `fetchComments(articleId)`
获取文章评论列表

#### `getCommentContext(comments, commentId)`
获取评论的完整上下文

### DeepSeekClient

DeepSeek AI 客户端

#### `generateReply(options)`
生成评论回复

**参数:**
- `options.articleTitle` (string): 文章标题
- `options.articleContent` (string): 文章内容
- `options.targetComment` (Object): 目标评论
- `options.commentContext` (Array): 评论上下文
- `options.replyType` (string): 回复类型

## 工作流程

1. **读取文章** - 从分享链接提取文章标题和内容
2. **获取评论** - 抓取文章的评论列表
3. **定位目标** - 找到要回复的评论及其上下文
4. **生成回复** - 调用 DeepSeek API，结合文章内容和评论上下文生成回复
5. **输出结果** - 返回生成的回复内容

## 示例

分享链接格式示例：
```
https://m.toutiao.com/is/Bcg6PuGgTnw/
```

## 注意事项

1. 需要有效的 DeepSeek API Key
2. 今日头条的评论 API 可能需要特定的认证，当前版本使用模拟数据进行演示
3. 实际使用时可能需要根据今日头条的 API 变化进行调整

## 项目结构

```
tt_reply_agent/
├── src/
│   ├── index.js      # 主程序入口
│   ├── fetcher.js    # 文章和评论抓取器
│   └── deepseek.js   # DeepSeek AI 客户端
├── .env.example      # 环境变量示例
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
