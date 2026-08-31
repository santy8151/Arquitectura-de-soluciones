package com.lasttrack.domain.order;

import java.time.Instant;
import java.util.Objects;

// Es publica porque otras capas necesitan tratar cualquier elemento trazable de forma polimorfica.
public abstract class TrackableWorkItem {
    // Es privado para encapsular el identificador y evitar cambios directos fuera del dominio.
    private final Long id;
    // Es privado para proteger la fecha de creacion como dato interno del objeto.
    private final Instant createdAt;

    protected TrackableWorkItem(Long id, Instant createdAt) {
        this.id = id;
        this.createdAt = Objects.requireNonNull(createdAt, "La fecha es obligatoria");
    }

    // Es publico porque la API y la persistencia necesitan leer el identificador sin modificarlo.
    public Long id() { return id; }

    // Es publico porque la API y la persistencia necesitan leer la fecha sin modificarla.
    public Instant createdAt() { return createdAt; }

    // Es publico porque permite polimorfismo: cada hijo decide como describe su estado operativo.
    public abstract String trackingLabel();
}
