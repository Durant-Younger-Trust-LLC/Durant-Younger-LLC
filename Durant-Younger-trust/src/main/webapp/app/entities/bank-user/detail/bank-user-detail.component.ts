import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBankUser } from '../bank-user.model';

@Component({
  selector: 'jhi-bank-user-detail',
  templateUrl: './bank-user-detail.component.html',
})
export class BankUserDetailComponent implements OnInit {
  bankUser: IBankUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankUser }) => {
      this.bankUser = bankUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
