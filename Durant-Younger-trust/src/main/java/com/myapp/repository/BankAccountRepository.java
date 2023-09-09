package com.myapp.repository;

import com.myapp.domain.BankAccount;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchProfile;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.FetchType;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the BankAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    @Query(value = "select bankAccount from BankAccount bankAccount left join fetch bankAccount.transactions where bankAccount.id =:id")
    Optional<BankAccount> findAccountWithTransactions(@Param("id") Long id);
}
