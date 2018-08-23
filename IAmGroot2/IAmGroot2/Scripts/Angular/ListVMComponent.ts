/// <amd-module name="/Scripts/Angular/ListVMComponent" />

import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';
import { IVMSpecifications, IStateMachine, IVMSpec } from './IVMSpecifications';

@Component({
    selector: 'listVMComponent',
    templateUrl: '/Scripts/Angular/ListVMTemplate.html'
})
export class ListVMComponent {
    apiURL = 'https://vmvendingmachineapi.cloudandinnovation.com/listvms';
    apiKey = 'BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV';
    //stateMachines:  IStateMachine[];
    vmSpecification: IVMSpecifications;
    testDataAny: any;


    constructor() {
        let _me = this;
        this.getWithFetch(this.apiURL, this.apiKey)
            .then(function (data) {
                _me.testDataAny = data;
                _me.vmSpecification = data;
                console.log(data);
                _me.vmSpecification = data;
            })
            .catch(message => console.error(message));
        }      

    //Reid's second suggestion
    getWithFetch(url, key) {
        // Default options are marked with *
        return fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "x-api-key": "BPfPDQgjJN2zGDDYFvdUp3oRXgW2TlKy8SpDdeIV",
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer" // no-referrer, *client

        })
            .then(response => response.json()); // parses response to JSON
    }

}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        ListVMComponent
    ],
    entryComponents: [ListVMComponent],
    bootstrap: [ListVMComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class LoginModule { }
platformBrowserDynamic().bootstrapModule(LoginModule);