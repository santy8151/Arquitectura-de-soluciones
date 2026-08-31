package com.lasttrack.application.order;

// Es publica porque presentation debe capturar este error del caso de uso y convertirlo en HTTP 404.
public final class OrderNotFoundException extends RuntimeException {
    // Es publico porque application lo lanza cuando no encuentra un pedido.
    public OrderNotFoundException(Long id) { super("No existe el pedido " + id); }
}
