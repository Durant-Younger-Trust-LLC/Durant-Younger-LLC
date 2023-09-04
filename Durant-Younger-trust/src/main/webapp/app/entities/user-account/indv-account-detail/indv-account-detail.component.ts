import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {IBankAccount} from "../../bank-account/bank-account.model";




@Component({
  selector: 'jhi-indv-account-detail',
  templateUrl: './indv-account-detail.component.html',

})
export class IndvAccountDetailComponent implements OnInit {
  bankAccount: IBankAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      this.bankAccount = bankAccount;
    });

  }
  previousState(): void {
    window.history.back();
  }



}
