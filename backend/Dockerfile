# Usando a imagem oficial do PHP com Apache
FROM php:8.1-cli

# Instalando dependências necessárias (como o Composer)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    curl \
    git \
    libmcrypt-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql

# Instalando o Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Definindo a pasta de trabalho do container
WORKDIR /var/www/html

# Copiar o código da aplicação Laravel para o container
COPY . /var/www/html

# Rodando os comandos para instalar as dependências do Laravel
RUN composer install

# Expondo a porta 8000 (o Laravel serve a aplicação por padrão nesta porta)
EXPOSE 8000

# Comando para rodar o servidor de desenvolvimento do Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
