package com.myapp.repository;

import com.myapp.domain.BankTransaction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BankTransaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {}
