# 使用 Node.js 18 作為基礎映像進行構建
FROM node:18-slim as builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 設定環境變數並構建應用
ENV NODE_ENV=production
RUN npm run build

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