package com.kanbanboard.repository;

import com.kanbanboard.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByColumnColumnIdOrderByCreatedAt(Integer columnId);
    List<Task> findByUserUserIdOrderByCreatedAt(Integer userId);
    List<Task> findByColumnColumnIdAndUserUserIdOrderByCreatedAt(Integer columnId, Integer userId);
}