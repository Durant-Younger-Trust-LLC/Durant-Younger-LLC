import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankUser } from '../bank-user.model';
import { BankUserService } from '../service/bank-user.service';

@Injectable({ providedIn: 'root' })
export class BankUserRoutingResolveService implements Resolve<IBankUser | null> {
  constructor(protected service: BankUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBankUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bankUser: HttpResponse<IBankUser>) => {
          if (bankUser.body) {
            return of(bankUser.body);
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
