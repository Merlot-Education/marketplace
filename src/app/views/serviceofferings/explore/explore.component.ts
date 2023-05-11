import { Component, OnInit } from '@angular/core';
import {IOfferings} from '../serviceofferings-data'
import { ServiceofferingApiService } from '../../../services/serviceoffering-api.service'
import { OrganizationsApiService } from 'src/app/services/organizations-api.service';


@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

  offerings: IOfferings[] = [];
  orgaOfferings: IOfferings[] = [];
  constructor(
    protected serviceOfferingApiService : ServiceofferingApiService,
    private organizationsApiService: OrganizationsApiService) {
  }

  ngOnInit(): void {
    this.refreshOfferings();
  }

  private refreshOfferings() {
    this.serviceOfferingApiService.fetchPublicServiceOfferings().then(result => {
      console.log(result)
      this.offerings = result;
    });
    this.serviceOfferingApiService.fetchOrganizationServiceOfferings().then(result => {
      console.log(result)
      this.orgaOfferings = result;
    });
  }

  protected resolveOrganizationLegalName(offeredByString: string): string {
    let result = this.organizationsApiService.getOrgaById(offeredByString.replace("Participant:", ""))?.organizationLegalName;
    return result ? result : "Unbekannt";
  }

  protected resolveMerlotStatusFriendlyName(merlotStatusString: string): string {
    let friendlyNames = {
      "IN_DRAFT": "In Bearbeitung",
      "RELEASED": "Veröffentlicht",
      "REVOKED": "Widerrufen",
      "DELETED": "Gelöscht",
      "ARCHIVED": "Archiviert"
    }
    return friendlyNames[merlotStatusString] ? friendlyNames[merlotStatusString] : "Unbekannt";
  }

  releaseOffering(id: string) {
    this.serviceOfferingApiService.releaseServiceOffering(id).then(result => {
      console.log(result);
      this.refreshOfferings();
    });
  }

  revokeOffering(id: string) {
    this.serviceOfferingApiService.revokeServiceOffering(id).then(result => {
      console.log(result);
      this.refreshOfferings();
    });
  }

  inDraftOffering(id: string) {
    this.serviceOfferingApiService.inDraftServiceOffering(id).then(result => {
      console.log(result);
      this.refreshOfferings();
    });
  }
  
  deleteOffering(id: string) {
    this.serviceOfferingApiService.deleteServiceOffering(id).then(result => {
      console.log(result);
      this.refreshOfferings();
    });
  }
}
