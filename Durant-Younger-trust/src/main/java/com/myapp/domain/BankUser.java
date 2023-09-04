package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BankUser.
 */
@Entity
@Table(name = "bank_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BankUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "user" }, allowSetters = true)
    private Set<BankAccount> accounts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BankUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public BankUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<BankAccount> getAccounts() {
        return this.accounts;
    }

    public void setAccounts(Set<BankAccount> bankAccounts) {
        if (this.accounts != null) {
            this.accounts.forEach(i -> i.setUser(null));
        }
        if (bankAccounts != null) {
            bankAccounts.forEach(i -> i.setUser(this));
        }
        this.accounts = bankAccounts;
    }

    public BankUser accounts(Set<BankAccount> bankAccounts) {
        this.setAccounts(bankAccounts);
        return this;
    }

    public BankUser addAccounts(BankAccount bankAccount) {
        this.accounts.add(bankAccount);
        bankAccount.setUser(this);
        return this;
    }

    public BankUser removeAccounts(BankAccount bankAccount) {
        this.accounts.remove(bankAccount);
        bankAccount.setUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BankUser)) {
            return false;
        }
        return id != null && id.equals(((BankUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BankUser{" +
            "id=" + getId() +
            "}";
    }
}
