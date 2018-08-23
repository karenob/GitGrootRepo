﻿/// <amd-module name="/Scripts/Angular/ServerRequestComponent" />
import {
    AjaxService, OverlayComponent, Savable, TooltipComponent, TwoWayListComponent, platformBrowserDynamic, QueryList,
    StepComponent, StepMenuComponent, ValidationDirective, BrowserModule, HttpModule, Component, ElementRef, Inject, NgModule, ViewChild,
    ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormsModule, Validators, MaskDirective, DatePickerComponent, AddressComponent,
    FieldDetailComponent, AddressDetailComponent
} from './SWBC.Components';
import { ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'serverRequestComponent',
    templateUrl: '/Scripts/Angular/ServerRequestTemplate.html'
})
export class ServerRequestComponent extends Savable {
    serverType: any;
    list2: any;
    compliance: any;
    selectedCompliance = "";
    purpose: any;
    selectedServerType = "";
    selectedList2 = "";
    serverEnvironment: any;
    selectedServerEnvironment = "";
    primaryDrive: any;
    selectedPrimaryDrive = "";
    serverOS: any;
    selectedServerOS = "";
    ServerRequestForm: FormGroup;
    showMessage = false;
    emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}';
    selectedSecondaryDesc = "";
    selectedServerTypeDesc = "";
    selectedList2Desc = "";
    selectedServerEnvironmentDesc = "";
    selectedServerOSDesc = "";
    selectedPrimaryDriveDesc = "";
    selectedComplianceDesc = "";

    constructor(@Inject(Window) private window: any,
        private formBuilder: FormBuilder,
        private ajax: AjaxService, ) {
        super();
        this.createForm();
    }

    private createForm() {
        this.serverType = [
            { Description: '--Select--', Value: '' },
            { Description: 'AWS', Value: 'AWS' },
            { Description: 'Azure', Value: 'AZURE' }

        ];
        this.compliance = [
            { Description: '--Select--', Value: '' },
            { Description: 'Yes', Value: 'Y' },
            { Description: 'No', Value: 'N' }

        ];
        this.list2 = [
            { Description: '--Select--', Value: '' },
            { Description: 'Tiny: 2 CPUs, 4GB RAM', Value: 't2.medium' },
            { Description: 'Small: 2 CPUs, 8GB RAM', Value: 't2.large' },
            { Description: 'Medium: 4 CPUs, 16GB RAM', Value: 't2.xlarge' },
            { Description: 'Large: 8 CPUs, 32GB RAM', Value: 't2.2xlarge' }

        ];

        this.serverEnvironment = [
            { Description: '--Select--', Value: '' },
            { Description: 'Dev', Value: 'D' },
            { Description: 'Unit Test', Value: 'U' },
            { Description: 'QA', Value: 'QA' },
            { Description: 'Beta', Value: 'B' },
            { Description: 'Prod', Value: 'P' }
        ];

        this.purpose = [
            { Description: '--Select--', Value: '' },
            { Description: '4GB', Value: '4GB' },
            { Description: '8GB', Value: '8GB' },
            { Description: '64GB', Value: '64GB' }
        ];

        this.primaryDrive = [
            { Description: '--Select--', Value: '' },
            { Description: '72GB', Value: '72GB' },
            { Description: '127GB', Value: '127GB' }
        ];

        this.serverOS = [
            { Description: '--Select--', Value: '' },
            { Description: 'Windows Server 2012 R2', Value: 'Windows2012R2' },
            { Description: 'Windows Server 2016', Value: 'Windows2016' },
            { Description: 'Linux 6.0', Value: 'Linux6.0' },
            { Description: 'Linux 7.0', Value: 'Linux7.0' }
        ];

        this.ServerRequestForm = this.formBuilder.group({
            ServerType: new FormControl("", Validators.required),
            List2: "",
            Purpose: "",
            Compliance: "",
            Environment: "",
            PrimaryDrive: "",
            SecondaryDrive: "",
            ServerOS: "",
            Email: "",
            ApproverEmail: ""
        });
    }

    private onServerTypeChange(selectedServerType) {
        this.selectedServerType = selectedServerType;
        this.serverType.find((item) => {
            if (item.Value === selectedServerType) {
                this.selectedServerTypeDesc = item.Description;
            }
        });
    }
    private onComplianceChange(selectedCompliance) {
        this.selectedCompliance = selectedCompliance;
        this.compliance.find((item) => {
            if (item.Value === selectedCompliance) {
                this.selectedComplianceDesc = item.Description;
            }
        });
    }

    private onList2Change(selectedList2) {
        this.selectedList2 = selectedList2;
        this.list2.find((item) => {
            if (item.Value === selectedList2) {
                this.selectedList2Desc = item.Description;
            }
        });
    }

    private onEnvironmentChange(value) {
        this.selectedServerEnvironment = value;
        this.serverEnvironment.find((item) => {
            if (item.Value === value) {
                this.selectedServerEnvironmentDesc = item.Description;
            }
        });
    }

    private onPrimaryDriveChange(value) {
        this.selectedPrimaryDrive = value;
        this.primaryDrive.find((item) => {
            if (item.Value === value) {
                this.selectedPrimaryDriveDesc = item.Description;
            }
        });
    }
    private onServerOSChange(value) {
        this.selectedServerOS = value;
        this.serverOS.find((item) => {
            if (item.Value === value) {
                this.selectedServerOSDesc = item.Description;
            }
        });
    }

    private showConfirmationModal() {

    }

    private submitForm() {
        if (!super.validate(this.ServerRequestForm, document.querySelector('#ServerRequestForm'))) return;
        let submitCommand = {
            type: "create",
            serverType: this.selectedServerType,
            memoryCpu: this.selectedList2,
            purpose: this.ServerRequestForm.controls.Purpose.value,
            compliance: this.selectedCompliance,
            environment: this.selectedServerEnvironment,
            primaryDrive: this.selectedPrimaryDrive,
            secondaryDrive: this.ServerRequestForm.controls.SecondaryDrive.value,
            serverOS: this.selectedServerOS,
            email: this.ServerRequestForm.controls.Email.value,
            approverEmail: this.ServerRequestForm.controls.ApproverEmail.value
        }

        this.selectedSecondaryDesc = this.ServerRequestForm.controls.SecondaryDrive.value + "GB";

        let _url = 'https://hznl3btqjg.execute-api.us-east-1.amazonaws.com/test/check';
        let headerKey = 'x-api-key:BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV';
        let reidObj = {
            executionArn: "arn:aws:states:us-east-1:238450819322:execution: vmvendingmachine: 1f843ef4-c660-4257-9399-d55011f3d7b8"
        }
        let reidStuff = 'executionArn":"arn:aws:states:us-east-1:238450819322:execution: vmvendingmachine: 1f843ef4-c660-4257-9399-d55011f3d7b8';
        let request = new XMLHttpRequest();
        let responseFromAws: string;

        //Reid's first suggestion
        //function requestOnLoad() {
        //    console.log(this.responseText);
        //}
        //request.addEventListener("load", requestOnLoad);
        //request.open("GET", "https://hznl3btqjg.execute-api.us-east-1.amazonaws.com/test/start");
        //request.setRequestHeader("x-api-key", "BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV");

        //request.send();



        //Have to figure out headers here
        //this.ajax.post(_url, reidObj,
        //    data => {
        //        this.saved();
        //        this.ServerRequestForm.markAsPristine();
        //        setTimeout(() => { this.showMessage = true; }, 1500);  //Delay so the overlay message has time to fade. 
        //    },
        //    (response) => {
        //        this.errored(response);
        //        //this.errorWindowOverlayComponent.show();
        //    }
        //);


        //Or, we can try this:       
        //var headers = new Headers();
        //headers.append('x-api-key', 'BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV');

        //this.http
        //    .post(_url,
        //        submitCommand, {
        //            headers: headers
        //        })
        //    .subscribe(data => {
        //        alert('ok');
        //    }, error => {
        //        console.log(JSON.stringify(error.json()));
        //    });

        this.postWithFetch(_url, headerKey, submitCommand);


        //THis shows the confirmation page
        this.showMessage = true;
    }

    //Reid's second suggestion
    postWithFetch(url, key, data) {
        // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "x-api-key": key,
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => response.json()); // parses response to JSON
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ServerRequestComponent,
        ValidationDirective,
        TooltipComponent,
        FieldDetailComponent
    ],
    entryComponents: [ServerRequestComponent],
    bootstrap: [ServerRequestComponent],
    providers: [AjaxService, { provide: Window, useValue: window }]
})
export class ServerRequestModule { }
platformBrowserDynamic().bootstrapModule(ServerRequestModule);