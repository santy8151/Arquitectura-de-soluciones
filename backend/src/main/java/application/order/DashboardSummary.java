package com.lasttrack.application.order;

// Es publico porque presentation devuelve este resumen operativo desde la API.
public record DashboardSummary(long totalOrders, long inTransit, long delivered, long cancelled) {}
