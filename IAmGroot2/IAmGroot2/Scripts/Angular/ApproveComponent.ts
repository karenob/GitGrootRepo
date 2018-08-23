/// <amd-module name="/Scripts/Angular/ApproveComponent" />

import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';

@Component({
    selector: 'approveComponent',
    templateUrl: '/Scripts/Angular/ApproveComponent.html'
})
export class ApproveComponent {
    constructor() { }

    name: string = 'Angular2 - Jackie';

}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        ApproveComponent
    ],
    entryComponents: [ApproveComponent],
    bootstrap: [ApproveComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class ApproveModule { }
platformBrowserDynamic().bootstrapModule(ApproveModule);