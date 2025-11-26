Comando docker para rodar o banco

docker run -d \
 --name postgres-uaifood \
 -e POSTGRES_USER=postgres \
 -e POSTGRES_PASSWORD=12345 \
 -e POSTGRES_DB=db_uaifood \
 -p 5433:5432 \
 postgres:16

Comando pra rodar os trens do prisma

npx prisma format
npx prisma validate
