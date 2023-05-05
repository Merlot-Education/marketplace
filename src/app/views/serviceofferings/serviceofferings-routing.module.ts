import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from './explore/explore.component';
import { EditComponent } from './edit/edit.component';
import { DynamicFormComponent } from 'src/app/sdwizard/core/dynamic-form/dynamic-form.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Service Angebote',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cards',
      },
      {
        path: 'explore',
        component: ExploreComponent,
        data: {
          title: 'Service Angebote erkunden',
        },
      },
      {
        path: 'edit',
        component: EditComponent,
        data: {
          title: 'Service Angebot erstellen',
        },
      },
      {
        path: 'edit/form',
        component: DynamicFormComponent,
        data: {
          title: 'Service Angebot erstellen',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceofferingsRoutingModule {}

