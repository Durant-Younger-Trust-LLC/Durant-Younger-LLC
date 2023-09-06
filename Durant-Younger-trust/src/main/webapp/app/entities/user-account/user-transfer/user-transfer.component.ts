import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountService } from '../../bank-account/service/bank-account.service';
import { IBankAccount } from '../../bank-account/bank-account.model';
import {IBankUser} from "../../bank-user/bank-user.model";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-user-transfer',
  templateUrl: './user-transfer.component.html',
})
export class UserTransferComponent implements OnInit {
transferForm: FormGroup;
accounts?: IBankAccount[]; // Assuming you have a way to retrieve the user's accounts
bankUser?: IBankUser;

constructor(private fb: FormBuilder, private bankAccountService: BankAccountService,
            protected activatedRoute: ActivatedRoute) {
    this.transferForm = this.fb.group({
      fromAccount: [null, Validators.required],
      toAccount: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });
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
      const fromAccount = this.transferForm.get('fromAccount')?.value;
      const toAccount = this.transferForm.get('toAccount')?.value;
      const amount = this.transferForm.get('amount')?.value;

      // Perform the money transfer logic here
      // You should update the account balances accordingly

      // Example code (you need to replace it with your actual logic):
      if (fromAccount && toAccount && amount) {
        // const fromAccountObj = this.accounts.find((account) => account.id === fromAccount);
        // const toAccountObj = this.accounts.find((account) => account.id === toAccount);

        // if (fromAccountObj && toAccountObj) {
        //   if (fromAccountObj.balance >= amount) {
        //     fromAccountObj.balance -= amount;
        //     toAccountObj.balance += amount;
        //
        //     // Update the account balances in your database using your service
        //     // This is a placeholder; replace it with your actual service call
        //     this.bankAccountService.updateAccount(fromAccountObj).subscribe();
        //     this.bankAccountService.updateAccount(toAccountObj).subscribe();

            // Optionally, you can display a success message

            console.log('Money transferred successfully.');
          } else {
            console.log('Insufficient funds in the source account.');
          }
        } else {
          console.log('Invalid account selection.');
        }
      }
    }


