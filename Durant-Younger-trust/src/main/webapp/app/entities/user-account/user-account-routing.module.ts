import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserAccountMainpageComponent} from './user-account-mainpage/user-account-mainpage.component'
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {BankAccountDetailComponent} from "../bank-account/detail/bank-account-detail.component";
import {BankAccountRoutingResolveService} from "../bank-account/route/bank-account-routing-resolve.service";
import {IndvAccountDetailComponent} from "./indv-account-detail/indv-account-detail.component";

const bankTransactionRoute: Routes = [
  {
    path: '',
    component: UserAccountMainpageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IndvAccountDetailComponent,
    resolve: {
      bankAccount: BankAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankTransactionRoute)],
  exports: [RouterModule],
})
export class UserAccountRoutingModule {}
