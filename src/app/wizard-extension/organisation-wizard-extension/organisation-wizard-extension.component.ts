import { Component, EventEmitter, ViewChild } from '@angular/core';
import { OrganizationsApiService } from '../../services/organizations-api.service';
import { StatusMessageComponent } from '../../views/common-views/status-message/status-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActiveOrganizationRoleService } from 'src/app/services/active-organization-role.service';
import { ConnectorData, IOrganizationData, IOrganizationMetadata, IonosS3Bucket } from 'src/app/views/organization/organization-data';
import { ModalComponent } from '@coreui/angular';
import { BaseWizardExtensionComponent } from '../base-wizard-extension/base-wizard-extension.component';


@Component({
  selector: 'app-organisation-wizard-extension',
  templateUrl: './organisation-wizard-extension.component.html',
  styleUrls: ['./organisation-wizard-extension.component.scss']
})
export class OrganisationWizardExtensionComponent {
  @ViewChild("baseWizardExtension") private baseWizardExtension: BaseWizardExtensionComponent;
  @ViewChild("saveStatusMessage") private saveStatusMessage: StatusMessageComponent;
  @ViewChild('modalConfirmation') private modalConfirmation: ModalComponent;

  public submitCompleteEvent: EventEmitter<any> = new EventEmitter();

  protected submitButtonsDisabled: boolean = false;  
  protected orgaActiveSelection: string = "false";
  protected orgaMetadata: IOrganizationMetadata = null;

  constructor(
      protected organizationsApiService: OrganizationsApiService,
      protected activeOrgRoleService: ActiveOrganizationRoleService
    ) {}

  public async loadShape(id: string): Promise<void> {
    console.log("Loading MERLOT Organisation shape");
    await this.baseWizardExtension.loadShape(this.organizationsApiService.getMerlotParticipantShape(), id);
  }

  public isShapeLoaded(): boolean {
    return this.baseWizardExtension?.isShapeLoaded();
  }

  private activeStringToBoolean(active: string) { 
    return active === "true";
  }

  private activeBooleanToString(active: boolean) { 
    return active ? "true": "false";
  }

  public prefillOrganisation(orga: IOrganizationData) {
    this.orgaMetadata = orga.metadata;
    this.orgaActiveSelection = this.activeBooleanToString(orga.metadata.active);
    this.baseWizardExtension.prefillFields(orga.selfDescription.verifiableCredential.credentialSubject);
  }

  private async saveSelfDescription(jsonSd: any) {
    this.orgaMetadata.active = this.activeStringToBoolean(this.orgaActiveSelection);
    const editedOrganisationData : IOrganizationData = {
      id: jsonSd["@id"],
      metadata: this.orgaMetadata,
      selfDescription: {
        verifiableCredential: {
          credentialSubject: jsonSd,
        },
      },
      activeRepresentant: false,
      passiveRepresentant: false,
      activeFedAdmin: false,
      passiveFedAdmin: false
    };
    console.log(editedOrganisationData);
    return await this.organizationsApiService.saveOrganization(editedOrganisationData);
  }

  protected checkConfirmationNeeded() {
    if (this.orgaActiveSelection === "false" && this.orgaMetadata.active) {
      this.modalConfirmation.visible = true;
    } else {
      this.onSubmit();
    }
  }

  protected onSubmit(): void {
    console.log("onSubmit");
    this.submitButtonsDisabled = true;
    this.saveStatusMessage.hideAllMessages();

    let jsonSd = this.baseWizardExtension.generateJsonSd();

    this.saveSelfDescription(jsonSd).then(result => {
      console.log(result);
      this.baseWizardExtension.setCredentialId(result["id"]);
      this.saveStatusMessage.showSuccessMessage("ID: " + result["id"]);
      this.submitCompleteEvent.emit(null);
    }).catch((e: HttpErrorResponse) => {
      this.saveStatusMessage.showErrorMessage(e.error.message);
    })
    .catch(_ => {
      this.saveStatusMessage.showErrorMessage("Unbekannter Fehler");
    }).finally(() => {
      this.submitButtonsDisabled = false;
    });
  }

