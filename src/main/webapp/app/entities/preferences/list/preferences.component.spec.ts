import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PreferencesService } from '../service/preferences.service';

import { PreferencesComponent } from './preferences.component';

describe('Component Tests', () => {
  describe('Preferences Management Component', () => {
    let comp: PreferencesComponent;
    let fixture: ComponentFixture<PreferencesComponent>;
    let service: PreferencesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PreferencesComponent],
      })
        .overrideTemplate(PreferencesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PreferencesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PreferencesService);

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
      expect(comp.preferences?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
