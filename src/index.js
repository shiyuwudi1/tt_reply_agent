import dotenv from 'dotenv';
import { ToutiaoFetcher } from './fetcher.js';
import { DeepSeekClient } from './deepseek.js';

// Load environment variables
dotenv.config();

/**
 * Toutiao Reply Agent
 * 今日头条自动回复机
 */
class ToutiaoReplyAgent {
  constructor() {
    this.fetcher = new ToutiaoFetcher();
    
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL;
    
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      console.warn('警告: 未配置有效的 DeepSeek API Key');
      console.warn('请在 .env 文件中设置 DEEPSEEK_API_KEY');
      this.deepseek = null;
    } else {
      this.deepseek = new DeepSeekClient(apiKey, apiUrl);
    }
  }

  /**
   * Process article and generate reply to a comment
   * 处理文章并生成评论回复
   * @param {string} articleUrl - Article share link
   * @param {string} commentId - Target comment ID to reply to
   * @param {string} replyType - Reply type: 'support' or 'oppose'
   * @returns {Promise<Object>} Reply result
   */
  async processAndReply(articleUrl, commentId, replyType = 'support') {
    try {
      console.log('\n========== 今日头条自动回复机 ==========\n');

      // Step 1: Fetch article content
      console.log('步骤 1: 获取文章内容');
      const article = await this.fetcher.fetchArticle(articleUrl);
      console.log(`✓ 文章标题: ${article.title}`);
      console.log(`✓ 文章长度: ${article.content.length} 字符`);
      console.log(`✓ 文章ID: ${article.articleId}\n`);

      // Step 2: Fetch comments
      console.log('步骤 2: 获取评论列表');
      const comments = await this.fetcher.fetchComments(article.articleId);
      console.log(`✓ 获取到 ${comments.length} 条评论\n`);

      // Step 3: Find target comment and get context
      console.log('步骤 3: 定位目标评论');
      const commentContext = this.fetcher.getCommentContext(comments, commentId);
      
      if (!commentContext) {
        throw new Error(`未找到评论 ID: ${commentId}`);
      }

      console.log(`✓ 目标评论: ${commentContext.targetComment.content}`);
      if (commentContext.parentComment) {
        console.log(`✓ 父评论: ${commentContext.parentComment.content}`);
      }
      console.log();

      // Step 4: Generate reply using DeepSeek
      if (!this.deepseek) {
        console.log('步骤 4: 生成回复 (模拟模式 - 未配置API)');
        const mockReply = this.generateMockReply(
          article,
          commentContext.targetComment,
          replyType
        );
        
        console.log('\n========== 生成的回复 (模拟) ==========');
        console.log(mockReply);
        console.log('=====================================\n');
        
        return {
          success: true,
          reply: mockReply,
          article: article,
          comment: commentContext.targetComment,
          replyType: replyType,
          mode: 'mock'
        };
      }

      console.log('步骤 4: 使用 DeepSeek AI 生成回复');
      const reply = await this.deepseek.generateReply({
        articleTitle: article.title,
        articleContent: article.content,
        targetComment: commentContext.targetComment,
        commentContext: commentContext.context,
        replyType: replyType
      });

      console.log('\n========== 生成的回复 ==========');
      console.log(reply);
      console.log('===============================\n');

      return {
        success: true,
        reply: reply,
        article: article,
        comment: commentContext.targetComment,
        replyType: replyType,
        mode: 'ai'
      };

    } catch (error) {
      console.error('\n❌ 错误:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate mock reply for testing without API
   * 生成模拟回复（用于测试）
   */
  generateMockReply(article, comment, replyType) {
    if (replyType === 'support') {
      return `您说得对！从文章"${article.title}"中可以看出，这个观点是有道理的。${comment.content.substring(0, 20)}...这个看法我很认同。`;
    } else {
      return `关于"${comment.content.substring(0, 30)}..."这个观点，我持不同看法。根据文章内容来看，实际情况可能更加复杂一些。`;
    }
  }

  /**
   * Display article and comments
   * 显示文章和评论信息
   */
  async displayArticleInfo(articleUrl) {
    try {
      console.log('\n========== 文章信息 ==========\n');

      const article = await this.fetcher.fetchArticle(articleUrl);
      console.log(`标题: ${article.title}`);
      console.log(`链接: ${article.url}`);
      console.log(`ID: ${article.articleId}`);
      console.log(`\n内容预览 (前200字):`);
      console.log(article.content.substring(0, 200) + '...');
      console.log('\n========== 评论列表 ==========\n');

      const comments = await this.fetcher.fetchComments(article.articleId);
      
      comments.forEach((comment, index) => {
        console.log(`${index + 1}. [ID: ${comment.id}] ${comment.userName}:`);
        console.log(`   ${comment.content}`);
        console.log(`   点赞: ${comment.likeCount}`);
        
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            console.log(`   └─ [ID: ${reply.id}] ${reply.userName}: ${reply.content}`);
          });
        }
        console.log();
      });

      return { article, comments };
    } catch (error) {
      console.error('错误:', error.message);
      throw error;
    }
  }
}

/**
 * Main function
 * 主函数
 */
async function main() {
  const agent = new ToutiaoReplyAgent();

  // Example usage
  const exampleUrl = process.env.ARTICLE_URL || 'https://m.toutiao.com/is/Bcg6PuGgTnw/';
  
  console.log('今日头条自动回复机 - 示例运行\n');
  console.log('功能演示:');
  console.log('1. 读取文章内容');
  console.log('2. 读取评论区');
  console.log('3. 自动生成回复\n');

  // Display article and comments
  await agent.displayArticleInfo(exampleUrl);

  // Generate reply to first comment
  console.log('\n========== 自动回复演示 ==========\n');
  console.log('正在为第一条评论生成支持性回复...\n');
  
  const result = await agent.processAndReply(exampleUrl, '1', 'support');
  
  if (result.success) {
    console.log('✓ 回复生成完成');
    console.log(`模式: ${result.mode === 'mock' ? '模拟模式' : 'AI模式'}`);
  }

  console.log('\n========== 使用说明 ==========');
  console.log('1. 复制 .env.example 为 .env');
  console.log('2. 在 .env 中填入你的 DeepSeek API Key');
  console.log('3. 运行: npm start');
  console.log('4. 或在代码中调用 processAndReply() 方法');
  console.log('===============================\n');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ToutiaoReplyAgent };
