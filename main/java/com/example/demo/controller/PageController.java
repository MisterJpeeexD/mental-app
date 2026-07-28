package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/inicio"})
    public String inicio() {
        return "forward:/public/index.html";
    }

    @GetMapping("/recursos")
    public String recursos() {
        return "forward:/public/recursos.html";
    }

    @GetMapping("/terapia")
    public String terapia() {
        return "forward:/public/terapia.html";
    }

    @GetMapping("/comunidad")
    public String comunidad() {
        return "forward:/public/comunidad.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/public/login.html";
    }
}
