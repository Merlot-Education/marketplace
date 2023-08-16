import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { IContractBasic, IContractDetailed, IEdcIdResponse, IEdcNegotiationStatus, IEdcTransferStatus, IPageContracts, ISaasContractDetailed } from '../views/contracts/contracts-data';

@Injectable({
  providedIn: 'root',
})
export class ContractApiService {

  private friendlyStatusNames = {
    "IN_DRAFT": "In Bearbeitung",
    "SIGNED_CONSUMER": "Vom Kunden unterschrieben",
    "RELEASED": "Veröffentlicht",
    "REVOKED": "Widerrufen",
    "DELETED": "Gelöscht",
    "ARCHIVED": "Archiviert"
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getActiveRoleHeaders() : HttpHeaders {
    let headers = new HttpHeaders({'Active-Role' : this.authService.activeOrganizationRole.value.orgaRoleString });
    return headers;
  }

  public async createNewContract(offeringId: string, consumerId: string): Promise<IContractDetailed> {
    return await lastValueFrom(this.http.post(environment.contract_api_url, {
      offeringId: offeringId,
      consumerId: consumerId
    }, {headers: this.getActiveRoleHeaders()})) as IContractDetailed;
  }

  public async regenerateContract(contractId: string): Promise<IContractDetailed> {
    return await lastValueFrom(this.http.post(environment.contract_api_url + "contract/regenerate/" + contractId, null, {headers: this.getActiveRoleHeaders()})) as IContractDetailed;
  }

  public async updateContract(contract: IContractDetailed): Promise<IContractDetailed> {
    return await lastValueFrom(this.http.put(environment.contract_api_url, contract, {headers: this.getActiveRoleHeaders()})) as IContractDetailed;
  }

  public async statusShiftContract(contractId: string, newStatus: string) {  
    let headers = this.getActiveRoleHeaders();

    let fullUrl = environment.contract_api_url + 'contract/status/' + contractId + '/' + newStatus;
    
    return await lastValueFrom(this.http.patch(fullUrl, null, {headers: headers})) as IContractDetailed;
  }

  public async getOrgaContracts(page: number, size: number, consumerId: string): Promise<IPageContracts> {
    return await lastValueFrom(this.http.get(
      environment.contract_api_url + "organization/" + consumerId + "?page=" + page + "&size=" + size)) as IPageContracts;
  }

  public async getContractDetails(contractId: string): Promise<IContractDetailed> {
    return await lastValueFrom(this.http.get(
      environment.contract_api_url + "contract/" + contractId, {headers: this.getActiveRoleHeaders()})) as IContractDetailed;
  }

  public async initiateEdcNegotiation(contractId: string): Promise<IEdcIdResponse> {
    return await lastValueFrom(this.http.post(
      environment.contract_api_url + "transfers/contract/" + contractId + "/negotiation/start", null, {headers: this.getActiveRoleHeaders()})) as IEdcIdResponse;
  }

  public async getEdcNegotiationStatus(contractId: string, negotiationId: string): Promise<IEdcNegotiationStatus> {
    return await lastValueFrom(this.http.get(
      environment.contract_api_url + "transfers/contract/" + contractId + "/negotiation/" + negotiationId + "/status", {headers: this.getActiveRoleHeaders()})) as IEdcNegotiationStatus;
  }

  public async initiateEdcTransfer(contractId: string, negotiationId: string): Promise<IEdcIdResponse> {
    return await lastValueFrom(this.http.post(
      environment.contract_api_url + "transfers/contract/" + contractId + "/negotiation/" + negotiationId + "/transfer/start", null, {headers: this.getActiveRoleHeaders()})) as IEdcIdResponse;
  }

  public async getEdcTransferStatus(contractId: string, transferId: string): Promise<IEdcTransferStatus> {
    return await lastValueFrom(this.http.get(
      environment.contract_api_url + "transfers/contract/" + contractId + "/transfer/" + transferId + "/status", {headers: this.getActiveRoleHeaders()})) as IEdcTransferStatus;
  }

  public resolveFriendlyStatusName(contractStatus: string) {
    return this.friendlyStatusNames[contractStatus] ? this.friendlyStatusNames[contractStatus] : "Unbekannt";
  }
}
