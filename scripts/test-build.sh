#!/bin/bash

# 构建测试脚本
echo "🧪 开始构建测试..."

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 类型检查
echo "🔍 类型检查..."
pnpm type-check

# 代码质量检查
echo "✨ 代码质量检查..."
pnpm lint

# 构建
echo "🏗️ 构建项目..."
pnpm build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件:"
    ls -la dist/
    echo ""
    echo "📄 index.html 内容预览:"
    head -10 dist/index.html
else
    echo "❌ 构建失败！"
    exit 1
fi

echo "🎉 所有测试通过！"
