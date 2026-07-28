package com.example.demo.service;

import com.example.demo.dto.GoogleAuthResponseDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final RestClient restClient;
    private final String googleClientId;
    private final String jwtSecret;
    private final long jwtExpirationMs;

    public GoogleAuthService(
            UserRepository userRepository,
            @Value("${spring.google.client-id}") String googleClientId,
            @Value("${spring.jwt.secret}") String jwtSecret,
            @Value("${spring.jwt.expiration}") long jwtExpirationMs
    ) {
        this.userRepository = userRepository;
        this.googleClientId = googleClientId;
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
        this.restClient = RestClient.builder()
                .baseUrl("https://oauth2.googleapis.com")
                .build();
    }

    public GoogleAuthResponseDTO loginOrRegister(String idToken) {
        GoogleTokenInfo tokenInfo = verifyToken(idToken);
        boolean isNewUser = userRepository.findByEmail(tokenInfo.email()).isEmpty();

        User user = userRepository.findByEmail(tokenInfo.email())
                .map(existingUser -> updateExistingUser(existingUser, tokenInfo))
                .orElseGet(() -> createGoogleUser(tokenInfo));

        User savedUser = userRepository.save(user);
        String token = createJwt(savedUser);

        return new GoogleAuthResponseDTO(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getNombres(),
                savedUser.getApellidos(),
                isNewUser
        );
    }

    private GoogleTokenInfo verifyToken(String idToken) {
        GoogleTokenInfo tokenInfo = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tokeninfo")
                        .queryParam("id_token", idToken)
                        .build())
                .retrieve()
                .body(GoogleTokenInfo.class);

        if (tokenInfo == null || tokenInfo.email() == null) {
            throw new IllegalArgumentException("Invalid Google token");
        }

        if (!googleClientId.equals(tokenInfo.audience())) {
            throw new IllegalArgumentException("Google token audience does not match this app");
        }

        if (!"true".equalsIgnoreCase(tokenInfo.emailVerified())) {
            throw new IllegalArgumentException("Google account email is not verified");
        }

        return tokenInfo;
    }

    private User createGoogleUser(GoogleTokenInfo tokenInfo) {
        User user = new User();
        user.setEmail(tokenInfo.email());
        user.setPasswordHash("GOOGLE:" + tokenInfo.subject());
        user.setNombres(resolveFirstName(tokenInfo));
        user.setApellidos(resolveLastName(tokenInfo));
        user.setFotoPerfilUrl(tokenInfo.picture());
        user.setFechaUltimoLogin(LocalDateTime.now());
        return user;
    }

    private User updateExistingUser(User user, GoogleTokenInfo tokenInfo) {
        user.setFotoPerfilUrl(tokenInfo.picture());
        user.setFechaUltimoLogin(LocalDateTime.now());
        user.setFechaActualizacion(LocalDateTime.now());
        return user;
    }

    private String resolveFirstName(GoogleTokenInfo tokenInfo) {
        if (hasText(tokenInfo.givenName())) {
            return tokenInfo.givenName();
        }

        if (hasText(tokenInfo.name())) {
            return tokenInfo.name().split(" ", 2)[0];
        }

        return tokenInfo.email().split("@", 2)[0];
    }

    private String resolveLastName(GoogleTokenInfo tokenInfo) {
        if (hasText(tokenInfo.familyName())) {
            return tokenInfo.familyName();
        }

        if (hasText(tokenInfo.name()) && tokenInfo.name().contains(" ")) {
            return tokenInfo.name().split(" ", 2)[1];
        }

        return "Google";
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String createJwt(User user) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(jwtExpirationMs);

        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64Url(String.format(
                "{\"sub\":\"%s\",\"email\":\"%s\",\"name\":\"%s\",\"iat\":%d,\"exp\":%d}",
                user.getId(),
                escapeJson(user.getEmail()),
                escapeJson(user.getNombres() + " " + user.getApellidos()),
                now.getEpochSecond(),
                expiration.getEpochSecond()
        ));

        String unsignedToken = header + "." + payload;
        return unsignedToken + "." + sign(unsignedToken);
    }

    private String sign(String unsignedToken) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not create auth token", exception);
        }
    }

    private String base64Url(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GoogleTokenInfo(
            @JsonProperty("aud") String audience,
            @JsonProperty("sub") String subject,
            String email,
            @JsonProperty("email_verified") String emailVerified,
            String name,
            @JsonProperty("given_name") String givenName,
            @JsonProperty("family_name") String familyName,
            String picture
    ) {
    }
}
