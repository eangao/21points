import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBloodPressure, BloodPressure } from '../blood-pressure.model';

import { BloodPressureService } from './blood-pressure.service';

describe('Service Tests', () => {
  describe('BloodPressure Service', () => {
    let service: BloodPressureService;
    let httpMock: HttpTestingController;
    let elemDefault: IBloodPressure;
    let expectedResult: IBloodPressure | IBloodPressure[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BloodPressureService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        systolic: 0,
        diastolic: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BloodPressure', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new BloodPressure()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BloodPressure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            systolic: 1,
            diastolic: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BloodPressure', () => {
        const patchObject = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
            systolic: 1,
          },
          new BloodPressure()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BloodPressure', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            systolic: 1,
            diastolic: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BloodPressure', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBloodPressureToCollectionIfMissing', () => {
        it('should add a BloodPressure to an empty array', () => {
          const bloodPressure: IBloodPressure = { id: 123 };
          expectedResult = service.addBloodPressureToCollectionIfMissing([], bloodPressure);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bloodPressure);
        });

        it('should not add a BloodPressure to an array that contains it', () => {
          const bloodPressure: IBloodPressure = { id: 123 };
          const bloodPressureCollection: IBloodPressure[] = [
            {
              ...bloodPressure,
            },
            { id: 456 },
          ];
          expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, bloodPressure);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BloodPressure to an array that doesn't contain it", () => {
          const bloodPressure: IBloodPressure = { id: 123 };
          const bloodPressureCollection: IBloodPressure[] = [{ id: 456 }];
          expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, bloodPressure);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bloodPressure);
        });

        it('should add only unique BloodPressure to an array', () => {
          const bloodPressureArray: IBloodPressure[] = [{ id: 123 }, { id: 456 }, { id: 39107 }];
          const bloodPressureCollection: IBloodPressure[] = [{ id: 123 }];
          expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, ...bloodPressureArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bloodPressure: IBloodPressure = { id: 123 };
          const bloodPressure2: IBloodPressure = { id: 456 };
          expectedResult = service.addBloodPressureToCollectionIfMissing([], bloodPressure, bloodPressure2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bloodPressure);
          expect(expectedResult).toContain(bloodPressure2);
        });

        it('should accept null and undefined values', () => {
          const bloodPressure: IBloodPressure = { id: 123 };
          expectedResult = service.addBloodPressureToCollectionIfMissing([], null, bloodPressure, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bloodPressure);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
