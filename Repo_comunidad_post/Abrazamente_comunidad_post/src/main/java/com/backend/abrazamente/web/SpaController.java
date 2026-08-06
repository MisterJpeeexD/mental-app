package com.backend.abrazamente.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/",
        "/login",
        "/registro",
        "/perfil",
        "/comunidad",
        "/recursos",
        "/professionals",
        "/journal",
        "/botiquin/breathing",
        "/botiquin/grounding"
    })
    public String index() {
        return "forward:/index.html";
    }
}
