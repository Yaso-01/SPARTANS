package it.unicam.spartans.service;

import it.unicam.spartans.model.User;
import it.unicam.spartans.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String fullName, String bio, String profileImageUrl) {
        User user = getCurrentUser();

        if (fullName != null) user.setFullName(fullName);
        if (bio != null) user.setBio(bio);
        if (profileImageUrl != null) user.setProfileImageUrl(profileImageUrl);

        return userRepository.save(user);
    }

    public Map<String, Object> getUserStats(Long userId) {
        User user = getUserById(userId);
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPosts", user.getPosts().size());
        stats.put("totalComments", user.getComments().size());
        stats.put("totalLikes", user.getLikes().size());

        return stats;
    }
}
