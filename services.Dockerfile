FROM amazoncorretto:23-alpine-jdk

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

ARG APP_DIR
ARG MAIN_CLASS
ARG DEPENDENCY=build/dependency

ENV ENV_MAIN_CLASS = ${MAIN_CLASS}

COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${APP_DIR}/${DEPENDENCY}/META-INF /app/META-INF
COPY ${APP_DIR}/${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*", $ENV_MAIN_CLASS]
