import { ToutiaoReplyAgent } from './index.js';

/**
 * Example Usage - 使用示例
 * 
 * This file demonstrates how to use the Toutiao Reply Agent
 */

async function example1_displayArticleInfo() {
  console.log('=== 示例 1: 显示文章和评论信息 ===\n');
  
  const agent = new ToutiaoReplyAgent();
  const articleUrl = 'https://m.toutiao.com/is/Bcg6PuGgTnw/';
  
  try {
    const { article, comments } = await agent.displayArticleInfo(articleUrl);
    console.log('成功获取文章和评论信息');
  } catch (error) {
    console.error('错误:', error.message);
  }
}

async function example2_supportReply() {
  console.log('\n=== 示例 2: 生成支持性回复 ===\n');
  
  const agent = new ToutiaoReplyAgent();
  const articleUrl = 'https://m.toutiao.com/is/Bcg6PuGgTnw/';
  const commentId = '1';  // 要回复的评论ID
  
  try {
    const result = await agent.processAndReply(articleUrl, commentId, 'support');
    
    if (result.success) {
      console.log('回复生成成功:');
      console.log('目标评论:', result.comment.content);
      console.log('生成的回复:', result.reply);
    }
  } catch (error) {
    console.error('错误:', error.message);
  }
}

async function example3_opposeReply() {
  console.log('\n=== 示例 3: 生成反驳性回复 ===\n');
  
  const agent = new ToutiaoReplyAgent();
  const articleUrl = 'https://m.toutiao.com/is/Bcg6PuGgTnw/';
  const commentId = '2';  // 要回复的评论ID
  
  try {
    const result = await agent.processAndReply(articleUrl, commentId, 'oppose');
    
    if (result.success) {
      console.log('回复生成成功:');
      console.log('目标评论:', result.comment.content);
      console.log('生成的回复:', result.reply);
    }
  } catch (error) {
    console.error('错误:', error.message);
  }
}

async function example4_replyToNestedComment() {
  console.log('\n=== 示例 4: 回复嵌套评论 ===\n');
  
  const agent = new ToutiaoReplyAgent();
  const articleUrl = 'https://m.toutiao.com/is/Bcg6PuGgTnw/';
  const commentId = '2-1';  // 嵌套评论的ID
  
  try {
    const result = await agent.processAndReply(articleUrl, commentId, 'support');
    
    if (result.success) {
      console.log('回复生成成功:');
      console.log('目标评论:', result.comment.content);
      console.log('生成的回复:', result.reply);
      console.log('回复类型:', result.replyType);
      console.log('模式:', result.mode);
    }
  } catch (error) {
    console.error('错误:', error.message);
  }
}

// 运行所有示例
async function runAllExamples() {
  console.log('今日头条自动回复机 - 使用示例\n');
  console.log('注意: 这些示例需要网络连接来访问今日头条');
  console.log('如果无法访问，将使用模拟数据进行演示\n');
  
  await example1_displayArticleInfo();
  await example2_supportReply();
  await example3_opposeReply();
  await example4_replyToNestedComment();
  
  console.log('\n所有示例运行完成!');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  example1_displayArticleInfo,
  example2_supportReply,
  example3_opposeReply,
  example4_replyToNestedComment,
  runAllExamples
};
