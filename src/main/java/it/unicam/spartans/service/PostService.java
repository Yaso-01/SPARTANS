package it.unicam.spartans.service;


import it.unicam.spartans.dto.PostRequest;
import it.unicam.spartans.model.Like;
import it.unicam.spartans.model.Post;
import it.unicam.spartans.model.User;
import it.unicam.spartans.repository.LikeRepository;
import it.unicam.spartans.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserService userService;

    public Post createPost(PostRequest request) {
        User currentUser = userService.getCurrentUser();

        Post post = new Post();
        post.setDescription(request.getDescription());
        post.setSportType(request.getSportType());
        post.setActivityDate(request.getActivityDate());
        post.setDistance(request.getDistance());
        post.setDuration(request.getDuration());
        post.setCalories(request.getCalories());
        post.setImageUrl(request.getImageUrl());
        post.setUser(currentUser);

        return postRepository.save(post);
    }

    public List<Map<String, Object>> getAllPosts() {
        User currentUser = userService.getCurrentUser();
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

        return posts.stream().map(post -> {
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", post.getId());
            postData.put("description", post.getDescription());
            postData.put("sportType", post.getSportType());
            postData.put("activityDate", post.getActivityDate());
            postData.put("distance", post.getDistance());
            postData.put("duration", post.getDuration());
            postData.put("calories", post.getCalories());
            postData.put("imageUrl", post.getImageUrl());
            postData.put("createdAt", post.getCreatedAt());
            postData.put("likesCount", post.getLikesCount());
            postData.put("commentsCount", post.getCommentsCount());
            postData.put("isLikedByCurrentUser", likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId()));

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", post.getUser().getId());
            userData.put("username", post.getUser().getUsername());
            userData.put("fullName", post.getUser().getFullName());
            userData.put("profileImageUrl", post.getUser().getProfileImageUrl());
            postData.put("user", userData);

            return postData;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPostsBySportType(String sportType) {
        User currentUser = userService.getCurrentUser();
        List<Post> posts = postRepository.findBySportTypeOrderByCreatedAtDesc(sportType);

        return posts.stream().map(post -> {
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", post.getId());
            postData.put("description", post.getDescription());
            postData.put("sportType", post.getSportType());
            postData.put("activityDate", post.getActivityDate());
            postData.put("distance", post.getDistance());
            postData.put("duration", post.getDuration());
            postData.put("calories", post.getCalories());
            postData.put("imageUrl", post.getImageUrl());
            postData.put("createdAt", post.getCreatedAt());
            postData.put("likesCount", post.getLikesCount());
            postData.put("commentsCount", post.getCommentsCount());
            postData.put("isLikedByCurrentUser", likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId()));

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", post.getUser().getId());
            userData.put("username", post.getUser().getUsername());
            userData.put("fullName", post.getUser().getFullName());
            userData.put("profileImageUrl", post.getUser().getProfileImageUrl());
            postData.put("user", userData);

            return postData;
        }).collect(Collectors.toList());
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Transactional
    public void toggleLike(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = getPostById(postId);

        if (likeRepository.existsByUserIdAndPostId(currentUser.getId(), postId)) {
            likeRepository.deleteByUserIdAndPostId(currentUser.getId(), postId);
        } else {
            Like like = new Like();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepository.save(like);
        }
    }

    public void deletePost(Long id) {
        User currentUser = userService.getCurrentUser();
        Post post = getPostById(id);

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Non puoi eliminare un post che non è tuo");
        }

        postRepository.delete(post);
    }
}
