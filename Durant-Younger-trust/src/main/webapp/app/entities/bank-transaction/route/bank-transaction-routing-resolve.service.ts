import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankTransaction } from '../bank-transaction.model';
import { BankTransactionService } from '../service/bank-transaction.service';

@Injectable({ providedIn: 'root' })
export class BankTransactionRoutingResolveService implements Resolve<IBankTransaction | null> {
  constructor(protected service: BankTransactionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBankTransaction | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bankTransaction: HttpResponse<IBankTransaction>) => {
          if (bankTransaction.body) {
            return of(bankTransaction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
