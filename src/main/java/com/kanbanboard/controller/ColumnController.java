package com.kanbanboard.controller;

import com.kanbanboard.model.KanbanColumn;
import com.kanbanboard.service.ColumnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/columns")
@RequiredArgsConstructor
public class ColumnController {
    private final ColumnService columnService;
    
    @PostMapping
    public ResponseEntity<KanbanColumn> createColumn(@RequestBody KanbanColumn column) {
        return ResponseEntity.ok(columnService.createColumn(column));
    }
    
    @GetMapping
    public ResponseEntity<List<KanbanColumn>> getAllColumns() {
        return ResponseEntity.ok(columnService.getAllColumns());
    }
}