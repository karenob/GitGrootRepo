/// <amd-module name="/Scripts/Angular/ApproveComponent" />

import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Inject, ElementRef, FieldDetailComponent } from './SWBC.Components';



@Component({
    selector: 'approveComponent',
    templateUrl: '/Scripts/Angular/ApproveTemplate.html'
})
export class ApproveComponent {
    private activityToken: string;
    private apiURL = "https://vmvendingmachineapi.cloudandinnovation.com/approve";
    apiKey = 'BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV';
    submitCommand: any;
    result = false;
    messageText = "";

    

    constructor(@Inject(ElementRef) elm: ElementRef)
    {
        this.activityToken = elm.nativeElement.getAttribute('activityToken');
    }


    approve() {
        this.submitCommand = {
            activityToken: this.activityToken,
            approved: true
        }
        let _me = this;
        //this.postWithFetch(_me.apiURL, _me.apiKey, _me.submitCommand)
        //    .then(function (data) {
        //        _me.result = data;
        //        console.log(data)
        //    })

        _me.messageText = "The server request has been approved."
        _me.result = true;
           // .catch(error => console.error(error));
    }

    deny() {
        this.submitCommand = {
            activityToken: this.activityToken,
            approved: false
        }
        let _me = this;
        //this.postWithFetch(_me.apiURL, _me.apiKey, _me.submitCommand)
        //    .then(function (data) {
        //        _me.result = data;
        //        console.log(data)
        //    })
        _me.messageText = "The server request has been denied."
        _me.result = true;
           // .catch(error => console.error(error));
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
            "x-api-key": "BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV",
            "Content-Type": "application/json; charset=utf-8",
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
        BrowserModule
      
    ],
    declarations: [
        ApproveComponent,
        FieldDetailComponent
    ],
    entryComponents: [ApproveComponent],
    bootstrap: [ApproveComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class ApproveModule { }
platformBrowserDynamic().bootstrapModule(ApproveModule);