package com.queueless.controller;

import com.queueless.entity.QueueTicket;
import com.queueless.service.QueueTicketService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/queue")
public class QueueTicketController {

    private final QueueTicketService queueTicketService;

    public QueueTicketController(QueueTicketService queueTicketService) {
        this.queueTicketService = queueTicketService;
    }

    // Create a new queue ticket
    @PostMapping
    public QueueTicket createTicket(@RequestBody QueueTicket ticket) {
        return queueTicketService.createTicket(ticket);
    }

    // Get all queue tickets
    @GetMapping
    public List<QueueTicket> getAllTickets() {
        return queueTicketService.getAllTickets();
    }

    // Get ticket by ID
    @GetMapping("/{id}")
    public QueueTicket getTicketById(@PathVariable Long id) {
        return queueTicketService.getTicketById(id);
    }

    // Call the next waiting customer
    @PostMapping("/call-next")
    public QueueTicket callNextCustomer() {
        return queueTicketService.callNextCustomer();
    }

    // Update ticket
    @PutMapping("/{id}")
    public QueueTicket updateTicket(
            @PathVariable Long id,
            @RequestBody QueueTicket ticket) {

        return queueTicketService.updateTicket(id, ticket);
    }

    // Delete ticket
    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id) {

        queueTicketService.deleteTicket(id);

        return "Queue ticket deleted successfully";
    }

    // Complete a queue ticket
    @PutMapping("/complete/{id}")
    public QueueTicket completeTicket(@PathVariable Long id) {
        return queueTicketService.completeTicket(id);
    }
}