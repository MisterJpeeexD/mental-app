package com.backend.abrazamente.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class JwtUtil {
    public static void main(String[] args){
        var key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String encoded = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println(encoded);
    }
}
