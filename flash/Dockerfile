FROM golang:1.25

WORKDIR /app

# Install Air (it will go into /go/bin by default)
RUN go install github.com/air-verse/air@latest

# Add /go/bin to PATH so Air is available
ENV PATH="/go/bin:${PATH}"

# Copy go.mod first to cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy project files
COPY . .

# Expose the app port (adjust if needed)
EXPOSE 5000

# Run Air with config
CMD ["air"]
