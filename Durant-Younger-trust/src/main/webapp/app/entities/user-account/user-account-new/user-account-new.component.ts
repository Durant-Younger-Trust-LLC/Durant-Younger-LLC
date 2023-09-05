import { Component, OnInit } from '@angular/core';
import {switchMap} from "rxjs";
import {AccountService} from "../../../core/auth/account.service";
import {BankUserService} from "../../bank-user/service/bank-user.service";
import {Account} from "../../../core/auth/account.model";
import {IBankUser} from "../../bank-user/bank-user.model";
import {IBankAccount} from "../../bank-account/bank-account.model";
import {BankAccountService} from "../../bank-account/service/bank-account.service";
import {NewBankAccount} from "../../bank-account/bank-account.model";


@Component({
  selector: 'jhi-user-account-new',
  templateUrl: './user-account-new.component.html',
})
export class UserAccountNewComponent implements OnInit {
  account?: Account | null = null;
  bankUser: IBankUser | null = null;
  newAccount: NewBankAccount = {id: null};
  createdAccount?: IBankAccount | null;

  constructor(
      protected accountService: AccountService,
      protected bankUserService: BankUserService,
      protected bankAccountService: BankAccountService,
  ) { }

  ngOnInit(): void {
    this.accountService
        .getAuthenticationState().pipe( switchMap(accountcall => {
      this.account = accountcall;
      return this.bankUserService.findUserByEmail(this.account?.email);
    })).subscribe(data => this.bankUser = data.body);
  }

    add(account: string) {
      console.log("Adding account " + account + " to bank user " + this.bankUser?.id);
      account = account.trim();
      if(account){
        console.log("add account successful");
        this.newAccount.accountName = account;
        this.newAccount.user = this.bankUser;
        this.newAccount.balance = 0.00;
        this.bankAccountService.create(this.newAccount).subscribe(data => this.createdAccount = data.body);
        this.previousState();
      }
      else{
        console.log("add account failed");
      }
    }

  previousState(): void {
    window.history.back();
  }
}

