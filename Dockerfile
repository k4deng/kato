# Stage 1: Build dependencies
FROM node:16.16.0-alpine AS builder

RUN apk update && \
    apk add --no-cache \
        build-base \
        cairo-dev \
        jpeg-dev \
        pango-dev \
        giflib-dev \
        pixman-dev \
        libtool \
        autoconf \
        automake \
        g++ \
        make \
        python3
        
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Stage 2: Create lightweight production image
FROM node:16.16.0-alpine

# Install necessary system dependencies for canvas
RUN apk update && \
    apk add --no-cache \
        cairo \
        libjpeg \
        pango \
        giflib \
        pixman \
        libtool \
        autoconf \
        automake

WORKDIR /app
COPY --from=builder /app .

# Copy only necessary files
COPY . .

CMD ["node", "index.js"]
