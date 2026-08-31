package com.lasttrack.domain.order;

import java.util.List;
import java.util.Optional;

// Es publica porque application define casos de uso contra esta abstraccion y infrastructure la implementa.
public interface OrderRepository {
    List<Order> findAll();
    Optional<Order> findById(Long id);
    Order save(Order order);
    long count();
    long countByStatus(OrderStatus status);
}
