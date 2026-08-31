package com.lasttrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Es publica porque Spring Boot necesita encontrar la clase principal del microservicio.
public class LastTrackApplication {
    // Es publico porque la JVM necesita este punto de entrada para iniciar la API.
    public static void main(String[] args) {
        SpringApplication.run(LastTrackApplication.class, args);
    }
}
