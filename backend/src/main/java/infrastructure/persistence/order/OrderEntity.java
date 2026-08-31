package com.lasttrack.infrastructure.persistence.order;

import com.lasttrack.domain.order.OrderStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Es privado para encapsular la clave primaria y dejar que JPA la gestione.
    private Long id;
    // Es privado para que la persistencia no exponga campos modificables directamente.
    private String customerName;
    // Es privado para que el adaptador controle como se guarda la direccion.
    private String deliveryAddress;
    // Es privado para preservar el total como dato persistido bajo control del adaptador.
    private BigDecimal total;
    @Enumerated(EnumType.STRING)
    // Es privado para que el estado persistido se traduzca desde el dominio.
    private OrderStatus status;
    // Es privado para que la fecha persistida no sea alterada desde fuera de infraestructura.
    private Instant createdAt;

    // Es protegido porque JPA necesita el constructor y el dominio no debe crear entidades de persistencia.
    protected OrderEntity() {}

    static OrderEntity fromDomain(Long id, String customerName, String deliveryAddress, BigDecimal total,
                                  OrderStatus status, Instant createdAt) {
        var entity = new OrderEntity();
        entity.id = id;
        entity.customerName = customerName;
        entity.deliveryAddress = deliveryAddress;
        entity.total = total;
        entity.status = status;
        entity.createdAt = createdAt;
        return entity;
    }

    Long id() { return id; }
    String customerName() { return customerName; }
    String deliveryAddress() { return deliveryAddress; }
    BigDecimal total() { return total; }
    OrderStatus status() { return status; }
    Instant createdAt() { return createdAt; }
}
