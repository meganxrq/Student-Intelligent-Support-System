package com.megan.university.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "*")
@Controller
public class ViewController {

    @RequestMapping({"/**/{path:[^\\\\.]+}"})
    public String index() {
        return "forward:/index.html";
    }

}

