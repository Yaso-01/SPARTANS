package it.unicam.spartans.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Il commento non può essere vuoto")
    private String content;
}