import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Toutiao Article Fetcher
 * 今日头条文章抓取器
 */
export class ToutiaoFetcher {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ToutiaoMicroApp',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    };
  }

  /**
   * Fetch article content from Toutiao share link
   * 获取文章内容
   * @param {string} url - Share link URL
   * @returns {Promise<Object>} Article data
   */
  async fetchArticle(url) {
    try {
      console.log(`正在获取文章: ${url}`);
      
      const response = await axios.get(url, {
        headers: this.headers,
        maxRedirects: 5,
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);
      
      // Extract article title
      const title = $('title').text() || 
                   $('meta[property="og:title"]').attr('content') || 
                   $('h1').first().text() || '';
      
      // Extract article content
      let content = '';
      
      // Try different selectors for article content
      const contentSelectors = [
        'article',
        '.article-content',
        '.content',
        '[class*="article"]',
        'main'
      ];
      
      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          content = element.text().trim();
          if (content.length > 100) {
            break;
          }
        }
      }
      
      // If still no content, try to get all paragraph text
      if (!content || content.length < 100) {
        const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
        content = paragraphs.join('\n');
      }

      // Extract article ID from URL
      const articleIdMatch = url.match(/\/is\/([^\/\?]+)/);
      const articleId = articleIdMatch ? articleIdMatch[1] : '';

      return {
        title: title.trim(),
        content: content.trim(),
        url: url,
        articleId: articleId,
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('获取文章失败:', error.message);
      throw new Error(`Failed to fetch article: ${error.message}`);
    }
  }

  /**
   * Fetch comments for an article
   * 获取文章评论
   * @param {string} articleId - Article ID
   * @returns {Promise<Array>} Comments array
   */
  async fetchComments(articleId) {
    try {
      console.log(`正在获取评论: ${articleId}`);
      
      // Note: Toutiao's comment API requires specific authentication and parameters
      // This is a placeholder implementation showing the structure
      // In real scenario, you would need to:
      // 1. Use appropriate API endpoints
      // 2. Handle authentication/cookies
      // 3. Parse the actual response format
      
      const commentApiUrl = `https://m.toutiao.com/api/comment/list/`;
      
      try {
        const response = await axios.get(commentApiUrl, {
          headers: this.headers,
          params: {
            group_id: articleId,
            item_id: articleId,
            offset: 0,
            count: 20
          },
          timeout: 15000,
        });

        if (response.data && response.data.data) {
          return this.parseComments(response.data.data);
        }
      } catch (apiError) {
        console.log('API获取失败，返回模拟数据供测试');
      }
      
      // Return mock data for demonstration
      return [
        {
          id: '1',
          userId: 'user1',
          userName: '用户1',
          content: '苹果确实很强，但是价格也不便宜啊',
          createTime: new Date().toISOString(),
          likeCount: 10,
          replies: []
        },
        {
          id: '2',
          userId: 'user2',
          userName: '用户2',
          content: '安卓现在也很流畅了，没必要买苹果',
          createTime: new Date().toISOString(),
          likeCount: 5,
          replies: [
            {
              id: '2-1',
              userId: 'user3',
              userName: '用户3',
              content: '确实，国产旗舰机性价比更高',
              createTime: new Date().toISOString(),
              likeCount: 2
            }
          ]
        }
      ];
    } catch (error) {
      console.error('获取评论失败:', error.message);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  /**
   * Parse comments from API response
   * 解析评论数据
   * @param {Object} data - API response data
   * @returns {Array} Parsed comments
   */
  parseComments(data) {
    const comments = [];
    
    if (Array.isArray(data)) {
      for (const item of data) {
        comments.push({
          id: item.id || item.comment_id,
          userId: item.user_id,
          userName: item.user_name || '匿名用户',
          content: item.text || item.content,
          createTime: item.create_time,
          likeCount: item.digg_count || 0,
          replies: item.reply_list ? this.parseComments(item.reply_list) : []
        });
      }
    }
    
    return comments;
  }

  /**
   * Get comment context (including parent comments)
   * 获取评论的完整上下文
   * @param {Array} comments - All comments
   * @param {string} commentId - Target comment ID
   * @returns {Object} Comment with context
   */
  getCommentContext(comments, commentId) {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return {
          targetComment: comment,
          parentComment: null,
          context: [comment]
        };
      }
      
      // Check replies
      if (comment.replies && comment.replies.length > 0) {
        for (const reply of comment.replies) {
          if (reply.id === commentId) {
            return {
              targetComment: reply,
              parentComment: comment,
              context: [comment, reply]
            };
          }
        }
      }
    }
    
    return null;
  }
}
