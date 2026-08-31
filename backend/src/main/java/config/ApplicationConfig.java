package com.lasttrack.config;

import com.lasttrack.application.order.OrderService;
import com.lasttrack.application.order.OrderUseCase;
import com.lasttrack.domain.order.OrderRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
// Es publica porque Spring necesita leer esta configuracion para conectar application con domain.
public class ApplicationConfig {
    // Es publico para que Spring registre el caso de uso como bean disponible para presentation.
    @Bean
    public OrderUseCase orderUseCase(OrderRepository repository) { return new OrderService(repository); }
}
