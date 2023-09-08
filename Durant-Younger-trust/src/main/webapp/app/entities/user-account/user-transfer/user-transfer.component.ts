import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BankAccountService } from '../../bank-account/service/bank-account.service';
import { IBankAccount} from '../../bank-account/bank-account.model';

import {IBankUser} from "../../bank-user/bank-user.model";
import { ActivatedRoute } from '@angular/router';
import {NewBankTransaction} from "../../bank-transaction/bank-transaction.model";
import dayjs from "dayjs/esm";
import {BankTransactionService} from "../../bank-transaction/service/bank-transaction.service";
import {from} from "rxjs";


@Component({
  selector: 'jhi-user-transfer',
  templateUrl: './user-transfer.component.html',
})
export class UserTransferComponent implements OnInit {

  accounts?: IBankAccount[]; // Assuming you have a way to retrieve the user's accounts
  bankUser: IBankUser | null = null;
  validTransfer = true;
  dummyAccount: IBankAccount = {id: 0};
  transferForm = new FormGroup({
    toAccountForm: new FormControl<IBankAccount>(this.dummyAccount, Validators.required),
    fromAccountForm: new FormControl<IBankAccount>( this.dummyAccount, Validators.required),
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
      let fromAccount = this.transferForm.value.fromAccountForm;
      let toAccount = this.transferForm.value.toAccountForm;
      let amount = this.transferForm.value.amountForm;
      console.log(fromAccount);console.log(toAccount); console.log(amount);
      if(fromAccount?.balance && amount){
        if(amount <= fromAccount.balance && toAccount){
          console.log("did it")
          this.validTransfer = true;
          this.transferMoney(fromAccount, toAccount, amount);
        }else{
          this.validTransfer = false;
        }
      }
      if(fromAccount?.balance === 0){
        this.validTransfer = false;
      }
    }
  }

  transferMoney(fromAccount:IBankAccount, toAccount: IBankAccount, amount:number){
    let currentDate = dayjs();
    if(fromAccount.balance){
      fromAccount.balance = fromAccount.balance - amount;
      if(!toAccount.balance){
        toAccount.balance = amount;
      }else{
        toAccount.balance = toAccount.balance + amount;
      }
      let receivingTransaction: NewBankTransaction =  { id:null, merchantName: "Internal Transfer",
        user: toAccount, balance: amount,
        description: "transfer from " + fromAccount.accountName + " to " + toAccount.accountName, date: currentDate};
      let sendingTransaction: NewBankTransaction =  { id:null, merchantName: "Internal Transfer",
        user: fromAccount, balance: -amount,
        description: "transfer from " + fromAccount.accountName + " to " + toAccount.accountName, date: currentDate};
      this.bankAccountService.partialUpdate(fromAccount).subscribe(data => data.body);
      this.bankAccountService.partialUpdate(toAccount).subscribe(data => data.body);
      this.bankTransactionService.create(receivingTransaction).subscribe(data => data.body);
      this.bankTransactionService.create(sendingTransaction).subscribe(data => data.body);
      this.previousState();
    }
  }
  previousState(): void {
    window.history.back();
  }
}

