import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {UserAccountRoutingModule} from './user-account-routing.module';
import {UserAccountMainpageComponent} from './user-account-mainpage/user-account-mainpage.component';



@NgModule({
  imports: [SharedModule, UserAccountRoutingModule ],
  declarations: [UserAccountMainpageComponent ],
})
export class UserAccountModule {}
