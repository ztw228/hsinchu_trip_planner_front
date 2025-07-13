FROM nginx:stable-alpine

# 靜態檔
COPY . /usr/share/nginx/html

# 覆蓋 Nginx 設定：讓它聽 8080
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
