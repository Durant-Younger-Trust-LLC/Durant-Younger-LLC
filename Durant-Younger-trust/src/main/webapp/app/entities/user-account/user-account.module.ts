import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {UserAccountRoutingModule} from './user-account-routing/user-account-routing.module';
import {UserAccountMainpageComponent} from './user-account-mainpage/user-account-mainpage.component';
import {IndvAccountDetailComponent} from "./indv-account-detail/indv-account-detail.component";
import {UserTransferComponent} from "./user-transfer/user-transfer.component";
import {UserAccountNewComponent} from "./user-account-new/user-account-new.component";



@NgModule({
  imports: [SharedModule, UserAccountRoutingModule ],
  declarations: [UserAccountMainpageComponent, IndvAccountDetailComponent, UserTransferComponent, UserAccountNewComponent ],
})
export class UserAccountModule {}