  public ngOnDestroy() {
    this.baseWizardExtension.ngOnDestroy();
    this.saveStatusMessage.hideAllMessages();
    this.submitButtonsDisabled = false;
  }

  public isOrganizationMetadataFilled(): boolean {
    let membershipClassOk = this.isMembershipClassFilled();
    let mailAddressOk = this.isMailAddressFilled();
    let isConnectorListOk = this.activeOrgRoleService.isActiveAsRepresentative ? this.isConnectorListValid() : true;

    return membershipClassOk && mailAddressOk && isConnectorListOk;
  }

  public isMailAddressFilled(): boolean {
    return this.isFieldFilled(this.orgaMetadata.mailAddress);
  }

  public isMembershipClassFilled(): boolean {
    return this.isFieldFilled(this.orgaMetadata.membershipClass);
  }

  public isConnectorListValid(): boolean {
    // check if all given connectors are valid
    // if there are no connectors at all, that is also valid
    for (const connector of this.orgaMetadata.connectors) {
      if (!this.isConnectorValid(connector)) {
        return false;
      }
    }
    return true;
  }

  public isConnectorValid(connector: ConnectorData): boolean {
    // Check if id, endpoint and access token are not empty
    if (!this.isFieldFilled(connector.connectorId) || !this.isFieldFilled(connector.connectorEndpoint) || !this.isFieldFilled(connector.connectorAccessToken)) {
      return false;
    }

    if (!this.isConnectorBucketListValid(connector)) {
      return false;
    }
      
    return true
  }

  protected isIonosS3ExtensionConfigValid(connector: ConnectorData): boolean {
    // check if all bucket names are valid
    // if there are no bucket names at all, that is also valid
    // TODO

    return true;
  }
    

  public isConnectorBucketListValid(connector: ConnectorData): boolean {

    if (!connector.ionosS3ExtensionConfig) {
      return true;
    }

    // if no buckets provided, the config is invalid
    if (!connector.ionosS3ExtensionConfig.buckets 
        || connector.ionosS3ExtensionConfig.buckets.length == 0) {
          return false;
    }

    // check if all bucket names are valid
    for (const bucket of connector.ionosS3ExtensionConfig.buckets) {
      if (!this.isFieldFilled(bucket.name)) {
        return false;
      }
    }

    return true;
  }

  protected isValidBucket(bucket: IonosS3Bucket) {
    return this.isFieldFilled(bucket.name) && this.isFieldFilled(bucket.storageEndpoint);
  }

  public isFieldFilled(str: string){
    if (!str || str.trim().length === 0) {
      return false;
    }

    return true;
  }

  public addConnector() {
    if (!this.orgaMetadata.connectors) {
      this.orgaMetadata.connectors = []
    }
    const connector: ConnectorData = {
      connectorId: '', 
      connectorEndpoint: '',
      connectorAccessToken: ''
    };
    this.orgaMetadata.connectors.push(connector);
  }

  public removeConnector(index: number) {
    this.orgaMetadata.connectors.splice(index, 1);
  }

  public addIonosS3ExtensionConfig(connector: ConnectorData) {
    connector.ionosS3ExtensionConfig = {
      buckets: [{
        name: "",
        storageEndpoint: ""
      }]
    }
  }

  public removeIonosS3ExtensionConfig(connector: ConnectorData) {
    connector.ionosS3ExtensionConfig = null;
  }

  public addBucket(connector: ConnectorData) {
    if (!connector.ionosS3ExtensionConfig.buckets) {
      connector.ionosS3ExtensionConfig.buckets = []
    }
    connector.ionosS3ExtensionConfig.buckets.push({
      name: '',
      storageEndpoint: ""
    });
  }

  public removeBucket(connector: ConnectorData, index: number) {
    connector.ionosS3ExtensionConfig.buckets.splice(index, 1);
  }

  public customTrackBy(index: number, obj: any): any {
    return index;
}

  protected isWizardFormInvalid(): boolean {
    return this.baseWizardExtension?.isWizardFormInvalid();
  }
}
