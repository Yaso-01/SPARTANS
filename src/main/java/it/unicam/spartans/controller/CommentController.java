package it.unicam.spartans.controller;


import it.unicam.spartans.dto.CommentRequest;
import it.unicam.spartans.model.Comment;
import it.unicam.spartans.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> createComment(@PathVariable Long postId,
                                           @Valid @RequestBody CommentRequest request) {
        try {
            Comment comment = commentService.createComment(postId, request);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Map<String, Object>>> getCommentsByPostId(@PathVariable Long postId) {
        try {
            List<Map<String, Object>> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().body("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
