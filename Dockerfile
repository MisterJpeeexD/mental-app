# Multi-stage Dockerfile para AbrazaMente (React SPA + Spring Boot)

# --- Etapa 1: Build del Frontend (Vite / React) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Build del Backend (Maven / Java 21) ---
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copiar el build del frontend a static resources
COPY --from=frontend-builder /app/src/main/resources/static ./src/main/resources/static
RUN mvn clean package -DskipTests

# --- Etapa 3: Runtime de Producción ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/mental-app-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar"]
