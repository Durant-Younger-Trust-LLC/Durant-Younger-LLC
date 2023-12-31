import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';


import {BankAccountService} from "../../bank-account/service/bank-account.service";
import {IBankAccount} from "../../bank-account/bank-account.model";

@Injectable({ providedIn: 'root' })
export class IndvAccountRoutingResolveService implements Resolve<IBankAccount | null> {
    constructor(protected service: BankAccountService, protected router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IBankAccount | null | never> {
        const id = route.params['id'];
        if (id) {
            return this.service.findWithTransactions(id).pipe(
                mergeMap((bankAccount: HttpResponse<IBankAccount>) => {
                    if (bankAccount.body) {
                        return of(bankAccount.body);
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
