import { Injectable } from '@angular/core';
import { DynamicFormComponent } from '../sdwizard/core/dynamic-form/dynamic-form.component';
import { DynamicFormArrayComponent } from '@components/dynamic-form-array/dynamic-form-array.component';
import { DynamicFormInputComponent } from '@components/dynamic-form-input/dynamic-form-input.component';
import { ExpandedFieldsComponent } from '@components/expanded-fields/expanded-fields.component';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ContractsRoutingModule } from '../views/contracts/contracts-routing.module';

@Injectable({
  providedIn: 'root'
})
export class WizardExtensionService {

  private subscriptions = new Subscription();

  private createDateTimer: NodeJS.Timer = undefined;

  constructor(private authService: AuthService) { }

  public prefillFields(wizard: DynamicFormComponent, selfDescriptionFields: any, forceImmediateRefresh: boolean = false) {
    console.log("start prefillFields")
    this.subscriptions.unsubscribe();
    if (this.createDateTimer !== undefined) {
      clearInterval(this.createDateTimer);
      this.createDateTimer = undefined;
    }

    if (forceImmediateRefresh) {
      for (let expandedField of wizard.expandedFieldsViewChildren) {
      this.processExpandedField(expandedField, selfDescriptionFields);
      }
      for (let formInput of wizard.formInputViewChildren) {
        this.processFormInput(formInput, selfDescriptionFields);
      }
      for (let formArray of wizard.formArrayViewChildren) {
        this.processFormArray(formArray, selfDescriptionFields);
      }
    }
    let expandedFieldsSub = wizard.expandedFieldsViewChildren.changes.subscribe(_ => {
      for (let expandedField of wizard.expandedFieldsViewChildren) {
        this.processExpandedField(expandedField, selfDescriptionFields);
      }
      expandedFieldsSub.unsubscribe();
    });

    let formInputSub = wizard.formInputViewChildren.changes.subscribe(_ => {
      for (let formInput of wizard.formInputViewChildren) {
        this.processFormInput(formInput, selfDescriptionFields);
      }
      formInputSub.unsubscribe();
    });

    let formArraySub = wizard.formArrayViewChildren.changes.subscribe(_ => {
      for (let formArray of wizard.formArrayViewChildren) {
        this.processFormArray(formArray, selfDescriptionFields);
      }
      formArraySub.unsubscribe();
    });
  }

  processFormArray(formArray: DynamicFormArrayComponent, prefillFields: any) {
    if (formArray === undefined || prefillFields === undefined) {
      return;
    }

    let parentKey = formArray.input.prefix + ":" + formArray.input.key;
    if (!Object.keys(prefillFields).includes(parentKey)) {
      return;
    }
    // create more inputs for each prefill field after the first one
    for (let i = formArray.input.minCount; i < prefillFields[parentKey].length; i++) {
      formArray.addInput();
    }

    let i = 0;
    for (let control of formArray.inputs.controls) {
      control.patchValue(this.unpackValueFromField(prefillFields[parentKey][i]));
      if (prefillFields[parentKey][i] instanceof Object && Object.keys(prefillFields[parentKey][i]).includes("disabled") && prefillFields[parentKey][i]["disabled"]) {
        control.disable();
      }
      i += 1;
    }
  }

  private updateDateField(formControl: FormControl) {
    formControl.patchValue(new Date().toLocaleString("de-DE", {timeZone: "Europe/Berlin", timeStyle: "short", dateStyle: "medium"}));
  }

  processFormInput(formInput: DynamicFormInputComponent, prefillFields: any) {
    if (formInput === undefined || prefillFields === undefined) {
      return;
    }

    let fullKey = formInput.input.prefix + ":" + formInput.input.key;

    if (["gax-core:offeredBy", "gax-trust-framework:providedBy"].includes(fullKey)) {
      this.subscriptions.add(this.authService.activeOrganizationRole.subscribe(_ => {
        formInput.form.controls[formInput.input.id].patchValue(this.authService.getActiveOrgaLegalName());
      }));
      console.log(this.authService.activeOrganizationRole.observers);
      formInput.form.controls[formInput.input.id].disable();
      return;
    } else if (fullKey === "merlot:creationDate") {
      if (!Object.keys(prefillFields).includes(fullKey)) {
        this.updateDateField(formInput.form.controls[formInput.input.id] as FormControl); // initial update
        this.createDateTimer = setInterval(() => this.updateDateField(formInput.form.controls[formInput.input.id] as FormControl), 1000); // set timer to refresh date field
      }
      formInput.form.controls[formInput.input.id].disable();
    }

    if (!Object.keys(prefillFields).includes(fullKey)) {
      return;
    }

    formInput.form.controls[formInput.input.id].patchValue(this.unpackValueFromField(prefillFields[fullKey]));
    if (prefillFields[fullKey] instanceof Object && Object.keys(prefillFields[fullKey]).includes("disabled") && prefillFields[fullKey]["disabled"]) {
      formInput.form.controls[formInput.input.id].disable();
    }
  }

