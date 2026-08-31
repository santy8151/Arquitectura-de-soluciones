package com.lasttrack.presentation.order;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

// Es publico porque Spring usa este contrato para recibir el cuerpo JSON de creacion.
public record OrderRequest(
    @NotBlank String customerName,
    @NotBlank String deliveryAddress,
    @NotNull @DecimalMin("0.01") BigDecimal total
) {}
