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

}
