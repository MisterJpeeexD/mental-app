package com.backend.abrazamente.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authProvider, JwtAuthFilter jwtAuthFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authenticationProvider(authProvider)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                    // Todos pueden consultar usuarios
                    .requestMatchers(HttpMethod.GET,"/usuarios").permitAll()
                    // Todos pueden crear usuarios
                    .requestMatchers(HttpMethod.POST,"/usuarios").permitAll()
                    // Solo usuario puede modificar usuarios
                    .requestMatchers(HttpMethod.PUT,"/usuarios/**").hasRole("CLIENT")
                    // Solo admin pueden eliminar usuarios
                    .requestMatchers(HttpMethod.DELETE,"/usuarios/**").hasRole("ADMIN")
                    // Todos pueden logearse
                    .requestMatchers(HttpMethod.POST,"/auth/login").permitAll()
                .anyRequest().authenticated())
                .httpBasic(httpBasic -> {});
        return http.build();
    }

    @Bean
    public AuthenticationProvider authProvider(UsuarioDetailsService usuarioDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config){
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("admin123"));
        System.out.println(encoder.encode("usuario123"));
        return encoder;
    }
}
