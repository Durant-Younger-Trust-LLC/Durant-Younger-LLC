import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BankUserFormService, BankUserFormGroup } from './bank-user-form.service';
import { IBankUser } from '../bank-user.model';
import { BankUserService } from '../service/bank-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-bank-user-update',
  templateUrl: './bank-user-update.component.html',
})
export class BankUserUpdateComponent implements OnInit {
  isSaving = false;
  bankUser: IBankUser | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: BankUserFormGroup = this.bankUserFormService.createBankUserFormGroup();

  constructor(
    protected bankUserService: BankUserService,
    protected bankUserFormService: BankUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankUser }) => {
      this.bankUser = bankUser;
      if (bankUser) {
        this.updateForm(bankUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankUser = this.bankUserFormService.getBankUser(this.editForm);
    if (bankUser.id !== null) {
      this.subscribeToSaveResponse(this.bankUserService.update(bankUser));
    } else {
      this.subscribeToSaveResponse(this.bankUserService.create(bankUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankUser>>): void {
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

  protected updateForm(bankUser: IBankUser): void {
    this.bankUser = bankUser;
    this.bankUserFormService.resetForm(this.editForm, bankUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, bankUser.internalUser);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.bankUser?.internalUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
