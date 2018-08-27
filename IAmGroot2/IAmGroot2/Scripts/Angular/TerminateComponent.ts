/// <amd-module name="/Scripts/Angular/TerminateComponent" />

import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Inject, ElementRef, FieldDetailComponent } from './SWBC.Components';

@Component({
    selector: 'terminateComponent',
    templateUrl: '/Scripts/Angular/TerminateTemplate.html'
})
export class TerminateComponent {
    private taskToken: any;
    private _Url = 'https://vmvendingmachineapi.cloudandinnovation.com/terminate';
    private result = false;
    private messageText: string;
    constructor(@Inject(ElementRef) elm: ElementRef)
    {
        this.taskToken = { taskToken: elm.nativeElement.getAttribute('taskToken') };
    }

    terminateVM() {
        let _me = this;
        this.postWithFetch(_me._Url, _me.taskToken)
            .then(function (data) {
                _me.result = data;
                console.log(data)
            })
            .catch(error => console.error(error));

        this.messageText =  "The VM has been successfully terminated.";
            
    }

    postWithFetch(url, data) {
        // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "x-api-key": "sbfaoxwYcYaxcB9MZmpnR69RB0ojM3Ne92KcDN2Q",
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
        TerminateComponent,
        FieldDetailComponent
    ],
    entryComponents: [TerminateComponent],
    bootstrap: [TerminateComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class ApproveModule { }
platformBrowserDynamic().bootstrapModule(ApproveModule);