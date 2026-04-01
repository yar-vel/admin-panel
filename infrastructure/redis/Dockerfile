FROM redis/redis-stack:7.4.0-v8 AS development

FROM redis/redis-stack-server:7.4.0-v8 AS production
COPY ./redis-stack.conf /redis-stack.conf
