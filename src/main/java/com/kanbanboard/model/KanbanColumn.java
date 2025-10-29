package com.kanbanboard.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "columns")
public class KanbanColumn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "column_id")
    private Integer columnId;
    
    @Column(name = "name", length = 50, nullable = false)
    private String name;
    
    @Column(name = "position", nullable = false)
    private Integer position;
    
    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks;
    
    public KanbanColumn() {}
    
    public KanbanColumn(String name, Integer position) {
        this.name = name;
        this.position = position;
    }
    
    public KanbanColumn(Integer columnId, String name, Integer position, List<Task> tasks) {
        this.columnId = columnId;
        this.name = name;
        this.position = position;
        this.tasks = tasks;
    }
    
    public Integer getColumnId() { return columnId; }
    public void setColumnId(Integer columnId) { this.columnId = columnId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
    
    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}