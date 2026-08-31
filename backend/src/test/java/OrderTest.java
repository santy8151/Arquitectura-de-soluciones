package com.lasttrack.domain.order;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderTest {
    @Test
    void advancesThroughTheLogisticsFlow() {
        var order = Order.create("Ana", "Calle 1", new BigDecimal("100"));

        order.advanceTo(OrderStatus.PAYMENT_PENDING);
        order.advanceTo(OrderStatus.INVENTORY_RESERVED);
        order.advanceTo(OrderStatus.PREPARING);
        order.advanceTo(OrderStatus.ASSIGNED);
        order.advanceTo(OrderStatus.IN_TRANSIT);
        order.advanceTo(OrderStatus.DELIVERED);

        assertEquals(OrderStatus.DELIVERED, order.status());
    }

    @Test
    void rejectsInvalidTransitions() {
        var order = Order.create("Ana", "Calle 1", new BigDecimal("100"));

        assertThrows(IllegalStateException.class, () -> order.advanceTo(OrderStatus.DELIVERED));
    }

    @Test
    void exposesOrderThroughPolymorphicBaseType() {
        TrackableWorkItem item = Order.create("Ana", "Calle 1", new BigDecimal("100"));

        assertEquals("Pedido null - CREATED", item.trackingLabel());
    }
}
