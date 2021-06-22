jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBloodPressure, BloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

import { BloodPressureRoutingResolveService } from './blood-pressure-routing-resolve.service';

describe('Service Tests', () => {
  describe('BloodPressure routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BloodPressureRoutingResolveService;
    let service: BloodPressureService;
    let resultBloodPressure: IBloodPressure | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BloodPressureRoutingResolveService);
      service = TestBed.inject(BloodPressureService);
      resultBloodPressure = undefined;
    });

    describe('resolve', () => {
      it('should return IBloodPressure returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBloodPressure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBloodPressure).toEqual({ id: 123 });
      });

      it('should return new IBloodPressure if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBloodPressure = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBloodPressure).toEqual(new BloodPressure());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBloodPressure = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBloodPressure).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
