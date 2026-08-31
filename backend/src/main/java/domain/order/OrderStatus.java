package com.lasttrack.domain.order;

// Es publico porque todas las capas deben compartir los estados validos del pedido.
public enum OrderStatus {
    CREATED,
    PAYMENT_PENDING,
    INVENTORY_RESERVED,
    PREPARING,
    ASSIGNED,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}
