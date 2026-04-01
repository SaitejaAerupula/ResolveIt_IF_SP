package com.complaint.portal.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String submissionType; 
    private String urgency; // Low, Medium, High
    private String subject;
    private String description;
    private String fileName; // Attached file evidence
    private String status = "NEW";
    private LocalDateTime createdAt = LocalDateTime.now();
}