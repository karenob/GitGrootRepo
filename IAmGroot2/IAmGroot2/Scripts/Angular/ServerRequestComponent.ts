/// <amd-module name="/Scripts/Angular/ServerRequestComponent" />
import {
    WindowOverlayComponent, QueryList, Inject, ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormsModule, Validators
} from './SWBC.Components';
import { ViewChildren } from '@angular/core';
import { NgModule, Component } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';

@Component({
    selector: 'serverRequestComponent',
    templateUrl: '/Scripts/Angular/ServerRequestTemplate.html'
})
export class ServerRequestComponent {
    @ViewChildren(WindowOverlayComponent) windowOverlayComponents: QueryList<WindowOverlayComponent>;

    windowOverlayComponent: WindowOverlayComponent;
    constructor(@Inject(Window) private window: any) {
       
    }
    

    private showConfirmationModal() {
        this.windowOverlayComponent.show();
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
        WindowOverlayComponent
    ],
    entryComponents: [ServerRequestComponent],
    bootstrap: [ServerRequestComponent],
    providers: [{ provide: Window, useValue: window }]
})
export class ServerRequestModule { }
platformBrowserDynamic().bootstrapModule(ServerRequestModule);