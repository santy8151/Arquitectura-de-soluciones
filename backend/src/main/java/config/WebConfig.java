package com.lasttrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
// Es publica porque Spring necesita aplicar esta configuracion web al microservicio.
public class WebConfig implements WebMvcConfigurer {
    @Override
    // Es publico porque Spring MVC llama este metodo para habilitar la comunicacion con el frontend.
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PATCH", "OPTIONS");
    }
}
