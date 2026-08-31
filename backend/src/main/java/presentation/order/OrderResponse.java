package com.lasttrack.presentation.order;

import com.lasttrack.domain.order.Order;
import com.lasttrack.domain.order.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;

// Es publico porque Spring serializa este contrato como respuesta JSON de la API.
public record OrderResponse(Long id, String customerName, String deliveryAddress, BigDecimal total,
                            OrderStatus status, Instant createdAt) {
    static OrderResponse from(Order order) {
        return new OrderResponse(order.id(), order.customerName(), order.deliveryAddress(), order.total(),
            order.status(), order.createdAt());
    }
}
