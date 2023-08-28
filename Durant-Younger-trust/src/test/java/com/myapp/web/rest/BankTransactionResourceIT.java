package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.BankTransaction;
import com.myapp.repository.BankTransactionRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BankTransactionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BankTransactionResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_BALANCE = 1D;
    private static final Double UPDATED_BALANCE = 2D;

    private static final String DEFAULT_MERCHANT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MERCHANT_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bank-transactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BankTransactionRepository bankTransactionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankTransactionMockMvc;

    private BankTransaction bankTransaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankTransaction createEntity(EntityManager em) {
        BankTransaction bankTransaction = new BankTransaction()
            .date(DEFAULT_DATE)
            .description(DEFAULT_DESCRIPTION)
            .balance(DEFAULT_BALANCE)
            .merchantName(DEFAULT_MERCHANT_NAME);
        return bankTransaction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankTransaction createUpdatedEntity(EntityManager em) {
        BankTransaction bankTransaction = new BankTransaction()
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .balance(UPDATED_BALANCE)
            .merchantName(UPDATED_MERCHANT_NAME);
        return bankTransaction;
    }

    @BeforeEach
    public void initTest() {
        bankTransaction = createEntity(em);
    }

    @Test
    @Transactional
    void createBankTransaction() throws Exception {
        int databaseSizeBeforeCreate = bankTransactionRepository.findAll().size();
        // Create the BankTransaction
        restBankTransactionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isCreated());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeCreate + 1);
        BankTransaction testBankTransaction = bankTransactionList.get(bankTransactionList.size() - 1);
        assertThat(testBankTransaction.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBankTransaction.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBankTransaction.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testBankTransaction.getMerchantName()).isEqualTo(DEFAULT_MERCHANT_NAME);
    }

    @Test
    @Transactional
    void createBankTransactionWithExistingId() throws Exception {
        // Create the BankTransaction with an existing ID
        bankTransaction.setId(1L);

        int databaseSizeBeforeCreate = bankTransactionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankTransactionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBankTransactions() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        // Get all the bankTransactionList
        restBankTransactionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankTransaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].merchantName").value(hasItem(DEFAULT_MERCHANT_NAME)));
    }

    @Test
    @Transactional
    void getBankTransaction() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        // Get the bankTransaction
        restBankTransactionMockMvc
            .perform(get(ENTITY_API_URL_ID, bankTransaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankTransaction.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.merchantName").value(DEFAULT_MERCHANT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBankTransaction() throws Exception {
        // Get the bankTransaction
        restBankTransactionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBankTransaction() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();

        // Update the bankTransaction
        BankTransaction updatedBankTransaction = bankTransactionRepository.findById(bankTransaction.getId()).get();
        // Disconnect from session so that the updates on updatedBankTransaction are not directly saved in db
        em.detach(updatedBankTransaction);
        updatedBankTransaction
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .balance(UPDATED_BALANCE)
            .merchantName(UPDATED_MERCHANT_NAME);

        restBankTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBankTransaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBankTransaction))
            )
            .andExpect(status().isOk());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
        BankTransaction testBankTransaction = bankTransactionList.get(bankTransactionList.size() - 1);
        assertThat(testBankTransaction.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBankTransaction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBankTransaction.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testBankTransaction.getMerchantName()).isEqualTo(UPDATED_MERCHANT_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bankTransaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBankTransactionWithPatch() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();

        // Update the bankTransaction using partial update
        BankTransaction partialUpdatedBankTransaction = new BankTransaction();
        partialUpdatedBankTransaction.setId(bankTransaction.getId());

        partialUpdatedBankTransaction
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .balance(UPDATED_BALANCE)
            .merchantName(UPDATED_MERCHANT_NAME);

        restBankTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBankTransaction))
            )
            .andExpect(status().isOk());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
        BankTransaction testBankTransaction = bankTransactionList.get(bankTransactionList.size() - 1);
        assertThat(testBankTransaction.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBankTransaction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBankTransaction.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testBankTransaction.getMerchantName()).isEqualTo(UPDATED_MERCHANT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBankTransactionWithPatch() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();

        // Update the bankTransaction using partial update
        BankTransaction partialUpdatedBankTransaction = new BankTransaction();
        partialUpdatedBankTransaction.setId(bankTransaction.getId());

        partialUpdatedBankTransaction
            .date(UPDATED_DATE)
            .description(UPDATED_DESCRIPTION)
            .balance(UPDATED_BALANCE)
            .merchantName(UPDATED_MERCHANT_NAME);

        restBankTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBankTransaction))
            )
            .andExpect(status().isOk());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
        BankTransaction testBankTransaction = bankTransactionList.get(bankTransactionList.size() - 1);
        assertThat(testBankTransaction.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBankTransaction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBankTransaction.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testBankTransaction.getMerchantName()).isEqualTo(UPDATED_MERCHANT_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bankTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBankTransaction() throws Exception {
        int databaseSizeBeforeUpdate = bankTransactionRepository.findAll().size();
        bankTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bankTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankTransaction in the database
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBankTransaction() throws Exception {
        // Initialize the database
        bankTransactionRepository.saveAndFlush(bankTransaction);

        int databaseSizeBeforeDelete = bankTransactionRepository.findAll().size();

        // Delete the bankTransaction
        restBankTransactionMockMvc
            .perform(delete(ENTITY_API_URL_ID, bankTransaction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BankTransaction> bankTransactionList = bankTransactionRepository.findAll();
        assertThat(bankTransactionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
