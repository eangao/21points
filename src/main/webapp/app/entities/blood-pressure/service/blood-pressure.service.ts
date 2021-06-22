import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBloodPressure, getBloodPressureIdentifier } from '../blood-pressure.model';

export type EntityResponseType = HttpResponse<IBloodPressure>;
export type EntityArrayResponseType = HttpResponse<IBloodPressure[]>;

@Injectable({ providedIn: 'root' })
export class BloodPressureService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/blood-pressures');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .post<IBloodPressure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .put<IBloodPressure>(`${this.resourceUrl}/${getBloodPressureIdentifier(bloodPressure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .patch<IBloodPressure>(`${this.resourceUrl}/${getBloodPressureIdentifier(bloodPressure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBloodPressure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBloodPressure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBloodPressureToCollectionIfMissing(
    bloodPressureCollection: IBloodPressure[],
    ...bloodPressuresToCheck: (IBloodPressure | null | undefined)[]
  ): IBloodPressure[] {
    const bloodPressures: IBloodPressure[] = bloodPressuresToCheck.filter(isPresent);
    if (bloodPressures.length > 0) {
      const bloodPressureCollectionIdentifiers = bloodPressureCollection.map(
        bloodPressureItem => getBloodPressureIdentifier(bloodPressureItem)!
      );
      const bloodPressuresToAdd = bloodPressures.filter(bloodPressureItem => {
        const bloodPressureIdentifier = getBloodPressureIdentifier(bloodPressureItem);
        if (bloodPressureIdentifier == null || bloodPressureCollectionIdentifiers.includes(bloodPressureIdentifier)) {
          return false;
        }
        bloodPressureCollectionIdentifiers.push(bloodPressureIdentifier);
        return true;
      });
      return [...bloodPressuresToAdd, ...bloodPressureCollection];
    }
    return bloodPressureCollection;
  }

  protected convertDateFromClient(bloodPressure: IBloodPressure): IBloodPressure {
    return Object.assign({}, bloodPressure, {
      date: bloodPressure.date?.isValid() ? bloodPressure.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bloodPressure: IBloodPressure) => {
        bloodPressure.date = bloodPressure.date ? dayjs(bloodPressure.date) : undefined;
      });
    }
    return res;
  }
}
