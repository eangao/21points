import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BloodPressureService } from '../service/blood-pressure.service';

import { BloodPressureComponent } from './blood-pressure.component';

describe('Component Tests', () => {
  describe('BloodPressure Management Component', () => {
    let comp: BloodPressureComponent;
    let fixture: ComponentFixture<BloodPressureComponent>;
    let service: BloodPressureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BloodPressureComponent],
      })
        .overrideTemplate(BloodPressureComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BloodPressureComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BloodPressureService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bloodPressures?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
