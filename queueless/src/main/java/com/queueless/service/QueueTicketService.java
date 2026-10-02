package com.queueless.service;

import com.queueless.QueueBusyException;
import com.queueless.entity.QueueTicket;
import com.queueless.repository.QueueTicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueueTicketService {

    private final QueueTicketRepository queueTicketRepository;

    public QueueTicketService(QueueTicketRepository queueTicketRepository) {
        this.queueTicketRepository = queueTicketRepository;
    }

    // Create a new queue ticket
    public QueueTicket createTicket(QueueTicket ticket) {

        QueueTicket lastTicket =
                queueTicketRepository.findTopByOrderByTokenNumberDesc();

        int nextToken = 1;

        if (lastTicket != null) {
            nextToken = lastTicket.getTokenNumber() + 1;
        }

        ticket.setTokenNumber(nextToken);

        if (ticket.getStatus() == null || ticket.getStatus().isEmpty()) {
            ticket.setStatus("WAITING");
        }

        return queueTicketRepository.save(ticket);
    }

    // Call the next waiting customer
    public QueueTicket callNextCustomer() {

        // Check if a customer is already being served
        QueueTicket currentServing =
                queueTicketRepository.findFirstByStatusOrderByTokenNumberAsc("SERVING");

        if (currentServing != null) {
    throw new QueueBusyException(
            "A customer is already being served."
    );
}

        // Find the first waiting customer
        QueueTicket nextTicket =
                queueTicketRepository.findFirstByStatusOrderByTokenNumberAsc("WAITING");

        if (nextTicket == null) {
            return null;
        }

        // Change WAITING to SERVING
        nextTicket.setStatus("SERVING");

        return queueTicketRepository.save(nextTicket);
    }

    // Get all queue tickets
    public List<QueueTicket> getAllTickets() {
        return queueTicketRepository.findAll();
    }

    // Get one queue ticket by ID
    public QueueTicket getTicketById(Long id) {
        return queueTicketRepository.findById(id).orElse(null);
    }

    // Update a queue ticket
    public QueueTicket updateTicket(Long id, QueueTicket ticket) {

        QueueTicket existing = queueTicketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Queue ticket not found"));

        existing.setTokenNumber(ticket.getTokenNumber());
        existing.setCustomerName(ticket.getCustomerName());
        existing.setPhone(ticket.getPhone());
        existing.setService(ticket.getService());
        existing.setStatus(ticket.getStatus());

        return queueTicketRepository.save(existing);
    }

    // Delete a queue ticket
    public void deleteTicket(Long id) {
        queueTicketRepository.deleteById(id);
    }

    // Complete a customer
    public QueueTicket completeTicket(Long id) {

        QueueTicket ticket = queueTicketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Queue ticket not found"));

        ticket.setStatus("COMPLETED");

        return queueTicketRepository.save(ticket);
    }
}