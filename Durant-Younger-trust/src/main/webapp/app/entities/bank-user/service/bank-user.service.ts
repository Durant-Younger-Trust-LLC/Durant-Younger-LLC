import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBankUser, NewBankUser } from '../bank-user.model';

export type PartialUpdateBankUser = Partial<IBankUser> & Pick<IBankUser, 'id'>;

export type EntityResponseType = HttpResponse<IBankUser>;
export type EntityArrayResponseType = HttpResponse<IBankUser[]>;

@Injectable({ providedIn: 'root' })
export class BankUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bankUser: NewBankUser): Observable<EntityResponseType> {
    return this.http.post<IBankUser>(this.resourceUrl, bankUser, { observe: 'response' });
  }

  update(bankUser: IBankUser): Observable<EntityResponseType> {
    return this.http.put<IBankUser>(`${this.resourceUrl}/${this.getBankUserIdentifier(bankUser)}`, bankUser, { observe: 'response' });
  }

  partialUpdate(bankUser: PartialUpdateBankUser): Observable<EntityResponseType> {
    return this.http.patch<IBankUser>(`${this.resourceUrl}/${this.getBankUserIdentifier(bankUser)}`, bankUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBankUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBankUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBankUserIdentifier(bankUser: Pick<IBankUser, 'id'>): number {
    return bankUser.id;
  }

  compareBankUser(o1: Pick<IBankUser, 'id'> | null, o2: Pick<IBankUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getBankUserIdentifier(o1) === this.getBankUserIdentifier(o2) : o1 === o2;
  }

  addBankUserToCollectionIfMissing<Type extends Pick<IBankUser, 'id'>>(
    bankUserCollection: Type[],
    ...bankUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bankUsers: Type[] = bankUsersToCheck.filter(isPresent);
    if (bankUsers.length > 0) {
      const bankUserCollectionIdentifiers = bankUserCollection.map(bankUserItem => this.getBankUserIdentifier(bankUserItem)!);
      const bankUsersToAdd = bankUsers.filter(bankUserItem => {
        const bankUserIdentifier = this.getBankUserIdentifier(bankUserItem);
        if (bankUserCollectionIdentifiers.includes(bankUserIdentifier)) {
          return false;
        }
        bankUserCollectionIdentifiers.push(bankUserIdentifier);
        return true;
      });
      return [...bankUsersToAdd, ...bankUserCollection];
    }
    return bankUserCollection;
  }
}
