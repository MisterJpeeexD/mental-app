package com.backend.abrazamente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "recursos_digitales")
public class RecursoDigital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "tipo_contenido", length = 20)
    private String tipoContenido;

    @Column(length = 255)
    private String autor;

    @Column(name = "url_contenido", length = 500)
    private String urlContenido;

    @Column(name = "duracion_minutos")
    private Integer duracionMinutos;

    @Column(name = "imagen_portada_url", length = 500)
    private String imagenPortadaUrl;

    @Column(name = "es_premium")
    private Boolean esPremium = false;

    @Column(precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "codigo_afiliado", length = 100)
    private String codigoAfiliado;

    @Column(name = "url_afiliado", length = 500)
    private String urlAfiliado;

    private Integer vistas = 0;

    @Column(length = 20)
    private String estado = "activo";

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private OffsetDateTime fechaActualizacion;

    @ManyToMany
    @JoinTable(
            name = "recurso_categoria",
            joinColumns = @JoinColumn(name = "recurso_id"),
            inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<CategoriaRecurso> categorias = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecursoDigital that = (RecursoDigital) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
