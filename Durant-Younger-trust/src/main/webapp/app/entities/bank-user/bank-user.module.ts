import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BankUserComponent } from './list/bank-user.component';
import { BankUserDetailComponent } from './detail/bank-user-detail.component';
import { BankUserUpdateComponent } from './update/bank-user-update.component';
import { BankUserDeleteDialogComponent } from './delete/bank-user-delete-dialog.component';
import { BankUserRoutingModule } from './route/bank-user-routing.module';

@NgModule({
  imports: [SharedModule, BankUserRoutingModule],
  declarations: [BankUserComponent, BankUserDetailComponent, BankUserUpdateComponent, BankUserDeleteDialogComponent],
})
export class BankUserModule {}
