# D. Supuestos y decisiones iniciales

## Supuestos
- Cada pedido posee un identificador único.
- Los repartidores utilizan dispositivos con acceso a internet y GPS.
- El sistema de comercio puede enviar los pedidos a LastTrack.
- Los almacenes pueden consultar o actualizar digitalmente su inventario.
- El sistema de pagos puede informar si un pago fue aprobado o rechazado.
- Los servicios externos pueden integrarse mediante interfaces o APIs.
- La empresa necesita consultar la trazabilidad histórica de cada pedido.

## Decisiones iniciales
- Crear una plataforma centralizada para coordinar el flujo logístico.
- Mantener pagos, mapas, notificaciones y ERP/CRM como sistemas externos.
- Centralizar el estado operativo del pedido en LastTrack.
- Permitir que cada actor acceda únicamente a la información necesaria para su función.
- Diseñar el sistema alrededor del ciclo de vida del pedido y no alrededor de una tecnología específica.
- Usar Java 21 y Spring Boot para una API REST modular, con separación por dominios y responsabilidades.
- Usar PostgreSQL como fuente de verdad transaccional para pedidos, inventario, usuarios y estados; JPA/Hibernate será el acceso ORM a esta base.
- Usar PostgreSQL también para datos flexibles mediante columnas JSONB; evaluar MongoDB únicamente si las métricas futuras demuestran una necesidad real.
- Usar React para la consola web de operadores y React Native para la aplicación móvil del repartidor y futuras aplicaciones móviles.
- Empaquetar backend y bases de datos con Docker Compose para facilitar el desarrollo multiplataforma.

## Lo que aún no sabemos
- Volumen real de pedidos diarios.
- Número exacto de almacenes.
- Número máximo de repartidores conectados simultáneamente.
- ERP o CRM utilizado por la empresa.
- Frecuencia requerida para actualizar la ubicación.
- Tiempo durante el cual debe conservarse el historial.
- Reglas exactas de asignación de rutas.
- Qué sucede operacionalmente cuando un repartidor pierde conectividad.
- Niveles de servicio esperados para cada tipo de entrega.

## Aspectos por confirmar posteriormente
- Requisitos de seguridad.
- Requisitos de disponibilidad.
- Requisitos de escalabilidad.
- Protección de datos personales.
- Integraciones existentes.
- Métricas de operación y desempeño.
