package com.lasttrack.application.order;

import com.lasttrack.domain.order.Order;
import com.lasttrack.domain.order.OrderStatus;
import java.util.List;

// Es publica porque presentation consume este contrato sin depender de la implementacion concreta.
public interface OrderUseCase {
    List<Order> findAll();
    Order create(CreateOrderCommand command);
    Order updateStatus(Long id, OrderStatus status);
    DashboardSummary dashboard();
}
