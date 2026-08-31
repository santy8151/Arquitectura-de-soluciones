package com.lasttrack.presentation.order;

import com.lasttrack.application.order.*;
import com.lasttrack.domain.order.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
// Es publica porque Spring debe registrar esta clase como controlador REST del microservicio.
public class OrderController {
    // Es privado para encapsular el caso de uso y exponer solo endpoints HTTP.
    private final OrderUseCase orders;

    // Es publico porque Spring necesita inyectar el caso de uso al crear el controlador.
    public OrderController(OrderUseCase orders) { this.orders = orders; }

    @GetMapping("/orders")
    public List<OrderResponse> findAll() { return orders.findAll().stream().map(OrderResponse::from).toList(); }

    @PostMapping("/orders") @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody OrderRequest request) {
        return OrderResponse.from(orders.create(new CreateOrderCommand(request.customerName(), request.deliveryAddress(), request.total())));
    }

    @PatchMapping("/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return OrderResponse.from(orders.updateStatus(id, status));
    }

    @GetMapping("/dashboard") public DashboardSummary dashboard() { return orders.dashboard(); }
    @GetMapping("/health") public String health() { return "ok"; }
}
