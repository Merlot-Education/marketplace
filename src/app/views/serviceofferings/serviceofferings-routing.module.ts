/*
 *  Copyright 2023-2024 Dataport AöR
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from './explore/explore.component';
import { EditComponent } from './edit/edit.component';
import { isAuthenticated, repAuthGuard } from 'src/app/auth.guard';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Service Angebote',
    },
    children: [
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
        canActivate: [isAuthenticated, repAuthGuard]
      },
      {
        path: 'edit/:offeringId',
        component: EditComponent,
        data: {
          title: 'Service Angebot bearbeiten',
        },
        canActivate: [isAuthenticated, repAuthGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceofferingsRoutingModule {}

