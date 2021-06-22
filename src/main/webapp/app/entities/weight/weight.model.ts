import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IWeight {
  id?: number;
  dateTime?: dayjs.Dayjs;
  weight?: number | null;
  user?: IUser | null;
}

export class Weight implements IWeight {
  constructor(public id?: number, public dateTime?: dayjs.Dayjs, public weight?: number | null, public user?: IUser | null) {}
}

export function getWeightIdentifier(weight: IWeight): number | undefined {
  return weight.id;
}
