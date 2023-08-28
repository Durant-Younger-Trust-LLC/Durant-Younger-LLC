import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BankAccountFormService, BankAccountFormGroup } from './bank-account-form.service';
import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';
import { IBankUser } from 'app/entities/bank-user/bank-user.model';
import { BankUserService } from 'app/entities/bank-user/service/bank-user.service';

@Component({
  selector: 'jhi-bank-account-update',
  templateUrl: './bank-account-update.component.html',
})
export class BankAccountUpdateComponent implements OnInit {
  isSaving = false;
  bankAccount: IBankAccount | null = null;

  bankUsersSharedCollection: IBankUser[] = [];

  editForm: BankAccountFormGroup = this.bankAccountFormService.createBankAccountFormGroup();

  constructor(
    protected bankAccountService: BankAccountService,
    protected bankAccountFormService: BankAccountFormService,
    protected bankUserService: BankUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBankUser = (o1: IBankUser | null, o2: IBankUser | null): boolean => this.bankUserService.compareBankUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      this.bankAccount = bankAccount;
      if (bankAccount) {
        this.updateForm(bankAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankAccount = this.bankAccountFormService.getBankAccount(this.editForm);
    if (bankAccount.id !== null) {
      this.subscribeToSaveResponse(this.bankAccountService.update(bankAccount));
    } else {
      this.subscribeToSaveResponse(this.bankAccountService.create(bankAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankAccount>>): void {
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

  protected updateForm(bankAccount: IBankAccount): void {
    this.bankAccount = bankAccount;
    this.bankAccountFormService.resetForm(this.editForm, bankAccount);

    this.bankUsersSharedCollection = this.bankUserService.addBankUserToCollectionIfMissing<IBankUser>(
      this.bankUsersSharedCollection,
      bankAccount.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankUserService
      .query()
      .pipe(map((res: HttpResponse<IBankUser[]>) => res.body ?? []))
      .pipe(
        map((bankUsers: IBankUser[]) => this.bankUserService.addBankUserToCollectionIfMissing<IBankUser>(bankUsers, this.bankAccount?.user))
      )
      .subscribe((bankUsers: IBankUser[]) => (this.bankUsersSharedCollection = bankUsers));
  }
}
