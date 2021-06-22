import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWeight, getWeightIdentifier } from '../weight.model';

export type EntityResponseType = HttpResponse<IWeight>;
export type EntityArrayResponseType = HttpResponse<IWeight[]>;

@Injectable({ providedIn: 'root' })
export class WeightService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/weights');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .post<IWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .put<IWeight>(`${this.resourceUrl}/${getWeightIdentifier(weight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .patch<IWeight>(`${this.resourceUrl}/${getWeightIdentifier(weight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWeightToCollectionIfMissing(weightCollection: IWeight[], ...weightsToCheck: (IWeight | null | undefined)[]): IWeight[] {
    const weights: IWeight[] = weightsToCheck.filter(isPresent);
    if (weights.length > 0) {
      const weightCollectionIdentifiers = weightCollection.map(weightItem => getWeightIdentifier(weightItem)!);
      const weightsToAdd = weights.filter(weightItem => {
        const weightIdentifier = getWeightIdentifier(weightItem);
        if (weightIdentifier == null || weightCollectionIdentifiers.includes(weightIdentifier)) {
          return false;
        }
        weightCollectionIdentifiers.push(weightIdentifier);
        return true;
      });
      return [...weightsToAdd, ...weightCollection];
    }
    return weightCollection;
  }

  protected convertDateFromClient(weight: IWeight): IWeight {
    return Object.assign({}, weight, {
      dateTime: weight.dateTime?.isValid() ? weight.dateTime.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateTime = res.body.dateTime ? dayjs(res.body.dateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((weight: IWeight) => {
        weight.dateTime = weight.dateTime ? dayjs(weight.dateTime) : undefined;
      });
    }
    return res;
  }
}
