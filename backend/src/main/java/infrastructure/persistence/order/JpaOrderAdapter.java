package com.lasttrack.infrastructure.persistence.order;

import com.lasttrack.domain.order.Order;
import com.lasttrack.domain.order.OrderRepository;
import com.lasttrack.domain.order.OrderStatus;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
// Es publica porque Spring debe descubrirla como adaptador JPA del repositorio de dominio.
public class JpaOrderAdapter implements OrderRepository {
    // Es privado para encapsular Spring Data y que el resto del sistema dependa del puerto del dominio.
    private final SpringDataOrderRepository repository;

    // Es publico porque Spring inyecta el repositorio generado en este adaptador.
    public JpaOrderAdapter(SpringDataOrderRepository repository) { this.repository = repository; }

    @Override @Transactional(readOnly = true)
    public List<Order> findAll() { return repository.findAll().stream().map(this::toDomain).toList(); }

    @Override @Transactional(readOnly = true)
    public Optional<Order> findById(Long id) { return repository.findById(id).map(this::toDomain); }

    @Override public Order save(Order order) {
        OrderEntity entity = toEntity(order);
        return toDomain(repository.save(entity));
    }

    @Override @Transactional(readOnly = true) public long count() { return repository.count(); }
    @Override @Transactional(readOnly = true) public long countByStatus(OrderStatus status) { return repository.countByStatus(status); }

    // Es privado porque la conversion a dominio es detalle interno de infraestructura.
    private Order toDomain(OrderEntity e) {
        return Order.restore(e.id(), e.customerName(), e.deliveryAddress(), e.total(), e.status(), e.createdAt());
    }

    // Es privado porque la conversion a entidad JPA no debe usarse fuera del adaptador.
    private OrderEntity toEntity(Order order) {
        return OrderEntity.fromDomain(order.id(), order.customerName(), order.deliveryAddress(), order.total(),
            order.status(), order.createdAt());
    }
}
