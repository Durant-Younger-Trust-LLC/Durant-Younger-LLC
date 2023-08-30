import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserAccountMainpageComponent} from './user-account-mainpage/user-account-mainpage.component'
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const bankTransactionRoute: Routes = [
  {
    path: '',
    component: UserAccountMainpageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'edit',
    component: UserAccountMainpageComponent,
    canActivate: [UserRouteAccessService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(bankTransactionRoute)],
  exports: [RouterModule],
})
export class UserAccountRoutingModule {}
