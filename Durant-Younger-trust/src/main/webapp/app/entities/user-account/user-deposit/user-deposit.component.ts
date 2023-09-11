import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BankAccountService } from '../../bank-account/service/bank-account.service';
import { IBankAccount} from '../../bank-account/bank-account.model';

import {IBankUser} from "../../bank-user/bank-user.model";
import { ActivatedRoute } from '@angular/router';
import {NewBankTransaction} from "../../bank-transaction/bank-transaction.model";
import dayjs from "dayjs/esm";
import {BankTransactionService} from "../../bank-transaction/service/bank-transaction.service";

@Component({
  selector: 'jhi-user-deposit',
  templateUrl: './user-deposit.component.html',

})
export class UserDepositComponent implements OnInit {

  accounts?: IBankAccount[]; // Assuming you have a way to retrieve the user's accounts
  bankUser: IBankUser | null = null;
  validTransfer = true;
  dummyAccount: IBankAccount = {id: 0};
  sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
  transferForm = new FormGroup({
    toAccountForm: new FormControl<IBankAccount>(this.dummyAccount, Validators.required),
    amountForm: new FormControl<number>(0.00, [Validators.required, Validators.min(0.01)])
  });


  constructor(private fb: FormBuilder,
              private bankAccountService: BankAccountService,
              protected activatedRoute: ActivatedRoute,
              protected bankTransactionService: BankTransactionService,
  ) {}


  ngOnInit(): void { // when it routs, its gets the bank account user from whoerver is logged in
    this.activatedRoute.data.subscribe(({bankUser}) => {
      this.bankUser = bankUser;
    });
  }

  sumbit() {
    if(this.transferForm.valid) {

      let toAccount = this.transferForm.value.toAccountForm;
      let amount = this.transferForm.value.amountForm;
      // console.log(fromAccount);console.log(toAccount); console.log(amount);
      if(toAccount && amount){

          this.validTransfer = true;
          this.depositMoney(toAccount, amount);
        }else{
          this.validTransfer = false;
        }

    }
  }

  depositMoney(toAccount: IBankAccount, amount:number){

    let currentDate = dayjs();

    if(toAccount.balance){
        toAccount.balance+=amount;

      } else{
      toAccount.balance=amount;
    }

      let receivingTransaction: NewBankTransaction =  {
      id:null,
        merchantName: "Deposit",
        user: toAccount,
        balance: toAccount.balance,
        type: 'Deposit',
        transactionAmount:amount,
        description:  " Deposit to " + toAccount.accountName, date: currentDate};

      this.bankAccountService.partialUpdate(toAccount).subscribe(data => data.body);
      this.bankTransactionService.create(receivingTransaction).subscribe(data => data.body);

      this.previousState();
    }


  async previousState(): Promise<void> {
    await this.sleep(500);
    window.history.back();
  }
}

