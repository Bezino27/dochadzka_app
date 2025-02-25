# Použijeme oficiálny Nginx image
FROM nginx:alpine

# Skopírujeme buildnuté súbory do Nginx
COPY build /usr/share/nginx/html

# Skopírujeme vlastnú konfiguráciu Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponujeme port 80
EXPOSE 80

# Spustíme Nginx
CMD ["nginx", "-g", "daemon off;"]