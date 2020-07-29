FROM node:alpine

WORKDIR /usr/src/app
COPY package.json .
RUN yarn install --prod
COPY . .
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache chromium

CMD ["npm", "run", "serve"]
