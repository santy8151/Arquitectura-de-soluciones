# ABCD - Entrega académica consolidada

Esta carpeta concentra la evidencia solicitada en la Actividad 1. El código es un prototipo complementario; la evaluación principal se centra en comprender y delimitar el problema.

## A. Resumen ejecutivo

**LastTrack** es una plataforma centralizada de gestión logística de última milla para retail digital. Resuelve la fragmentación de información de pedidos, inventario, rutas y entregas, que hoy produce duplicidad, retrasos, errores y baja trazabilidad.

Actores: cliente, tienda, almacén, repartidor, soporte, pagos, geolocalización, notificaciones y ERP/CRM. El alcance inicial comprende registrar pedidos, consultar su estado, validar y reservar inventario, coordinar la preparación, asignar entregas, actualizar estados y gestionar incidencias. No incluye optimización avanzada, facturación, nómina ni reemplazo del ERP/CRM.

Documento ampliado: `A_Resumen_Ejecutivo/resumen_ejecutivo.md`.

## B. Diagrama de contexto

LastTrack recibe pedidos de tienda/e-commerce, consultas de clientes, preparación de almacén e incidencias de soporte. Integra pagos, geolocalización, notificaciones y datos maestros del ERP/CRM; asigna trabajo al repartidor y recibe estados y ubicación.

Fuentes: `B_Diagrama_Contexto/diagrama_contexto.png`, `diagrama_contexto.puml` y `flujos_de_informacion.md`.

## C. Análisis del problema

Cada actor opera con información parcial y actualizaciones no sincronizadas. El negocio no puede determinar con rapidez el estado real de un pedido. Las consecuencias son promesas incumplidas, inventario inconsistente, soporte reactivo, reprocesos y dificultad para crecer.

Variables clave: volumen de pedidos, disponibilidad y reserva de inventario, tiempos por etapa, capacidad del almacén, disponibilidad del repartidor, distancia y tráfico, fallos de pago, precisión de ubicación, incidencias y cumplimiento de entrega.

Documento ampliado: `C_Analisis_Problema/analisis_del_problema.md`.

## D. Supuestos y decisiones iniciales

Supuestos: existen identificadores únicos; el ERP/CRM expone datos maestros; los proveedores externos tienen API; el repartidor puede sufrir conectividad intermitente; PostgreSQL puede ser la fuente de verdad transaccional.

Decisiones: plataforma centralizada, API REST, dominio independiente mediante Onion, backend Java 21/Spring Boot, frontend React/TypeScript, PostgreSQL como fuente principal y Docker Compose para un entorno reproducible.

Pendiente por confirmar: volumen y concurrencia, SLA, reglas de reserva y cancelación, proveedores externos, retención de datos, roles/permisos y requisitos legales.

Documento ampliado: `D_Supuestos_y_Decisiones_Iniciales/supuestos_y_decisiones.md`.

## Complementos

- Guion de sustentación: `E_Video_Sustentacion/guion_video.md`.
- Justificación tecnológica: `F_Arquitectura_Tecnologica/arquitectura_tecnologica.md`.
