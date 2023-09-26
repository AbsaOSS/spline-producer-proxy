# Use a Node.js 20 base image with Alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install tini
RUN apk add --no-cache tini

# Copy source code
COPY dist .

# Expose the desired port
EXPOSE 3000

# Use tini as the entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Run the application
CMD ["node", "index.js"]
