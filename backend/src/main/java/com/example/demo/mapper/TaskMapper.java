package com.example.demo.mapper;

import com.example.demo.dto.TaskRequestDTO;
import com.example.demo.dto.TaskResponseDTO;
import com.example.demo.model.Task;

import java.util.List;
import java.util.stream.Collectors;

public class TaskMapper {

    public static Task toEntity(TaskRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        return task;
    }

    public static TaskResponseDTO toResponseDTO(Task task) {
        if (task == null) {
            return null;
        }
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        if (task.getUser() != null) {
            dto.setUserId(task.getUser().getId());
        }
        return dto;
    }

    public static List<TaskResponseDTO> toResponseDTOList(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }
        return tasks.stream()
                .map(TaskMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
