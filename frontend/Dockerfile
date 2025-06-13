# ベースイメージは軽量なNode.jsイメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール
RUN apk add --no-cache inotify-tools

# パッケージマネージャのキャッシュを活用
COPY package.json yarn.lock* ./

# 依存関係を最小限でインストール
RUN yarn install --frozen-lockfile

# 全てのソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["yarn", "dev"]