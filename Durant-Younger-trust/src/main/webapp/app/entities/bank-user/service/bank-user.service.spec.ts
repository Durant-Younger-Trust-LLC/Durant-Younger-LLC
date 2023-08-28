import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBankUser } from '../bank-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bank-user.test-samples';

import { BankUserService } from './bank-user.service';

const requireRestSample: IBankUser = {
  ...sampleWithRequiredData,
};

describe('BankUser Service', () => {
  let service: BankUserService;
  let httpMock: HttpTestingController;
  let expectedResult: IBankUser | IBankUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BankUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BankUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bankUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bankUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankUser', () => {
      const bankUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bankUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BankUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBankUserToCollectionIfMissing', () => {
      it('should add a BankUser to an empty array', () => {
        const bankUser: IBankUser = sampleWithRequiredData;
        expectedResult = service.addBankUserToCollectionIfMissing([], bankUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankUser);
      });

      it('should not add a BankUser to an array that contains it', () => {
        const bankUser: IBankUser = sampleWithRequiredData;
        const bankUserCollection: IBankUser[] = [
          {
            ...bankUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBankUserToCollectionIfMissing(bankUserCollection, bankUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankUser to an array that doesn't contain it", () => {
        const bankUser: IBankUser = sampleWithRequiredData;
        const bankUserCollection: IBankUser[] = [sampleWithPartialData];
        expectedResult = service.addBankUserToCollectionIfMissing(bankUserCollection, bankUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankUser);
      });

      it('should add only unique BankUser to an array', () => {
        const bankUserArray: IBankUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bankUserCollection: IBankUser[] = [sampleWithRequiredData];
        expectedResult = service.addBankUserToCollectionIfMissing(bankUserCollection, ...bankUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankUser: IBankUser = sampleWithRequiredData;
        const bankUser2: IBankUser = sampleWithPartialData;
        expectedResult = service.addBankUserToCollectionIfMissing([], bankUser, bankUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankUser);
        expect(expectedResult).toContain(bankUser2);
      });

      it('should accept null and undefined values', () => {
        const bankUser: IBankUser = sampleWithRequiredData;
        expectedResult = service.addBankUserToCollectionIfMissing([], null, bankUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankUser);
      });

      it('should return initial array if no BankUser is added', () => {
        const bankUserCollection: IBankUser[] = [sampleWithRequiredData];
        expectedResult = service.addBankUserToCollectionIfMissing(bankUserCollection, undefined, null);
        expect(expectedResult).toEqual(bankUserCollection);
      });
    });

    describe('compareBankUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBankUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBankUser(entity1, entity2);
        const compareResult2 = service.compareBankUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBankUser(entity1, entity2);
        const compareResult2 = service.compareBankUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBankUser(entity1, entity2);
        const compareResult2 = service.compareBankUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
