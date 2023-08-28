import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BankUserComponent } from '../list/bank-user.component';
import { BankUserDetailComponent } from '../detail/bank-user-detail.component';
import { BankUserUpdateComponent } from '../update/bank-user-update.component';
import { BankUserRoutingResolveService } from './bank-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bankUserRoute: Routes = [
  {
    path: '',
    component: BankUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BankUserDetailComponent,
    resolve: {
      bankUser: BankUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BankUserUpdateComponent,
    resolve: {
      bankUser: BankUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BankUserUpdateComponent,
    resolve: {
      bankUser: BankUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankUserRoute)],
  exports: [RouterModule],
})
export class BankUserRoutingModule {}
