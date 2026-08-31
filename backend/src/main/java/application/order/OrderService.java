package com.lasttrack.application.order;

import com.lasttrack.domain.order.Order;
import com.lasttrack.domain.order.OrderRepository;
import com.lasttrack.domain.order.OrderStatus;
import java.util.List;

// Es publica porque configuracion expone este servicio como implementacion del caso de uso.
public final class OrderService implements OrderUseCase {
    // Es privado para encapsular el puerto de datos y cambiarlo solo por inyeccion de dependencias.
    private final OrderRepository repository;

    // Es publico porque Spring necesita construir el servicio con sus dependencias.
    public OrderService(OrderRepository repository) { this.repository = repository; }

    @Override public List<Order> findAll() { return repository.findAll(); }

    @Override public Order create(CreateOrderCommand command) {
        return repository.save(Order.create(command.customerName(), command.deliveryAddress(), command.total()));
    }

    @Override public Order updateStatus(Long id, OrderStatus status) {
        Order order = repository.findById(id).orElseThrow(() -> new OrderNotFoundException(id));
        order.advanceTo(status);
        return repository.save(order);
    }

    @Override public DashboardSummary dashboard() {
        return new DashboardSummary(repository.count(), repository.countByStatus(OrderStatus.IN_TRANSIT),
            repository.countByStatus(OrderStatus.DELIVERED), repository.countByStatus(OrderStatus.CANCELLED));
    }
}
