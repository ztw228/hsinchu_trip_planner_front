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

# 構建應用
RUN npm run build

# 使用 nginx 作為生產環境的基礎映像
FROM nginx:alpine

# 複製構建產物到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 8080

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]