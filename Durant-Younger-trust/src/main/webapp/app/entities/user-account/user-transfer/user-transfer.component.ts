import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BankAccountService } from '../../bank-account/service/bank-account.service';
import { IBankAccount} from '../../bank-account/bank-account.model';

import {IBankUser} from "../../bank-user/bank-user.model";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'jhi-user-transfer',
  templateUrl: './user-transfer.component.html',
})
export class UserTransferComponent implements OnInit {

  accounts?: IBankAccount[]; // Assuming you have a way to retrieve the user's accounts
  bankUser?: IBankUser;
  transferForm = new FormGroup({
    toAccountForm: new FormControl<IBankAccount['id']>(0, Validators.required),
    fromAccountForm: new FormControl<IBankAccount['id']>(0 , Validators.required),
    ammountForm: new FormControl<number>(0.00, [Validators.required, Validators.min(0.01)])
  });


  constructor(private fb: FormBuilder,
              private bankAccountService: BankAccountService,
              protected activatedRoute: ActivatedRoute) {}


  ngOnInit(): void { // when it routs, its gets the bank account user from whoerver is logged in
    this.activatedRoute.data.subscribe(({bankUser}) => {
      this.bankUser = bankUser;
    });
  }

  transferMoney() {
    console.log("We made it here")
    console.log(this.transferForm.value)

  }


  ngOnInit(): void { // when it routs, its gets the bank account user from whoerver is logged in
// Fetch user's accounts from your service
    // Replace this with your actual code to fetch accounts
    // this.bankAccountService.getUserAccounts().subscribe((accounts) => {
    //   this.accounts = accounts;
    // });
    this.activatedRoute.data.subscribe(({ bankUser }) => {
      this.bankUser = bankUser;
    });



    }
transferMoney() {
    if (this.transferForm.valid) {
      console.log("We made it here")
      // const fromAccount = this.transferForm.get('fromAccount')?.value;
      // const toAccount = this.transferForm.get('toAccount')?.value;
      // const amount = this.transferForm.get('amount')?.value;

      console.log(this.toAccount)
      console.log(this.fromAccount)
      console.log(this.amount)

      if (this.fromAccount && this.toAccount && this.amount) {



            console.log('Money transferred successfully.');
          } else {
            console.log('Insufficient funds in the source account.');
          }
        } else {
          console.log('Invalid account selection.');
        }
      }
    }


