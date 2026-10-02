package com.queueless.repository;

import com.queueless.entity.QueueTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueTicketRepository extends JpaRepository<QueueTicket, Long> {

    QueueTicket findTopByOrderByTokenNumberDesc();

    QueueTicket findFirstByStatusOrderByTokenNumberAsc(String status);
}
