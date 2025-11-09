package it.unicam.spartans.repository;

import it.unicam.spartans.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    int countByPostId(Long postId);
    void deleteByUserIdAndPostId(Long userId, Long postId);
}