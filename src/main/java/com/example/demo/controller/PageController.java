package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/inicio", "/recursos", "/comunidad", "/login"})
    public String inicio() {
        return "forward:/index.html";
    }
}
