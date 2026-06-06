#!/bin/zsh

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 {test|release}"
  exit 1
fi

if [ "$1" = "test" ]; then
  url='https://timehub-api.haocode.net'
  serverUser='motian'
  serverHost='timehub-api.haocode.net'
elif [ "$1" = "release" ]; then
  url='https://api.timehub.com.cn'
  serverUser='root'
  serverHost='api.timehub.com.cn'
else
  echo "Invalid environment: $1"
  exit 1
fi

sed -i "" "s#VITE_API_BASE_URL=.*#VITE_API_BASE_URL='$url'#g" .env.production

# 构建项目
if ! pnpm build; then
  echo "Build failed, aborting deployment."
  exit 1
fi

# 打包构建结果
tar -czf dist.tar.gz dist

# 上传压缩包到服务器
scp dist.tar.gz $serverUser@$serverHost:/data/workdir/timehub-admin/release

# 连接到服务器并解压缩
ssh $serverUser@$serverHost << 'EOF'
cd /data/workdir/timehub-admin/release
tar -xzf dist.tar.gz
rm dist.tar.gz
EOF

# 删除本地压缩包
rm dist.tar.gz
