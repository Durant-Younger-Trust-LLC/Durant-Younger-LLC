package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BankAccount.
 */
@Entity
@Table(name = "bank_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BankAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "balance")
    private Double balance;

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Set<BankTransaction> transactions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "accounts" }, allowSetters = true)
    private BankUser user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BankAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountName() {
        return this.accountName;
    }

    public BankAccount accountName(String accountName) {
        this.setAccountName(accountName);
        return this;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public Double getBalance() {
        return this.balance;
    }

    public BankAccount balance(Double balance) {
        this.setBalance(balance);
        return this;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Set<BankTransaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<BankTransaction> bankTransactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setUser(null));
        }
        if (bankTransactions != null) {
            bankTransactions.forEach(i -> i.setUser(this));
        }
        this.transactions = bankTransactions;
    }

    public BankAccount transactions(Set<BankTransaction> bankTransactions) {
        this.setTransactions(bankTransactions);
        return this;
    }

    public BankAccount addTransaction(BankTransaction bankTransaction) {
        this.transactions.add(bankTransaction);
        bankTransaction.setUser(this);
        return this;
    }

    public BankAccount removeTransaction(BankTransaction bankTransaction) {
        this.transactions.remove(bankTransaction);
        bankTransaction.setUser(null);
        return this;
    }

    public BankUser getUser() {
        return this.user;
    }

    public void setUser(BankUser bankUser) {
        this.user = bankUser;
    }

    public BankAccount user(BankUser bankUser) {
        this.setUser(bankUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BankAccount)) {
            return false;
        }
        return id != null && id.equals(((BankAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BankAccount{" +
            "id=" + getId() +
            ", accountName='" + getAccountName() + "'" +
            ", balance=" + getBalance() +
            "}";
    }
}
