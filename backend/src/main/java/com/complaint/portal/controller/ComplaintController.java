package com.complaint.portal.controller;

import com.complaint.portal.model.Complaint;
import com.complaint.portal.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Allows React to securely connect to Java
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // SAVE NEW COMPLAINT TO MYSQL
    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus("NEW"); // Default status for new submissions
        return complaintRepository.save(complaint);
    }

    // ADMIN: GET ALL COMPLAINTS
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // UPDATE STATUS & NOTES (MILESTONE 3)
    @PutMapping("/{id}")
    public Complaint updateComplaintStatus(@PathVariable Long id, @RequestBody Complaint updateDetails) {
        Optional<Complaint> existingComplaint = complaintRepository.findById(id);
        if (existingComplaint.isPresent()) {
            Complaint complaint = existingComplaint.get();
            // Admins can update status!
            if (updateDetails.getStatus() != null) {
                complaint.setStatus(updateDetails.getStatus());
            }
            return complaintRepository.save(complaint);
        }
        return null; // Not found fallback
    }

    // ESCALATE COMPLAINT (MILESTONE 4)
    @PostMapping("/{id}/escalate")
    public Complaint escalateComplaint(@PathVariable Long id) {
        Optional<Complaint> existingComplaint = complaintRepository.findById(id);
        if (existingComplaint.isPresent()) {
            Complaint complaint = existingComplaint.get();
            complaint.setStatus("ESCALATED");
            return complaintRepository.save(complaint);
        }
        return null;
    }
}
