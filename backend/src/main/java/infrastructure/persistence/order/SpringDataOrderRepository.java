package com.lasttrack.infrastructure.persistence.order;

import com.lasttrack.domain.order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataOrderRepository extends JpaRepository<OrderEntity, Long> {
    long countByStatus(OrderStatus status);
}
