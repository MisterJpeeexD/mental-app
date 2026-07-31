package com.example.demo.model;

import com.example.demo.model.enums.SessionStatus;
import com.example.demo.model.enums.SessionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas_sesiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesional_id", nullable = false)
    @JsonIgnore
    private Professional professional;

    @Column(name = "fecha_sesion", nullable = false)
    private LocalDateTime fechaSesion;

    @Column(name = "duracion_minutos", nullable = false)
    private Integer duracionMinutos = 60;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sesion", nullable = false)
    private SessionType tipoSesion = SessionType.ONLINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus estado = SessionStatus.PENDING;

    @Column(name = "monto_pagado", precision = 10, scale = 2)
    private BigDecimal montoPagado;

    @Column(name = "notas_usuario", columnDefinition = "TEXT")
    private String notasUsuario;

    @Column(name = "notas_profesional", columnDefinition = "TEXT")
    private String notasProfesional;

    @Column(name = "url_videollamada", length = 500)
    private String urlVideollamada;

    @Column(name = "ubicacion_presencial", length = 500)
    private String ubicacionPresencial;

    @Column(name = "fecha_reserva", nullable = false, updatable = false)
    private LocalDateTime fechaReserva = LocalDateTime.now();

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Feedback rating;
}
