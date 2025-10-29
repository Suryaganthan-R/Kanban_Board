package com.kanbanboard.service;

import com.kanbanboard.model.Task;
import com.kanbanboard.model.KanbanColumn;
import com.kanbanboard.model.User;
import com.kanbanboard.repository.TaskRepository;
import com.kanbanboard.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;
    private final UserService userService;
    
    public Task createTask(Task task) {
        // Auto-assign current user to new tasks
        userService.getCurrentUser().ifPresent(task::setUser);
        return taskRepository.save(task);
    }
    
    public List<Task> getAllTasks() {
        // Only return tasks for current user
        return userService.getCurrentUser()
                .map(user -> taskRepository.findByUserUserIdOrderByCreatedAt(user.getUserId()))
                .orElse(List.of());
    }
    
    public Optional<Task> getTaskById(Integer id) {
        return taskRepository.findById(id);
    }
    
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }
    
    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }
    
    public Map<String, List<Task>> getTasksGroupedByColumn() {
        List<KanbanColumn> columns = columnRepository.findAllByOrderByPosition();
        Optional<User> currentUser = userService.getCurrentUser();
        
        if (currentUser.isEmpty()) {
            return columns.stream().collect(Collectors.toMap(KanbanColumn::getName, col -> List.of()));
        }
        
        return columns.stream()
                .collect(Collectors.toMap(
                    KanbanColumn::getName,
                    column -> taskRepository.findByColumnColumnIdAndUserUserIdOrderByCreatedAt(
                        column.getColumnId(), currentUser.get().getUserId())
                ));
    }
    
    public Task moveTask(Integer taskId, Integer columnId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new RuntimeException("Column not found"));
        task.setColumn(column);
        return taskRepository.save(task);
    }
}