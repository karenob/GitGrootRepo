/// <amd-module name="/Scripts/Angular/LoginComponent" />

import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';

@Component({
    selector: 'loginComponent',
    templateUrl: '/Scripts/Angular/LoginComponent.html'
})
export class LoginComponent {
    constructor() { }

    name: string = 'Angular2 - Jackie';

}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        LoginComponent
    ],
    entryComponents: [LoginComponent],
    bootstrap: [LoginComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class LoginModule { }
platformBrowserDynamic().bootstrapModule(LoginModule);