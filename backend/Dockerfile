FROM node:20

WORKDIR /app

# パッケージファイルを先にコピー (キャッシュ効率化)
COPY package.json yarn.lock ./

# 依存関係をインストール
RUN yarn install

# ソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 5000

# アプリケーションを実行
CMD ["yarn", "dev"]