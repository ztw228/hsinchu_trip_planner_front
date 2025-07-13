# 使用 Node.js 18 作為基礎映像進行構建
FROM node:18-slim as builder

# 設定工作目錄
WORKDIR /app

# 確保 package.json 存在
COPY package.json package-lock.json* ./

# 安裝依賴
RUN npm install

# 複製源代碼（排除不需要的檔案）
COPY . .
RUN npm run build || (echo "Build failed" && exit 1)

# 使用輕量級 nginx
FROM nginx:stable-alpine

# 創建非 root 用戶
RUN adduser -D static
USER static

# 複製構建產物到 nginx 目錄
COPY --from=builder --chown=static:static /app/dist /usr/share/nginx/html/

# 複製自定義 nginx 配置
COPY --chown=static:static nginx.conf /etc/nginx/conf.d/default.conf

# 設定環境變數
ENV PORT=8080

# 使用 env 替換 nginx 配置中的環境變數並啟動 nginx
CMD sed -i "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'