import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PointsService } from '../service/points.service';

import { PointsComponent } from './points.component';

describe('Component Tests', () => {
  describe('Points Management Component', () => {
    let comp: PointsComponent;
    let fixture: ComponentFixture<PointsComponent>;
    let service: PointsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PointsComponent],
      })
        .overrideTemplate(PointsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PointsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PointsService);

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
      expect(comp.points?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
