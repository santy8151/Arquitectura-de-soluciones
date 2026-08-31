package com.lasttrack.domain.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumSet;
import java.util.Objects;

// Es publica porque application, infrastructure y presentation necesitan usar esta entidad de dominio.
public final class Order extends TrackableWorkItem {
    // Es privado para encapsular los datos del cliente y obligar a pasar por validaciones del dominio.
    private final String customerName;
    // Es privado para evitar que la direccion cambie sin reglas de negocio.
    private final String deliveryAddress;
    // Es privado para garantizar que el total siempre sea validado por el constructor.
    private final BigDecimal total;
    // Es privado para que los cambios de estado pasen por advanceTo y respeten las transiciones.
    private OrderStatus status;

    // Es privado porque la creacion debe pasar por fabricas que validan si es pedido nuevo o restaurado.
    private Order(Long id, String customerName, String deliveryAddress, BigDecimal total,
                  OrderStatus status, Instant createdAt) {
        super(id, createdAt);
        this.customerName = requireText(customerName, "El cliente es obligatorio");
        this.deliveryAddress = requireText(deliveryAddress, "La dirección es obligatoria");
        if (total == null || total.signum() <= 0) {
            throw new IllegalArgumentException("El total debe ser mayor que cero");
        }
        this.total = total;
        this.status = Objects.requireNonNull(status, "El estado es obligatorio");
    }

    // Es publico porque la aplicacion necesita crear pedidos sin conocer detalles internos del constructor.
    public static Order create(String customerName, String deliveryAddress, BigDecimal total) {
        return new Order(null, customerName, deliveryAddress, total, OrderStatus.CREATED, Instant.now());
    }

    // Es publico porque infraestructura necesita reconstruir pedidos guardados por JPA.
    public static Order restore(Long id, String customerName, String deliveryAddress, BigDecimal total,
                                OrderStatus status, Instant createdAt) {
        return new Order(id, customerName, deliveryAddress, total, status, createdAt);
    }

    // Es publico porque el caso de uso debe cambiar el estado respetando reglas del dominio.
    public void advanceTo(OrderStatus nextStatus) {
        Objects.requireNonNull(nextStatus, "El nuevo estado es obligatorio");
        var allowed = switch (status) {
            case CREATED -> EnumSet.of(OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED);
            case PAYMENT_PENDING -> EnumSet.of(OrderStatus.INVENTORY_RESERVED, OrderStatus.CANCELLED);
            case INVENTORY_RESERVED -> EnumSet.of(OrderStatus.PREPARING, OrderStatus.CANCELLED);
            case PREPARING -> EnumSet.of(OrderStatus.ASSIGNED, OrderStatus.CANCELLED);
            case ASSIGNED -> EnumSet.of(OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED);
            case IN_TRANSIT -> EnumSet.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED);
            default -> EnumSet.noneOf(OrderStatus.class);
        };
        if (!allowed.contains(nextStatus)) {
            throw new IllegalStateException("Transición no permitida: " + status + " -> " + nextStatus);
        }
        status = nextStatus;
    }

    @Override
    // Es publico porque implementa el contrato polimorfico de TrackableWorkItem para reportar seguimiento.
    public String trackingLabel() {
        return "Pedido " + id() + " - " + status;
    }

    // Es privado porque es una validacion interna reutilizada solo por esta entidad.
    private static String requireText(String value, String message) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(message);
        return value.trim();
    }

    // Es publico porque las capas externas necesitan leer el cliente sin poder modificarlo.
    public String customerName() { return customerName; }

    // Es publico porque las capas externas necesitan leer la direccion sin poder modificarla.
    public String deliveryAddress() { return deliveryAddress; }

    // Es publico porque las capas externas necesitan leer el total sin poder modificarlo.
    public BigDecimal total() { return total; }

    // Es publico porque las capas externas necesitan leer el estado sin saltarse advanceTo.
    public OrderStatus status() { return status; }
}
