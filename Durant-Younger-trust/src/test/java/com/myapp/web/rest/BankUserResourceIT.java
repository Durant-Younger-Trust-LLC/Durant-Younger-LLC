package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.BankUser;
import com.myapp.repository.BankUserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BankUserResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BankUserResourceIT {

    private static final String ENTITY_API_URL = "/api/bank-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BankUserRepository bankUserRepository;

    @Mock
    private BankUserRepository bankUserRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankUserMockMvc;

    private BankUser bankUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankUser createEntity(EntityManager em) {
        BankUser bankUser = new BankUser();
        return bankUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankUser createUpdatedEntity(EntityManager em) {
        BankUser bankUser = new BankUser();
        return bankUser;
    }

    @BeforeEach
    public void initTest() {
        bankUser = createEntity(em);
    }

    @Test
    @Transactional
    void createBankUser() throws Exception {
        int databaseSizeBeforeCreate = bankUserRepository.findAll().size();
        // Create the BankUser
        restBankUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankUser)))
            .andExpect(status().isCreated());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeCreate + 1);
        BankUser testBankUser = bankUserList.get(bankUserList.size() - 1);
    }

    @Test
    @Transactional
    void createBankUserWithExistingId() throws Exception {
        // Create the BankUser with an existing ID
        bankUser.setId(1L);

        int databaseSizeBeforeCreate = bankUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankUser)))
            .andExpect(status().isBadRequest());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBankUsers() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        // Get all the bankUserList
        restBankUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankUser.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBankUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(bankUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBankUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bankUserRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBankUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bankUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBankUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bankUserRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBankUser() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        // Get the bankUser
        restBankUserMockMvc
            .perform(get(ENTITY_API_URL_ID, bankUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankUser.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingBankUser() throws Exception {
        // Get the bankUser
        restBankUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBankUser() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();

        // Update the bankUser
        BankUser updatedBankUser = bankUserRepository.findById(bankUser.getId()).get();
        // Disconnect from session so that the updates on updatedBankUser are not directly saved in db
        em.detach(updatedBankUser);

        restBankUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBankUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBankUser))
            )
            .andExpect(status().isOk());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
        BankUser testBankUser = bankUserList.get(bankUserList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bankUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bankUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bankUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bankUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBankUserWithPatch() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();

        // Update the bankUser using partial update
        BankUser partialUpdatedBankUser = new BankUser();
        partialUpdatedBankUser.setId(bankUser.getId());

        restBankUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBankUser))
            )
            .andExpect(status().isOk());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
        BankUser testBankUser = bankUserList.get(bankUserList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateBankUserWithPatch() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();

        // Update the bankUser using partial update
        BankUser partialUpdatedBankUser = new BankUser();
        partialUpdatedBankUser.setId(bankUser.getId());

        restBankUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBankUser))
            )
            .andExpect(status().isOk());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
        BankUser testBankUser = bankUserList.get(bankUserList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bankUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bankUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bankUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBankUser() throws Exception {
        int databaseSizeBeforeUpdate = bankUserRepository.findAll().size();
        bankUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankUserMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bankUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankUser in the database
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBankUser() throws Exception {
        // Initialize the database
        bankUserRepository.saveAndFlush(bankUser);

        int databaseSizeBeforeDelete = bankUserRepository.findAll().size();

        // Delete the bankUser
        restBankUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, bankUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BankUser> bankUserList = bankUserRepository.findAll();
        assertThat(bankUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
