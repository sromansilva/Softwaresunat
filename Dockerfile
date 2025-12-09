# ==========================================
# Stage 1: Build React Application
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
# Para Vite: genera carpeta 'dist'
# Para CRA: genera carpeta 'build'
RUN npm run build

# ==========================================
# Stage 2: Serve with NGINX
# ==========================================
FROM nginx:alpine AS production

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos desde el builder
# Si usas VITE (dist):
COPY --from=builder /app/dist /usr/share/nginx/html

# Si usas CRA (build), comenta la línea anterior y descomenta esta:
# COPY --from=builder /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
