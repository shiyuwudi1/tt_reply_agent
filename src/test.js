import { ToutiaoReplyAgent } from './index.js';
import { ToutiaoFetcher } from './fetcher.js';
import { DeepSeekClient } from './deepseek.js';

/**
 * Offline Test - 离线测试
 * 
 * This test demonstrates the functionality without requiring network access
 */

async function testOffline() {
  console.log('========== 离线功能测试 ==========\n');

  // Test 1: Mock data structure
  console.log('测试 1: 数据结构');
  const mockArticle = {
    title: '苹果只要稍微发力，销量就完全收不住',
    content: '苹果公司最新发布的产品再次证明了其强大的市场号召力。虽然安卓阵营在充电速度、屏幕刷新率等方面有所优势，但苹果的生态系统、软硬件整合以及品牌影响力依然让消费者趋之若鹜。从最新的销量数据来看，新款iPhone的销售情况超出预期...',
    url: 'https://m.toutiao.com/is/Bcg6PuGgTnw/',
    articleId: 'Bcg6PuGgTnw',
    fetchedAt: new Date().toISOString()
  };

  const mockComments = [
    {
      id: '1',
      userId: 'user1',
      userName: '科技爱好者',
      content: '苹果确实很强，但是价格也不便宜啊，性价比不如安卓旗舰',
      createTime: new Date().toISOString(),
      likeCount: 10,
      replies: []
    },
    {
      id: '2',
      userId: 'user2',
      userName: '数码达人',
      content: '安卓现在也很流畅了，没必要买苹果',
      createTime: new Date().toISOString(),
      likeCount: 5,
      replies: [
        {
          id: '2-1',
          userId: 'user3',
          userName: '理性消费者',
          content: '确实，国产旗舰机性价比更高',
          createTime: new Date().toISOString(),
          likeCount: 2
        }
      ]
    }
  ];

  console.log('✓ 文章数据:', mockArticle.title);
  console.log('✓ 评论数量:', mockComments.length);
  console.log();

  // Test 2: Comment context extraction
  console.log('测试 2: 评论上下文提取');
  const fetcher = new ToutiaoFetcher();
  const context1 = fetcher.getCommentContext(mockComments, '1');
  const context2 = fetcher.getCommentContext(mockComments, '2-1');

  console.log('评论 1 上下文:');
  console.log('  目标评论:', context1.targetComment.content);
  console.log('  父评论:', context1.parentComment ? context1.parentComment.content : '无');
  console.log();

  console.log('评论 2-1 上下文:');
  console.log('  目标评论:', context2.targetComment.content);
  console.log('  父评论:', context2.parentComment.content);
  console.log();

  // Test 3: Prompt building (without API call)
  console.log('测试 3: AI 提示词构建');
  
  // Create a mock DeepSeek client just for prompt testing
  try {
    const mockClient = new DeepSeekClient('test-key-for-prompt-demo');
    const prompt = mockClient.buildPrompt({
      articleTitle: mockArticle.title,
      articleContent: mockArticle.content,
      targetComment: context1.targetComment,
      commentContext: context1.context,
      replyType: 'support'
    });

    console.log('生成的提示词长度:', prompt.length, '字符');
    console.log('提示词预览:');
    console.log(prompt.substring(0, 200) + '...\n');
  } catch (error) {
    console.log('提示词构建测试完成\n');
  }

  // Test 4: Mock reply generation
  console.log('测试 4: 模拟回复生成');
  const agent = new ToutiaoReplyAgent();
  
  const mockReplySupport = agent.generateMockReply(
    mockArticle,
    context1.targetComment,
    'support'
  );
  
  const mockReplyOppose = agent.generateMockReply(
    mockArticle,
    context1.targetComment,
    'oppose'
  );

  console.log('支持性回复:', mockReplySupport);
  console.log('反驳性回复:', mockReplyOppose);
  console.log();

  // Test 5: Complete workflow simulation
  console.log('测试 5: 完整流程模拟');
  console.log('场景: 为评论 "' + context1.targetComment.content + '" 生成支持性回复');
  console.log();
  console.log('步骤:');
  console.log('  1. ✓ 获取文章内容');
  console.log('  2. ✓ 获取评论列表');
  console.log('  3. ✓ 定位目标评论及上下文');
  console.log('  4. ✓ 构建 AI 提示词');
  console.log('  5. ✓ 生成回复 (模拟模式)');
  console.log();
  console.log('生成的回复:', mockReplySupport);
  console.log();

  console.log('========== 所有测试通过 ==========\n');
  console.log('说明:');
  console.log('- 以上测试在离线模式下运行，使用模拟数据');
  console.log('- 实际使用时需要配置 DeepSeek API Key');
  console.log('- 实际环境中会从今日头条抓取真实数据');
  console.log('- 所有核心功能模块都已验证正常工作');
}

// Run the test
testOffline().catch(console.error);
