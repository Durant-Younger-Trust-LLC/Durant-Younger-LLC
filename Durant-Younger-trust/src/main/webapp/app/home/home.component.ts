import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import {BankUserService} from "../entities/bank-user/service/bank-user.service";
import {IBankUser} from "../entities/bank-user/bank-user.model";

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  bankUser: IBankUser | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router,private bankUserService: BankUserService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        if (this.account) {
          this.callBankUserByEmail(this.account.email);
        }
      });
  }

  callBankUserByEmail(email:string | undefined): void {
    if (email) {
      this.bankUserService.findUserByEmail(email).subscribe(data => {
        this.bankUser = data.body;
      });
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
