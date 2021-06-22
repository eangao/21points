import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'weight',
        data: { pageTitle: 'Weights' },
        loadChildren: () => import('./weight/weight.module').then(m => m.WeightModule),
      },
      {
        path: 'points',
        data: { pageTitle: 'Points' },
        loadChildren: () => import('./points/points.module').then(m => m.PointsModule),
      },
      {
        path: 'blood-pressure',
        data: { pageTitle: 'BloodPressures' },
        loadChildren: () => import('./blood-pressure/blood-pressure.module').then(m => m.BloodPressureModule),
      },
      {
        path: 'preferences',
        data: { pageTitle: 'Preferences' },
        loadChildren: () => import('./preferences/preferences.module').then(m => m.PreferencesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
