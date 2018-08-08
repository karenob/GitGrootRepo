System.config({
    "baseURL": "./",
    "defaultJSExtensions": true,
    "map": {
        "@angular": "node_modules/@angular",
        "rxjs": "node_modules/rxjs",
        "reflect-metadata": "node_modules/reflect-metadata"
    },
    "packages": {
        "rxjs": {
            "main": "Rx.js"
        },
        "reflect-metadata": {
            "main": "Reflect.js"
        },
        "@angular/common": {
            "main": "index.js"
        },
        "@angular/compiler": {
            "main": "index.js"
        },
        "@angular/core": {
            "main": "index.js"
        },
        "@angular/http": {
            "main": "index.js"
        },
        "@angular/platform-browser": {
            "main": "index.js"
        },
        "@angular/platform-browser-dynamic": {
            "main": "index.js"
        },
        "@angular/platform-server": {
            "main": "index.js"
        },
        "@angular/forms": {
            "main": "index.js"
        },
        "@angular/router": {
            "main": "index.js"
        }
    },
    "paths": {
        "node_modules*": "node_modules/*"
    }
});