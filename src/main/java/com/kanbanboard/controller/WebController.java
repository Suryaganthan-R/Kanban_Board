package com.kanbanboard.controller;

import com.kanbanboard.service.TaskService;
import com.kanbanboard.service.ColumnService;
import com.kanbanboard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class WebController {
    private final TaskService taskService;
    private final ColumnService columnService;
    private final UserService userService;
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("tasksGrouped", taskService.getTasksGroupedByColumn());
        model.addAttribute("columns", columnService.getAllColumns());
        // Only show current user for task assignment
        userService.getCurrentUser().ifPresent(user -> 
            model.addAttribute("users", java.util.List.of(user))
        );
        return "index";
    }
    
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        return index(model);
    }
}