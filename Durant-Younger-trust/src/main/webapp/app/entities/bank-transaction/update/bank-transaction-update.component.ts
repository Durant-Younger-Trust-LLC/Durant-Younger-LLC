import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BankTransactionFormService, BankTransactionFormGroup } from './bank-transaction-form.service';
import { IBankTransaction } from '../bank-transaction.model';
import { BankTransactionService } from '../service/bank-transaction.service';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

@Component({
  selector: 'jhi-bank-transaction-update',
  templateUrl: './bank-transaction-update.component.html',
})
export class BankTransactionUpdateComponent implements OnInit {
  isSaving = false;
  bankTransaction: IBankTransaction | null = null;

  bankAccountsSharedCollection: IBankAccount[] = [];

  editForm: BankTransactionFormGroup = this.bankTransactionFormService.createBankTransactionFormGroup();

  constructor(
    protected bankTransactionService: BankTransactionService,
    protected bankTransactionFormService: BankTransactionFormService,
    protected bankAccountService: BankAccountService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBankAccount = (o1: IBankAccount | null, o2: IBankAccount | null): boolean => this.bankAccountService.compareBankAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankTransaction }) => {
      this.bankTransaction = bankTransaction;
      if (bankTransaction) {
        this.updateForm(bankTransaction);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankTransaction = this.bankTransactionFormService.getBankTransaction(this.editForm);
    if (bankTransaction.id !== null) {
      this.subscribeToSaveResponse(this.bankTransactionService.update(bankTransaction));
    } else {
      this.subscribeToSaveResponse(this.bankTransactionService.create(bankTransaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankTransaction>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bankTransaction: IBankTransaction): void {
    this.bankTransaction = bankTransaction;
    this.bankTransactionFormService.resetForm(this.editForm, bankTransaction);

    this.bankAccountsSharedCollection = this.bankAccountService.addBankAccountToCollectionIfMissing<IBankAccount>(
      this.bankAccountsSharedCollection,
      bankTransaction.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankAccountService
      .query()
      .pipe(map((res: HttpResponse<IBankAccount[]>) => res.body ?? []))
      .pipe(
        map((bankAccounts: IBankAccount[]) =>
          this.bankAccountService.addBankAccountToCollectionIfMissing<IBankAccount>(bankAccounts, this.bankTransaction?.user)
        )
      )
      .subscribe((bankAccounts: IBankAccount[]) => (this.bankAccountsSharedCollection = bankAccounts));
  }
}
