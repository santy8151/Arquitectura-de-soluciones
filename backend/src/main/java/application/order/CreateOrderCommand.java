package com.lasttrack.application.order;

import java.math.BigDecimal;

// Es publico porque presentation envia datos de creacion hacia application mediante este contrato.
public record CreateOrderCommand(String customerName, String deliveryAddress, BigDecimal total) {}
