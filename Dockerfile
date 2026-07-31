# Dockerfile opcional para el backend. Úsalo si prefieres desplegar el
# servicio Spring Boot como contenedor (Render "Docker" runtime, Railway, etc.)
# en lugar del runtime nativo de Java. El frontend NO se sirve desde aquí:
# se despliega aparte (ver render.yaml / GUIA_DESPLIEGUE.md).

# ---- Etapa 1: build ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src ./src
RUN ./mvnw -B clean package -DskipTests

# ---- Etapa 2: runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/abrazamente-0.0.1-SNAPSHOT.jar app.jar

# Render inyecta PORT en tiempo de ejecución; application.yaml ya lo respeta
# mediante server.port: ${PORT:8080}.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
