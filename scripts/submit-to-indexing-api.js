/**
 * Google Indexing API 提交脚本
 * 用法：node submit-to-indexing-api.js [服务账号密钥路径]
 * 
 * 前置条件：
 * 1. GCP 项目已启用 Indexing API
 * 2. 服务账号有 "Indexing Service Owner" 权限
 * 3. 网站已在 GSC 验证所有权
 */

const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// 高优先级页面列表（首页 + 5产品页 + 关键落地页）
const HIGH_PRIORITY_URLS = [
  // 首页
  'https://powerstarapps.com/',
  
  // 产品页 (5)
  'https://powerstarapps.com/products/thermometer.html',
  'https://powerstarapps.com/products/microphone.html',
  'https://powerstarapps.com/products/voice-changer.html',
  'https://powerstarapps.com/products/lumiwall.html',
  'https://powerstarapps.com/products/ai-photo.html',
  
  // 高搜索量落地页 (10)
  'https://powerstarapps.com/products/thermometer-landing/indoor-thermometer-app.html',
  'https://powerstarapps.com/products/thermometer-landing/room-temperature-app.html',
  'https://powerstarapps.com/products/microphone-landing/microphone-for-presentations.html',
  'https://powerstarapps.com/products/microphone-landing/karaoke-microphone-app.html',
  'https://powerstarapps.com/products/voice-changer-landing/real-time-voice-changer.html',
  'https://powerstarapps.com/products/voice-changer-landing/voice-changer-for-gaming.html',
  'https://powerstarapps.com/products/lumiwall-landing/4k-wallpapers-android.html',
  'https://powerstarapps.com/products/lumiwall-landing/anime-wallpapers.html',
  'https://powerstarapps.com/products/ai-photo-landing/anime-style.html',
  'https://powerstarapps.com/products/ai-photo-landing/lensa-alternative.html',
  
  // 高价值博客页 (4)
  'https://powerstarapps.com/blog/check-room-temperature-phone.html',
  'https://powerstarapps.com/blog/best-voice-changer-apps-for-android.html',
  'https://powerstarapps.com/blog/celebrity-voice-changer-app.html',
  'https://powerstarapps.com/blog/photo-to-anime-converter.html',
];

async function submitUrlToIndexingAPI(authClient, url) {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  
  try {
    const response = await authClient.request({
      url: endpoint,
      method: 'POST',
      data: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    
    return { success: true, url, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      url, 
      error: error.message || 'Unknown error',
      status: error.code || 500
    };
  }
}

async function main() {
  const keyFile = process.argv[2] || './service-account-key.json';
  
  if (!fs.existsSync(keyFile)) {
    console.error('❌ 服务账号密钥文件不存在:', keyFile);
    console.log('\n使用方法:');
    console.log('  node submit-to-indexing-api.js [密钥文件路径]');
    console.log('\n获取密钥:');
    console.log('  1. 进入 GCP Console: https://console.cloud.google.com');
    console.log('  2. 选择项目: HongYanApps');
    console.log('  3. IAM & Admin > Service Accounts');
    console.log('  4. 创建服务账号或使用现有账号');
    console.log('  5. 添加角色: "Indexing Service Owner"');
    console.log('  6. 创建密钥 > JSON 格式');
    console.log('  7. 将密钥文件保存到本目录');
    process.exit(1);
  }
  
  console.log('🔑 加载服务账号密钥:', keyFile);
  const keyData = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  
  const authClient = new JWT({
    email: keyData.client_email,
    key: keyData.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  
  console.log('\n📤 开始提交高优先级页面...');
  console.log('   总计:', HIGH_PRIORITY_URLS.length, '个 URL\n');
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  // 批量提交（每批10个，间隔1秒）
  for (let i = 0; i < HIGH_PRIORITY_URLS.length; i++) {
    const url = HIGH_PRIORITY_URLS[i];
    console.log(`[${i + 1}/${HIGH_PRIORITY_URLS.length}] 提交: ${url}`);
    
    const result = await submitUrlToIndexingAPI(authClient, url);
    results.push(result);
    
    if (result.success) {
      successCount++;
      console.log('   ✅ 成功');
    } else {
      failCount++;
      console.log('   ❌ 失败:', result.error);
    }
    
    // 避免速率限制，每10个请求暂停
    if (i > 0 && (i + 1) % 10 === 0) {
      console.log('\n   ⏳ 暂停 1 秒（避免速率限制）...\n');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 输出总结
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 提交完成');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ 成功: ${successCount}/${HIGH_PRIORITY_URLS.length}`);
  console.log(`❌ 失败: ${failCount}/${HIGH_PRIORITY_URLS.length}`);
  console.log('\n💡 注意: 提交成功不代表立即索引，通常需要几小时到3天');
  console.log('💡 建议: 24小时后检查 GSC > Page Indexing 报告\n');
  
  // 保存结果日志
  const logPath = './indexing-api-log.json';
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: HIGH_PRIORITY_URLS.length,
    success: successCount,
    fail: failCount,
    results: results
  }, null, 2));
  
  console.log('📁 详细日志已保存:', logPath);
}

main().catch(console.error);