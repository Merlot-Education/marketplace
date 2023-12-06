import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from 'src/app/services/auth.service';
import { ActiveOrganizationRoleService } from 'src/app/services/active-organization-role.service';
import { AaamApiService } from 'src/app/services/aaam-api.service';

import {
  IRoleNavData,
  OrganizationRoleLayoutData,
} from '@merlot-education/m-dashboard-ui';
import { navItems } from './_nav';
import { OrganizationsApiService } from 'src/app/services/organizations-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  public navItems: IRoleNavData[];

  public selectedRoleOption: string = '';

  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  objectKeys = Object.keys;

  organizationRolesForLayout: OrganizationRoleLayoutData[] = [];

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    protected authService: AuthService,
    protected activeOrgRoleService: ActiveOrganizationRoleService,
    protected keycloakService: KeycloakService,
    private aaamApiService: AaamApiService,
    private organizationsApiService: OrganizationsApiService
  ) {
    let globalNavItems = structuredClone(navItems);
    this.navItems = this.buildAllowedNavItems(globalNavItems);
  }

  public async ngOnInit() {
    //this.authService.user.subscribe(x => {
    let globalNavItems = structuredClone(navItems);
    this.navItems = this.buildAllowedNavItems(globalNavItems);
    //});
    this.selectedRoleOption =
      this.activeOrgRoleService.activeOrganizationRole.getValue().orgaRoleString;

    let tries = 0;
    while (this.authService.isLoggedIn) {
      console.log('waiting for roles to load');
      await this.wait(100);

      if (this.authService.finishedLoadingRoles) {
        this.loadRolesForMenu();
        break;
      }

      // TODO: remove this if there are no regular problems with roles (don't forget the tries variable above)
      tries++;
      if (tries > 10) {
        console.warn(
          'still trying to load roles from the auth service, if you keep seeing this warning, check in `buildOrganizationRoles`'
        );
      }
    }
  }

  private loadRolesForMenu() {
    for (let role in this.authService.organizationRoles) {
      this.organizationRolesForLayout.push({
        orgaRoleString: this.authService.organizationRoles[role].orgaRoleString,
        roleName: this.authService.organizationRoles[role].roleName,
        roleFriendlyName:
          this.authService.organizationRoles[role].roleFriendlyName,
        orgaName:
          this.authService.organizationRoles[role].orgaData?.selfDescription
            .verifiableCredential.credentialSubject['merlot:orgaName'][
            '@value'
          ],
      });
    }
  }

  private buildAllowedNavItems(navItems: IRoleNavData[]) {
    let outNavItems: IRoleNavData[] = [];
    // iterate over navItems, check if they are allowed for this role
    for (let navItem of navItems) {
      // check if entry itself is allowed
      if (!this.checkNavItemRoleAllowed(navItem)) {
        // if not allowed, don't waste time with checking children
        continue;
      }

      // checking for children and their roles
      if (navItem.children !== undefined) {
        navItem.children = this.buildAllowedNavItems(navItem.children);
      }

      // at this point we have an allowed item with allowed children, push it back to the list
      outNavItems.push(navItem);
    }
    return outNavItems;
  }

  private checkNavItemRoleAllowed(navItem: IRoleNavData) {
    return true;
    // TODO readd this once roles are properly implemented
    // if no roles are defined, allow for everyone
    /*if (navItem.allowedRoles === undefined) {
      return true
    }
    // otherwise ask the auth service if the current user has any of the allowed roles
    return navItem.allowedRoles.some(r => this.authService.user.value.roles.includes(r));*/
  }

  selectedRoleChanged(event: any) {
    this.selectedRoleOption = event.value;
    this.authService.changeActiveOrgaRole(this.selectedRoleOption);
  }
}
