package it.unicam.spartans.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostRequest {

    @NotBlank(message = "Descrizione è obbligatoria")
    private String description;

    @NotBlank(message = "Tipo di sport è obbligatorio")
    private String sportType;

    @NotNull(message = "Data attività è obbligatoria")
    private LocalDateTime activityDate;

    private Double distance;
    private Integer duration;
    private Integer calories;
    private String imageUrl;
}