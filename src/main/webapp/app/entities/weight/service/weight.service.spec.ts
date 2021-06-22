import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IWeight, Weight } from '../weight.model';

import { WeightService } from './weight.service';

describe('Service Tests', () => {
  describe('Weight Service', () => {
    let service: WeightService;
    let httpMock: HttpTestingController;
    let elemDefault: IWeight;
    let expectedResult: IWeight | IWeight[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(WeightService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateTime: currentDate,
        weight: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateTime: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Weight', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateTime: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Weight()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Weight', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateTime: currentDate.format(DATE_FORMAT),
            weight: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Weight', () => {
        const patchObject = Object.assign(
          {
            dateTime: currentDate.format(DATE_FORMAT),
          },
          new Weight()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Weight', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateTime: currentDate.format(DATE_FORMAT),
            weight: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Weight', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addWeightToCollectionIfMissing', () => {
        it('should add a Weight to an empty array', () => {
          const weight: IWeight = { id: 123 };
          expectedResult = service.addWeightToCollectionIfMissing([], weight);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(weight);
        });

        it('should not add a Weight to an array that contains it', () => {
          const weight: IWeight = { id: 123 };
          const weightCollection: IWeight[] = [
            {
              ...weight,
            },
            { id: 456 },
          ];
          expectedResult = service.addWeightToCollectionIfMissing(weightCollection, weight);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Weight to an array that doesn't contain it", () => {
          const weight: IWeight = { id: 123 };
          const weightCollection: IWeight[] = [{ id: 456 }];
          expectedResult = service.addWeightToCollectionIfMissing(weightCollection, weight);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(weight);
        });

        it('should add only unique Weight to an array', () => {
          const weightArray: IWeight[] = [{ id: 123 }, { id: 456 }, { id: 20854 }];
          const weightCollection: IWeight[] = [{ id: 123 }];
          expectedResult = service.addWeightToCollectionIfMissing(weightCollection, ...weightArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const weight: IWeight = { id: 123 };
          const weight2: IWeight = { id: 456 };
          expectedResult = service.addWeightToCollectionIfMissing([], weight, weight2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(weight);
          expect(expectedResult).toContain(weight2);
        });

        it('should accept null and undefined values', () => {
          const weight: IWeight = { id: 123 };
          expectedResult = service.addWeightToCollectionIfMissing([], null, weight, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(weight);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
