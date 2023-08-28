import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'bank-user',
        data: { pageTitle: 'durantYoungerTrustApp.bankUser.home.title' },
        loadChildren: () => import('./bank-user/bank-user.module').then(m => m.BankUserModule),
      },
      {
        path: 'bank-account',
        data: { pageTitle: 'durantYoungerTrustApp.bankAccount.home.title' },
        loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule),
      },
      {
        path: 'bank-transaction',
        data: { pageTitle: 'durantYoungerTrustApp.bankTransaction.home.title' },
        loadChildren: () => import('./bank-transaction/bank-transaction.module').then(m => m.BankTransactionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
