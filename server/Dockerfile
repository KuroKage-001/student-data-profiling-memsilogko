FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /opt/render/project/src/server

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Set permissions
RUN chown -R www-data:www-data /opt/render/project/src/server \
    && chmod -R 755 /opt/render/project/src/server/storage \
    && chmod -R 755 /opt/render/project/src/server/bootstrap/cache

# Make scripts executable
RUN chmod +x render-build.sh render-start.sh

EXPOSE $PORT

CMD ["./render-start.sh"]