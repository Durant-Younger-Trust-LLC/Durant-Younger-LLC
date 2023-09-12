package com.myapp.repository;

import com.myapp.domain.BankUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BankUser entity.
 */
@Repository
public interface BankUserRepository extends JpaRepository<BankUser, Long> {
    default Optional<BankUser> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<BankUser> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<BankUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct bankUser from BankUser bankUser left join fetch bankUser.internalUser",
        countQuery = "select count(distinct bankUser) from BankUser bankUser"
    )
   Page<BankUser> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct bankUser from BankUser bankUser left join fetch bankUser.internalUser")
    List<BankUser> findAllWithToOneRelationships();

    @Query("select bankUser from BankUser bankUser left join fetch bankUser.internalUser where bankUser.id =:id")
    Optional<BankUser> findOneWithToOneRelationships(@Param("id") Long id);
//    @Query(value = "SELECT * FROM BANK_USER LEFT JOIN JHI_USER ON BANK_USER.INTERNAL_USER_ID = JHI_USER.ID LEFT JOIN BANK_ACCOUNT ON BANK_USER.ID = BANK_ACCOUNT.USER_ID", nativeQuery = true)
    @Query("select bankUser from BankUser bankUser left join fetch bankUser.internalUser left join fetch bankUser.accounts where bankUser.internalUser.email = :email")
    Optional<BankUser> findBankUserWithAllRelationship(@Param("email") String email);
}
