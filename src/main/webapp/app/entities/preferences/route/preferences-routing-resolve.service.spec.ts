jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPreferences, Preferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';

import { PreferencesRoutingResolveService } from './preferences-routing-resolve.service';

describe('Service Tests', () => {
  describe('Preferences routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PreferencesRoutingResolveService;
    let service: PreferencesService;
    let resultPreferences: IPreferences | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PreferencesRoutingResolveService);
      service = TestBed.inject(PreferencesService);
      resultPreferences = undefined;
    });

    describe('resolve', () => {
      it('should return IPreferences returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPreferences = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPreferences).toEqual({ id: 123 });
      });

      it('should return new IPreferences if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPreferences = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPreferences).toEqual(new Preferences());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPreferences = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPreferences).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
