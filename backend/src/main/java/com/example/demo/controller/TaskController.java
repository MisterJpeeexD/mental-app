package com.example.demo.controller;

import com.example.demo.dto.TaskRequestDTO;
import com.example.demo.dto.TaskResponseDTO;
import com.example.demo.mapper.TaskMapper;
import com.example.demo.model.Task;
import com.example.demo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(TaskMapper.toResponseDTOList(tasks));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(TaskMapper.toResponseDTOList(tasks));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<TaskResponseDTO> createTask(@PathVariable Long userId, @Valid @RequestBody TaskRequestDTO taskDTO) {
        Task task = TaskMapper.toEntity(taskDTO);
        Task createdTask = taskService.createTask(userId, task);
        return new ResponseEntity<>(TaskMapper.toResponseDTO(createdTask), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(@PathVariable Long id, @RequestParam Task.TaskStatus status) {
        Task updatedTask = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(TaskMapper.toResponseDTO(updatedTask));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
