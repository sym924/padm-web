# FROM node:20-alpine

# WORKDIR /app

# COPY ./ ./

# RUN npm i

# RUN npm run build
# # RUN npx nuxi preview [.] [../.env]

# ENTRYPOINT [ "node", ".output/server/index.mjs" ]
# --- 第一阶段：构建 (使用 Bun) ---
FROM oven/bun:latest AS builder
WORKDIR /app

# 1. 只复制依赖描述文件（这是利用缓存的关键）
COPY package.json bun.lockb* ./

# 2. 安装依赖（Bun 会自动下载适合 Linux 运行的依赖，解决 Rollup 报错）
RUN bun install --frozen-lockfile

# 3. 复制剩余的所有源码
COPY . .

# 4. 执行 Nuxt 打包
RUN bun run build

# --- 第二阶段：运行 (使用轻量化 Node) ---
FROM node:20-alpine AS runner
WORKDIR /app

# 5. 只从构建阶段拷贝打包好的产物 (.output 文件夹)
# 这样你的镜像里就不会包含源码和庞大的 node_modules
COPY --from=builder /app/.output ./.output

# 暴露 Nuxt 默认端口
EXPOSE 3000

# 启动程序
ENTRYPOINT [ "node", ".output/server/index.mjs" ]