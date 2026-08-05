package com.backend.abrazamente.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({"/", "/login", "/registro", "/perfil"})
    public String index() {
        return "forward:/index.html";
    }
}
