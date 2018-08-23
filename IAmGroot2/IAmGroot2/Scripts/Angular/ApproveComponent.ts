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
    constructor(@Inject(ElementRef) elm: ElementRef)
    {
        this.activityToken = elm.nativeElement.getAttribute('activityToken');
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