FROM nginx:alpine

# 复制静态文件
COPY . /usr/share/nginx/html

# 删除默认配置，使用我们的配置
RUN rm -f /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]