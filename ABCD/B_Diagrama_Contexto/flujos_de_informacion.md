# Flujos de información del diagrama

| Actor / sistema | Información hacia LastTrack | Información desde LastTrack |
|---|---|---|
| Cliente | Consulta del pedido | Estado, trazabilidad y notificaciones |
| Tienda | Registro de pedido | Estado de procesamiento |
| Almacén | Inventario disponible | Solicitud de preparación/despacho |
| Repartidor | Ubicación y estado de entrega | Pedido y ruta asignada |
| Soporte | Consultas e incidencias | Historial y estado del pedido |
| Sistema de pagos | Confirmación del pago | Solicitud de validación |
| Geolocalización | Ruta, distancia y ubicación | Solicitud de cálculo/consulta |
| Notificaciones | Confirmación técnica del envío | Evento que debe ser comunicado |
| ERP / CRM | Datos internos | Solicitudes de sincronización |

## Límite del sistema

LastTrack centraliza la coordinación logística, pero los servicios de pagos, geolocalización, notificaciones y ERP/CRM permanecen como sistemas externos.
