package com.kanbanboard.service;

import com.kanbanboard.model.KanbanColumn;
import com.kanbanboard.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ColumnService {
    private final ColumnRepository columnRepository;
    
    public KanbanColumn createColumn(KanbanColumn column) {
        return columnRepository.save(column);
    }
    
    public List<KanbanColumn> getAllColumns() {
        return columnRepository.findAllByOrderByPosition();
    }
}