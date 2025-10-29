package com.kanbanboard.controller;

import com.kanbanboard.model.Task;
import com.kanbanboard.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final TaskService taskService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<Task>>> getTasksGroupedByColumn() {
        return ResponseEntity.ok(taskService.getTasksGroupedByColumn());
    }
}