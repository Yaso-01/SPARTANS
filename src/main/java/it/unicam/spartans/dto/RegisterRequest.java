package it.unicam.spartans.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username è obbligatorio")
    @Size(min = 3, max = 20, message = "Username deve essere tra 3 e 20 caratteri")
    private String username;

    @NotBlank(message = "Email è obbligatoria")
    @Email(message = "Email non valida")
    private String email;

    @NotBlank(message = "Password è obbligatoria")
    @Size(min = 6, message = "Password deve essere almeno 6 caratteri")
    private String password;

    private String fullName;
}