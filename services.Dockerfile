FROM eclipse-temurin:23-jre

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

ARG APP_DIR=/spring_apps
ARG DEPENDENCY=build/dependency

COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${APP_DIR}/${DEPENDENCY}/META-INF /app/META-INF
COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","hello.Application"]