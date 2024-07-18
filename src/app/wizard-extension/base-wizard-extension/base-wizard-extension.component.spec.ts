/*
 *  Copyright 2024 Dataport. All rights reserved. Developed as part of the MERLOT project.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseWizardExtensionComponent } from './base-wizard-extension.component';

describe('BaseWizardExtensionComponent', () => {
  let component: BaseWizardExtensionComponent;
  let fixture: ComponentFixture<BaseWizardExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseWizardExtensionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseWizardExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