  processExpandedField(expandedField: ExpandedFieldsComponent, prefillFields: any) {
    if (expandedField === undefined || prefillFields === undefined) {
      return;
    }

    let parentKey = expandedField.input.prefix + ":" + expandedField.input.key;
    if (!Object.keys(prefillFields).includes(parentKey)) {
      return;
    }
    // create more inputs for each prefill field after the first one
    let updatedInput = false;
    for (let i = expandedField.inputs.length; i < prefillFields[parentKey].length; i++) {
      expandedField.addInput();
      updatedInput = true;
    }
    for (let i = expandedField.inputs.length; i > prefillFields[parentKey].length; i--) {
      expandedField.deleteInput(-1);
      updatedInput = true;
    }

    // if we created new inputs, wait for changes
    if (updatedInput) {
      let formInputSub = expandedField.formInputViewChildren.changes.subscribe(_ => {
        this.processExpandedFieldChildrenFields(expandedField, prefillFields);
        formInputSub.unsubscribe();
      });
      let expandedFieldSub = expandedField.expandedFieldsViewChildren.changes.subscribe(_ => {
        this.processExpandedFieldChildrenFields(expandedField, prefillFields);
        expandedFieldSub.unsubscribe();
      });
      let formArraySub = expandedField.formArrayViewChildren.changes.subscribe(_ => {
        this.processExpandedFieldChildrenFields(expandedField, prefillFields);
        formArraySub.unsubscribe();
      });
    } else { //otherwise just start immediately
      this.processExpandedFieldChildrenFields(expandedField, prefillFields);
    }
  }

  processExpandedFieldChildrenFields(expandedField: ExpandedFieldsComponent, prefillFields: any) {
    let parentKey = expandedField.input.prefix + ":" + expandedField.input.key;

    // since we are always working with a list of inputs, we need to adapt to that in the prefill as well (even if it is just one element)
    if (!(prefillFields[parentKey] instanceof Array)) {
      prefillFields[parentKey] = [prefillFields[parentKey]];
    }

    let i = 0;
    for (let input of expandedField.inputs) {
      console.log(expandedField);
      if (prefillFields[parentKey][i] instanceof Object && Object.keys(prefillFields[parentKey][i]).includes("overrideName")) {
        input.name = prefillFields[parentKey][i]["overrideName"];
      } else if (parentKey === "gax-trust-framework:termsAndConditions") {
        input.name = "Serviceangebotsspezifische Geschäftsbedingungen";
      }
      for (let cf of input.childrenFields) {
        this.processFormInput(expandedField.formInputViewChildren.find(f => f.input.id === cf.id), prefillFields[parentKey][i]);
        this.processExpandedField(expandedField.expandedFieldsViewChildren.find(f => f.input.id === cf.id), prefillFields[parentKey][i]);
        this.processFormArray(expandedField.formArrayViewChildren.find(f => f.input.id === cf.id), prefillFields[parentKey][i]);
      }
      i += 1;
    }
  }


  private unpackValueFromField(field) {
    if (field instanceof Array) {
      let unpackedArray = []
      for (let f of field) {
        unpackedArray.push(this.unpackValueFromField(f));
      }
      return unpackedArray;
    } else if (!(field instanceof Object)) {
      return field;
    } else if ("@value" in field) {
      // patch 0 fields to be actually filled since they are regarded as null...
      if (field["@value"] === 0) {
        return "0";
      }
      return field["@value"]
    } else if ("@id" in field) {
      return field["@id"]
    }
  }

}
