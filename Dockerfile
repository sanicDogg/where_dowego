FROM denoland/deno:alpine-2.5.3

WORKDIR /app

COPY deno.json ./
COPY . .

# Разрешения: read, net, env
ENV DENO_DIR=/deno-dir
ENV DENO_INSTALL_ROOT=/deno-bin

# Команда запуска
CMD ["run", "--config", "./deno.json", "--allow-all", "bot.ts"]
