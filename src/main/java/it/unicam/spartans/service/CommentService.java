package it.unicam.spartans.service;


import it.unicam.spartans.dto.CommentRequest;
import it.unicam.spartans.model.Comment;
import it.unicam.spartans.model.Post;
import it.unicam.spartans.model.User;
import it.unicam.spartans.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    public Comment createComment(Long postId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postService.getPostById(postId);

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    public List<Map<String, Object>> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);

        return comments.stream().map(comment -> {
            Map<String, Object> commentData = new HashMap<>();
            commentData.put("id", comment.getId());
            commentData.put("content", comment.getContent());
            commentData.put("createdAt", comment.getCreatedAt());

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", comment.getUser().getId());
            userData.put("username", comment.getUser().getUsername());
            userData.put("fullName", comment.getUser().getFullName());
            userData.put("profileImageUrl", comment.getUser().getProfileImageUrl());
            commentData.put("user", userData);

            return commentData;
        }).collect(Collectors.toList());
    }

    public void deleteComment(Long id) {
        User currentUser = userService.getCurrentUser();
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Non puoi eliminare un commento che non è tuo");
        }

        commentRepository.delete(comment);
    }
}
