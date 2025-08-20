import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const inputSvg = path.join(__dirname, '../public/icons/icon.svg')
const outputDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  try {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 读取 SVG 文件
    const svgBuffer = fs.readFileSync(inputSvg)

    // 并行生成所有尺寸的图标
    const generatePromises = sizes.map(async (size) => {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`)

      await sharp(svgBuffer).resize(size, size).png().toFile(outputPath)

      console.log(`✅ Generated ${size}x${size} icon`)
      return size
    })

    // 等待所有图标生成完成
    await Promise.all(generatePromises)

    console.log('🎉 All icons generated successfully!')
  } catch (error) {
    console.error('❌ Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons()
