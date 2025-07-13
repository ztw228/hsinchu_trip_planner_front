###############################################################################
#  Static Frontend for Cloud Run (Nginx)                                      #
###############################################################################

FROM nginx:stable-alpine

# 1. 把靜態檔整包複製進去
COPY . /usr/share/nginx/html



# 2. Cloud Run 會把 $PORT 傳進容器，Nginx 要聽 8080
#    default.conf 已用  $PORT  變數？→ 用 envsubst 先替換
ENV PORT 8080
CMD ["nginx", "-g", "daemon off;"]

