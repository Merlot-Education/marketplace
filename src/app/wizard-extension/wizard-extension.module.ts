import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardAppModule } from '../sdwizard/wizardapp.module';
import { CommonViewsModule } from "../views/common-views/common-views.module";
import { ButtonGroupModule, ButtonModule, GridModule, ModalModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrganisationWizardExtensionComponent } from './organisation-wizard-extension/organisation-wizard-extension.component';
import { OfferingWizardExtensionComponent } from './offering-wizard-extension/offering-wizard-extension.component';
import { BaseWizardExtensionComponent } from './base-wizard-extension/base-wizard-extension.component';

@NgModule({
    declarations: [OrganisationWizardExtensionComponent, OfferingWizardExtensionComponent, BaseWizardExtensionComponent],
    exports: [
        OrganisationWizardExtensionComponent,
        OfferingWizardExtensionComponent
    ],
    imports: [
        CommonModule,
        WizardAppModule,
        CommonViewsModule,
        FlexLayoutModule,
        ButtonModule,
        ButtonGroupModule,
        FormsModule,
        GridModule,
        ModalModule
    ]
})
export class WizardExtensionModule { }
