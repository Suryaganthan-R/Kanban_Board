package com.kanbanboard.repository;

import com.kanbanboard.model.KanbanColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ColumnRepository extends JpaRepository<KanbanColumn, Integer> {
    List<KanbanColumn> findAllByOrderByPosition();
}