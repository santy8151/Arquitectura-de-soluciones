# LastTrack

Prototipo y entrega académica de una plataforma de gestión logística de última milla.

## Estructura

- `ABCD/`: diagnóstico y contexto exigidos por la actividad.
- `backend/`: API Java 21 + Spring Boot con arquitectura Onion.
- `frontend/`: consola React + TypeScript.
- `docker-compose.yml`: frontend, API y PostgreSQL.

## Ejecutar todo

```bash
docker compose up --build
```

- Aplicación: http://localhost:3000
- API: http://localhost:8080/api
- PostgreSQL: localhost:5432

Para detener: `docker compose down`. Para borrar también los datos: `docker compose down -v`.

## Desarrollo local

```bash
cd backend
mvn test
mvn spring-boot:run
```

```bash
cd frontend
npm install
npm run dev
```

En desarrollo puede definirse `VITE_API_URL=http://localhost:8080/api`.

## Arquitectura Onion

La dirección de dependencias es `presentation/infrastructure -> application -> domain`. El dominio contiene las reglas del pedido y no importa Spring ni JPA. PostgreSQL implementa el puerto `OrderRepository` desde infraestructura.

## Backend Maven

El proyecto tiene un POM raíz que centraliza la herencia Maven y declara `backend` como su único módulo. El backend es un microservicio ejecutable con las capas Onion conectadas dentro de `src/main/java`:

- `domain`: entidades, herencia, encapsulamiento y reglas del negocio.
- `application`: casos de uso y puertos de aplicación.
- `infrastructure`: persistencia JPA y PostgreSQL.
- `presentation`: API REST Spring Boot.

Para compilar y probar el proyecto desde la raíz:

```bash
mvn clean verify
```

También puede ejecutarse desde `backend/` porque hereda del POM raíz:

```bash
cd backend
mvn clean verify
```

Una arquitectura y un plan persistente hacen que el product owner no tenga que ir por metodologia scrum si no kanban.
