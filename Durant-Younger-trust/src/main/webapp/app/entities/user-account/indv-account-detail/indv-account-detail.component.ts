import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {IBankAccount} from "../../bank-account/bank-account.model";
import {IBankTransaction} from "../../bank-transaction/bank-transaction.model";




@Component({
  selector: 'jhi-indv-account-detail',
  templateUrl: './indv-account-detail.component.html',

})
export class IndvAccountDetailComponent implements OnInit {
  bankAccount: IBankAccount | null = null;

  //adding here..
  // //array to store transactions??
  // transactions: IBankTransaction [] = [];

  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      this.bankAccount = bankAccount;

      // //adding stuff
      // //will this populate array??
      // if(bankAccount?.transactions) {
      //   this.transactions =bankAccount.transactions;
      //
     // }


    });

  }
  previousState(): void {
    window.history.back();
  }



}
