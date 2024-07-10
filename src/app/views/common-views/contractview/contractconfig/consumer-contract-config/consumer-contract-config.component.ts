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

import { Component, Input } from '@angular/core';
import { IContract, IDataDeliveryContract, IIonosS3ConsumerTransferProvisioning } from '../../../../contracts/contracts-data';
import { ConnectorData } from 'src/app/views/organization/organization-data';
import { getMerlotSpecificServiceOfferingTypeFromServiceOfferingSd } from 'src/app/utils/credential-tools';

@Component({
  selector: 'app-consumer-contract-config',
  templateUrl: './consumer-contract-config.component.html',
  styleUrls: ['./consumer-contract-config.component.scss']
})
export class ConsumerContractConfigComponent {
  protected asDataDeliveryContract(val): IDataDeliveryContract { return val };

  protected asIonosConsumerTransferProvisioning(val): IIonosS3ConsumerTransferProvisioning { return val };

  @Input() contractDetails: IContract = undefined;
  @Input() availableConnectors : ConnectorData[] = [];

  protected selectedTransferMethod: string;

  ngOnInit(): void {
    this.selectedTransferMethod = this.asDataDeliveryContract(this.contractDetails).provisioning.consumerTransferProvisioning?.dataAddressType;
  }

  protected getConnectorBuckets(connectorId: string) {
    try {
      return this.availableConnectors.find(con => con.connectorId === connectorId).ionosS3ExtensionConfig?.buckets.map(b => b.name);
    } catch (e) {
      return [];
    }
  }

  protected onChangeTransferType() {
    if (this.selectedTransferMethod === undefined || this.selectedTransferMethod === "") {
      this.asDataDeliveryContract(this.contractDetails).provisioning.consumerTransferProvisioning = null;
    } else if (this.selectedTransferMethod === "IonosS3Dest") {
      let ionosProvisioning : IIonosS3ConsumerTransferProvisioning = {
        dataAddressTargetBucketName: '',
        dataAddressTargetPath: '',
        dataAddressType: 'IonosS3Dest',
        selectedConnectorId: ''
      };
      this.asDataDeliveryContract(this.contractDetails).provisioning.consumerTransferProvisioning = ionosProvisioning;
    } 
  }

  protected isContractInDraft(contractDetails: IContract): boolean {
    return contractDetails.details.state === 'IN_DRAFT';
  }

  protected isContractSignedConsumer(contractDetails: IContract): boolean {
    return contractDetails.details.state === 'SIGNED_CONSUMER';
  }

  protected isDataDeliveryContract(contractDetails: IContract): boolean {
    return getMerlotSpecificServiceOfferingTypeFromServiceOfferingSd(contractDetails?.offering?.selfDescription) === 'merlot:MerlotDataDeliveryServiceOffering';
  }

  protected isIonosConsumerTransferProvisioning(contractDetails: IContract): boolean {
    return this.asDataDeliveryContract(contractDetails).provisioning.consumerTransferProvisioning?.dataAddressType === "IonosS3Dest";
  }

  protected hasContractAttachments(contractDetails: IContract): boolean {
    return contractDetails.negotiation.attachments.length > 0;
  }
  
  protected getSelectedProviderConnectorId(): string {
    return this.asDataDeliveryContract(this.contractDetails).provisioning.providerTransferProvisioning?.selectedConnectorId;
  }

  protected getSelectedConsumerConnectorId(): string {
    return this.asDataDeliveryContract(this.contractDetails).provisioning.consumerTransferProvisioning?.selectedConnectorId;
  }

  protected isConnectorIdValid(connectorId: string): boolean {
    if (!connectorId || connectorId.trim().length === 0 || !this.availableConnectors.find(con => con.connectorId === connectorId)) {
      return false;
    }

    return true;
  }

  protected isAnyBucketAvailableForConnector(connectorId: string): boolean {
    let bucketList = this.getConnectorBuckets(connectorId);

    if (!bucketList || bucketList.length === 0) {
      return false;
    }

    return true;
  }
}
