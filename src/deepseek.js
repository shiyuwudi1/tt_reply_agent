import axios from 'axios';

/**
 * DeepSeek AI Client
 * DeepSeek AI 客户端
 */
export class DeepSeekClient {
  constructor(apiKey, apiUrl = 'https://api.deepseek.com/v1/chat/completions') {
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
    }
    
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  /**
   * Generate a reply to a comment
   * 生成评论回复
   * @param {Object} options - Generation options
   * @param {string} options.articleTitle - Article title
   * @param {string} options.articleContent - Article content
   * @param {string} options.targetComment - Target comment to reply to
   * @param {Array} options.commentContext - Comment context (parent comments)
   * @param {string} options.replyType - Reply type: 'support' or 'oppose'
   * @returns {Promise<string>} Generated reply
   */
  async generateReply({ articleTitle, articleContent, targetComment, commentContext = [], replyType = 'support' }) {
    try {
      const prompt = this.buildPrompt({
        articleTitle,
        articleContent,
        targetComment,
        commentContext,
        replyType
      });

      console.log('正在调用 DeepSeek API 生成回复...');

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的评论回复助手，能够根据文章内容和评论上下文，生成有理有据、观点明确的回复。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const reply = response.data.choices[0].message.content.trim();
        console.log('回复生成成功');
        return reply;
      }

      throw new Error('Invalid response from DeepSeek API');
    } catch (error) {
      console.error('生成回复失败:', error.message);
      
      if (error.response) {
        console.error('API错误详情:', error.response.data);
      }
      
      throw new Error(`Failed to generate reply: ${error.message}`);
    }
  }

  /**
   * Build prompt for AI
   * 构建AI提示词
   * @param {Object} options - Prompt options
   * @returns {string} Prompt text
   */
  buildPrompt({ articleTitle, articleContent, targetComment, commentContext, replyType }) {
    const contextText = commentContext.length > 1
      ? `\n评论上下文：\n${commentContext.map((c, i) => `${i + 1}. ${c.userName}: ${c.content}`).join('\n')}\n`
      : '';

    const replyTypeText = replyType === 'support' ? '支持' : '反驳';
    const replyInstruction = replyType === 'support'
      ? '请基于文章内容，从支持的角度回复这条评论，要有理有据，态度友善。'
      : '请基于文章内容，从反驳的角度回复这条评论，要有理有据，但保持礼貌和理性。';

    // Truncate article content if too long
    const truncatedContent = articleContent.length > 2000
      ? articleContent.substring(0, 2000) + '...'
      : articleContent;

    return `文章标题：${articleTitle}

文章内容：
${truncatedContent}
${contextText}
目标评论（需要${replyTypeText}）：
${targetComment.userName}: ${targetComment.content}

任务：${replyInstruction}

要求：
1. 回复要简洁有力，控制在150字以内
2. 要结合文章内容和评论上下文
3. 观点明确，逻辑清晰
4. 语气自然，像真人在交流
5. 直接输出回复内容，不要包含"回复："等前缀

请生成回复：`;
  }
}
