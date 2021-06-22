import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IBloodPressure {
  id?: number;
  date?: dayjs.Dayjs;
  systolic?: number | null;
  diastolic?: number | null;
  user?: IUser | null;
}

export class BloodPressure implements IBloodPressure {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public systolic?: number | null,
    public diastolic?: number | null,
    public user?: IUser | null
  ) {}
}

export function getBloodPressureIdentifier(bloodPressure: IBloodPressure): number | undefined {
  return bloodPressure.id;
}
