# Actividad 1: Diagnóstico y contexto arquitectónico

## Estructura de entrega

Toda la evidencia académica está consolidada en `ABCD/`:

- `ABCD/A_Resumen_Ejecutivo/`
- `ABCD/B_Diagrama_Contexto/`
- `ABCD/C_Analisis_Problema/`
- `ABCD/D_Supuestos_y_Decisiones_Iniciales/`
- `ABCD/E_Video_Sustentacion/`
- `ABCD/F_Arquitectura_Tecnologica/`

## Proyecto propuesto

**Nombre:** LastTrack  
**Tipo:** Plataforma centralizada de gestión logística de última milla para retail digital.

## Archivos principales

Consulta primero `ABCD/README.md`; allí se resume la rúbrica y se enlaza conceptualmente con cada documento ampliado.

## Nota

El diagrama está hecho como diagrama UML de componentes/contexto mediante PlantUML.  
El archivo `.puml` es editable y el `.png` sirve para insertarlo directamente en la entrega.

## Orientacion tecnologica inicial

La propuesta para la siguiente etapa es **Java 21 con Spring Boot** en el backend, **React para la consola web** y **React Native para la aplicacion movil multiplataforma**. Se usara **PostgreSQL** como fuente unica de verdad para pedidos, inventario, usuarios, estados operativos y datos flexibles mediante `JSONB`. MongoDB queda como una posible evolucion, no como dependencia inicial.

**JPA/Hibernate** se aplicara a PostgreSQL. La base de datos se ejecutara con **Docker Compose** durante el desarrollo. La justificacion completa, las estructuras de datos, los principios de programacion orientada a objetos y la estructura propuesta de carpetas estan en `F_Arquitectura_Tecnologica/arquitectura_tecnologica.md`.
