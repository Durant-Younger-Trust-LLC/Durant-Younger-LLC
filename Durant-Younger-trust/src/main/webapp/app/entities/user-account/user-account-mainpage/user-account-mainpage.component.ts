import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { BankUserService } from 'app/entities/bank-user/service/bank-user.service';
import {Subject, switchMap} from "rxjs";

import {IBankUser} from "../../bank-user/bank-user.model";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'jhi-user-account-mainpage',
  templateUrl: './user-account-mainpage.component.html',
})
export class UserAccountMainpageComponent implements OnInit {
  account?: Account | null = null;
  bankUser: IBankUser | null = null;
  // bankAccount?: IBankAccount[] | null = null;

  private readonly destroy$ = new Subject<void>();
  constructor(
    protected accountService: AccountService,
    protected bankUserService: BankUserService,
  ) { }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState().pipe(takeUntil(this.destroy$), switchMap(accountcall => {
        this.account = accountcall;
        return this.bankUserService.findUserByEmail(this.account?.email);
    })).subscribe(data => this.bankUser = data.body);

  }

}
