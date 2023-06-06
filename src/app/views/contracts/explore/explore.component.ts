import { Component, OnInit } from '@angular/core';
import { demoContracts, IContractBasic } from '../contracts-data';
import { OrganizationsApiService } from 'src/app/services/organizations-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContractApiService } from 'src/app/services/contract-api.service';

@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

  contracts: IContractBasic[] = [];

  constructor(
    protected organizationsApiService: OrganizationsApiService,
    protected authService: AuthService,
    protected contractApiService: ContractApiService
    ) {
  }

  ngOnInit(): void {
    this.authService.activeOrganizationRole.subscribe(value => {
      this.contractApiService.getOrgaContracts(
        "Participant:" + value.orgaId)
        .then(result => this.contracts = result.content);
    })
  }

}
