package com.lasttrack.config;

import com.lasttrack.domain.order.Order;
import com.lasttrack.domain.order.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;

@Configuration
// Es publica porque Spring debe detectar esta configuracion de datos iniciales.
public class DataSeeder {
    // Es publico para que Spring ejecute la carga inicial cuando arranca el microservicio.
    @Bean
    public CommandLineRunner seedOrders(OrderRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Order.create("Laura Gómez", "Carrera 43A # 12-18", new BigDecimal("189900")));
                repository.save(Order.create("Mateo Ríos", "Calle 10 # 34-22", new BigDecimal("74900")));
                repository.save(Order.create("Sofía Pérez", "Carrera 70 # 48-06", new BigDecimal("125000")));
            }
        };
    }
}
