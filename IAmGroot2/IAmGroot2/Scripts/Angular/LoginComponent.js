var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("/Scripts/Angular/LoginComponent", ["require", "exports", "@angular/core", "@angular/platform-browser", "@angular/platform-browser-dynamic", "@angular/http"], function (require, exports, core_1, platform_browser_1, platform_browser_dynamic_1, http_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginComponent = (function () {
        function LoginComponent() {
            this.name = 'Angular2 - Jackie';
        }
        LoginComponent = __decorate([
            core_1.Component({
                selector: 'loginComponent',
                templateUrl: '/Scripts/Angular/LoginComponent.html'
            }),
            __metadata("design:paramtypes", [])
        ], LoginComponent);
        return LoginComponent;
    }());
    exports.LoginComponent = LoginComponent;
    var LoginModule = (function () {
        function LoginModule() {
        }
        LoginModule = __decorate([
            core_1.NgModule({
                imports: [
                    platform_browser_1.BrowserModule,
                    http_1.HttpModule
                ],
                declarations: [
                    LoginComponent
                ],
                entryComponents: [LoginComponent],
                bootstrap: [LoginComponent],
                providers: [{ provide: Window, useValue: window }]
            })
        ], LoginModule);
        return LoginModule;
    }());
    exports.LoginModule = LoginModule;
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(LoginModule);
});
//# sourceMappingURL=LoginComponent.js.map