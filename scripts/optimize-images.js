const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const outputDir = path.join(publicDir, 'poetry');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 获取所有 PNG 图片
const images = fs.readdirSync(publicDir)
    .filter(file => file.startsWith('Gemini_Generated_Image_') && file.endsWith('.png'))
    .sort();

console.log(`找到 ${images.length} 张图片,开始优化...\n`);

// 优化每张图片
Promise.all(
    images.map(async (filename, index) => {
        const inputPath = path.join(publicDir, filename);
        const outputPath = path.join(outputDir, `${index + 1}.webp`);

        const stats = fs.statSync(inputPath);
        const originalSize = (stats.size / 1024 / 1024).toFixed(2);

        try {
            await sharp(inputPath)
                .resize(1200, 800, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({
                    quality: 85,
                    effort: 6
                })
                .toFile(outputPath);

            const newStats = fs.statSync(outputPath);
            const newSize = (newStats.size / 1024 / 1024).toFixed(2);
            const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);

            console.log(`✓ ${index + 1}.webp: ${originalSize}MB → ${newSize}MB (减少 ${reduction}%)`);
        } catch (error) {
            console.error(`✗ 处理 ${filename} 失败:`, error.message);
        }
    })
).then(() => {
    console.log('\n✨ 所有图片优化完成!');
    console.log(`📁 输出目录: ${outputDir}`);
    console.log(`📊 图片数量: ${images.length}`);
    console.log(`📐 尺寸: 1200x800`);
    console.log(`🎨 格式: WebP (质量 85%)`);
}).catch(error => {
    console.error('优化过程出错:', error);
    process.exit(1);
});
