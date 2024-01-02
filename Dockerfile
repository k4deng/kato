FROM node:16.16.0-alpine

# Install system dependencies for canvas
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

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]