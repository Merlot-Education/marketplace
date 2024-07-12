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

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { ActiveOrganizationRoleService } from './services/active-organization-role.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'MERLOT Portal';
  

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private oidcSecurityService: OidcSecurityService,
    private activeOrgRoleService: ActiveOrganizationRoleService,
    private publicEventsService: PublicEventsService,
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };

    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: any) => {
        console.log(loginResponse);
        const { isAuthenticated, userData, accessToken, idToken, configId } = loginResponse;
        activeOrgRoleService.userData = userData;
        activeOrgRoleService.accessToken = accessToken;

        // update this last to trigger next steps
        activeOrgRoleService.isLoggedIn.next(isAuthenticated);
      });
      this.publicEventsService.registerForEvents()
        .pipe(filter((notification) => notification.type === EventTypes.NewAuthenticationResult))
        .subscribe(_ => {
          oidcSecurityService.getAccessToken().subscribe(token => {
            activeOrgRoleService.accessToken = token;
          });
      });
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
