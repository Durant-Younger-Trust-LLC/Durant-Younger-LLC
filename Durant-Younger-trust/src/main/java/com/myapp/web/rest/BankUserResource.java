package com.myapp.web.rest;

import com.myapp.domain.BankUser;
import com.myapp.repository.BankUserRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.BankUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BankUserResource {

    private final Logger log = LoggerFactory.getLogger(BankUserResource.class);

    private static final String ENTITY_NAME = "bankUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BankUserRepository bankUserRepository;

    public BankUserResource(BankUserRepository bankUserRepository) {
        this.bankUserRepository = bankUserRepository;
    }

    /**
     * {@code POST  /bank-users} : Create a new bankUser.
     *
     * @param bankUser the bankUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bankUser, or with status {@code 400 (Bad Request)} if the bankUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bank-users")
    public ResponseEntity<BankUser> createBankUser(@RequestBody BankUser bankUser) throws URISyntaxException {
        log.debug("REST request to save BankUser : {}", bankUser);
        if (bankUser.getId() != null) {
            throw new BadRequestAlertException("A new bankUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BankUser result = bankUserRepository.save(bankUser);
        return ResponseEntity
            .created(new URI("/api/bank-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bank-users/:id} : Updates an existing bankUser.
     *
     * @param id the id of the bankUser to save.
     * @param bankUser the bankUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bankUser,
     * or with status {@code 400 (Bad Request)} if the bankUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bankUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bank-users/{id}")
    public ResponseEntity<BankUser> updateBankUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BankUser bankUser
    ) throws URISyntaxException {
        log.debug("REST request to update BankUser : {}, {}", id, bankUser);
        if (bankUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bankUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bankUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BankUser result = bankUserRepository.save(bankUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bankUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bank-users/:id} : Partial updates given fields of an existing bankUser, field will ignore if it is null
     *
     * @param id the id of the bankUser to save.
     * @param bankUser the bankUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bankUser,
     * or with status {@code 400 (Bad Request)} if the bankUser is not valid,
     * or with status {@code 404 (Not Found)} if the bankUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the bankUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bank-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BankUser> partialUpdateBankUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BankUser bankUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update BankUser partially : {}, {}", id, bankUser);
        if (bankUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bankUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bankUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BankUser> result = bankUserRepository
            .findById(bankUser.getId())
            .map(existingBankUser -> {
                return existingBankUser;
            })
            .map(bankUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bankUser.getId().toString())
        );
    }

    /**
     * {@code GET  /bank-users} : get all the bankUsers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bankUsers in body.
     */
    @GetMapping("/bank-users")
    public List<BankUser> getAllBankUsers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all BankUsers");
        if (eagerload) {
            return bankUserRepository.findAllWithEagerRelationships();
        } else {
            return bankUserRepository.findAll();
        }
    }

    /**
     * {@code GET  /bank-users/:id} : get the "id" bankUser.
     *
     * @param id the id of the bankUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bankUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bank-users/{id}")
    public ResponseEntity<BankUser> getBankUser(@PathVariable Long id) {
        log.debug("REST request to get BankUser : {}", id);
        Optional<BankUser> bankUser = bankUserRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(bankUser);
    }

    /**
     * {@code DELETE  /bank-users/:id} : delete the "id" bankUser.
     *
     * @param id the id of the bankUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bank-users/{id}")
    public ResponseEntity<Void> deleteBankUser(@PathVariable Long id) {
        log.debug("REST request to delete BankUser : {}", id);
        bankUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
