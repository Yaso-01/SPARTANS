package it.unicam.spartans.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username è obbligatorio")
    private String username;

    @NotBlank(message = "Password è obbligatoria")
    private String password;
}