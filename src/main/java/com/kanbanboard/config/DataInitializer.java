package com.kanbanboard.config;

import com.kanbanboard.model.KanbanColumn;
import com.kanbanboard.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ColumnRepository columnRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (columnRepository.count() == 0) {
            columnRepository.save(new KanbanColumn("To Do", 1));
            columnRepository.save(new KanbanColumn("In Progress", 2));
            columnRepository.save(new KanbanColumn("Done", 3));
        }
    }
}