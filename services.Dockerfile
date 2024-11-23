FROM eclipse-temurin:23-jre

RUN apt-get update && apt-get install -y shadow

RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

ARG APP_DIR
ARG DEPENDENCY=build/dependency

COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${APP_DIR}/${DEPENDENCY}/META-INF /app/META-INF
COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","hello.Application"]