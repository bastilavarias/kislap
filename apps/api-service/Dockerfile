FROM golang:1.25

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN="/usr/bin/chromium"

WORKDIR /app

RUN go install github.com/air-verse/air@latest

ENV PATH="/go/bin:${PATH}"

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 5000

CMD ["air", "-c", "air.toml"]