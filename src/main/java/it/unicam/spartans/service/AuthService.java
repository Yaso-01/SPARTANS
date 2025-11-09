package it.unicam.spartans.service;

import it.unicam.spartans.dto.AuthResponse;
import it.unicam.spartans.dto.LoginRequest;
import it.unicam.spartans.dto.RegisterRequest;
import it.unicam.spartans.model.User;
import it.unicam.spartans.repository.UserRepository;
import it.unicam.spartans.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username già esistente");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email già registrata");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getId());
    }
}
