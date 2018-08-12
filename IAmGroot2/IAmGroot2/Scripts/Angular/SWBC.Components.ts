/// <amd-module name="/Scripts/Angular/SWBC.Components" />

/** Following is a list of base code from which these directives and component are built:
        1) DragDropDirective, DragDropContainerDirecive are built from 'ng2-dnd' source code, For more details see: https://github.com/akserg/ng2-dnd
 */

declare var jQuery, swbc;

import {
    Input, Component, NgModule, Output, Host, EventEmitter, NgZone, ContentChildren, QueryList, forwardRef, Directive, OnChanges, ElementRef,
    AfterContentInit, ChangeDetectionStrategy, AfterViewInit, Injectable, SimpleChange, ViewChild, OnInit, HostListener, Pipe, PipeTransform,
    ChangeDetectorRef, OnDestroy, ContentChild, Renderer, SimpleChanges, Inject, WrappedValue, AfterViewChecked
} from '@angular/core';
import {
    NgForm, FormsModule, FormControl, FormArray, AbstractControl, ValidatorFn, FormGroup, NG_VALIDATORS, Validator, Validators,
    ControlValueAccessor, NG_VALUE_ACCESSOR, SelectMultipleControlValueAccessor
} from '@angular/forms';
import { DomSanitizer, EventManager, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AsyncPipe } from '@angular/common';
import { Observable, Observer, Subscription, Subscriber, Subject, BehaviorSubject, ConnectableObservable } from 'rxjs/Rx';
import { Subscribable } from "rxjs/Observable";
import { ISubscription } from "rxjs/Subscription";
import { toSubscriber } from 'rxjs/util/toSubscriber';

export {
    Input, Component, NgModule, Inject, Injector, Output, NgZone, Host, EventEmitter, ContentChildren, QueryList, forwardRef, Directive, OnChanges,
    ElementRef, AfterContentInit, AfterViewInit, Injectable, SimpleChange, ViewChild, OnInit, HostListener, Pipe, PipeTransform, ChangeDetectionStrategy,
    ChangeDetectorRef, OnDestroy, TemplateRef, ContentChild, HostBinding, KeyValueDiffer, KeyValueDiffers, SkipSelf, Renderer, IterableDiffer,
    ViewEncapsulation, SimpleChanges, ViewContainerRef, DoCheck
} from '@angular/core';
export { CommonModule } from '@angular/common';
export {
    NgForm, FormsModule, FormBuilder, FormControl, ReactiveFormsModule, FormArray,
    AbstractControl, ValidatorFn, FormGroup, NG_VALIDATORS, Validator, Validators
} from '@angular/forms';
export { Http, Response, Headers, RequestOptions } from '@angular/http';
export { Observable } from 'rxjs/observable';
export { Observer } from 'rxjs/observer';
export { HttpModule } from '@angular/http';
export { BrowserModule, DomSanitizer } from '@angular/platform-browser';
export { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
export { BehaviorSubject } from 'rxjs/BehaviorSubject';
export { Subscription } from 'rxjs/Subscription';

/**
 * Constant values that do not change
 */
const Constants = {
    PortalHeaderHeight: 105
}

/**
* Marks a method as obsolete which will generate a console warning.
*/
function MethodObsolete(message: string = '{name} is obsolote.') {
    return (instance, name, descriptor) => {
        var original = descriptor.value;
        var localMessage = message.replace('{name}', name);

        descriptor.value = function () {
            console.warn(localMessage);
            return original.apply(instance, arguments);
        };

        return descriptor;
    };
}

/**
* Drag drop event arg, that is, the argument that's sent as part of emitting drag/drop event.
*/
export interface DragDropData {
    dragData: any;
    mouseEvent: MouseEvent;
}

/**
 * List item model for TwoWayListComponent.
 */
export class TwoWayListItem {
    uuid: string;
    Id: number;
    Name: string;
    IsRelated: boolean = false;
    Selected: boolean = false;
    IsFiltered: boolean = false;
}

/**
 * Item model for VirtualScrollComponent
 */
export class VirtualScrollItem {
    items: any[] = [];
    offsets: number[];
    index: number;
}

/**
 * List item data model for AlertsComponent.
 */
export class AlertItem {
    AccountId: number;
    Account: string;
    Name: string;
    Detail: string;
    Url: string;
    ApplicationName: string;
    AlertAfterDateTime: string;
    Status: string;
    ApplicationId: number;
}

/**
 * Represents a DOM element's position.
 */
export class Position {
    top: number;
    left: number;
}

/**
 * Represents a DOM element's dimensions.
 */
export class Dimension {
    width: number;
    height: number;
}

/**
 * Represents a rectangular rendered site for a DOM element.
 */
export class Site {
    position: Position;
    dimension: Dimension
}

/**
 * Base class for a savable component.
 */
export class Savable {
    @Input() form: FormGroup;

    isSaving: boolean = false;
    isSaved: boolean = false;
    isError: boolean = false;
    serverError: string;

    saving() {
        this.isSaving = true;
        this.isSaved = false;
    }

    saved() {
        this.isSaved = true;
        this.isSaving = false;
        this.serverError = undefined;

        setTimeout(() => {
            this.isSaved = false;
            this.isSaving = false;

            if (this.form) {
                this.form.markAsPristine({ onlySelf: false });
                this.form.markAsUntouched({ onlySelf: false });
            }
        }, 1000);
    }

    errored(response: Response = undefined) {
        this.isError = true;
        this.isSaved = false;
        this.isSaving = false;
        let errorLabel: string = '  Error code: ';

        if (response || typeof response === 'string') {
            let jsonResponse = (typeof response === 'string') ? JSON.parse(response) : response.json();

            //Response body should contain Id and a Messages array.  Id is the guid logged in CoreLogging and Messages array 
            //contains list of generic or user readable message(s) to display to user.
            if (jsonResponse.Messages && jsonResponse.Messages.length > 0) {
                this.serverError = jsonResponse.Messages.join(' ');
                if (jsonResponse.Id && jsonResponse.Id.length > 0) {
                    this.serverError = this.serverError.concat(errorLabel.concat(jsonResponse.Id));
                }
            }
        }

        setTimeout(() => {
            this.isError = false;
            this.isSaved = false;
            this.isSaving = false;
        }, 1000);
    }

    sleep(seconds) {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) { }
    }

    resetValues(form: any, tempModel: string) {
        form = form.form || form;

        var model = JSON.parse(tempModel);

        for (var control in form.controls) {
            var myControl = form.controls[control];
            myControl.markAsDirty(false);
            myControl.markAsUntouched({ onlySelf: false });
        }

        this.serverError = undefined;

        form.markAsPristine({ onlySelf: false });

        return model;
    }

    reset(form: FormGroup, defaults: any) {
        form.reset(defaults);
        this.serverError = undefined;
    }

    validate(form: any, htmlContainer: any = undefined) {
        var isValid = Helpers.formRecursiveValidate(form);

        if (!isValid && htmlContainer) {
            let parentDialog = Helpers.domGetClosestAncestor(htmlContainer, '.modal-body,.modal-dialog');

            if (!parentDialog) {
                let firstInvalidControl: any = htmlContainer.querySelector('input.ng-invalid,select.ng-invalid,textarea.ng-invalid');

                if (firstInvalidControl && firstInvalidControl.focus) {
                    let position = Helpers.domGetElementPosition(htmlContainer);

                    //This is to accomodate page scroll for fixed top header on every application
                    //The height of that is roughly 105px
                    scrollTo(position.left, position.top - 115);

                    firstInvalidControl.focus();
                }
            }
        }

        return isValid;
    }
}

/**
 * Collection of utility methods for DOM manipulation and Angular interactions.
 */
export class Helpers {
    private static cache: any = {};

    /**
     * Set a css class on a DOM element.
     * @param domElement DOM element reference on which to set the css class.
     * @param className String name of the css class.
     * @param remove Whether to remove the css class instead of adding it.
     */
    public static domSetClass(domElement, className: string, remove = false) {
        let classes = domElement.getAttribute('class');

        if (!remove) { domElement.setAttribute('class', classes + ' ' + className); }
        else { domElement.setAttribute('class', classes.replace(className, '')); }
    }

    /**
     * Finds a DOM element in hierarchy by traversing from child nodes to parent nodes.
     * @param domStartElement DOM element at which to start the traversing.
     * @param selector Valid DOM selector string to match for finding the DOM element.
     * @param entirePage Whether or not to run the search on entire DOM. Note that this an expensive operation and better be avoided.
     */
    public static domFindElement(domStartElement, selector: string, entirePage = false): any {
        if (entirePage) {
            return document.querySelector(selector);
        }
        else {
            let i = 0;
            let parent = domStartElement.parentElement;
            let htmlElementRef: Element;

            //ten levels of parents are traversed searching for the source element.
            while (!htmlElementRef && parent && i < 10) {
                htmlElementRef = parent.querySelector(selector);
                parent = parent.parentElement;
            }

            return htmlElementRef;
        }
    }

    /**
     * Return current scroll size on the page.
     */
    public static domGetPageScrollSize() {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        var scrollWidth = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var scrollHeight = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

        return { width: scrollWidth, height: scrollHeight };
    }

    /**
     * Returns current viewport size
     */
    public static domGetViewportSize() {
        var viewPortWidth;
        var viewPortHeight;

        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth = window.innerWidth;
            viewPortHeight = window.innerHeight;
        }
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth;
            viewPortHeight = document.documentElement.clientHeight;
        }
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
            viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
        }

        return { width: viewPortWidth, height: viewPortHeight };
    }

    /**
     * Return element position on the page as x and y.
     * @param domElement DOM element for which to find the position.
     */
    public static domGetElementPosition(domElement): Position {
        var box = domElement.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    /**
     * Triggers an event on a DOM element.
     * @param domElement Element on which to trigger an event.
     * @param eventName String representing the name of the event to be triggered.
     * @param bubbles Whether or not to bubble the event through DOM hierarchy.
     * @param cancelable Whether or not this event can be cancelled.
     */
    public static domTriggerEvent(domElement, eventName: string, bubbles = true, cancelable = true): boolean {
        var event = new MouseEvent(eventName, {
            'view': window,
            'bubbles': bubbles,
            'cancelable': cancelable
        });

        return domElement.dispatchEvent(event);
    }

    /**
     * Determines if the HTML element is a text input and returns true, otherwise, returns false.
     */
    public static domIsInputElement(domElement) {
        return domElement.tagName === 'INPUT' || domElement.tagName === 'TEXTAREA';
    }

    /**
     * Get the closest matching ancestor element up the DOM tree.
     * @param domElement Starting element
     * @param selector Valid DOM selector string to match for finding the ancestor element.
     */
    public static domGetClosestAncestor(domElement, selector) {
        var proto: any = Element.prototype;

        // Element.matches() polyfill
        if (!proto.matches) {
            proto.matches =
                proto.matchesSelector ||
                proto.mozMatchesSelector ||
                proto.msMatchesSelector ||
                proto.oMatchesSelector ||
                proto.webkitMatchesSelector ||
                function (s) {
                    let matches = (this.document || this.ownerDocument).querySelectorAll(s);
                    let i = matches.length;

                    while (--i >= 0 && matches.item(i) !== this) { }

                    return i > -1;
                };
        }

        // Get closest match
        while (domElement && domElement !== document) {
            if (domElement.matches(selector)) return domElement;

            domElement = domElement.parentNode;
        }

        return undefined;
    };

    /**
     * Returns outer width and height of an element. This includes the rendered width plus margins.
     * @param domElement A DOM element reference for which to get the dimensions.
     */
    public static domGetElementDimension(domElement): Dimension {
        let returnValue = new Dimension();

        if (!domElement) { return returnValue; }

        if (document.all) {
            returnValue.height =
                parseInt(domElement.currentStyle.height) +
                parseInt(domElement.currentStyle.marginTop, 10) +
                parseInt(domElement.currentStyle.marginBottom, 10);

            returnValue.width =
                parseInt(domElement.currentStyle.width) +
                parseInt(domElement.currentStyle.marginLeft, 10) +
                parseInt(domElement.currentStyle.marginRight, 10);
        }
        else {
            returnValue.height =
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('height')) +
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('margin-top')) +
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('margin-bottom'));

            returnValue.width =
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('width')) +
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('margin-left')) +
                parseInt(document.defaultView.getComputedStyle(domElement, '').getPropertyValue('margin-right'));
        }

        return returnValue;
    }

    /**
     * Returns the scrollbar width according to current OS settings. Returned value can be included in calculations. 
     * Note that multiple invokations will yeild the exact same result as this is a caching function.
     */
    public static domGetScrollbarWidth(): number {
        if (Helpers.cache.scrollbarWidth) { return Helpers.cache.scrollbarWidth; }

        var scrollDiv = document.createElement("div");
        scrollDiv.style.width = '100px';
        scrollDiv.style.height = '100px';
        scrollDiv.style.overflow = 'scroll';
        scrollDiv.style.msOverflowStyle = "scrollbar";
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.top = '-9999px';

        document.body.appendChild(scrollDiv);
        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        Helpers.cache.scrollbarWidth = scrollbarWidth;
        return scrollbarWidth;
    }

    /**
     * Recursively validates an angular2 form object.
     * @param form Reference to form object. Note that this function supports both Reactive and Standard forms.
     */
    public static formRecursiveValidate(form): boolean {
        form = form.form || form;

        if (!form.valid) {
            for (var control in form.controls) {
                var formControl: any = form.controls[control];

                if (formControl instanceof FormGroup) { this.formRecursiveValidate(formControl); }
                else { formControl.markAsTouched({ onlySelf: false }); }
            }

            return false;
        }

        return true;
    }

    /**
     * Return a date object formatted as a string. e.g. 01/01/2017
     * @param dateObject A javascript date object instance.
     */
    public static convertDateToString(dateObject: Date): string {
        var dateString;

        try {
            var date = new Date(dateObject.toDateString());
            dateString = ('0' + (dateObject.getMonth() + 1)).substr(-2) + '/' + ('0' + dateObject.getDate()).substr(-2) + '/' + dateObject.getFullYear();
        }
        catch (err) {
            dateString = undefined;
        }

        return dateString;
    }

    /**
     * Sorts an array of similar objects by using a field defined in each object.
     * @param myArray Array to be sorted.
     * @param isAscending Sorting order.
     * @param getField Lambda function to return a reference for the comparison field.
     */
    public static sortByField(myArray = [], isAscending, getField: (func) => any): any[] {
        var sortedArray: any[];
        sortedArray = myArray.slice(0);

        sortedArray.sort((leftSide, rightSide): number => {
            var left = getField(leftSide);
            var right = getField(rightSide);
            if (left < right) return -1;
            if (left > right) return 1;
            return 0;
        });

        myArray = sortedArray.slice(0);

        if (!isAscending)
            myArray.reverse();

        return myArray;
    }

    /**
     * Gets the value from a cookie, if it exists
     * @param cookieName Name of cookie to retrieve.
     */
    public static getCookie(cookieName: string): string {
        var name = cookieName + '=';
        var ca = decodeURIComponent(document.cookie).split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return '';
    }

    /**
     * Used to compare two object for purpose of copying data from one to another.
     * This method uses specialized logic in comparison making it unsuitable for typical object comparisons.
     * @param sourceObj Object to compare to another.
     * @param compareToObj Object to compare to. This is the object from which the property values should be copied to the source object.
     */
    public static hasEqualPropertyValues(sourceObj: any, compareToObj: any) {
        let sourceProps = Object.getOwnPropertyNames(sourceObj);
        let targetProps = Object.getOwnPropertyNames(compareToObj);

        for (let i = 0; i < sourceProps.length; i++) {
            let sourceValue = sourceObj[sourceProps[i]] || undefined;
            let targetValue = compareToObj[sourceProps[i]] || undefined;

            if (sourceValue instanceof Object) {
                if (!this.hasEqualPropertyValues(sourceValue, targetValue)) {
                    return false;
                }
            }
            else if (compareToObj.hasOwnProperty(sourceProps[i]) && sourceValue !== targetValue) {
                return false;
            }
        }

        return true;
    }

    /**
     * Parses a query string once and caches the values for enhancing performance on subsequent calls for different query string keys.
     * @param key query string key for which to retrieve the value.
     */
    public static getQueryStringVariable(key: string): string {
        function parse(): string {
            if (!Helpers.cache.queryStringNameValues) {
                var query = window.location.search.substring(1);
                Helpers.cache.queryStringNameValues = {};

                var vars = query.split("&");

                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    var value = pair[1];
                    Helpers.cache.queryStringNameValues[pair[0]] = decodeURIComponent(value);
                }
            }

            return Helpers.cache.queryStringNameValues[key];
        }

        return parse();
    }

    /**
     * Returns a comma separated list of querystring keys. This does not contain querystring values, just keys and also is caching.
     */
    public static getQueryStringKeys(): string {
        if (Helpers.cache.queryStringNames) { return Helpers.cache.queryStringNames; }

        var vars = window.location.search;
        var matches = vars.match(/[?|&].+?[=]/g);

        Helpers.cache.queryStringNames = matches ? matches.join(',').replace('?', '').replace(/&/g, '').replace(/=/g, '') : undefined;
        return Helpers.cache.queryStringNames;
    }

    /**
     * Check and return true if an object is type of string
     */
    public static isString(value: any) {
        return typeof value === "string";
    }

    /**
     * Check and return true if an object is type of Function
     */
    public static isFunction(value: any) {
        return typeof value === "function";
    }

    /**
     * Returns a universally unique identifier based on https://www.ietf.org/rfc/rfc4122.txt
     */
    public static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/** Provides a set of helpers to work with numbers. */
export class MathHelpers {
    private static cache: any = {
        autoIncrement: -1
    };

    /** Generates a random number sequence. */
    public static random(): string {
        return Math.random().toString().replace('.', '');
    }

    /** Attempts to parse the value as integer and return it, otherwise, returns undefined. */
    public static parse(value) {
        let valueNumber = parseInt(value);

        if (isNaN(valueNumber)) { return undefined; }

        return valueNumber;
    }

    /** Compares two numbers and returns 1 for a > b, 0 for a == b and -1 for b > a. */
    public static compare(a: number, b: number) {
        if ((!a && !b) || (a === b)) { return 0; }
        if ((!a && b) || (a > b)) { return 1 }
        if ((a && !b) || (a < b)) { return -1; }
    }

    /** Returns an auto incremented number starting with 0. This increments by one with each call and is reset after a page load. */
    public static autoIncrement(): number {
        MathHelpers.cache.autoIncrement = MathHelpers.cache.autoIncrement + 1;
        return MathHelpers.cache.autoIncrement;
    }
}

/**
 * Collections of utility methods that operate on Angular forms.
 */
export class FormHelpers {
    /**
     * Automatically fills a FormGroup object by using the value parameter. This method uses "value" and "form" property names that are matching, in order to fill the form.
       This method will traverse the form hierarchy.
     * @param form FormGroup object to auto fill.
     * @param value Javascript object containing the data to fill the form with.
     * @param existingFormValueTakesPriority Set to false, in order to override existing form values. Note that this will not override form data with null values.
     */
    public static autoFill(form: FormGroup, value: { [key: string]: any }, existingFormValueTakesPriority: boolean = true) {
        if (!value) { return; }

        let props = Object.getOwnPropertyNames(form.controls);

        for (let i = 0; i < props.length; i++) {
            let prop = props[i];
            let control = form.controls[prop];

            if (control instanceof FormGroup) {
                this.autoFill(control, value[prop]);
                continue;
            }

            if (existingFormValueTakesPriority && !control.value && value[prop]) {
                control.setValue(value[prop]);
                control.markAsDirty();
                control.markAsTouched();
            }
            else if (!existingFormValueTakesPriority && value[prop]) {
                control.setValue(value[prop]);
                control.markAsDirty();
                control.markAsTouched();
            }
        }
    }
}

/**
 * Collection of utility methods that format all unformatted values according to SWBC input mask standards.
 */
export class FormatHelpers {
    /**
     * This is useful for switching the precision of a number in string representation.
     * @param value A string value representing a number.
     * @param precision Precision of the float number.
     */
    public static toFixedPrecision(value: string, precision: number = 2): string {
        return value ? parseFloat(value).toFixed(precision) : value;
    }

    /**
     * Formats a number as a phone number according to SWBC input mask standards.
     * @param value Unformatted phone number in string representation.
     */
    public static formatPhoneNumber(value: string): string {
        function format(str) {
            var strDigits = ("" + str).replace(/\D/g, '');
            var m = strDigits.match(/^(\d{3})(\d{3})(\d{4})$/);

            return (!m) ? undefined : m[1] + "-" + m[2] + "-" + m[3];
        }

        return value ? format(value) : value;
    }

    /**
     * Formats an unformatted SSN according to SWBC input mask standards.
     * @param value Unformatted SSN in string representation.
     * @param onlyLastFourDigits There are two SSN input mask representations, hidden and visible SSN.
     */
    public static formatSSN(value: string, onlyLastFourDigits: boolean = true): string {
        function format() {
            var valueRegex = value.match(/(\d{3})[-]+(\d{2})[-]+(\d{4})/);
            return onlyLastFourDigits ? "***-**-" + valueRegex[3] : valueRegex[1] + "-" + valueRegex[2] + "-" + valueRegex[3];
        }

        return value ? format() : value;
    }

    /**
     * Extracts numbers in a string literal and formats them to a date according to SWBC mask input standards.
     * @param value String value containing date digits with or without additional characters.
     * @param format Format string. This allows you to override the format if desired.
     */
    public static extractDate(value: string, format: string = 'MM/dd/yyyy') {
        let dayRegex = '(\\d{1,2})';
        let monthRegex = '(\\d{1,2})';
        let yearRegex = '(\\d{4})';
        let formatRegex = format
            .replace('/', '\/')
            .replace('MM', monthRegex)
            .replace('yyyy', yearRegex)
            .replace('dd', dayRegex);

        return value ? Helpers.convertDateToString(new Date(value.match(formatRegex)[0])) : value;
    }
}

/**
 * Helper methods to work with multiple window communications and logic. Some may have dependency on frame ancestor script and call its functions from inside of angular. 
 */
export class FrameHelpers {
    /**
     * Checks if the current page contains the external-framing.js (it's in portal intermediate page) script and if this page happens to be a child page
     * opened via a parent window/iframe, usually portal intermediate page.If so, it'll invoke a function from the mentioned script and pass the result to the parent window for further processing,
     * otherwise, does nothing.
     */
    public static tryUpdateParentWindow(wasSuccessful: boolean, result: { [key: string]: any }) {
        let win: any = window.opener;

        if (win && win.swbc && win.swbc.framing && win.swbc.framing.external) {
            win.swbc.framing.external.setVerbiageResult(wasSuccessful, result);
        }
    }

    /**
     * Closes current window if it's a child window of another window.
     */
    public static tryCloseChildWindow() {
        let win: any = window;

        if (win && win.swbc && win.swbc.framing && win.swbc.framing && win.swbc.framing.isChildWindow()) {
            win.close();
        }
    }
}

/**
 * Lists all visual effect that are allowed for drag/drop functionality.
 */
export class DragDropEffects {
    public static copy = 'copy';
    public static link = 'link';
    public static move = 'move';
    public static none = 'none';
}

/**
 * Drag image that's created as part of visual effect in drag/drop
 */
export class DragImage {
    constructor(
        public imageElement: string | HTMLElement,
        public x_offset: number = 0,
        public y_offset: number = 0) {
        if (Helpers.isString(this.imageElement)) {
            // Create real image from string source
            let imgScr: string = <string>this.imageElement;
            this.imageElement = new HTMLImageElement();
            (<HTMLImageElement>this.imageElement).src = imgScr;
        }
    }
}

/**
 * Mask translation object used by masking functionality. It holds the mapping of a string mask and its equivalent regular expression pattern and etc...
 */
export class MaskTranslationMap {
    pattern: RegExp;
    fallback: boolean = false;
    optional: boolean = false;
    recursive: boolean = false;
}

/**
 * Mask configurations used by all masking functionalities.
 */
export class MaskOptions {
    placeholder: string;
    mask: string;
    reverse: boolean;
    clearIfNotMatch: boolean;
    byPassKeys: number[];
    selectOnFocus: boolean;
    translations: {
        [key: string]: MaskTranslationMap
    }
}

/**
 * Abstract base calss for drag/drop services.
 */
export abstract class DragDropAbstractBase {
    _elem: HTMLElement;
    _dragHelper: HTMLElement;
    _defaultCursor: string;

    /**
     * Whether the object is draggable. Default is true.
     */
    private _dragEnabled: boolean = false;
    set dragEnabled(enabled: boolean) {
        this._dragEnabled = !!enabled;
        this._elem.draggable = this._dragEnabled;
    }
    get dragEnabled(): boolean {
        return this._dragEnabled
    }

    /**
     * Allows drop on this element
     */
    dropEnabled: boolean = false;
    /**
     * Drag effect
     */
    effectAllowed: string;
    /**
     * Drag cursor
     */
    effectCursor: string;

    /**
     * Restrict places where a draggable element can be dropped. Either one of
     * these two mechanisms can be used:
     *
     * - dropZones: an array of strings that permits to specify the drop zones
     *   associated with this component. By default, if the drop-zones attribute
     *   is not specified, the droppable component accepts drop operations by
     *   all the draggable components that do not specify the allowed-drop-zones
     *
     * - allowDrop: a boolean function for droppable components, that is checked
     *   when an item is dragged. The function is passed the dragData of this
     *   item.
     *   - if it returns true, the item can be dropped in this component
     *   - if it returns false, the item cannot be dropped here
     */
    allowDrop: (dropData: any) => boolean;
    dropZones: string[] = [];

    /**
     * Here is the property dragImage you can use:
     * - The string value as url to the image
     *   <div class="panel panel-default"
     *        dnd-draggable [dragEnabled]="true"
     *        [dragImage]="/images/simpler.png">
     * ...
     * - The DragImage value with Image and optional offset by x and y:
     *   let myDragImage: DragImage = new DragImage("/images/simpler1.png", 0, 0);
     * ...
     *   <div class="panel panel-default"
     *        dnd-draggable [dragEnabled]="true"
     *        [dragImage]="myDragImage">
     * ...
     * - The custom function to return the value of dragImage programmatically:
     *   <div class="panel panel-default"
     *        dnd-draggable [dragEnabled]="true"
     *        [dragImage]="getDragImage(someData)">
     * ...
     *   getDragImage(value:any): string {
     *     return value ? "/images/simpler1.png" : "/images/simpler2.png"
     *   }
     */
    dragImage: string | DragImage | Function;

    cloneItem: boolean = false;

    constructor(elemRef: ElementRef, public _dragDropService: DragDropService, public _config: DragDropConfigurationService, private _cdr: ChangeDetectorRef) {

        this._elem = elemRef.nativeElement;
        //
        // DROP events
        //
        this._elem.ondragenter = (event: Event) => {
            this._onDragEnter(event);
        };
        this._elem.ondragover = (event: DragEvent) => {
            this._onDragOver(event);
            //
            if (event.dataTransfer != null) {
                event.dataTransfer.dropEffect = this._config.dropEffect;
            }

            return false;
        };
        this._elem.ondragleave = (event: Event) => {
            this._onDragLeave(event);
        };
        this._elem.ondrop = (event: Event) => {
            this._onDrop(event);
        };
        //
        // Drag events
        //
        this._elem.ondragstart = (event: DragEvent) => {
            // console.log('ondragstart', event.target);
            this._onDragStart(event);
            //
            if (event.dataTransfer != null) {
                event.dataTransfer.setData('text', '');
                // Change drag effect
                event.dataTransfer.effectAllowed = this.effectAllowed || this._config.dragEffect;
                // Change drag image
                if (this.dragImage) {
                    if (Helpers.isString(this.dragImage)) {
                        (<any>event.dataTransfer).setDragImage(this.createImage(<string>this.dragImage));
                    } else if (Helpers.isFunction(this.dragImage)) {
                        (<any>event.dataTransfer).setDragImage((<Function>this.dragImage)());
                    } else {
                        let img: DragImage = <DragImage>this.dragImage;
                        (<any>event.dataTransfer).setDragImage(img.imageElement, img.x_offset, img.y_offset);
                    }
                } else if (this._config.dragImage) {
                    let dragImage: DragImage = this._config.dragImage;
                    (<any>event.dataTransfer).setDragImage(dragImage.imageElement, dragImage.x_offset, dragImage.y_offset);
                } else if (this.cloneItem) {
                    this._dragHelper = <HTMLElement>this._elem.cloneNode(true);
                    this._dragHelper.classList.add('dnd-drag-item');
                    this._dragHelper.style.position = "absolute";
                    this._dragHelper.style.top = "0px";
                    this._dragHelper.style.left = "-1000px";
                    this._elem.parentElement.appendChild(this._dragHelper);
                    (<any>event.dataTransfer).setDragImage(this._dragHelper, event.offsetX, event.offsetY);
                }
                // Change drag cursor
                if (this._dragEnabled) {
                    this._elem.style.cursor = this.effectCursor ? this.effectCursor : this._config.dragCursor;
                } else {
                    this._elem.style.cursor = this._defaultCursor;
                }
            }
        };
        this._elem.ondragend = (event: Event) => {
            if (this._elem.parentElement && this._dragHelper) {
                this._elem.parentElement.removeChild(this._dragHelper);
            }
            // console.log('ondragend', event.target);
            this._onDragEnd(event);
            // Restore style of dragged element
            this._elem.style.cursor = this._defaultCursor;
        };
    }

    /******* Change detection ******/

    detectChanges() {
        // Programmatically run change detection to fix issue in Safari
        setTimeout(() => {
            this._cdr.detectChanges();
        }, 250);
    }

    private createImage(src: string) {
        let img: HTMLImageElement = new HTMLImageElement();
        img.src = src;
        return img;
    }

    //****** Droppable *******//
    private _onDragEnter(event: Event): void {
        // console.log('ondragenter._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed) {
            // event.preventDefault();
            this._onDragEnterCallback(event);
        }
    }

    private _onDragOver(event: Event) {
        // // console.log('ondragover._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed) {
            // The element is over the same source element - do nothing
            if (event.preventDefault) {
                // Necessary. Allows us to drop.
                event.preventDefault();
            }

            this._onDragOverCallback(event);
        }
    }

    private _onDragLeave(event: Event): void {
        // console.log('ondragleave._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed) {
            // event.preventDefault();
            this._onDragLeaveCallback(event);
        }
    }

    private _onDrop(event: Event): void {
        // console.log('ondrop._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed) {
            if (event.preventDefault) {
                // Necessary. Allows us to drop.
                event.preventDefault();
            }

            if (event.stopPropagation) {
                // Necessary. Allows us to drop.
                event.stopPropagation();
            }

            this._onDropCallback(event);

            this.detectChanges();
        }
    }

    private get _isDropAllowed(): boolean {
        if (this._dragDropService.isDragged && this.dropEnabled) {
            // First, if `allowDrop` is set, call it to determine whether the
            // dragged element can be dropped here.
            if (this.allowDrop) {
                return this.allowDrop(this._dragDropService.dragData);
            }

            // Otherwise, use dropZones if they are set.
            if (this.dropZones.length === 0 && this._dragDropService.allowedDropZones.length === 0) {
                return true;
            }
            for (let i: number = 0; i < this._dragDropService.allowedDropZones.length; i++) {
                let dragZone: string = this._dragDropService.allowedDropZones[i];
                if (this.dropZones.indexOf(dragZone) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    //*********** Draggable **********//

    private _onDragStart(event: Event): void {
        // console.log('ondragstart.dragEnabled', this._dragEnabled);
        if (this._dragEnabled) {
            this._dragDropService.allowedDropZones = this.dropZones;
            // console.log('ondragstart.allowedDropZones', this._dragDropService.allowedDropZones);
            this._onDragStartCallback(event);
        }
    }

    private _onDragEnd(event: Event): void {
        this._dragDropService.allowedDropZones = [];
        // console.log('ondragend.allowedDropZones', this._dragDropService.allowedDropZones);
        this._onDragEndCallback(event);
    }

    //**** Drop Callbacks ****//
    _onDragEnterCallback(event: Event) { }
    _onDragOverCallback(event: Event) { }
    _onDragLeaveCallback(event: Event) { }
    _onDropCallback(event: Event) { }

    //**** Drag Callbacks ****//
    _onDragStartCallback(event: Event) { }
    _onDragEndCallback(event: Event) { }
}

/**
 * Abstract base class for base masking requirements of HTML elements.
 */
export abstract class MaskDirectiveAbstractBase {
    protected controlRef: FormControl;
    protected isInput: boolean;

    private maskServicePrivate: MaskService;
    protected set maskService(value: MaskService) {
        this.maskServicePrivate = value;

        if (this.isInput) { this.initializeInputElement(); }
    }
    protected get maskService(): MaskService {
        return this.maskServicePrivate;
    }

    private currentKeyCode: number;

    constructor(protected element: ElementRef) {
        this.isInput = Helpers.domIsInputElement(this.element.nativeElement);

        if (!this.isInput &&
            this.element.nativeElement.tagName !== 'DIV' &&
            this.element.nativeElement.tagName !== 'P' &&
            this.element.nativeElement.tagName !== 'SPAN' &&
            this.element.nativeElement.tagName !== 'LABEL') {

            throw Error('Invalid Mask usage. Only <div>, <p>, <span> and <label> are supported.');
        }
    }

    getUnmaskedValue() {
        return this.maskService.getUnmaskedValue();
    }

    getMaskedValue(value) {
        return this.maskService.getMaskedValue(value);
    }

    protected setValue(value: any, onChange: (value: any) => any) {
        if (this.isInput) {
            var caretPosition = this.getCaretPosition();
            var currentValueLength = value ? value.length : '';
            var shouldChangeCaret = caretPosition < currentValueLength;

            this.maskService.maskInputValue(value, (maskedValue) => {
                this.setControlValue(maskedValue, onChange);
                this.setDisplayValue(maskedValue);

                if (shouldChangeCaret) {
                    this.setCaretPosition(caretPosition);
                }
            });
        }
        else {
            this.setStaticValue(value);
        }
    }

    protected setControlValue(value: any, onChange: (value: any) => any) {
        if (value == this.controlRef.value) { return; }

        //defaults value for a control
        if (!onChange) {
            this.controlRef.setValue(value ? value : null, { emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false });
            this.controlRef.markAsPristine();
            this.controlRef.markAsUntouched();
        }
        //modifies value of a control
        else {
            onChange(value);
        }
    }

    protected setDisplayValue(value: any) {
        if (value == this.element.nativeElement.value) { return; }

        this.element.nativeElement.value = value ? value : '';
    }

    protected setStaticValue(value: any) {
        this.maskService.maskStaticValue(value, (maskedValue) => {
            this.element.nativeElement.innerText = maskedValue;
        });
    }

    protected activated(e: Event, onChange: (value: any) => any) {
        this.maskService.tryClear(this.controlRef.value, () => {
            this.setValue(null, onChange);
        });
        this.tryHighlightText();
    }

    protected deactivated(e: Event, onChange: (value: any) => any, onTouch: () => any) {
        this.maskService.tryClear(this.controlRef.value, () => {
            this.setValue(null, onChange);
        });
        onTouch();
    }

    protected keyboardKeyPress(e: KeyboardEvent) {
        this.currentKeyCode = e.keyCode || e.which;
    }

    private initializeInputElement() {
        if (this.maskService.maskOptions.placeholder) { this.element.nativeElement.setAttribute('placeholder', this.maskService.maskOptions.placeholder); }

        this.element.nativeElement.setAttribute('autocomplete', 'off');
    }

    private getCaretPosition() {
        var doc: any = document;

        try {
            var sel;
            var pos = 0;
            var dSel: any = doc.selection;
            var cSelStart = this.element.nativeElement.selectionStart;

            if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                sel = dSel.createRange();
                sel.moveStart('character', -this.element.nativeElement.value.length);
                pos = sel.text.length;
            }
            else if (cSelStart || cSelStart === 0) {
                pos = cSelStart;
            }

            return pos;
        } catch (e) { }
    }

    private setCaretPosition(positionIndex: number) {
        if (!(this.currentKeyCode === 8 || this.currentKeyCode === 46)) {
            //backspace
            if (this.currentKeyCode == 50) { positionIndex -= 1; }
        }

        try {
            if (this.element.nativeElement == document.activeElement) {
                var range;

                if (this.element.nativeElement.setSelectionRange) {
                    this.element.nativeElement.focus();
                    this.element.nativeElement.setSelectionRange(positionIndex, positionIndex);
                } else {
                    range = this.element.nativeElement.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', positionIndex);
                    range.moveStart('character', positionIndex);
                    range.select();
                }
            }
        } catch (e) { }
    }

    private tryHighlightText() {
        if (this.isInput && this.maskService.maskOptions.selectOnFocus === true) {
            this.element.nativeElement.select();
        }
    }
}

/**
 * Collection of HTTP and Ajax interaction methods.
 */
@Injectable()
export class AjaxService {
    logoutUrl = '/auth/logout';
    refreshUrl = '/auth/refresh';

    constructor(private http: Http) { }

    post(url: string, data: any, successCallback: Function, failureCallback: Function) {
        this.jsonPost(url, data, successCallback, failureCallback);
    }

    upload(url: string, files: File[], successCallback: Function, failureCallback: Function, successCode: number = 200) {
        let formData: FormData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("uploads[]", files[i], files[i].name);
        }
        this.uploadFunc(url, formData, successCallback, failureCallback, successCode);
    }

    customUpload(url: string, customFiles: any[], successCallback: Function, failureCallback: Function, successCode: number = 200, data: any = null) {
        let formData: FormData = new FormData();

        for (let i = 0; i < customFiles.length; i++) {
            formData.append("uploads[]", customFiles[i].file, customFiles[i].id + '_' + customFiles[i].file.name);
        }

        if (data !== null) {
            formData.append("data", JSON.stringify(data));
        }

        this.uploadFunc(url, formData, successCallback, failureCallback, successCode);
    }

    private uploadFunc(url: string, formData: FormData, successCallback: Function, failureCallback: Function, successCode: number = 200) {
        let self = this;
        let csrf: any = document.querySelector('input[name="__RequestVerificationToken"],input[id="__RequestVerificationToken"]');
        let retry = 0;

        function upload(/*observer: Observer<number>*/) {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === successCode) {
                        if (successCallback) { successCallback(xhr.responseText); }
                    }
                    else if (xhr.status === 401 && retry < 1) {
                        retry += 1;
                        self.checkTokenRefresh(upload);
                    }
                    else {
                        if (failureCallback) { failureCallback(xhr.response); }
                    }

                    //observer.complete();
                }
            };

            xhr.upload.onprogress = (event) => {
                let fileUploadProgress = Math.round(event.loaded / event.total * 100);
                //observer.next(fileUploadProgress);
            };

            xhr.open('POST', url, true);

            if (csrf) { xhr.setRequestHeader('__RequestVerificationToken', csrf.value); }
            xhr.setRequestHeader('Authorization', 'Bearer ' + self.getToken());

            xhr.send(formData);
        }

        upload();

        //Observable.create(upload); //figure out a way to call the created observable automatically
    }

    get(url: string, data: any, successCallback: Function, failureCallback: Function) {
        let self = this;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let csrf: any = document.querySelector('input[name="__RequestVerificationToken"],input[id="__RequestVerificationToken"]');
        if (csrf) { headers.set('__RequestVerificationToken', csrf.value); }
        if (data) { url += '?' + this.serialize(data, null); }
        let retry = 0;

        function get() {
            headers.set('Authorization', 'Bearer ' + self.getToken());
            self.http.get(url, new RequestOptions({ headers: headers })).subscribe(
                response => {
                    if (successCallback) { successCallback(response.text()); }
                },
                response => {
                    if (response.status == 401 && retry < 1) {
                        retry += 1;
                        self.checkTokenRefresh(get);
                    }
                    else {
                        console.error(response);
                        if (failureCallback) { failureCallback(response); }
                    }
                }
            );
        }

        get();
    }

    delete(url: string, successCallback: Function, failureCallback: Function) {
        let self = this;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let csrf: any = document.querySelector('input[name="__RequestVerificationToken"],input[id="__RequestVerificationToken"]');
        if (csrf) { headers.set('__RequestVerificationToken', csrf.value); }
        let retry = 0;

        function Delete() {
            headers.set('Authorization', 'Bearer ' + self.getToken());

            self.http.delete(url, new RequestOptions({ headers: headers })).subscribe(
                response => {
                    if (successCallback) { successCallback(response.text()); }
                },
                response => {
                    if (response.status === 401 && retry < 1) {
                        retry += 1;
                        self.checkTokenRefresh(Delete);
                    }
                    else {
                        console.error(response);
                        if (failureCallback) { failureCallback(response); }
                    }
                }
            );
        }

        Delete();
    }

    private getToken() {
        return Helpers.getCookie('token');
    }

    private serialize(obj, prefix) {
        var uriString = [];

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                var key = prefix ? prefix + "[" + encodeURIComponent(property) + "]" : property;
                var value = obj[property];
                uriString.push(typeof value == "object" ? this.serialize(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }
        }

        return uriString.join("&");
    }

    private checkTokenRefresh(successCallback) {
        var self = this;
        var pathArray = location.href.split('/');
        var basePath = pathArray[0] + '//' + pathArray[2];
        var iframe = document.createElement('iframe');
        var tokenRefreshStarted = true;
        var win: any = window;

        function tokenRefreshed(success) {
            document.body.removeChild(iframe);

            if (success && successCallback) { successCallback(); }
            else if (!success && tokenRefreshStarted) { window.location.href = self.logoutUrl; }

            document.body.removeChild(iframe);
            tokenRefreshStarted = false;
        }

        win.tokenRefreshed = tokenRefreshed;
        iframe.onload = function () { tokenRefreshed(false); };
        iframe.src = basePath + this.refreshUrl;
        document.body.appendChild(iframe);
    }

    private jsonPost(url: string, data: any, successCallback: Function, failureCallback: Function) {
        let self = this;
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let csrf: any = document.querySelector('input[name="__RequestVerificationToken"],input[id="__RequestVerificationToken"]');
        if (csrf) { headers.set('__RequestVerificationToken', csrf.value); }
        let retry = 0;

        function post() {
            headers.set('Authorization', 'Bearer ' + self.getToken());
            self.http.post(url, body, new RequestOptions({ headers: headers })).subscribe(
                response => {
                    if (successCallback) { successCallback(response.text()); }
                },
                response => {
                    if (response.status == 401 && retry < 1) {
                        retry += 1;
                        self.checkTokenRefresh(post);
                    }
                    else {
                        console.error(response);
                        if (failureCallback) { failureCallback(response); }
                    }
                }
            );
        }

        post();
    }
}

/**
 * Configuration service to be passed to drag/drop directives in order to manipulate visual effects and such.
 */
@Injectable()
export class DragDropConfigurationService {
    public onDragStartClass: string = "dnd-drag-start";
    public onDragEnterClass: string = "dnd-drag-enter";
    public onDragOverClass: string = "dnd-drag-over";
    public onSortableDragClass: string = "dnd-sortable-drag";

    public dragEffect: string = DragDropEffects.move;
    public dropEffect: string = DragDropEffects.move;
    public dragCursor: string = "move";
    public dragImage: DragImage;
}

/**
 * Service that's exposing drag/drop event data and callbacks.
 */
@Injectable()
export class DragDropService {
    allowedDropZones: Array<string> = [];
    onDragSuccessCallback: EventEmitter<DragDropData>;
    dragData: any;
    isDragged: boolean;
}

/**
 * Service that determines the sorting ability of drag/drop elements.
 */
@Injectable()
export class DragDropSortableService {
    index: number;
    sortableData: Array<any>;
    isDragged: boolean;

    private _elem: HTMLElement;
    public get elem(): HTMLElement {
        return this._elem;
    }

    constructor(private _config: DragDropConfigurationService) { }

    markSortable(elem: HTMLElement) {
        if (this._elem) {
            this._elem.classList.remove(this._config.onSortableDragClass);
        }
        if (elem) {
            this._elem = elem;
            this._elem.classList.add(this._config.onSortableDragClass);
        }
    }
}

/**
 * Service that provides majority of input masking without direct dependency on Angular FormControl.
 */
@Injectable()
export class MaskService {
    private invalid = [];

    constructor(public maskOptions: MaskOptions) {
        this.interpolateMaskDefaults();
    }

    maskStaticValue(value: any, callback: (maskedValue: string) => void) {
        if (!value) {
            callback('');
        } else {
            callback(this.getTranslatedValue(undefined, value));
        }
    }

    maskInputValue(value: any, callback: (maskedValue: string) => void) {
        value = value || '';

        var maskedValue = this.getTranslatedValue(undefined, value);
        var controlValue = maskedValue ? maskedValue : null;

        callback(controlValue);
    }

    tryClear(value: string, callback: () => void) {
        if (this.maskOptions && this.maskOptions.clearIfNotMatch && value && !this.isMaskMatch(value)) {
            callback();
        }
    }

    getUnmaskedValue() {
        return this.getTranslatedValue(true);
    }

    getMaskedValue(value: string) {
        return this.getTranslatedValue(false, value);
    }

    isMaskMatch(value: string) {
        var maskChunks = [];
        var translation;
        var pattern;
        var optional;
        var recursive;
        var oRecursive;
        var r;

        for (var i = 0; i < this.maskOptions.mask.length; i++) {
            translation = this.maskOptions.translations[this.maskOptions.mask.charAt(i)];

            if (translation) {
                pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                optional = translation.optional;
                recursive = translation.recursive;

                if (recursive) {
                    maskChunks.push(this.maskOptions.mask.charAt(i));
                    oRecursive = { digit: this.maskOptions.mask.charAt(i), pattern: pattern };
                } else {
                    maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                }

            } else {
                maskChunks.push(this.maskOptions.mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
            }
        }

        r = maskChunks.join('');

        if (oRecursive) {
            r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
        }

        return (new RegExp(r)).test(value);
    }

    private interpolateMaskDefaults() {
        this.maskOptions = this.maskOptions || new MaskOptions();
        this.maskOptions.reverse = this.maskOptions.reverse === undefined ? false : this.maskOptions.reverse;
        this.maskOptions.clearIfNotMatch = this.maskOptions.clearIfNotMatch === undefined ? true : this.maskOptions.clearIfNotMatch;
        this.maskOptions.selectOnFocus = this.maskOptions.selectOnFocus === undefined ? true : this.maskOptions.selectOnFocus;
        this.maskOptions.byPassKeys = this.maskOptions.byPassKeys || [];

        this.maskOptions.byPassKeys[0] = this.maskOptions.byPassKeys[0] || 9;
        this.maskOptions.byPassKeys[1] = this.maskOptions.byPassKeys[1] || 16;
        this.maskOptions.byPassKeys[2] = this.maskOptions.byPassKeys[2] || 17;
        this.maskOptions.byPassKeys[3] = this.maskOptions.byPassKeys[3] || 18;
        this.maskOptions.byPassKeys[4] = this.maskOptions.byPassKeys[4] || 36;
        this.maskOptions.byPassKeys[5] = this.maskOptions.byPassKeys[5] || 37;
        this.maskOptions.byPassKeys[6] = this.maskOptions.byPassKeys[6] || 38
        this.maskOptions.byPassKeys[7] = this.maskOptions.byPassKeys[7] || 39;
        this.maskOptions.byPassKeys[8] = this.maskOptions.byPassKeys[8] || 40;
        this.maskOptions.byPassKeys[9] = this.maskOptions.byPassKeys[9] || 91;

        this.maskOptions.translations = this.maskOptions.translations || {};

        //digit ranges from 0 to current
        this.maskOptions.translations['0'] = this.maskOptions.translations['0'] || { pattern: /[0]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['1'] = this.maskOptions.translations['1'] || { pattern: /[0-1]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['2'] = this.maskOptions.translations['2'] || { pattern: /[0-2]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['3'] = this.maskOptions.translations['3'] || { pattern: /[0-3]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['4'] = this.maskOptions.translations['4'] || { pattern: /[0-4]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['5'] = this.maskOptions.translations['5'] || { pattern: /[0-5]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['6'] = this.maskOptions.translations['6'] || { pattern: /[0-6]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['7'] = this.maskOptions.translations['7'] || { pattern: /[0-7]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['8'] = this.maskOptions.translations['8'] || { pattern: /[0-8]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['9'] = this.maskOptions.translations['9'] || { pattern: /[0-9]/, fallback: false, optional: false, recursive: false };

        //digit statics
        this.maskOptions.translations['a'] = this.maskOptions.translations['a'] || { pattern: /[1]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['b'] = this.maskOptions.translations['b'] || { pattern: /[2]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['c'] = this.maskOptions.translations['c'] || { pattern: /[3]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['d'] = this.maskOptions.translations['d'] || { pattern: /[4]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['e'] = this.maskOptions.translations['e'] || { pattern: /[5]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['f'] = this.maskOptions.translations['f'] || { pattern: /[6]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['g'] = this.maskOptions.translations['g'] || { pattern: /[7]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['h'] = this.maskOptions.translations['h'] || { pattern: /[8]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['i'] = this.maskOptions.translations['i'] || { pattern: /[9]/, fallback: false, optional: false, recursive: false };

        //generic characters
        this.maskOptions.translations['|'] = this.maskOptions.translations['|'] || { pattern: /\d/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['#'] = this.maskOptions.translations['#'] || { pattern: /\d/, fallback: false, optional: false, recursive: true };
        this.maskOptions.translations['A'] = this.maskOptions.translations['A'] || { pattern: /[a-zA-Z0-9]/, fallback: false, optional: false, recursive: false };
        this.maskOptions.translations['S'] = this.maskOptions.translations['S'] || { pattern: /[a-zA-Z]/, fallback: false, optional: false, recursive: false };

        //special character start *
        this.maskOptions.translations['*'] = this.maskOptions.translations['*'] || { pattern: /\*/, fallback: false, optional: false, recursive: false }
    }

    private getTranslatedValue(skipMaskChars = undefined, value = undefined) {
        value = !value ? '' : value.toString();

        var buf = [];
        var m = 0, maskLen = this.maskOptions.mask.length;
        var v = 0, valLen = value ? value.length : 0;
        var offset = 1, addMethod = 'push';
        var resetPos = -1;
        var lastMaskChar;
        var check;

        if (this.maskOptions.reverse) {
            addMethod = 'unshift';
            offset = -1;
            lastMaskChar = 0;
            m = maskLen - 1;
            v = valLen - 1;
            check = function () {
                return m > -1 && v > -1;
            };
        } else {
            lastMaskChar = maskLen - 1;
            check = function () {
                return m < maskLen && v < valLen;
            };
        }

        while (check()) {
            var maskDigit = this.maskOptions.mask.charAt(m);
            var valDigit = value.charAt(v);
            var translation = this.maskOptions.translations[maskDigit];

            if (translation) {
                if (valDigit.match(translation.pattern)) {
                    buf[addMethod](valDigit);
                    if (translation.recursive) {
                        if (resetPos === -1) {
                            resetPos = m;
                        } else if (m === lastMaskChar) {
                            m = resetPos - offset;
                        }

                        if (lastMaskChar === resetPos) {
                            m -= offset;
                        }
                    }
                    m += offset;
                } else if (translation.optional) {
                    m += offset;
                    v -= offset;
                } else if (translation.fallback) {
                    buf[addMethod](translation.fallback);
                    m += offset;
                    v -= offset;
                } else {
                    this.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                }
                v += offset;
            } else {
                if (!skipMaskChars) {
                    buf[addMethod](maskDigit);
                }

                if (valDigit === maskDigit) {
                    v += offset;
                }

                m += offset;
            }
        }

        var lastMaskCharDigit = this.maskOptions.mask.charAt(lastMaskChar);

        if (maskLen === valLen + 1 && !this.maskOptions || !this.maskOptions.translations[lastMaskCharDigit]) {
            buf.push(lastMaskCharDigit);
        }

        return buf.join('');
    }
}

/**
 * Provides methods to work with angular zone (NgZone). A typical use case is to run something after angular has mostly finished with the page.
 */
@Injectable()
export class ZoneService {
    constructor(private zone: NgZone) { }

    /**
     * Invokes the subscription function once, for the very first time the NgZone emits onStable (It typically does emission more than once, although the Angular docs mention otherwise).
     * @param fn A callback function to execute as soon as NgZone reports Angular tasks are carried out (mostly).
     */
    runAfterAngular(fn: () => void) {
        var stableSubscription = this.zone.onStable.subscribe(() => {
            fn();
            stableSubscription.unsubscribe();
        });
    }

    /**
     * Runs a function outside of angular context.
     */
    runOutsideAngular(fn: () => void) {
        this.zone.runOutsideAngular(fn);
    }

    /**
     * Runs a function inside of angular context. Useful when context of execution is global.
     */
    runInsideAngular(fn: () => void) {
        this.zone.run(fn);
    }
}

/**
 * Allows querystring persistence. Note that this simply modifies the links within the page and will not automatically handle window.location redirects yet.
 */
@Injectable()
export class StickyQueryStringService {
    /**
     * Modify all HTML element that have 'href' or 'src' attributes as well as "data-sticky-queryString" marker.
     * @param keys Comma separated list of querystring keys to append to each element.
     */
    modifyLinks(keys: string) {
        if (!keys) { throw new Error('Keys is required to modify sticky querystring for links'); }

        let stickyQuerystrings = [];
        let stickyKeys = keys.split(',');

        stickyKeys.forEach((item) => {
            let value = Helpers.getQueryStringVariable(item);

            if (value) {
                stickyQuerystrings.push(item + '=' + value);
            }
        });

        let queryString = stickyQuerystrings.join('&');

        if (queryString) {
            let elements: any = document.querySelectorAll('[data-sticky-queryString]');

            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    let element = elements[i];
                    let propName = this.getLinkAttribute(element);

                    if (propName === 'href') {
                        element.href = element.href + (element.href.indexOf('?') > -1 ? (element.href.indexOf('=') > -1 ? '&' + queryString : queryString) : '?' + queryString);
                    } else if (propName === 'src') {
                        element.src = element.src + (element.src.indexOf('?') > -1 ? (element.src.indexOf('=') > -1 ? '&' + queryString : queryString) : '?' + queryString);
                    }
                }
            }
        }
    }

    private getLinkAttribute(element) {
        let hasHref = element.attributes['href'] && element.attributes['href'].specified;
        let hasSrc = element.attributes['src'] && element.attributes['src'].specified;

        return hasHref ? 'href' : hasSrc ? 'src' : undefined;
    }
}

/**
 * Adds support for filtering on input text boxes or static elements.
 */
@Directive({
    selector: '[mask]',
    exportAs: 'MaskDirective',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MaskDirective), multi: true }
    ]
})
export class MaskDirective extends MaskDirectiveAbstractBase implements ControlValueAccessor, OnChanges {
    @Input('mask') maskOptions: MaskOptions;
    @Input() controlRef: FormControl;

    private onTouched: () => any;
    private onChange: (value: any) => any;

    registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }
    registerOnTouched(fn: () => any): void { this.onTouched = fn; }

    @HostListener('keypress', ['$event'])
    onPress(e) {
        super.keyboardKeyPress(e);
    }

    @HostListener('focus', ['$event'])
    onFocus(e) {
        super.activated(e, this.onChange);
    }

    @HostListener('focusout', ['$event'])
    onFocusOut(e) {
        super.deactivated(e, this.onChange, this.onTouched);
    }

    @HostListener('input', ['$event'])
    onInput(e) {
        super.setValue(e.target.value, this.onChange);
    }

    constructor(element: ElementRef) {
        super(element);
    }

    ngOnChanges(change: { [key: string]: SimpleChange }) {
        if (this.maskOptions) {
            this.maskService = new MaskService(this.maskOptions);
        }
    }

    //writeValue only called in case of resets or defaults, not called for user modifications
    writeValue(value: any) {
        super.setValue(value, undefined);
    }
}

/**
 * Adds support for masking input text boxes that require an independent display value, that is,
 * what shows in the input box after input box loses focus.
 * For example, this is useful for SSN field mask where control value is the fully formatted SSN and the display value of last four digits.
 * This directive does not support static elements, only input text boxes.
 */
@Directive({
    selector: '[blurMask]',
    exportAs: 'BlurMaskDirective',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BlurMaskDirective), multi: true }
    ]
})
export class BlurMaskDirective extends MaskDirectiveAbstractBase implements ControlValueAccessor, OnChanges {
    @Input('blurMask') maskOptions: MaskOptions;
    @Input() controlRef: FormControl;
    @Input() displayFormatter: (value: any) => any;

    private onTouched: () => any;
    private onChange: (value: any) => any;

    registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }
    registerOnTouched(fn: () => any): void { this.onTouched = fn; }

    @HostListener('keypress', ['$event'])
    onPress(e) {
        super.keyboardKeyPress(e);
    }

    @HostListener('focus', ['$event'])
    onFocus(e) {
        super.activated(e, this.onChange);
        super.setDisplayValue(this.controlRef.value);
    }

    @HostListener('focusout', ['$event'])
    onFocusOut(e) {
        super.deactivated(e, this.onChange, this.onTouched);
        var maskedValue = this.maskService.getMaskedValue(e.target.value);
        super.setDisplayValue(this.displayFormatter(maskedValue));
    }

    @HostListener('input', ['$event'])
    onInput(e) {
        super.setValue(e.target.value, this.onChange);
    }

    constructor(element: ElementRef) {
        super(element);
    }

    ngOnChanges(change: { [key: string]: SimpleChange }) {
        if (this.maskOptions) {
            this.maskService = new MaskService(this.maskOptions);
        }
    }

    //writeValue only called in case of resets or defaults, not called for user modifications
    writeValue(value: any) {
        var maskedValue = this.maskService.getMaskedValue(value);

        super.setControlValue(maskedValue, undefined);
        super.setDisplayValue(this.displayFormatter(maskedValue));
    }
}

/**
 * Adds validation support to input elements that have a corresponding angular2 control.
 */
@Directive({
    selector: '[validation]',
    exportAs: 'ValidationDirective',
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidationDirective, multi: true }]
})
export class ValidationDirective implements Validator, OnChanges {
    @Input() controlRef: FormControl;
    @Input() requiredValidator: boolean;
    @Input() minLengthValidator: number;
    @Input() maxLengthValidator: number;
    @Input() patternValidator: string;
    @Input() customValidator: string;

    private validators: ValidatorFn[] = [];

    constructor(private elementRef: ElementRef) { }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        var self = this;

        if (self.controlRef) {
            //without time-out was throwing 'expresseion changed after it was checked. previous value 'false' current value 'true''
            //because of setValidators() requiredValidator, which changes control from valid to invalid immediately (angular2 default behaviour for required fields)
            setTimeout(() => {
                self.setValidators();
                self.controlRef.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            }, 500);
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        let errors;

        this.validators.forEach((validator) => {
            var retValue = validator(control);

            if (retValue && retValue != null) {
                errors = errors || {};
                errors[retValue[0]] = retValue;
            }
        });

        return errors ? errors : null;
    }

    setValidators() {
        var self = this;

        self.validators = [];

        function customValidation(messageRef, htmlElement): ValidatorFn {
            return (control: AbstractControl): { [key: string]: any } => {
                var message = messageRef();

                if (message && message != '') {
                    htmlElement.setCustomValidity(message);

                    return { 'customError': true };
                }
                else if (control.errors && control.errors['customError']) {
                    htmlElement.setCustomValidity('');
                    delete control.errors['customError'];

                    return null;
                }
            };
        }

        if (self.requiredValidator) { self.validators.push(Validators.required); }
        if (self.minLengthValidator) { self.validators.push(Validators.minLength(self.minLengthValidator)); }
        if (self.maxLengthValidator) { self.validators.push(Validators.maxLength(self.maxLengthValidator)); }
        if (self.patternValidator) { self.validators.push(Validators.pattern(self.patternValidator)); }
        if (self.customValidator) { self.validators.push(customValidation(forwardRef(() => { return self.customValidator }), self.elementRef.nativeElement)); }

        self.controlRef.clearValidators();
        self.controlRef.setValidators(self.validators.length > 0 ? self.validators : null);
    }
}

/**
 * Drag/drop directive for drag/drop container, that is, the container within which drag and drop is possible.
 */
@Directive({ selector: '[DragDropContainerDirective]' })
export class DragDropContainerDirective extends DragDropAbstractBase {
    @Input("dragEnabled")
    set draggable(value: boolean) {
        this.dragEnabled = !!value;
    }

    @Input()
    set dragDropItems(dragDropItems: Array<any>) {
        this._dragDropItems = dragDropItems;
        //
        this.dropEnabled = this.dragDropItems.length === 0;
        // console.log("collection is changed, drop enabled: " + this.dropEnabled);
    }
    get dragDropItems(): Array<any> {
        return this._dragDropItems;
    }

    @Input("dropZones")
    set dropzones(value: Array<string>) {
        this.dropZones = value;
    }

    private _dragDropItems: Array<any> = [];

    constructor(elemRef: ElementRef,
        dragDropService: DragDropService,
        config: DragDropConfigurationService,
        cdr: ChangeDetectorRef,
        private _sortableDataService: DragDropSortableService) {

        super(elemRef, dragDropService, config, cdr);
        this.dragEnabled = false;
    }

    _onDragEnterCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            let item: any = this._sortableDataService.sortableData[this._sortableDataService.index];

            if (this._dragDropItems.indexOf(item) === -1) {
                // Let's add it
                // console.log('Container._onDragEnterCallback. drag node [' + this._sortableDataService.index.toString() + '] over parent node');
                // Remove item from previouse list
                this._sortableDataService.sortableData.splice(this._sortableDataService.index, 1);
                // Add item to new list
                this._dragDropItems.unshift(item);
                this._sortableDataService.sortableData = this._dragDropItems;
                this._sortableDataService.index = 0;
            }

            this.detectChanges();
        }
    }
}

/**
 * Drag/drop service for HTML elements inside of a container that's marked to be a drag/drop container.
 */
@Directive({ selector: '[DragDropDirective]' })
export class DragDropDirective extends DragDropAbstractBase {
    @Input('sortableIndex') index: number;
    @Input("dragEnabled") set draggable(value: boolean) {
        this.dragEnabled = !!value;
    }
    @Input("dropEnabled") set droppable(value: boolean) {
        this.dropEnabled = !!value;
    }
    /**
     * Drag allowed effect
     */
    @Input("effectAllowed") set effectallowed(value: string) {
        this.effectAllowed = value;
    }
    /**
     * Drag effect cursor
     */
    @Input("effectCursor") set effectcursor(value: string) {
        this.effectCursor = value;
    }
    /**
     * The data that has to be dragged. It can be any JS object
     */
    @Input() dragData: any;

    /**
     * Callback function called when the drag action ends with a valid drop action.
     * It is activated after the on-drop-success callback
     */
    @Output("onDragSuccess") onDragSuccessCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output("onDragStart") onDragStartCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output("onDragOver") onDragOverCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output("onDragEnd") onDragEndCallback: EventEmitter<any> = new EventEmitter<any>();
    @Output("onDropSuccess") onDropSuccessCallback: EventEmitter<any> = new EventEmitter<any>();

    constructor(elemRef: ElementRef,
        dragDropService: DragDropService,
        config: DragDropConfigurationService,
        private _dragDropContainer: DragDropContainerDirective,
        private _sortableDataService: DragDropSortableService,
        cdr: ChangeDetectorRef) {

        super(elemRef, dragDropService, config, cdr);

        this.dropZones = this._dragDropContainer.dropZones;
        this.dragEnabled = true;
        this.dropEnabled = true;
    }

    _onDragStartCallback(event: Event) {
        this._sortableDataService.isDragged = true;
        this._sortableDataService.sortableData = this._dragDropContainer.dragDropItems;
        this._sortableDataService.index = this.index;
        this._sortableDataService.markSortable(this._elem);

        this._dragDropService.isDragged = true;
        this._dragDropService.dragData = this.dragData;
        this._dragDropService.onDragSuccessCallback = this.onDragSuccessCallback;

        this.onDragStartCallback.emit(this._dragDropService.dragData);
    }

    _onDragOverCallback(event: Event) {
        if (this._sortableDataService.isDragged && this._elem != this._sortableDataService.elem) {
            this._sortableDataService.sortableData = this._dragDropContainer.dragDropItems;
            this._sortableDataService.index = this.index;
            this._sortableDataService.markSortable(this._elem);
            this.onDragOverCallback.emit(this._dragDropService.dragData);
        }
    }

    _onDragEndCallback(event: Event) {
        this._sortableDataService.isDragged = false;
        this._sortableDataService.sortableData = null;
        this._sortableDataService.index = null;
        this._sortableDataService.markSortable(null);

        this._dragDropService.isDragged = false;
        this._dragDropService.dragData = null;
        this._dragDropService.onDragSuccessCallback = null;

        this.onDragEndCallback.emit(this._dragDropService.dragData);
    }

    _onDragEnterCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            this._sortableDataService.markSortable(this._elem);

            if ((this.index !== this._sortableDataService.index) || (this._sortableDataService.sortableData != this._dragDropContainer.dragDropItems)) {
                let item: any = this._sortableDataService.sortableData[this._sortableDataService.index];

                this._sortableDataService.sortableData.splice(this._sortableDataService.index, 1);

                this._dragDropContainer.dragDropItems.splice(this.index, 0, item);
                this._sortableDataService.sortableData = this._dragDropContainer.dragDropItems;
                this._sortableDataService.index = this.index;
            }
        }
    }

    _onDropCallback(event: Event) {
        if (this._sortableDataService.isDragged) {
            this.onDropSuccessCallback.emit(this._dragDropService.dragData);

            if (this._dragDropService.onDragSuccessCallback) {
                this._dragDropService.onDragSuccessCallback.emit(this._dragDropService.dragData);
            }

            this._dragDropContainer.detectChanges();
        }
    }
}

/**
 * Whatever HTML element this directive is applied to, will be hidden when the page containing this element and directive is opened in an iframe/child window.
 */
@Directive({ selector: '[notIframe]', exportAs: 'NotIframeDirective' })
export class NotIframeDirective implements AfterViewInit {
    constructor(private elementRef: ElementRef) {
        if (!swbc || !swbc.framing) { throw new Error('NotIframeDirective requires the script SWBC.Framing to be included on the page'); }
    }

    ngAfterViewInit() {
        var isChild = swbc.framing.isChildWindow();

        if (isChild) {
            this.elementRef.nativeElement.setAttribute('style', 'display:none !important');
        }
    }
}

/**
 * Limits text to certain size after which to show three dots.
 */
@Pipe({ name: 'limitTo' })
export class TruncatePipe implements PipeTransform {
    transform(inputVal: string, limitCount: number): string {
        return inputVal ? inputVal.length > limitCount ? inputVal.substring(0, limitCount) + '....more' : inputVal : '';
    }
}

/**
 * Fallback to a predefined value of property is null on an object.
 */
@Pipe({ name: 'valueFallback' })
export class ValueFallbackPipe implements PipeTransform {
    transform(inputVal: string, valueFallback: string): string {
        return inputVal ? inputVal : valueFallback;
    }
}

/**
 * Convert a JSON formatted date string into a date object.
 */
@Pipe({ name: 'jsonToDate' })
export class JsonToDatePipe implements PipeTransform {
    private jsonDateFormat: RegExp = /\/Date\((\d*)\)\//;
    transform(inputVal: string): Date {
        if (!inputVal) { return; }
        var dt = this.jsonDateFormat.exec(inputVal);
        if (dt) { return new Date(+dt[1]); }
        else { return; }
    }
}

/**
 * Convert a date into a short date format.
 */
@Pipe({ name: 'shortDate' })
export class ShortDatePipe implements PipeTransform {
    private dateFormat: string = 'MM/dd/yyyy';
    private preZero(val: any) {
        val = parseInt(val);
        return val < 10 ? '0' + val : val;
    }
    private toDateString(val) {
        if (!val) { return; }
        return this.dateFormat.replace('yyyy', val.getFullYear())
            .replace('MM', this.preZero(val.getMonth() + 1))
            .replace('dd', this.preZero(val.getDate()));
    }
    transform(inputVal: Date): string {
        return this.toDateString(inputVal);
    }
}

/**
 * Santizes an HTML fragment to be safe for angular2 parsing.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHTML {
    constructor(private sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}

/**
 * Convert amount value into a USD format.
 */
@Pipe({ name: 'currencySWBC' })
export class CurrecnySWBCPipe implements PipeTransform {

    private formatter(value): string {
        if (isNaN(parseFloat(value)))
            return "";

        if (value === null || value === "" || value === 0) {
            return "$" + Number();
        }
        else {
            var result = parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            if (value < 0) {
                return "$(" + result.replace('-', '') + ")";
            }
            return "$" + result;
        }
    }

    transform(inputVal): string {
        return this.formatter(inputVal);
    }
}

/**
 * Convert a date into a given date or time format.
 */
@Pipe({ name: 'dateSWBC' })
export class DateSWBCPipe implements PipeTransform {
    constructor(private jsonPipe: JsonToDatePipe) { }

    private dateFormatter(value, formatType): string {
        var result = '';

        if (!this.validate(value)) {
            var retDate = this.jsonPipe.transform(value);
            if (!this.validate(retDate))
                return result;
        }

        var date = new Date(value);

        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();

        var hours = date.getHours();
        var minitues = date.getMinutes();
        var seconds = date.getSeconds();

        var am = (hours < 12 || hours == 24);
        var amORpm = (am ? 'AM' : 'PM');

        if (hours == 0)
            hours = 12;
        else if (hours > 12)
            hours -= 12;

        var shortDate = [month, day, year].join('/');
        var time = [hours, minitues, seconds].join(':') + ' ' + amORpm;//ex: 04/10/2017 02:46:09 PM (April 10th 2017 02:46:09 PM)
        var shortTime = [hours, minitues].join(':') + ' ' + amORpm;


        switch (formatType) {
            case "Date":
                result = shortDate + ' ' + time; //ex: 04/10/2017 02:46:09 PM (April 10th 2017 02:46:09 PM)
                break;
            case "ShortDate":
                result = shortDate; //ex: 04/10/2017 (April 10th 2017)
                break;
            case "Time":
                result = time; //ex: Input value should be valid date format: 04/10/2017 02:46:09 PM, Format as: 02:46:09 PM
                break;
            case "ShortTime":
                result = shortTime; //ex: Input value should be valid date format: 04/10/2017 02:46:09 PM, Format as: 02:46 PM
                break;
        }

        return result;
    }

    private validate(value): boolean {
        return !isNaN(Date.parse(value));
    }

    transform(inputVal, formatType): string {
        return this.dateFormatter(inputVal, formatType);
    }
}

@Component({
    selector: 'tooltipComponent',
    template: `<div class="tooltip-container">
                    <div [class]="cssClassObservable | async">
                        <div class="tooltip-arrow"></div>
                        <div class="tooltip-inner">{{ message }}</div>
                    </div>
               </div>`,
    providers: [ZoneService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnChanges, OnDestroy {
    @Input() validationType: string;
    @Input() errorType: string;
    @Input() elementId: string;
    @Input() controlRef: FormControl;
    @Input() autoLoad: boolean = true;
    @Input() isTouched = false;
    @Input() message: string;

    private isLoaded = false;
    private htmlElementRef;
    private isOpen: boolean;
    private cssClassObservable: BehaviorSubject<string> = new BehaviorSubject<string>('tooltip top-left in animationBox defaultBox');
    private focusSubscription: Subscription;
    private blurSubscription: Subscription;
    private keyUpSubscription: Subscription;
    private changeSubscription: Subscription;

    constructor(private elementRef: ElementRef, private zoneService: ZoneService) { }
    
    ngOnChanges() {
        if (this.autoLoad == true) { this.load(); }
    }

    ngOnDestroy() {
        if (this.isLoaded) {
            this.focusSubscription.unsubscribe();
            this.blurSubscription.unsubscribe();
            this.keyUpSubscription.unsubscribe();
            this.changeSubscription.unsubscribe();
        }
    }

    load() {
        this.zoneService.runOutsideAngular(() => {
            if (!this.htmlElementRef) { this.htmlElementRef = Helpers.domFindElement(this.elementRef.nativeElement, '#' + this.elementId); }

            if (this.htmlElementRef && !this.isLoaded) {
                this.focusSubscription = Observable.fromEvent(this.htmlElementRef, 'focus').subscribe((e) => this.onFocusIn(e));
                this.blurSubscription = Observable.fromEvent(this.htmlElementRef, 'blur').subscribe((e) => this.onFocusOut(e));
                this.keyUpSubscription = Observable.fromEvent(this.htmlElementRef, 'keyup').subscribe((e) => this.onKeyUp(e));
                this.changeSubscription = Observable.fromEvent(this.htmlElementRef, 'change').subscribe((e) => this.onChange(e));

                if (this.controlRef) {
                    this.controlRef.statusChanges.subscribe((value) => { this.validate(); });
                }

                this.isLoaded = true;
            }
        });
    }

    private validate() {
        if (this.errorType && this.controlRef && this.htmlElementRef) { this.validateAngular(); }
        else if (this.validationType && this.htmlElementRef) { this.validateHTML(); }
    }

    private validateAngular() {
        if (this.controlRef.touched &&
            this.htmlElementRef == document.activeElement &&
            this.controlRef.errors &&
            this.controlRef.errors[this.errorType]) {

            if (!this.isOpen) {
                this.isOpen = true;
                this.toggleClass();
            }
        } else {
            if (this.isOpen) {
                this.isOpen = false;
                this.toggleClass();
            }
        }
    }

    private validateHTML() {
        if (this.isTouched &&
            this.htmlElementRef == document.activeElement &&
            this.htmlElementRef.validity &&
            this.htmlElementRef.validity[this.validationType]) {

            if (!this.isOpen) {
                this.isOpen = true;
                this.toggleClass();
            }
        } else {
            if (this.isOpen) {
                this.isOpen = false;
                this.toggleClass();
            }
        }
    }

    private onFocusIn(e) {
        this.validate();
    }

    private onFocusOut(e) {
        this.isTouched = true;

        this.validate();
    }

    private onChange(e) {
        this.isTouched = true;

        this.validate();
    }

    private onKeyUp(e) {
        this.validate();
    }

    private toggleClass() {
        let className = this.isOpen == true ? 'tooltip top-left in animationBox openBox' : 'tooltip top-left in animationBox closeBox';
        this.cssClassObservable.next(className);
    }
}

@Component({
    selector: 'remoteTooltipComponent',
    providers: [AjaxService, ZoneService],
    template: `<div role="tooltip" class="remoteTooltipContainer">
                    <tooltipComponent [message]="message" [elementId]="elementId" autoLoad="false" validationType="customError" #tooltip></tooltipComponent>
                    <div *ngIf="isWaiting" [ngClass]="'ajaxBox'">
                        <img class="ajaxAnimation" src="data:image/jpeg;base64,R0lGODlhDAAMAPMAAP///8zMzJmZmWZmZjMzM+7u7t3d3bu7u6qqqoiIiHd3d1VVVURERCIiIhEREQAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1HaWZCdWlsZGVyIDAuNSBieSBZdmVzIFBpZ3VldAAh+QQJBQAAACwAAAAADAAMAAAERxDIAs6QWBpSEAGIgYnDIDDBAVDFkgRKehiBwCZCllJHL2KFgBAhQFCAqYDkoMSkJohQgBIwHGwAUbKnMhwLtmcoswI8C8cIACH5BAkFAAAALAAAAAAMAAwAAARIEMgChAKFSmBWSQvQHBuVnIrSYJiCBIJhDIeBUIWAbEBwUAGfZhIMHn68gi8gCfJ8EwTCEAAaDgKKoXfwHTmanJI05bGgGUkEACH5BAkFAAAALAAAAAAMAAwAAARGEMgCkACFSqyA6MSxUUiZJAyWIYeBGEZyJI4IHMEGJCEQ/BqJy/A7HIKSAC6Z2ygnJSIlYDgIKAYfzigyaArX50uH0aokEQAh+QQJBQAAACwAAAAADAAMAAAERhDIAg4CVM57BBiBRh0kIigYhhxGYBjCkTSGdISasNRBn0kwBCJA+gEMC8ZA0tNUDhtEi+LqUHg3EtSQKQgKRIDUmQoXMhEAIfkECQUAAAAsAAAAAAwADAAABEUQyAJCAFROVMIBiaFRx+EhAoYhhxEUhSksImBqAKJQ1osXiYTAc8hMFAOFxIJLKFcIFwW1IIhEHksplykIOp8oTuXBZCIAIfkECQUAAAAsAAAAAAwADAAABEUQyALCAVROVCxAhkYdh+VRBXIYQdEZiBICpUYLVKBnm4BYBx5GkBBIdDaBAoUABTAJxKARCpkQiwEtU8DtHE9b7tKSRAAAIfkECQUAAAAsAAAAAAwADAAABEcQyALCAVROVCxAhkYdh+VRBXIYQdGxQlZq1UEFeLaRlk2nCIQER0MkUCrDqiA4JBahUAAxUCgWlUwKMBgAGgEaBpBQAAyZCAAh+QQJBQAAACwAAAAADAAMAAAERxDIAsIBVE5ULECGRh2HFSAYhhxGUHStkJVadVBBnk15TtcFUkASENQOHBUCkTAUECcFJaQYJBQCBcBJbAASC8BiKAplt5kIACH5BAkFAAAALAAAAAAMAAwAAARFEMgCwgFUTlQsQIZGHYcVIBiGHEZQdK2QlVp1UEGeTXnP1raAZDCoeQAGBwMhK7AOzUtigUgwkRlDw4BQABQhkbCKyUQAACH5BAkFAAAALAAAAAAMAAwAAARGEMgCwgFUTlQsQIZGHYcVIBiGBF3RGYGQHahmUckwBBoW/DlFSGSSJBI9D4bAoLkChoMMcEEoaCSAIVNYRAUAwVATomEyEQAh+QQJBQAAACwAAAAADAAMAAAERRDIAsIBVE5ULzJTAByHFXBUQSyIUBSBEbiSMmgdJSgJqMGBQGKg8IVKEoEAZ5kMBhZK7EATUS0kgCFTUMA8Rgmo+ZJEAAAh+QQJBQAAACwAAAAADAAMAAAERhBIA0wARWrjjDkAQk3AwBxHAGYGMRxDUASWkBWDogFqhgii3SwQECgSGc0sJUHtVJJCIkHM0A42Hi+FAhmSBRs0KNxikhEAOw==" />
                    </div>
               </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteTooltipComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() message: string;
    @Input() elementId: string;
    @Input() url: string;
    @Input() cannotReachServerMessage: string;
    @Input() autoLoad: boolean = true;

    @ViewChild('tooltip') tooltip: TooltipComponent;

    private isWaiting;
    private htmlTargetElement;
    private isLoaded = false;
    private blurSubscription: Subscription;

    constructor(private ajaxService: AjaxService, private elementRef: ElementRef, private zoneService: ZoneService) { }

    ngAfterViewInit() {
        if (this.tooltip) { this.tooltip.load(); }
    }

    ngOnChanges() {
        if (this.autoLoad == true) { this.load(); }
    }

    ngOnDestroy() {
        if (this.isLoaded) {
            this.blurSubscription.unsubscribe();
        }
    }

    load() {
        this.zoneService.runOutsideAngular(() => {
            if (!this.htmlTargetElement) { this.htmlTargetElement = Helpers.domFindElement(this.elementRef.nativeElement, '#' + this.elementId); }

            if (!this.isLoaded && this.url) {
                this.blurSubscription = Observable.fromEvent(this.htmlTargetElement, 'blur').subscribe((e) => this.onFocusOut(e));
            }
        });
    }

    private onFocusOut(e) {
        this.validate();

        e.preventDefault();
        e.cancelBubble = true;
    }

    private validate() {
        var self = this;

        self.isWaiting = true;

        self.ajaxService.post(
            self.url,
            { value: self.htmlTargetElement.value },
            (data) => {
                self.isWaiting = false;

                if (data == true) {
                    self.htmlTargetElement.setCustomValidity('');
                }
                else {
                    if (typeof data == typeof String) {
                        self.message = data;
                        self.htmlTargetElement.setCustomValidity(data);
                    } else {
                        self.htmlTargetElement.setCustomValidity('');
                    }
                }
            },
            (ex) => {
                self.isWaiting = false;
                self.htmlTargetElement.setCustomValidity(self.cannotReachServerMessage);
            });
    }
}

@Component({
    selector: 'virtualScrollComponent',
    exportAs: 'VirtualScrollComponent',
    template:
        `<div class="scrollHeight" [style.height.px]="containerHeight">
            <div [style.height.px]="totalHeightExtender | async"></div>
        </div>
        <div [style.paddingRight.px]="scrollbarWidth">
            <ng-content></ng-content>
        </div>`,
    providers: [ZoneService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualScrollComponent implements OnChanges, OnDestroy, AfterViewInit {
    @Input() scrollToIndex: Observable<number>;
    @Input() useWindowScroll = false;
    @Input() containerHeight = 0;
    @Input() itemHeight: number = 0;
    @Input() getIndexScrollTop: () => number = () => { return 0; };
    @Input() items = [];

    @Output() onFiltered: EventEmitter<VirtualScrollItem> = new EventEmitter<VirtualScrollItem>();
    @Output() onFilteredInit: EventEmitter<any> = new EventEmitter<any>();

    private itemsOffsets: number[] = [];
    private scrollExtender: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private totalHeightExtender: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private scrollToIndexSubscription: Subscription;
    private scrollSubscriber: Subscription;
    private isLoaded = false;
    private onFilteredInitInvoked: boolean = false;
    private scrollElement: HTMLElement;
    private scrollbarWidth: number = Helpers.domGetScrollbarWidth();

    constructor(private elementRef: ElementRef, private renderer: Renderer, private zoneService: ZoneService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['scrollToIndex']) {
            if (this.scrollToIndex) {
                this.scrollToIndexSubscription = this.scrollToIndex.subscribe((index: number) => this.scrollToOffsetByIndex(index));
            }
            else {
                this.scrollToIndexSubscription.unsubscribe();
            }
        }
        if (changes['items']) {
            this.items = this.items || [];

            if (!this.isLoaded) { this.load(); }
            else { this.refresh(); }
        }
    }

    ngAfterViewInit() {
        this.load();
    }

    ngOnDestroy() {
        if (this.scrollSubscriber) { this.scrollSubscriber.unsubscribe(); }
        if (this.scrollToIndexSubscription) { this.scrollToIndexSubscription.unsubscribe(); }
    }

    private load() {
        //initializes the entirety of this component outside the angule to boost the performance of the page.
        this.zoneService.runOutsideAngular(() => {
            this.scrollElement = this.elementRef.nativeElement.querySelector('.scrollHeight');

            if (this.scrollElement && this.items && this.items.length > 0) {
                this.itemsOffsets = this.calculateOffsets();
                this.totalHeightExtender.next(this.itemsOffsets[this.itemsOffsets.length - 1]);
                this.renderer.setElementStyle(this.elementRef.nativeElement, 'height', this.containerHeight + 'px');

                let scrollObservable = Observable.fromEvent(this.useWindowScroll ? window : this.scrollElement, 'scroll');
                this.refresh();
                this.scrollSubscriber = scrollObservable.debounceTime(10).map(() => 'debounce').subscribe(() => this.handleScroll());
                this.isLoaded = true;
            }
        });
    }

    private refresh() {
        let [top, height] = this.getScrollTopAndHeight();

        this.itemsOffsets = this.calculateOffsets();
        this.totalHeightExtender.next(this.itemsOffsets[this.itemsOffsets.length - 1]);
        this.renderer.setElementStyle(this.elementRef.nativeElement, 'height', this.containerHeight + 'px');
        this.scrollExtender.next(top);
        this.filter(top, height);
        this.scrollToOffset();
    }

    private handleScroll() {
        let [top, height] = this.getScrollTopAndHeight();

        this.scrollExtender.next(top);
        this.filter(top, height);
    }

    private calculateOffsets() {
        let offset = 0;
        let offsets = [offset];

        for (let i = this.items.length; i > 0; i--) {
            offset += this.itemHeight;
            offsets.push(offset);
        }

        return offsets;
    }

    private filter(top: number, height: number) {
        let [from, to] = this.calculateFilterRange(top, height);
        [from, to] = this.calculateBufferRange(from, to);
        let filteredItems = this.items.slice(from, to);
        let filteredOffsets = this.itemsOffsets.slice(from, to);

        //this is the only thing angular needs to know about, the filtered range which will in turn trigger the change detection tree
        this.zoneService.runInsideAngular(() => {
            this.onFiltered.next({
                items: filteredItems,
                offsets: filteredOffsets,
                index: from
            });

            this.zoneService.runAfterAngular(() => {
                if (!this.onFilteredInitInvoked) {
                    this.onFilteredInit.next(null);
                    this.onFilteredInitInvoked = true;
                }
            });
        });
    }

    private getScrollTopAndHeight(): number[] {
        let top = 0;
        let height = 0;

        if (this.useWindowScroll) {
            top = -document.body.getBoundingClientRect().top;
            height = top + window.innerHeight;
        } else {
            top = this.scrollElement.scrollTop;
            height = top + this.containerHeight;
        }

        return [Math.round(top), Math.round(height)];
    }

    private calculateBufferRange(from: number, to: number): number[] {
        from = (from > 0) ? (from - 1) : from;
        to = (to > this.itemsOffsets.length - 2) ? (to + 1) : to;

        from = from >= this.itemsOffsets.length ? this.itemsOffsets.length - 1 : from;
        to = to >= this.itemsOffsets.length ? this.itemsOffsets.length - 1 : to;

        return [from, to];
    }

    private calculateFilterRange(scrollTop: number, scrollHeight: number): number[] {
        let lastOffset = this.itemsOffsets[this.itemsOffsets.length - 1];

        if (this.itemsOffsets.length === 0) { return [0, 0]; }
        if (scrollHeight <= 0) { return [0, 1]; }
        if (lastOffset < scrollHeight) { scrollHeight = lastOffset; }
        if (scrollTop < 0) { scrollTop = 0; }

        let from = 0;
        while (scrollTop > 0 && scrollTop >= this.itemsOffsets[from]) {
            from++;
        }

        let to = from;

        while (scrollHeight >= this.itemsOffsets[to]) {
            to++;
        }

        return [from, to];
    }

    private scrollToOffsetByIndex(index: number) {
        if (this.useWindowScroll) {
            let offset = this.itemsOffsets[index];

            if (offset) {
                var x = (window.pageXOffset !== undefined)
                    ? window.pageXOffset
                    : ((document.documentElement || document.body.parentNode || document.body) as any).scrollLeft;
                window.scrollTo(x, offset);
            }
        }
    }

    private scrollToOffset() {
        if (this.useWindowScroll) { return; }

        let scrollTopIndex = this.getIndexScrollTop();

        if (scrollTopIndex > -1) {
            let itemOffset = this.itemsOffsets[scrollTopIndex];
            let offset = 0;
            let resultsContainerHeight = this.containerHeight - 50;
            let resultsContainerScrollTop = this.scrollExtender.value;
            let itemOffsetAndHeight = itemOffset;

            if (itemOffsetAndHeight > (resultsContainerScrollTop + resultsContainerHeight)) {
                offset = itemOffsetAndHeight - resultsContainerHeight;
                this.scrollExtender.next(offset);
                this.setScrollOffset(offset);

                return;
            }
            if (itemOffset <= resultsContainerScrollTop) {
                offset = itemOffset;
                this.scrollExtender.next(offset);
                this.setScrollOffset(offset);

                return;
            }
        } else {
            this.scrollExtender.next(0);
        }

        this.setScrollOffset(this.scrollExtender.value);
    }

    private setScrollOffset(scrollTop: number) {
        this.renderer.setElementProperty(this.elementRef.nativeElement, 'scrollTop', scrollTop);
    }
}

@Component({
    selector: 'overlayComponent',
    template:
        `<div [ngClass]="modalClassName | async" autofocus="off">
        <div class="modalElement" role="dialog">      
            <div class="modalElementBody">
                <div *ngIf="isSaving" class="messageContainer">
                    <span class="swbcBlue hidden-xs">
                        <img src="data:image/gif;base64,R0lGODlhIAAgAPcAAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV9fX2FhYWJiYmNjY2VlZWVlZWZmZmdnZ2hoaGhoaGlpaWpqampqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3Nzc3R0dHV1dXZ2dnd3d3h4eHh4eHl5eXl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYODg4WFhYeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpKSkpOTk5SUlJWVlZaWlpeXl5iYmJqampubm5ycnJ2dnZ6enp+fn6GhoaOjo6Wlpaenp6ioqKmpqaurq6ysrK6urq+vr7GxsbGxsbKysrOzs7S0tLS0tLS0tLW1tbW1tbW1tba2tra2tre3t7e3t7i4uLi4uLm5ubm5ubq6uru7u7u7u7y8vL29vb29vb6+vr+/v8DAwMHBwcPDw8TExMXFxcfHx8jIyMnJycnJycnJycrKysvLy8vLy8zMzM/Pz9HR0dTU1NbW1tjY2Nra2tzc3N7e3uDg4OLi4uPj4+Pj4+Tk5OXl5ebm5ujo6Ovr6+3t7e/v7/Dw8PLy8vPz8/T09PT09PX19ff39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAD+ACwAAAAAIAAgAAAI/gD9CRxIsKDBgwgTKlzIsKFDg7JkPVR4j+CaNQTHrZsosB27eAMvDvymRxNHf+7YuQuJUWAkPaFOxmPHDp5Akf6i6dHz7aS/dzRvthykx9TDceZWCqQJcto0f9j0DNroT5upSgnhjRMn7hzIeDYLGuu5rpUhQ4yoHnxHjuu4dwrDMTq7KRzDdVvVKTSG9qnDeO5AJlynTa3Pw/7GaVu8OB3DbJMiR1ZmkBzjxo8lT0bM+d05uAnbhWv3kBy1aXYTSvMkCtvda06pGTY4TpQnT6vGhT49bRvccuAMXiPnr52x26JII7RWWOA7ZsjK+QtnV5wpVcrD/VL18Boyyv5yPeUSqMqUM5/lkCFLLV6gVVPiTlZDJm1ge4G8TCE7SU2ZY4H3+UOOKcScBBRBAfqTjnKcYeMaZxBGKOFEAQEAIfkECQQA/wAsAAAAACAAIACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZWVlZ2dnaGhoaWlpampqa2trbGxsbW1tbW1tbm5ub29vb29vcHBwcHBwcHBwcXFxcnJycnJyc3NzdHR0dXV1dnZ2d3d3eHh4enp6fHx8fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKioqKi4uLjIyMjY2Njo6Oj4+PkJCQkpKSk5OTlJSUlZWVlpaWl5eXmJiYmZmZmpqanJycnp6eoKCgoqKipKSkpaWlp6enqampqqqqq6urrKysrKysra2tra2trq6urq6urq6urq6ur6+vr6+vr6+vr6+vsLCwsLCwsbGxsrKysrKys7OztLS0tLS0tbW1tra2t7e3uLi4ubm5urq6vLy8vb29v7+/wcHBwcHBwsLCwsLCwsLCw8PDw8PDxMTExcXFxcXFxsbGx8fHyMjIysrKy8vLz8/P0tLS1dXV19fX2tra3Nzc3d3d3t7e39/f4ODg4eHh4uLi4uLi4+Pj5OTk5eXl5+fn6+vr7u7u8PDw8vLy9PT09vb29/f3+Pj4+fn5+fn5+vr6+vr6+/v7/Pz8/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////CP4A/wkcSLCgwYMIEypcyLChQ4P48D1MiC8ewXgWB447N1GgOXLvBmIc+C3OpI7/PpoTmfHfojibULojR26dwJH/nMWJ8w3lv3Pkyt3MuCcOqIfhxKUTiK8cOXcErcXZw/EfNlCPEr775s3bOIvvlhYM1vPcKj9+CFU92C5c12/tFIYrhLZSOIbmuApNCCxttIfx0rU8eA7bWp+I/4mjxpjxXoXVFkmWnMzg4sbUHieMPHlR5cSJ35ULmTAdOLENxUV7Bk4htEucqOGd9uxZtJUJxXG6dGmUuNKrn2ELSa6bQWrj/qULxpsTaoPRquFuNwwYuX/h7ob7JMrmv2+7RkM9nAZsmEBZsgSK+rTMJzlgwO7+Qy/w2qdP8idKA/ZsIH2BuHwiDErRDPPYf/+M80kvKLVzGIIpeQcaY6BVaOGFHQUEACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW11dXV9fX2BgYGFhYWJiYmNjY2RkZGVlZWVlZWZmZmdnZ2dnZ2hoaGhoaGhoaGlpaWpqampqamtra2xsbG1tbW5ubm9vb3BwcHJycnR0dHZ2dnd3d3h4eHl5eXp6ent7e319fX5+fn5+fn9/f4CAgIGBgYGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiIqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZeXl5qampycnJ6enqCgoKKioqOjo6SkpKWlpaampqampqenp6enp6enp6ioqKioqKioqKioqKioqKmpqampqampqaqqqqurq6urq6ysrK2tra6urq6urq+vr7CwsLGxsbOzs7S0tLW1tbe3t7i4uLm5ubq6uru7u7u7u7u7u7y8vLy8vL29vb29vb6+vr+/v8DAwMHBwcLCwsPDw8XFxcbGxsjIyMrKyszMzM/Pz9DQ0NLS0tTU1NbW1tfX19nZ2dvb29zc3N3d3d7e3t/f3+Dg4OLi4uTk5OXl5efn5+np6evr6+zs7O7u7vDw8PHx8fLy8vPz8/Pz8/T09PT09PX19fb29vf39/j4+Pn5+fv7+/39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////wj+AP0JHEiwoMGDCBMqXMiwoUOD8OA9TCgvHsF16wiGyzjRHzlwEgViHMgtTaOOHsGNGzhSYKE0llC+AweOnUiOytKk4YbSXzlw4W4KpJNG00Nu39oJlBcO3Dt/Ef1VS0OH47VNiBLCy3btWjh5UDkSHMaTnSo7dvzYROiOW9ds7hR6+4MWkjeG5riuTMgrrbOH8tqBTcju2tqeiAV2e8aYMTmG1QZJlmzM4LfGjiFPppy4MzxyIRG266bUIbhlyHgmXPbI0jSG6JwhQ6YMncJwlR496hRUNGpk1SSK02ZQmjh/7XbptlT6YLNptqHuwnW8Wzd/3zBteuqvW61OD6FF4eIlUJUqgZswHespDheu6/7MC7SGCdM3lM5wJRsoX6AsTOR1xAwv5fB3nkDiYHILSvAcFt+BApnDXWfSSNPZhRhm2FFAACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3V1dXZ2dnZ2dnd3d3h4eHl5eXl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi42NjZCQkJGRkZOTk5SUlJaWlpiYmJqampycnJ2dnZ6enp6enp+fn5+fn6CgoKCgoKCgoKGhoaGhoaGhoaGhoaGhoaKioqKioqOjo6Ojo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK6urq6urq+vr6+vr7CwsLCwsLGxsbGxsbKysrOzs7S0tLS0tLW1tbW1tba2tre3t7i4uLm5ubq6ury8vL29vb+/v8HBwcPDw8XFxcjIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9HR0dPT09XV1dfX19jY2Nra2tvb293d3d/f3+Hh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uzs7O7u7vDw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pj4+Pn5+fr6+vv7+/z8/P39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////wj+AP0JHEiwoMGDCBMqXMiwoUOD7Ng9TDgvHkFy5AjmmzgwXLZ3AzEOzAfPIkdx2b6FzCgwHjx5HP25y5YtnUCR/ubBg7cx5rhs226y3GmyYbWaAudpy+bO3zuQOuENrEYpUMJ306RJ4wbznTmD8zaqM+XGzR11Cdld0zpNYsJtd8omCrqQXNZwCnuZRfZQXjqYCdVVQxuzcEFsyBInZqlQ2p7Hj4UZ3KZ4MUPHkPdINszZXzxyRQ+yy+a2Ybdiwq4pNHaoUTSG55AJE0bsnEJwjA4dugQu4TrUwqRZFGfNIDRx/tjp0t2otEFj0Gw7vfUKOU1/3CBRauovm6tKD5dDvbIl8NMngZMgbT756lW28uf9TYMEiVvMY6/Wmx+YChKvmMXYUs5A+wkkDiSwxPSOTQTGJ9A53HX2zDOdVWjhhRwFBAAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3Nzc3N0dHR1dXV2dnZ3d3d4eHh5eXl7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaIiIiKioqLi4uNjY2Ojo6QkJCRkZGSkpKTk5OUlJSVlZWVlZWWlpaWlpaXl5eXl5eYmJiYmJiZmZmampqampqbm5ucnJydnZ2enp6enp6fn5+goKChoaGioqKjo6OlpaWmpqanp6epqamqqqqrq6urq6urq6usrKysrKysrKytra2urq6urq6vr6+wsLCxsbGysrKzs7O0tLS2tra3t7e5ubm7u7u+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzMzMzNzc3Pz8/R0dHT09PU1NTW1tbZ2dna2trc3Nze3t7f39/g4ODh4eHh4eHi4uLi4uLj4+Pj4+Pl5eXm5ubo6Ojp6enr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT29vb4+Pj6+vr8/Pz9/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////8I/gD9CRxIsKDBgwgTKlzIsKFDg+vWPUwYDx7BcOEI4sM3UWA3au8GYhw4j527jv7AUcsmMqNAd+xCdnRHjZo6gSP9xWPHbh5Kf+KoWcPpsl3Mh9GuSdRpjdrJdyF3tuPYEB40Z86yxfP3Dp1BeD4fupuGFdrJnwjLXXWJ9mC8dVvbymVY7Zddu+QYRqPDly8vg9ju4tXb1+9ctPDKWUzoDtvZht124aKm8BegQ88YpguGCxevdArFHQIECJM4xpJxQbMY1GCzcf7c0SJ96LHBXstA+4P36tRpbNj8dVP0SCY2VJYeHjvFSmCmTAIfKdL1U9ypU9ecQ/cXTZGibiiDKZ3aNfD5QFKKaKHsxepc+e3+xilKhRIeO4LmB6aTKbdZs8MABihgQgEBACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2tra2xsbG1tbW5ubm9vb3BwcHFxcXNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4GBgYODg4SEhIaGhoeHh4mJiYqKiouLi4yMjI2NjY6Ojo6Ojo+Pj4+Pj5CQkJCQkJGRkZGRkZKSkpKSkpOTk5SUlJWVlZaWlpeXl5eXl5iYmJmZmZqampubm5ycnJ6enp+fn6CgoKKioqOjo6SkpKSkpKSkpKWlpaWlpaWlpaampqenp6enp6ioqKmpqaqqqqurq6ysrK2tra+vr7CwsLKysrS0tLe3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcfHx8vLy87OztHR0dPT09XV1dfX19jY2NnZ2dra2tvb29vb29zc3N3d3d7e3uDg4OHh4eLi4uPj4+Tk5OXl5eXl5ebm5ufn5+fn5+jo6Onp6erq6uvr6+3t7e/v7/Hx8fPz8/X19fb29vf39/j4+Pj4+Pn5+fr6+vv7+/z8/P39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////wj+AP0JHEiwoMGDCBMqXMiwoUOD5Mg9TOiOHcFq1Qi+gzdRoLRk6AZiHOhOXLmO/qoleyYyo0ByJlGaS5ZMYkqX6cSJc4fS37VkywSO9DdOnLmHx5id9OduWbKj5875ayduHEd/8NpZRLjOWLFi0XiiE2cQHU+m69IqPIfs6zGpCeGlXdfuqkJwXq8pdJf23UN35c7G7Um4IDNciBF/Y5iMjWPHtgxGS6yY8WPIhTOzC7cVIbppIR1WowUraMJdeAAdY0huFyxYtGwi3AYID55J2xKeIw3rmEVvpgke8+YP3SvbgEIftFXMJjtUn4hPm5ZyEKJ0HkVFeijsUymBkyY/CUQ0qFZPb58+sfQXXmCyQYNcTuT1idbA9gI7DXqF8lapcfeJJ5A3g4yCEjtHBUgQOdhl5o8xxjgo4YQUNhQQACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHp6enx8fH19fX5+foCAgIGBgYODg4SEhIWFhYWFhYaGhoeHh4eHh4iIiIiIiImJiYmJiYqKioqKiouLi4yMjIyMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpiYmJmZmZubm5ycnJ2dnZ2dnZ2dnZ6enp6enp6enp+fn6CgoKCgoKGhoaKioqOjo6SkpKWlpaampqioqKmpqaurq62trbCwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcPDw8XFxcfHx8rKys3Nzc/Pz9DQ0NLS0tPT09TU1NXV1dXV1dbW1tbW1tfX19nZ2dra2tvb29zc3N3d3d7e3t/f39/f3+Dg4OHh4eHh4eLi4uPj4+Tk5OXl5ebm5ufn5+np6evr6+3t7e/v7/Ly8vT09PX19ff39/j4+Pn5+fr6+vr6+vv7+/z8/P39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////wj+AP0JHEiwoMGDCBMqXMiwoUOD48Y9TPhOHUFo0Ai+gzdRILRi5wZiHNium8SO0ootE5lRoLhu5Dr6M1es2MmR/s5169ZOpj9rxYx5bOmtW7mHw5Id9ffOWDFzM6Gq6+aNoz9356AiTBesV69nPc+FM2iu57105cqZu5eQptdgWhG+M5f23DuG4LpaU6hO7bqH7cr1THjPHVufiAcmg8WYMbiG8CJHPnyxsWPIkuFRTuxznbi/CdNNS/ewWitUyBTegpOnGENytFChYhUzoTc8cOAw8pbw3GlUw/56S2aQ2ON0qnLnIY3wFbDa6jxl4i1N2s89gphP47Tooa9MngRALuruD9CeVz69ZcoUTTx5Y3v27O14K5OrgeMHXtqjSiYsTyf5k59A4OwRXkfqxCUgeQKVwxxnwwzD2YQUVthRQAAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBycnJ0dHR1dXV3d3d4eHh5eXl7e3t8fHx9fX19fX1+fn5/f39/f3+AgICAgICBgYGBgYGCgoKCgoKDg4OEhISEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6QkJCRkZGTk5OUlJSVlZWVlZWVlZWWlpaWlpaWlpaXl5eYmJiYmJiZmZmampqbm5ucnJydnZ2enp6goKChoaGjo6OlpaWoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq8vLy+vr7AwMDCwsLDw8PExMTGxsbHx8fIyMjJycnLy8vMzMzNzc3Ozs7Pz8/R0dHS0tLT09PU1NTV1dXW1tbX19fY2NjY2NjZ2dna2trb29vb29vc3Nzd3d3e3t7e3t7f39/g4ODh4eHi4uLk5OTn5+fp6enr6+vu7u7w8PDy8vL09PT19fX19fX29vb29vb39/f39/f4+Pj6+vr7+/v8/Pz9/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////8I/gD9CRxIsKDBgwgTKlzIsKFDg+DAPUz4jh3BZMkIvos3UaAyX+YGYhzY7tq3jv6c+TomMqNAb9ckdiTny1c4gSP9lbt2rR1Kf9N8BcPpUtu1mw55GRMn8F0wX+T8kYvK7po2jv7ckWOKUJ2uWrWUufNn7mRBcj7jlQsXThzWg+V+gc1VTqE7cWzHjV347Ss1hebaqnt4dy/CeO7e/lzsD1mqx4/NKnyHrnJlwwObQY7MkLJldJgZo3QHLnRBdNTQPaRmKhTLhLPQxBm6UJyrUKFMcUXoLQ4aNIe8JSzXOpSvsd+QGfR1Eh2p33FUI0Sliyu7TJFOSpPm7xqdPoOBSW4y9DBXJEsCBw0SuIcOqp/fIkVyln69v2J06FxDGSvSqYHqDRQJHaSgtIoluwUo0Dd0dIISO1EBaJ9A44QnWi+9iKbhhhx2FBAAIfkECQQA/gAsAAAAACAAIACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoampqbGxsbW1tb29vcHBwcXFxc3NzdHR0dXV1dXV1dnZ2d3d3d3d3eHh4eHh4eXl5eXl5enp6enp6e3t7e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEhYWFh4eHiIiIioqKi4uLjY2NjY2Njo6Ojo6Ojo6Oj4+Pj4+Pj4+PkJCQkZGRkZGRkpKSk5OTlJSUlZWVlpaWl5eXmZmZmpqanJycnp6eoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1t7e3ubm5urq6vLy8vb29v7+/v7+/wMDAwcHBwsLCw8PDxMTExMTExsbGyMjIysrKy8vLzMzMzc3Nzs7Oz8/P0NDQ0NDQ0dHR0tLS09PT1NTU1NTU1dXV19fX19fX2NjY2dnZ2dnZ2tra29vb3d3d3t7e4ODg4eHh4+Pj5OTk5ubm6Ojo6urq7Ozs7u7u7+/v8PDw8fHx8vLy8/Pz9PT09fX19vb29/f3+fn5+vr6+/v7/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////CP4A/QkcSLCgwYMIEypcyLChQ4PevD1MCI8dQWLECLqLN1HgsVzoBmIc2C7ato7+mOXKKHCkQG3RJHYklysXuJYsyUWL1g6lv2i5euEUSC3at4e2iIkTCI9XLnL+yEFVF40aR3/uxN1EqC5Wq1bG3PlD183guJ7xxnXr5u3qwXK5vsoqp9Cdt7XhxC7k5nWaQnNs1T3MqhdhvI0+ExMsFqpx47IL3Umd3LOgMsePGUqeTK6y4sTuvhU2PHHap0zFFMZ7985tQnGoMmXytDThPdbv4N1LiO50plxiuxkzyEsmPNwKQ9Wq3U4SorLSpPnDxqbOOoHx4sF7SAvRI4F79j8IrMOGlM9uiBA5Ay/eHzE2bLChZIUI1MDwAxWx+YSy1KNw97XnjzdsXIJSO+YQhN9A41z3mT81PSjhhBQ2FBAAIfkECQQA/gAsAAAAACAAIACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhY2NjZWVlZmZmaGhoaWlpa2trbGxsbW1tbm5ubm5ub29vcHBwcHBwcXFxcXFxcnJycnJyc3Nzc3Nzc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19f39/gICAgoKCg4ODhYWFhoaGh4eHh4eHiIiIiIiIiIiIiYmJiYmJiYmJioqKi4uLi4uLjIyMjY2Njo6Oj4+PkJCQkZGRk5OTlJSUlpaWmJiYm5ubnJycnZ2dnp6en5+foKCgoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxs7OztbW1tra2t7e3ubm5ubm5urq6u7u7vLy8vLy8vb29vr6+vr6+v7+/wMDAwcHBwsLCxMTExMTExcXFxsbGx8fHyMjIycnJysrKy8vLy8vLzMzMzs7Oz8/P0NDQ0tLS09PT1dXV1tbW2NjY2dnZ29vb3Nzc3t7e4ODg4uLi4+Pj5OTk5OTk5OTk5eXl5ubm5+fn6enp6urq7Ozs7e3t7+/v8fHx8vLy8/Pz9PT09fX19vb2+Pj4+vr6/Pz8/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////CP4A/QkcSLCgwYMIEypcyLChQ4PatD1M+I4dwV+/CL6DN1GgMVnoBmIcyM6ZtY7+mMkKJjKjQGrOsKEsJ0vWNoEj/ZVz5swiSmiyauF0Cc2ZRIewhI0T+M6WrHI6oaZzBo2jv3bgsiVUt8qUqWPv/KHTWnCcRXjirFm7ZvXguVpeWZ1T6O6aWm3uGGbrGk1hubUhHb4bFzYhvHZtUSoeWEyTY8dH6YabPDmdwWaPITN0R7ny4s8C3XHLm/AevHsPpV2KVEzhO3XrEiMcFypSpEtLE8Zbp04du3gJ0a2ORCuvNmSl3fVehxrhple52yUKJDFaX4Pw3Pls+CpQIoF06CmAFqgtUKBn4MWPPxVI08Dw4/2BSiTuvXrQ7ebaj2/w1i3+AAYoYEEBAQAh+QQJBAD5ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlbW1tdXV1eXl5gYGBhYWFjY2NkZGRlZWVmZmZmZmZnZ2doaGhoaGhpaWlpaWlqampqampra2tra2tra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV3d3d4eHh6enp7e3t9fX1+fn5/f39/f3+AgICAgICAgICBgYGBgYGBgYGCgoKDg4ODg4OEhISFhYWGhoaHh4eIiIiJiYmLi4uMjIyOjo6QkJCTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqsrKyurq6vr6+wsLCysrKysrKzs7O0tLS1tbW1tbW2tra3t7e3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDAwMDBwcHCwsLDw8PExMTFxcXFxcXGxsbGxsbHx8fIyMjJycnKysrNzc3Pz8/R0dHT09PU1NTX19fZ2dna2trc3Nzd3d3d3d3e3t7e3t7f39/f39/f39/g4ODg4ODh4eHj4+Pm5ubq6urt7e3v7+/x8fHy8vL09PT19fX29vb39/f4+Pj4+Pj5+fn7+/v8/Pz8/Pz9/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v4I/gD/CRxIsKDBgwgTKlzIsKFDg9asPUzoDh1BXLgItns3UWCwVeUGYhyI7li0jv+OrdolMqPAZ8emoRy3ahU3gSP/jTt2zCLKZqtc4XS57Fi1h6p6iRPoztWqcTqhmju2jOM/dNxkIkRHypMnYu7+lTtaUJzFd+GgQZNm9SA5V15LkVOoTppaauoYVuv6TOG4tSEduhMXNuE7dG1RKh4obJJjx9gYYuVGmVtggsseQ5ZcmfLlxYvXfVunUN47eQ+hQVI0TGG6ceRILxTHSZEiSEsNkxs3rlziguVWK4JF2loxg/FQy0PHmxxqhJRU5VZHKI9Etf/ktWs38J25zwtVP+UJJJANG4Hbfzu0liePs/Ln/8Xb/nyiqDySBprvvhFlpkC5/bOfQNoVNpE6c+kXn0D5gEYQLbQ4KOGEFHYUEAAh+QQJBAD5ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVnZ2dpaWlra2tsbGxubm5vb29wcHBxcXFycnJzc3N0dHR0dHR1dXV2dnZ2dnZ2dnZ3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl6enp7e3t7e3t8fHx9fX1+fn5/f3+AgICBgYGDg4OEhISGhoaIiIiLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKkpKSmpqanp6eoqKiqqqqqqqqrq6usrKytra2tra2urq6vr6+vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi4uLi5ubm6urq7u7u8vLy9vb29vb2+vr6+vr6/v7/AwMDBwcHCwsLDw8PExMTGxsbHx8fJycnMzMzOzs7Q0NDS0tLT09PV1dXW1tbX19fX19fY2NjZ2dnZ2dna2trb29vb29vc3Nzc3Nzd3d3d3d3g4ODi4uLm5ubq6urt7e3x8fHz8/P09PT19fX39/f39/f4+Pj4+Pj5+fn6+vr6+vr7+/v8/Pz8/Pz9/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v4I/gD/CRxIsKDBgwgTKlzIsKFDg9OoPUy4jhxBWLAInms3UaCuUeIGYhxI7hezjv+GjaIlMqNAZb+coQw3alQ3gSP/gfv1yyJKZKNO4XRJ7Be0h6NygRO4ztSocDqXjvtFjOM/ctdkIiTX6dKlYOr+iYtm8JtFeN2UKWMGL2E4VF47QU1YjplaaOUYUuu6TCG4tXMbqgMXNiE8cm1RKi74a5Fjx9cYkptGmXLggcceQ5Zc2fLizwLPdTunUJ46eQ+ZJRL0S+G4b+DyLgRXSZAgREsTtgP37Vs4qwfHrRbEinS2YQbVtZUnrjc41Agbkcp9jg+bbATdjRuXT6A6cZcXP5Jik0egPOjbSaPMxoaNMvPQ1213h5ITm0UDz5McJ3vipDy5/aOfQPDwh9I5IeUHnXndgfZPPg06KOGEFC4UEAAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5gYGBiYmJkZGRlZWVnZ2doaGhpaWlqampra2tsbGxtbW1tbW1ubm5vb29vb29vb29wcHBwcHBxcXFxcXFxcXFycnJycnJycnJzc3N0dHR0dHR1dXV2dnZ3d3d4eHh5eXl6enp8fHx9fX1/f3+BgYGEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5udnZ2fn5+goKChoaGjo6Ojo6OkpKSlpaWmpqampqanp6eoqKioqKipqamqqqqsrKytra2tra2urq6vr6+wsLCxsbGxsbGysrKzs7Ozs7O0tLS1tbW2tra2tra3t7e4uLi5ubm5ubm7u7u8vLy+vr6/v7/BwcHDw8PFxcXGxsbIyMjKysrLy8vNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbW1tbX19fX19fY2NjY2Nja2trc3Nze3t7g4ODi4uLl5eXn5+fp6enr6+vu7u7w8PDz8/P09PT19fX19fX19fX29vb29vb39/f39/f4+Pj4+Pj5+fn6+vr7+/v9/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////8I/gD9CRxIsKDBgwgTKlzIsKFDg9CgPUzobhzBVKkIpns3UaAtTuAGYhwo7paxjv58cXIlMqPAYbeQofTGiRM2gSP9cbt1SxxKf8I4gcLp0tctZg85zeIm0B0oTt78devmD9wtXxz9iYt2LKG4So8e9VpXVWJBbT7hYRs2jBi8hOBEhbUUMuG4YmyTWVwYDWwxhdzafnu4jhvZhPDEvf3JeGCvQZAhX2Mobplly1ELCossmfJlzI1Dp9OWTqG8dfIeIhO0x5fCcNm07VXY7dGePYKoJmynLVs2bu0ShmO9B1VpbMAMmuMo75tvbakRGvKk25wcMjfhvXX3DVz0dd6YRDr0REaOQHPmBIL75hMlNjJkiJ1P7y/dt2/uUF4iQ2gg+oHhsIdSI3KI589/Ar0jYEfm1DUfQfFEF9o7WYVm4YUYPhQQACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5WVlZeXl5iYmJmZmZubm5ubm5ycnJ2dnZ6enp6enp+fn6CgoKCgoKGhoaKioqSkpKWlpaWlpaampqenp6ioqKmpqampqaqqqqurq6urq6ysrK2tra6urq6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tri4uLq6ur29vb6+vr+/v8DAwMHBwcPDw8TExMbGxsfHx8jIyMnJycrKyszMzM3Nzc7Ozs/Pz9DQ0NHR0dHR0dLS0tTU1NbW1tjY2Nra2tzc3N7e3uDg4OPj4+Tk5Obm5ujo6Orq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vb29vb29vb29vf39/f39/f39/j4+Pr6+vv7+/39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////wj+AP0JHEiwoMGDCBMqXMiwoUODy5g9TOhuHMFQoQiWezdRYCxK2wZiHAjuFbCO/nBRQiUyo0Ber4ahxEaJUjSBI/1Ze/UKHEp/vChlwumS1itkDyu9sibQHSZK2HQy3faKFkd/35gJSxjO0aFDt9j52yax4DSf8KDt2uULXkJtm74+0qZw3K+1xCwufOY1mMJqbLM9ZGdNbEJ439z+XDzQlp7Hj28u9EascuVrBnlBjsyQsmVimBkzNkfNnMJ45eI9LHbHTS6F26BJ+8bwWiI3bu6ERshOGjRo1Awf7NbazSjT8uQZFMcxHrbf0lQjBJRp97t3yq/7c2ftmnJ/5a4/UXsITztW2v6uWev2U97179/Ql7NmzR3KeO8Unx+ozVrIjuXhM1B8A73j308CDoieQPB8Jxo7wokm4YQUOhQQACH5BAkEAP4ALAAAAAAgACAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi42NjY+Pj5CQkJGRkZOTk5OTk5SUlJWVlZaWlpaWlpeXl5iYmJiYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaGhoaKioqOjo6SkpKWlpaampqampqenp6enp6ioqKmpqaqqqqurq6ysrK2tra6urrCwsLGxsbOzs7W1tba2tre3t7i4uLm5ubq6ury8vL29vb+/v8DAwMHBwcPDw8TExMXFxcbGxsjIyMrKysrKysvLy8zMzMzMzM3Nzc/Pz9HR0dLS0tTU1NbW1tfX19jY2Nra2tzc3N7e3uDg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Orq6uvr6+3t7e7u7u/v7/Dw8PHx8fLy8vPz8/Pz8/T09PT09PX19fX19fb29vb29vj4+Pr6+vv7+/z8/P7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////wj+AP0JHEiwoMGDCBMqXMiwoUODyZI9TOhuHMFMmQieezdRICtG3gZiHBgO1a6O/mQxEiUyo8BbqH6hvMaIkTOBI/1RQ4UqHEp/thhFwunSFSpiDxutqibQXSRG1/xVY9oNlSuO/r4dO4kwHCJAgGS18+dNYsFoPt8to0ULF9aD3CyBRcRN4bhbbH9ZXLjsay+F0tpGddiu2tiE7769/ck45ZzHj5sx/NarcmWmBXNBjjzZ8uXGoBvGKxcvtMFtypiBM01wHTNlyp6tmxhvsUBx7vzFqwabWemG99KdK+0udztp036Xm/bsobtz6QRu2yZwmrS6KOOdOwdPOnV/5KQrSTs88fls7wOrSdOGsl06eQOnD3QnbfDEe/cIyh/47jfocuWwJuCABBYUEAAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISGhoaIiIiJiYmKioqMjIyMjIyNjY2Ojo6Pj4+Pj4+QkJCRkZGRkZGSkpKTk5OVlZWWlpaWlpaXl5eYmJiZmZmampqampqbm5ucnJycnJydnZ2enp6fn5+fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6epqamrq6utra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi6urq7u7u9vb2+vr7AwMDCwsLExMTFxcXGxsbGxsbHx8fIyMjIyMjJycnKysrNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTW1tbY2NjZ2dna2trc3Nzd3d3d3d3e3t7e3t7g4ODh4eHj4+Pk5OTm5ubn5+fp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT09PT09PT19fX39/f4+Pj6+vr8/Pz9/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////8I/gD9CRxIsKDBgwgTKlzIsKFDg8WKPUzorhxBSZIIpoM3UaCpQt4GYhw4DpStjv5YFfIkMqNAWKB2ocxWqBAzgSP9TQMFahxKf7IKKcLp8hQoXw8PlaIm0J2iQtn8WbPmzxuoUxz9gQN2EuE4QHjwsHJX1ZjBZz7hHWPFClbWg90ihQ3UTWE5WGxzWVyIDKwuhdDaRnXojhrZhPDAvf3JOOWax49vLvyGq3JlpgVrQY7MkLJlXJgbN5a3MJ65eA/jvXuHOuE2YMa+MZQHb/U70gnXFQMGbNm6hPhst4Z3mGA4svGm8TbW+iA8eLjljQvHcd3vdMyetTYHTdnDdOHEPQnMNvgZs20/4YU7Pn4wOWbM0qE8F26vP/IDpTEbPNGcuOb4NcVMaA/J09x9/PkDz4GMlWOfaBBGKKFDAQEAIfkECQQA/gAsAAAAACAAIACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fn5+gICAgYGBgoKChISEhISEhYWFhoaGh4eHh4eHiIiIiYmJiYmJioqKi4uLjIyMjY2Njo6Oj4+PkJCQkZGRkpKSkpKSk5OTlJSUlZWVlpaWl5eXl5eXmJiYmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foKCgoqKipKSkpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsLCwsbGxs7OztLS0tra2uLi4urq6vLy8vr6+v7+/wMDAwcHBwcHBwsLCw8PDw8PDxMTExMTExsbGyMjIycnJycnJysrKy8vLzMzMzs7Ozs7Oz8/P0NDQ0dHR0tLS1NTU1dXV1dXV1tbW19fX19fX2NjY2NjY2dnZ2tra3Nzc3t7e4ODg4eHh4+Pj5OTk5ubm5+fn6enp6+vr7e3t7u7u8PDw8PDw8fHx8vLy8vLy8/Pz8/Pz9PT09vb2+Pj4+vr6+/v7/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////CP4A/QkcSLCgwYMIEypcyLChQ4PChj1M6M4cQUWKCKp7N1EgqD7gBmIcOC5TrI7+TPWxJDKjQFWZbKHc1qePMoEj/V3LlGkcSn+t+gzC6RJUplwP/4DSJtCdoD7b/GXL5u9bJlAc/YnT9SohOTxw4Jhy5w+cxILOfMIbVqoUKngJvykKm+ebQnKp2tIix5AYWJkJm7mN6tCdNrIJ4YmD+7PxQHzzIkduCC6WZcvVDEKWPI/yZcyOQ+OLh08hPHOMG8JDdy4rwm25eoVcKI/duXPo5ClU1ytXLmPqEs5jfc5d6XfBC4Zr5w+eNN+9UhtU1063v3nfvHFUF1zdMWXWzUg5M/awnDe7/qpl9qfsGOGO77x5Y55+/bhjx5JPJOdN3ED1A0FzDFUdjfNNagAK1M4x6000j3UCJSjQOxA6No5PoWWo4YYTBQQAIfkECQQA/gAsAAAAACAAIACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dnZ2eHh4eXl5enp6fHx8fHx8fX19fn5+f39/f39/gICAgYGBgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKioqKi4uLjIyMjY2Njo6Oj4+Pj4+PkJCQkJCQkZGRkpKSk5OTlJSUlZWVlpaWl5eXmJiYmpqanJycnp6en5+foKCgoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqampqqqqq6urrKysrq6usLCwsrKytLS0tra2t7e3ubm5urq6u7u7vLy8vLy8vb29vr6+vr6+v7+/v7+/wcHBwsLCw8PDw8PDxMTExsbGxsbGx8fHyMjIycnJycnJysrKysrKy8vLzMzMzc3Nzs7Oz8/Pz8/P0NDQ0dHR0dHR0tLS09PT1NTU1dXV1dXV2NjY2tra3Nzc3t7e4ODg4uLi4+Pj5eXl5+fn6enp6urq7Ozs7e3t7u7u7u7u7+/v8PDw8fHx8vLy8/Pz9PT09vb2+Pj4+vr6+/v7/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////CP4A/QkcSLCgwYMIEypcyLChQ4O+fD1M6K4cQUGCCKZ7N1HgpjrgBmIcOC4Sq47+QNWJJDKjQFKRYKHcVqfOMoEj/WGLFGkcSn+o6vjB6RJTJFoP8WjSJtAdnzrb/GXL5u9bJEwc/YWzhSohuTho0IRy5w/cL4POfMLz1amTKHgJvREKG8ebQnKi2roix3AY2FgKm7ll6tCdNrIJ4YWD+7PxQHjuIkeOxxCcqsuXrRmELNkd5YWWMavS7NjxPHjzFMIrx7ihO3Li2inUJovWN4arxYkj1/qgulqyZAVTl1AebHHqUr9LZxAcO3/wogWn1bsguXSM53HbxjEd83S/iEp9Jrcs2ENx27gJhAZN4LBfhDu+27Zt3fr2/sT9+sW8Y7htdt03UDO/YIMSONxk5Q97A7HzyzQozfOZgAO9M6Fj4YRT2oYcdthRQAAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxubm5wcHBxcXFycnJ0dHR0dHR1dXV2dnZ3d3d3d3d4eHh5eXl5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKCgoKDg4OEhISFhYWGhoaHh4eHh4eIiIiIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCSkpKUlJSWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGhoaGioqKjo6OkpKSlpaWmpqanp6eqqqqsrKyurq6vr6+xsbGysrK0tLS1tbW2tra3t7e3t7e4uLi5ubm6urq7u7u7u7u8vLy9vb2+vr6/v7/AwMDBwcHBwcHCwsLCwsLDw8PDw8PExMTFxcXFxcXGxsbHx8fHx8fIyMjJycnKysrKysrLy8vMzMzNzc3Ozs7Pz8/Pz8/Q0NDT09PW1tbY2Njb29vd3d3f39/g4ODh4eHi4uLj4+Pk5OTl5eXn5+fo6Ojq6urs7Ozu7u7w8PDx8fHz8/P09PT19fX29vb39/f4+Pj5+fn6+vr8/Pz9/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////8I/gD9CRxIsKDBgwgTKlzIsKFDg7l0PUyojhxBPXoImmM3USClNt4GYhwoLpGpjv42tWEkMqPATolUocTWpo0ygSP9VUuUSBxKf6Xa2MHpMlKiVw/fwYsnUJ2dNtj8WbPmj1uiSBz9fYM1KuG9d2DhCfTGy2Azn+1yVaqkqZ1XeGDf3VM4btNaVOMYxgurcBlbqg+ZKmz3ze3PwwPVlVu82B1DbqIiR55mkB3jxo8lT0bMOV47wQjdjXPsMJ03buYUWlvlahtDd+G4cetGGqG5VqtW5UqNEN5pbuSYprNYkBs6f+6c5XZV2yC40QLhXauWzt9i67h6ifU37liuh9+qQl0TmCyZQF64qv1MV61aOfLm/YHDhet9x27Vsg0svx8XNZTaXJOVP/wJhA4uz6AET3MFCrTOdpx5ExJnFFZo4UQBAQAh+QQJBAD+ACwAAAAAIAAgAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVnZ2dpaWlqampra2ttbW1tbW1ubm5vb29wcHBwcHBxcXFycnJycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t7e3t8fHx9fX1+fn5/f3+AgICAgICBgYGBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmLi4uNjY2Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmZmZmampqbm5ucnJydnZ2enp6fn5+hoaGioqKjo6OlpaWnp6epqamqqqqsrKytra2vr6+wsLCxsbGysrKysrK0tLS1tbW2tra3t7e4uLi5ubm5ubm6urq6urq7u7u7u7u7u7u8vLy8vLy8vLy9vb2+vr6/v7+/v7/AwMDAwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Pz8/S0tLU1NTW1tbX19fZ2dnb29vc3Nzd3d3e3t7g4ODh4eHi4uLj4+Pk5OTl5eXn5+fq6urt7e3w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v9/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////8I/gD9CRxIsKDBgwgTKlzIsKFDg7VqPXw4Zw7BceomIqw4MJygUBoPchR4SVCpkAZHRhMkKBzKgiMXCVL1MN06eAelSfO3TdCijP66rdqU8B66c+fY3UuozCU7WY4cTWKXEF46pOhwJhQ3KaoocQzfHW2nEJnUaQ/vwVuakF03qi/j+isXrm7ddQy3adq795lBc3bv5uXbV25ceOq0ImwXjqzDctesjVMorRQqbQzXbbNm7RrehONQlSoVazJCd5GthcNpDmzBbOT8tVM2GpXjg9nAfYYXDZo5f+LAinsly53AcMRkPdwGLZrAYMEEznrlPKQ5aNBMQxfY7dUr1xOxKUGjNnC7QGKvnIW0Fi1d+egCyb1KFhLebX/mBaYzbnjbNsMABihgQwEBADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />
                        &nbsp;{{ processingText }}
                    </span>
                    <span class="swbcBlue visible-xs-inline-block">
                        <img src="data:image/gif;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" />
                        &nbsp;{{ mobileProcessingText }}
                    </span>
                </div>
                <div *ngIf="isSaved" class="messageContainer">
                    <span class="swbcGreen hidden-xs">
                        <i class="glyphicon glyphicon-ok"></i>
                        &nbsp;{{ processedText }}
                    </span>
                    <span class="swbcGreen visible-xs-inline-block">
                        <i class="glyphicon glyphicon-ok"></i>
                        &nbsp;{{ mobileProcessedText }}
                    </span>
                </div>
                <div *ngIf="isError" class="messageContainer">
                    <span class="swbcRed hidden-xs">
                        <i class="glyphicon glyphicon-exclamation-sign"></i>
                        &nbsp;{{ failedText }}
                    </span>
                    <span class="swbcRed visible-xs-inline-block">
                        <i class="glyphicon glyphicon-exclamation-sign"></i>
                        &nbsp;{{ mobileFailedText }}
                    </span>
                </div>
            </div>
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnChanges {
    @Input() isSaving: boolean = false;
    @Input() isSaved: boolean = false;
    @Input() isError: boolean = false;
    @Input() containerElement: HTMLElement;
    @Input() processingText: string;
    @Input() processedText: string;
    @Input() failedText: string;
    @Input() mobileProcessingText: string;
    @Input() mobileProcessedText: string;
    @Input() mobileFailedText: string;

    private isOpen;
    private modalElement;
    private modalClassName: BehaviorSubject<string> = new BehaviorSubject<string>('overlay');

    constructor(private element: ElementRef) {

    }

    ngOnChanges(changes: { [key: string]: SimpleChange; }) {
        if (!this.modalElement) {
            this.containerElement.style.position = 'relative';
            this.modalElement = this.element.nativeElement.querySelector('.modalElement');
        }

        if (this.modalElement) {
            if (!this.isOpen && this.isSaving === true || this.isSaved === true || this.isError === true) {
                this.toggleOpen(true);
            }
            else if (this.isOpen && this.isSaving === false && this.isSaved === false && this.isError === false) {
                this.toggleOpen(false);
            }
        }
    }

    private toggleOpen(isOpen: boolean) {
        if (isOpen) {
            this.isOpen = true;
            this.modalClassName.next('overlay openedModal');
        }
        else {
            this.isOpen = false;
            this.modalClassName.next('overlay closedModal');
        }
    }
}

@Component({
    selector: 'windowOverlayComponent',
    template:
        `<div [id]="id" class="modal fade" role="dialog" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog {{ sizeClass }}" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modalLabel">{{ header }}</h4>
                </div>
                <div class="modal-body edit-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowOverlayComponent implements AfterViewInit {
    @Input() header: string;
    @Input() sizeClass: string = "modal-md";
    @Input() allowClickOff: boolean = true;
    @Output() hideEvent: EventEmitter<any> = new EventEmitter<any>();

    private $modal: any;
    private id = 'windowOverlay_' + MathHelpers.random();

    constructor(private element: ElementRef) { }

    ngAfterViewInit() {
        this.$modal = jQuery(this.element.nativeElement.querySelector('#' + this.id));
        this.$modal.appendTo('body');
        this.$modal.on('hide.bs.modal', (e) => {
            this.hideEvent.emit();
        });
    }

    show() {
        if (this.allowClickOff) {
            this.$modal.modal('show');
        }
        else {
            this.$modal.modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    }

    hide() {
        this.$modal.modal('hide');
    }
}

@Component({
    selector: 'widgetComponent',
    template:
        `<div class="widget">
        <div [ngClass]="css + ' tilePadding'">
            <div [ngClass]="bodyClass | async">            
                <div *ngIf="showHeader == true" [ngClass]="headerClass | async">
                    <div class="tileHeaderContent clearfix">                
                        <div class="tileHeader"><ng-content select="[header]"></ng-content></div>
                    </div>
                </div>
                <div class="tilePadding">
                    <ng-content select="[body]"></ng-content>
                </div>
            </div>
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent implements OnChanges {
    @Input() theme: string;
    @Input() css: string;
    @Input() showHeader: boolean = true;

    private headerClass: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private bodyClass: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['theme']) {
            this.setBodyClass();
            this.setHeaderClass();
        }
    }

    private setHeaderClass() {
        let className =
            this.theme == 'blue' ? 'tilePadding blueHeader' :
                this.theme == 'gray' ? 'tilePadding grayHeader' :
                    this.theme == 'orange' ? 'tilePadding orangeHeader' : 'tilePadding greenHeader';

        this.headerClass.next(className);
    }

    private setBodyClass() {
        let className =
            this.theme == 'blue' ? 'tileContent blue' :
                this.theme == 'gray' ? 'tileContent gray' :
                    this.theme == 'orange' ? 'tileContent orange' : 'tileContent green';

        this.bodyClass.next(className);
    }
}

@Component({
    selector: 'datePickerComponent',
    template:
        `<div class="datepicker">
        <div>
            <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [autoLoad]="false" [message]="patternMessage" errorType="pattern" #textBoxPatternTooltip></tooltipComponent>
            <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [autoLoad]="false" [message]="requiredMessage" errorType="required" #textBoxRequiredTooltip></tooltipComponent>
            <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [autoLoad]="false" [message]="privateCustomMessage | async" errorType="customError" #textBoxCustomTooltip></tooltipComponent>
            <div class="form-group">
                <label [attr.for]="textBoxId" class="control-label">
                    {{ labelText }}<i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                </label>
                 <div class="input-group">
                    <input [id]="textBoxId" [formControl]="controlRef" type="text" class="form-control" (focus)="showCalendar()" 
                            patternValidator="^[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]$"
                            validation [controlRef]="controlRef" [requiredValidator]="isRequired" [customValidator]="privateCustomMessage | async"
                            [mask]="{ mask: '19/39/2999', placeholder: 'MM/dd/yyyy', clearIfNotMatch: false }" />

                    <i *ngIf="!controlRef.valid && controlRef.touched" 
                        class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error-input-group requiredIcon"></i>

                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" (click)="showCalendar()">
                            <i class="glyphicon glyphicon-calendar"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
        <div class="calendarContainer">
            <div *ngIf="isOpen | async" [ngClass]="calendarClassName | async">
                <div class="dateNav clearfix">
                    <div class="unit prev" (click)="prev10Year()">
                        <em class="navButton">
                            <span>10</span>
                            <span class="represent">yr</span>
                        </em>
                    </div>
                    <div class="unit prev" (click)="prevYear()">
                        <em class="navButton">
                            <span>1</span>
                            <span class="represent">yr</span>
                        </em>
                    </div>
                    <div class="unit prev" (click)="prevMonth()">
                        <em class="navButton">
                            <span>1</span>
                            <span class="represent">mo</span>
                        </em>
                    </div>
                    <div class="monyear">{{displayMonthYear.monthTxt}} {{displayMonthYear.year}}</div>
                    <div class="unit next" (click)="nextMonth()">
                        <em class="navButton">
                            <span>1</span>
                            <span class="represent">mo</span>
                        </em>
                    </div>
                    <div class="unit next" (click)="nextYear()">
                        <em class="navButton">
                            <span>1</span>
                            <span class="represent">yr</span>
                        </em>
                    </div>
                    <div class="unit next" (click)="next10Year()">
                        <em class="navButton">
                            <span>10</span>
                            <span class="represent">yr</span>
                        </em>
                    </div>
                </div>
                <div class="days">
                    <div class="clearfix">
                        <div class="unit weekdays" *ngFor="let days of weekDays">{{days}}</div>
                    </div>
                    <div class="clearfix">
                        <div *ngFor="let aDate of dates">
                            <div *ngFor="let d of aDate" (click)="cellClicked(d)" [ngClass]="d.currentDay == true ? 'unit todayDate' : (d.cmo===PREV_MONTH || d.cmo===NEXT_MONTH) ? 'unit older' : 'unit'">
                                <div [ngClass]="isInvalidDate(d) && !isNextPrevCmo(d) ? 'inactive' : isCellSelected(d) ? 'selected' : ''">
                                    <b>{{d.day}}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class DatePickerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() controlRef: FormControl;
    @Input() options: any;
    @Input() requiredMessage: string;
    @Input() patternMessage: string;
    @Input() customMessage: string;
    @Input() labelText: string;
    @Input() isRequired: boolean = false;
    @Input() controlId: string;
    @Input() form: FormGroup;
    @Input() allowMaxDate: boolean = true;

    @ViewChild('textBoxPatternTooltip') textBoxPatternTooltip: TooltipComponent;
    @ViewChild('textBoxRequiredTooltip') textBoxRequiredTooltip: TooltipComponent;
    @ViewChild('textBoxCustomTooltip') textBoxCustomTooltip: TooltipComponent;

    private privateCustomMessage: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private displayMonthYear = { monthTxt: '', monthNbr: 0, year: 0 };
    private weekDays: Array<string> = [];
    private dates: Array<Object> = [];
    private dayIdx: number = 0;
    private today: any;
    private PREV_MONTH: number = 1;
    private CURR_MONTH: number = 2;
    private NEXT_MONTH: number = 3;
    private dateFormat: string = 'MM/dd/yyyy';
    private days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    private textBoxId = 'calendar_TextBox_' + MathHelpers.random();
    private calendarClassName: BehaviorSubject<string> = new BehaviorSubject<string>('calendar');
    private documentEventsSubscription: Subscription;
    private isOpenSubscription: Subscription;

    constructor(public element: ElementRef) {
        let today = new Date();
        let dateObject = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };

        this.today = this.toString(dateObject);
    }

    ngOnInit() {
        this.initOptions();

        let clickObservable = Observable.fromEvent(document, 'click');
        let focusObservable = Observable.fromEvent(document, 'focus');
        let allObservables = Observable.merge(clickObservable, focusObservable);

        this.documentEventsSubscription = allObservables
            .subscribe((e: any) => {
                if (this.isOpen.value && e.target && this.element.nativeElement !== e.target && !this.element.nativeElement.contains(e.target)) {
                    this.isOpen.next(false);
                }
            });

        this.isOpenSubscription = this.isOpen.subscribe((value) => {
            this.calendarClassName.next(value && this.shouldOpenToTop() ? 'calendar top' : 'calendar');
        });

        if (this.dayIdx !== -1) {
            let idx = this.dayIdx;
            for (let i = 0; i < this.days.length; i++) {
                this.weekDays.push(this.options.dayLabels[this.days[idx]]);
                idx = this.days[idx] === 'sa' ? 0 : idx + 1;
            }
        }
    }

    ngOnDestroy() {
        this.documentEventsSubscription.unsubscribe();
        this.isOpenSubscription.unsubscribe();
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        var customMessageProp = changes['customMessage'];
        var controlRefProp = changes['controlRef'];

        //re-sync custom message
        if (customMessageProp) {
            this.selectDate(this.controlRef.value);
        }

        if (controlRefProp) {
            if (this.controlRef.value) { this.selectDate(this.controlRef.value); }

            this.controlRef.valueChanges.subscribe((value) => { this.selectDate(value); });
        }
    }

    ngAfterViewInit() {
        if (this.textBoxRequiredTooltip) { this.textBoxRequiredTooltip.load(); }
        if (this.textBoxCustomTooltip) { this.textBoxCustomTooltip.load(); }
        if (this.textBoxPatternTooltip) { this.textBoxPatternTooltip.load(); }
        if (this.form && this.options.maxDate && this.options.maxDate.fromControl) {
            var array = this.options.maxDate.fromControl.split('.');
            if (array !== null && array.length > 0) {
                var cntrl = array[array.length - 1];
                if (cntrl !== null && cntrl !== '' && this.form.get(cntrl) !== null) {
                    this.form.get(cntrl).valueChanges.subscribe(val => {
                        if (this.controlRef.value !== null && val !== null) {
                            var enteredDate = this.controlRef.value,
                                maxDateArray = val.split('/'),
                                enteredDateArray = enteredDate.split('/');
                            var maxDateObj = new Date(maxDateArray[2], maxDateArray[0], maxDateArray[1]);
                            var enteredDateObj = new Date(enteredDateArray[2], enteredDateArray[0], enteredDateArray[1]);
                            if (!this.allowMaxDate) {
                                maxDateObj.setDate(maxDateObj.getDate() - 1);
                            }
                            if (maxDateObj >= enteredDateObj) {
                                this.controlRef.setErrors(null);
                            }
                            else {
                                this.syncCustomMessage(false);
                                this.controlRef.setErrors({ customError: true });
                            }
                        }
                    });
                }
            }
        }
    }

    showCalendar(): void {
        this.isOpen.next(!this.isOpen.value);

        if (this.isOpen.value) {
            let y = 0, m = 0;
            let value = this.controlRef.value;
            let selectedDateObj = this.fromString(value);

            if (!value || this.isInvalidDate(selectedDateObj)) {
                let start = this.getCalendarStartMonthYear();
                y = start.year;
                m = start.month;
            }
            else {
                y = selectedDateObj.year;
                m = selectedDateObj.month;
            }

            this.displayMonthYear = { monthTxt: this.options.monthLabels[m], monthNbr: m, year: y };
            this.createMonth(m, y);
        }
    }

    prevMonth(): void {
        let m = this.displayMonthYear.monthNbr;
        let y = this.displayMonthYear.year;

        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }

        this.displayMonthYear = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.createMonth(m, y);
    }

    nextMonth(): void {
        let m = this.displayMonthYear.monthNbr;
        let y = this.displayMonthYear.year;

        if (m === 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }

        this.displayMonthYear = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.createMonth(m, y);
    }

    prevYear(): void {
        this.displayMonthYear.year--;
        this.createMonth(this.displayMonthYear.monthNbr, this.displayMonthYear.year);
    }

    prev10Year(): void {
        this.displayMonthYear.year -= 10;
        this.createMonth(this.displayMonthYear.monthNbr, this.displayMonthYear.year);
    }

    nextYear(): void {
        this.displayMonthYear.year++;
        this.createMonth(this.displayMonthYear.monthNbr, this.displayMonthYear.year);
    }

    next10Year(): void {
        this.displayMonthYear.year += 10;
        this.createMonth(this.displayMonthYear.monthNbr, this.displayMonthYear.year);
    }

    selectDate(date: any, fromDropDown: boolean = false) {
        if (date && this.isInvalidDate(date) == true) {
            this.isOpen.next(false);
            this.syncCustomMessage(false);
            return;
        }

        this.syncCustomMessage(true);

        //typically the value change subscription is triggered when value is changed in the textbox either by typing/pasting or even setting the controlRef value
        //except the dropdown cell click as it has no association with the controlRef or the dropdown content
        if (fromDropDown) {
            this.writeValue(date);
        }

        this.isOpen.next(false);
    }

    private syncCustomMessage(isValid: boolean) {
        var hasCustomMessage = this.customMessage && this.customMessage !== '' ? true : false;

        if (!isValid && !hasCustomMessage) {
            this.privateCustomMessage.next(this.options.rangeMessage);
        }
        else if (hasCustomMessage) {
            this.privateCustomMessage.next(this.customMessage);
        }
        else {
            this.privateCustomMessage.next(null);
        }
    }

    private isCellSelected(date) {
        var dateString = this.toString(date);

        return dateString == this.controlRef.value && date.cmo == this.CURR_MONTH;
    }

    private isInvalidDate(date) {
        var isInvalid = false;
        var dateObject;

        if (typeof date == typeof '') { dateObject = this.fromString(date); }
        else { dateObject = date; }

        if (dateObject.day < 1 || dateObject.day > 31 || dateObject.month < 1 || dateObject.month > 12 || dateObject.year.toString().length != 4) { isInvalid = true; }

        if (this.options.invalidDays) {
            if (this.options.invalidDays.findIndex((day) => {
                if (day.year == dateObject.year && day.month == dateObject.month && day.day == dateObject.day) { return true; }
                else { return false; }
            }) > -1) {
                isInvalid = true;
            }
        }

        if (!isInvalid && this.options.minDate) {
            let minDate;
            if (this.options.minDate.fromControl) {
                minDate = this.getDateFromControlId(this.options.minDate.fromControl, "min");
            }
            else {
                minDate = new Date(this.options.minDate.year, this.options.minDate.month, this.options.minDate.day);
            }
            let dDate = new Date(dateObject.year, parseInt(dateObject.month), parseInt(dateObject.day));
            if (dDate < minDate) {
                isInvalid = true;
            }
        }

        if (!isInvalid && this.options.maxDate) {
            let maxDate;
            if (this.options.maxDate.fromControl) {
                maxDate = this.getDateFromControlId(this.options.maxDate.fromControl, "max");
            }
            else {
                maxDate = new Date(this.options.maxDate.year, this.options.maxDate.month, this.options.maxDate.day);
            }
            let dDate = new Date(dateObject.year, parseInt(dateObject.month), parseInt(dateObject.day));
            if (!this.allowMaxDate) {
                maxDate.setDate(maxDate.getDate() - 1);
            }
            if (dDate > maxDate) {
                isInvalid = true;
            }
        }
        return isInvalid;
    }

    private getDateFromControlId(id: string, valType: string) {
        if (!id) return null;
        try {
            let controlPath = id.split(".controls.");
            let formRef = this.controlRef.root as FormGroup;
            for (let a = 1; a < controlPath.length - 1; a++) {
                formRef = formRef.controls[controlPath[a]] as FormGroup;
            }
            let controlRef = formRef.controls[controlPath.pop()];
            let returnDate = controlRef.value !== null ? new Date(controlRef.value) : (valType === "min" ? new Date(1910, 0, 1) : new Date(2050, 0, 1));
            returnDate.setMonth(returnDate.getMonth() + 1);
            return returnDate;
        } catch (e) {
            return null;
        }
    }

    private cellClicked(cell: any): void {
        if (!this.isNextPrevCmo(cell) && this.isInvalidDate(cell) == true) { return; }

        if (cell.cmo === this.PREV_MONTH) {
            this.prevMonth();
        }
        else if (cell.cmo === this.CURR_MONTH) {
            this.selectDate(this.toString({ day: cell.day, month: cell.month, year: cell.year }), true);

            this.controlRef.markAsTouched();
            this.controlRef.markAsDirty();
        }
        else if (cell.cmo === this.NEXT_MONTH) {
            this.nextMonth();
        }
    }

    private preZero(val: any) {
        val = parseInt(val);
        return val < 10 ? '0' + val : val;
    }

    private monthText(m: number): string {
        return this.options.monthLabels[m];
    }

    private monthStartIdx(y: number, m: number): number {
        let d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        let idx = d.getDay() + this.sundayIdx();

        return idx >= 7 ? idx - 7 : idx;
    }

    private daysInMonth(m: number, y: number): number {
        return new Date(y, m, 0).getDate();
    }

    private daysInPrevMonth(m: number, y: number): number {
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }

        return this.daysInMonth(m, y);
    }

    private isCurrentDay(d: number, m: number, y: number, cmo: any): boolean {
        let todayObject = this.fromString(this.today);
        var todayDate = new Date(todayObject.year, todayObject.month, todayObject.day);

        if (this.options.maxDate) {
            var maxDate = new Date(this.options.maxDate.year, this.options.maxDate.month, this.options.maxDate.day);

            if (todayDate > maxDate) { return d === this.options.maxDate.day && m === this.options.maxDate.month && y === this.options.maxDate.year && cmo === 2; }
        }

        if (this.options.minDate) {
            var minDate = new Date(this.options.minDate.year, this.options.minDate.month, this.options.minDate.day);

            if (todayDate < minDate) { return d === this.options.minDate.day && m === this.options.minDate.month && y === this.options.minDate.year && cmo === 2; }
        }

        return d === todayObject.day && m === todayObject.month && y === todayObject.year && cmo === 2;;
    }

    private sundayIdx(): number {
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }

    private createMonth(m: number, y: number): void {
        this.dates.length = 0;
        let monthStart = this.monthStartIdx(y, m);
        let dInThisM = this.daysInMonth(m, y);
        let dInPrevM = this.daysInPrevMonth(m, y);
        let sunIdx = this.sundayIdx();

        let dayNbr = 1;
        let cmo = this.PREV_MONTH;

        for (var i = 1; i < 7; i++) {
            var week = [];

            if (i === 1) {
                var pm = dInPrevM - monthStart + 1;
                for (var j = pm; j <= dInPrevM; j++) {
                    week.push({ day: j, month: m, year: y, cmo: cmo, currentDay: this.isCurrentDay(j, m, y, cmo), sun: week.length === sunIdx });
                }

                cmo = this.CURR_MONTH;

                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    week.push({ day: dayNbr, month: m, year: y, cmo: cmo, currentDay: this.isCurrentDay(dayNbr, m, y, cmo), sun: week.length === sunIdx });
                    dayNbr++;
                }
            }
            else {
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
                    }
                    week.push({ day: dayNbr, month: m, year: y, cmo: cmo, currentDay: this.isCurrentDay(dayNbr, m, y, cmo), sun: week.length === sunIdx });
                    dayNbr++;
                }
            }

            this.dates.push(week);
        }
    }

    private fromString(val) {
        if (!val) { return; }

        var date = val.split('/');

        return { year: parseInt(date[2]), month: parseInt(date[0]), day: parseInt(date[1]) };
    }

    private toString(val) {
        if (!val) { return; }

        return this.dateFormat.replace('yyyy', val.year)
            .replace('MM', this.preZero(val.month))
            .replace('dd', this.preZero(val.day));
    }

    private isNextPrevCmo(date) {
        return date.cmo === this.PREV_MONTH || date.cmo === this.NEXT_MONTH;
    }

    private initOptions() {
        this.options = this.options || {};
        this.options.dayLabels = this.options.dayLabels || { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' };
        this.options.monthLabels = this.options.monthLabels || { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
        this.options.firstDayOfWeek = this.options.firstDayOfWeek || 'mo';
        this.options.dayIdx = this.days.indexOf(this.options.firstDayOfWeek);
        this.options.rangeMessage = this.options.rangeMessage || '';
    }

    private writeValue(newValue) {
        if (newValue != this.controlRef.value) { this.controlRef.patchValue(newValue); }
    }

    private shouldOpenToTop() {
        var element = Helpers.domFindElement(this.element.nativeElement, '.calendarContainer');
        var position = Helpers.domGetElementPosition(element);
        var height = this.getHeight();
        var scrollSize = Helpers.domGetPageScrollSize();

        return ((position.top - scrollSize.height) + 260) >= height;
    }

    //Only covers two scenarios, one where calender doesn't have space at the bottom of the page and one where it doesn't have enough space at the 
    //top of the page. If it doesn't have enough space at the top or bottom then it gets cut off.
    private getHeight() {
        var mainContent = Helpers.domFindElement(this.element.nativeElement, '.mainContent');
        let height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)

        //checking against .mainContent element to ensure CSS box issues don't break this calcualtion
        if (mainContent) {
            var mainContentHeight = (mainContent.innerHeight || mainContent.offsetHeight) + mainContent.getBoundingClientRect().top;

            if (mainContentHeight > height) { height = mainContentHeight; }
        }

        return height;
    }

    private getCalendarStartMonthYear() {
        let today = this.fromString(this.today);
        let todayDate = new Date(today.year, today.month, today.day);

        if (this.options.maxDate) {
            var maxDate = new Date(this.options.maxDate.year, this.options.maxDate.month, this.options.maxDate.day);

            if (todayDate > maxDate) { return { year: this.options.maxDate.year, month: this.options.maxDate.month }; }
        }

        if (this.options.minDate) {
            var minDate = new Date(this.options.minDate.year, this.options.minDate.month, this.options.minDate.day);

            if (todayDate < minDate) { return { year: this.options.minDate.year, month: this.options.minDate.month }; }
        }

        return { year: today.year, month: today.month };
    }
}

@Component({
    selector: 'twoWayListComponent',
    template:
        `<div class="row twoWayList">
            <div class="col-md-5">
                <div class="form-group">
                    <div class="filter-container clearfix">
                        <label class="control-label pull-left">{{ leftLabel }}</label>
                        <input (keyup)="filterMe()" [(ngModel)]="filterText" type="text" class="form-control input-sm pull-right filter" placeholder="Filter..." />
                        <i class="form-control-feedback glyphicon glyphicon-search filter-glyphicon"></i>
                    </div>
                    <select multiple size="10" class="form-control" id="selectAllList" style="width: 100%;"
                            (change)="setSelections($event.target, true)" >
                        <option *ngFor="let item of allItems" [ngClass]="item.IsFiltered ? 'hidden' : 'visible'"
                            (dblclick)="moveToRelated()" [value]="item.Id" [selected]="item.Selected == true">{{ item.Name }}</option>
                    </select>
                </div>
            </div>
            <div id="loadingDiv" style="display: none;">
                <span class="glyphicon glyphicon-refresh spinning"></span> @Labels.Loading
            </div>
            <div class="col-md-2">
                <ul [ngClass]="'button-row-multiselect'">
                    <li>
                        <button type="button" [ngClass]="'button-multiselect secondary'" (click)="moveAllItemsToRelated()">
                            <span class="glyphicon glyphicon-forward"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" [ngClass]="'button-multiselect primary'" (click)="moveToRelated()">
                            <span class="glyphicon glyphicon-chevron-right"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" [ngClass]="'button-multiselect primary'" (click)="moveToAll()">
                            <span class="glyphicon glyphicon-chevron-left"></span>
                        </button>
                    </li>
                    <li>
                        <button type="button" [ngClass]="'button-multiselect secondary'" (click)="moveAllRelatedItemsToAll()">
                            <span class="glyphicon glyphicon-backward"></span>
                        </button>
                    </li>
                </ul>
            </div>       
            <div class="col-md-5" >
                <tooltipComponent *ngIf="isRequired" #toolTip [isTouched]="isTouched" [message]="requiredMessage" autoLoad="false" [elementId]="rightSideListId" validationType="customError"></tooltipComponent>
                <div class="form-group">
                    <div>
                        <label id="lbFromLabel" class="control-label">
                            {{ rightLabel }}
                            <i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                        </label>         
                    </div>
                    <div *ngIf="isRequired" [ngClass]="'inner-addon right-addon-select rightSideListContainer'">
                        <select [id]="rightSideListId" multiple size="10" class="form-control"  
                            (blur)="onFocus(false)" (focus)="onFocus(true)"
                            (change)="setSelections($event.target, false)" required>                                      
                            <option *ngFor="let item of relatedItems" 
                                (dblclick)="moveToAll()" [value]="item.Id" [selected]="item.Selected == true" 
                                [class]="item.IsRelated == true && canRemoveExistingRelated == false ? 'related-items' : ''">{{ item.Name }}                        
                            </option>
                        </select>
                        <i *ngIf="isInvalid == true" [ngClass]="'form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error input-error requiredIcon'"></i>
                    </div>
                    <div *ngIf="!isRequired" class="inner-addon right-addon-select">
                        <select [id]="rightSideListId" multiple size="10" class="form-control"  
                            (blur)="onFocus(false)" (focus)="onFocus(true)" 
                            (change)="setSelections($event.target, false)">                                      
                            <option *ngFor="let item of relatedItems" 
                                (dblclick)="moveToAll()" [value]="item.Id" [selected]="item.Selected == true" 
                                [ngClass] = "item.IsRelated == true && canRemoveExistingRelated == false ? 'related-items':''">{{ item.Name }}                        
                            </option>
                        </select>
                    </div>
                </div>
            </div>   
        </div>`
})
export class TwoWayListComponent implements AfterViewInit {
    @Input() leftLabel: string;
    @Input() rightLabel: string;
    @Input() canRemoveExistingRelated: boolean;
    @Input() requiredMessage: string;
    @Input() isRequired: boolean = false;
    @Input() allItems: TwoWayListItem[] = [];

    @Input() relatedItems: TwoWayListItem[] = [];
    @Output() relatedItemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @ViewChild('toolTip') toolTip: TooltipComponent;

    private isInvalid: boolean = false;
    private isTouched: boolean = false;
    private nativeElement;
    private rightSideListId: string = 'rightSideList' + MathHelpers.random();
    private filterText: string = "";

    constructor(private elementRef: ElementRef, @Host() private formRef: NgForm) {
        console.warn('TwoWayListComponent has been deprecated. Please use VirtualTwoWayListComponent instead.');
    }

    ngAfterViewInit() {
        if (this.toolTip) { this.toolTip.load(); }
    }

    private sortMe(myArray = []): any[] {
        var sortedArray: any[];
        sortedArray = myArray.slice(0);

        sortedArray.sort((leftSide, rightSide): number => {
            if (leftSide.Name < rightSide.Name) return -1;
            if (leftSide.Name > rightSide.Name) return 1;
            return 0;
        });

        myArray = sortedArray.slice(0);

        return myArray;
    }

    private filterMe() {
        var self = this;
        self.allItems.forEach((item) => { item.Name.toLowerCase().indexOf(self.filterText.toLowerCase()) < 0 ? item.IsFiltered = true : item.IsFiltered = false; });
    }

    private setSelections(selectElement, isallItems) {
        for (let i = 0; i < selectElement.options.length; i++) {
            var option = selectElement.options[i];
            var item = (isallItems) ? this.allItems[i] : this.relatedItems[i];

            if (option.selected == true) { item.Selected = true; }
            else { item.Selected = false; }
        }

        var otherItemsList = (isallItems) ? this.relatedItems : this.allItems;

        if (otherItemsList) {
            for (let x = 0; x < otherItemsList.length; x++) {
                otherItemsList[x].Selected = false;
            }
        }
    }

    private moveToRelated() {
        var selectedItems = this.allItems.filter((item) => { return item.Selected === true && !item.IsFiltered; });

        this.moveItems(false, selectedItems);
    }

    private moveAllItemsToRelated() {
        var selectedItems = this.allItems.filter((item) => { return !item.IsFiltered; });

        this.moveItems(false, selectedItems);
    }

    private moveToAll() {
        var selectedItems = this.relatedItems.filter((item) => {
            if (this.canRemoveExistingRelated) { return item.Selected === true; }
            else { return item.Selected === true && !item.IsRelated; }
        });

        this.moveItems(true, selectedItems);
    }

    private moveAllRelatedItemsToAll() {
        var selectedItems = this.relatedItems.filter((item) => {
            if (this.canRemoveExistingRelated) { return true; }
            else { return !item.IsRelated; }
        });

        this.moveItems(true, selectedItems);
    }

    validate(): boolean {
        if (this.isValid()) {
            this.postValidation(true);
            return true;
        }

        this.postValidation(false);
        return false;
    }

    reset(modelAllItems) {
        this.isTouched = false;
        this.allItems = modelAllItems;
        this.postValidation(true);
        this.filterText = "";
        this.filterMe();
    }

    private moveItems(toAll, selectedItems): any[] {
        if (!selectedItems || !this.allItems) { return; }

        this.relatedItems = this.relatedItems || [];

        if (toAll) {
            Array.prototype.push.apply(this.allItems, selectedItems);

            selectedItems.forEach((item, i) => {
                this.relatedItems.splice(this.relatedItems.indexOf(item), 1);
            });

            this.allItems = this.sortMe(this.allItems);
        }
        else {
            Array.prototype.push.apply(this.relatedItems, selectedItems);

            selectedItems.forEach((item, i) => {
                this.allItems.splice(this.allItems.indexOf(item), 1);
            });

            this.relatedItems = this.sortMe(this.relatedItems);
            this.relatedItemsChange.emit(this.relatedItems);
        }

        this.isTouched = true;
        this.formRef.form.markAsTouched();
        this.formRef.form.markAsDirty();
        this.filterMe();
        this.postValidation(this.isValid());
    }

    private isValid() {
        if (this.isRequired && (!this.relatedItems || this.relatedItems.length == 0)) { return false; }

        return true;
    }

    private postValidation(valid: boolean) {
        var htmlElement = this.elementRef.nativeElement.querySelector('#' + this.rightSideListId);
        var classes = htmlElement.getAttribute('class');

        if (!valid) {

            classes = this.replaceClass(classes, 'ng-valid', 'ng-invalid');
            classes = this.replaceClass(classes, 'ng-untouched', 'ng-touched');
            htmlElement.setAttribute('class', classes);
            htmlElement.setCustomValidity(this.requiredMessage);
            this.isInvalid = true;
            return;
        }

        this.isInvalid = false;
        classes = this.replaceClass(classes, 'ng-invalid', 'ng-valid');
        classes = this.replaceClass(classes, 'ng-touched', 'ng-untouched');
        htmlElement.setAttribute('class', classes);
        htmlElement.setCustomValidity('');
    }

    private replaceClass(value: string, searchString: string, replaceString: string) {

        if (value.indexOf(searchString) > 0) {
            return value.replace(searchString, replaceString)
        }
        else if (value.indexOf(replaceString) > 0) {
            return value;
        }

        return value + ' ' + replaceString;
    }

    onFocus(isFocus) {
        this.postValidation(this.isValid());
    }
}

@Component({
    selector: 'virtualTwoWayListComponent',
    exportAs: 'VirtualTwoWayListComponent',
    template:
        `<div class="row">
            <div class="col-md-5">
                <div class="form-group">
                    <div class="filter-container clearfix">
                        <label class="control-label pull-left">{{ leftLabel }}</label>
                        <input [id]="textboxId" type="text" class="form-control input-sm pull-right filter" placeholder="Filter..." />
                        <i class="form-control-feedback glyphicon glyphicon-search filter-glyphicon"></i>
                    </div>
                    <virtualScrollComponent [items]="allItemsObservable | async" [containerHeight]="containerHeight - containerPaddings" [itemHeight]="itemHeight" 
                                            (onFiltered)="allItemsSlice = $event.items">
                        <select [id]="leftSideListId" multiple class="form-control" (change)="syncSelection(true, $event, allItemsSlice)" 
                                [style.height.px]="containerHeight - containerPaddings">
                            <option *ngFor="let item of allItemsSlice" [ngClass]="item.IsFiltered ? 'hidden' : 'visible'"
                                    (dblclick)="moveItemToRelated(item)" [attr.data-twowaylist-id]="item[dynamicIdField]"
                                    [selected]="item.Selected" [attr.selected]="item.Selected ? '' : null" [style.height.px]="item.IsFiltered ? null : itemHeight">
                                {{ item.Name }}
                            </option>
                        </select>
                    </virtualScrollComponent>
                </div>
            </div>
            <div class="col-md-2">
                <ul class="button-row-multiselect">
                    <li>
                        <button [id]="moveAllItemsToRightId" type="button" class="button-multiselect secondary" (click)="moveAllToRelated()">
                            <span class="glyphicon glyphicon-forward"></span>
                        </button>
                    </li>
                    <li>
                        <button [id]="moveItemToRightId" type="button" class="button-multiselect primary" (click)="moveToRelated()">
                            <span class="glyphicon glyphicon-chevron-right"></span>
                        </button>
                    </li>
                    <li>
                        <button [id]="moveItemToLeftId" type="button" class="button-multiselect primary" (click)="moveToAll()">
                            <span class="glyphicon glyphicon-chevron-left"></span>
                        </button>
                    </li>
                    <li>
                        <button [id]="moveAllItemsToLeftId" type="button" class="button-multiselect secondary" (click)="moveRelatedToAll()">
                            <span class="glyphicon glyphicon-backward"></span>
                        </button>
                    </li>
                </ul>
            </div>       
            <div class="col-md-5">
                <div class="form-group">
                    <tooltipComponent #toolTip *ngIf="isRequired" [controlRef]="relatedItems" [message]="requiredMessage" 
                                      [autoLoad]="false" [elementId]="rightSideListId" errorType="required"></tooltipComponent>
                    <label id="lbFromLabel" class="control-label">
                        {{ rightLabel }}
                        <i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon-select rightSideListContainer">            
                        <virtualScrollComponent [items]="relatedItemsObservable | async" [containerHeight]="containerHeight - containerPaddings" 
                                                [itemHeight]="itemHeight" (onFiltered)="relatedItemSlice = $event.items">
                            <select [id]="rightSideListId" multiple  [style.height.px]="containerHeight - containerPaddings" 
                                    (change)="syncSelection(false, $event, relatedItemSlice)" 
                                    [class]="relatedItemsClassObservable | async" (focus)="onRelatedItemsFocus()" (blur)="onRelatedItemsBlur()"
                                     validation [requiredValidator]="isRequired" [controlRef]="relatedItems">                                      
                                <option *ngFor="let item of relatedItemSlice" [style.height.px]="itemHeight" 
                                        (dblclick)="moveItemToAll($event, item)" (mousedown)="isItemClickable($event, item)"
                                        [attr.data-twowaylist-id]="item[dynamicIdField]" [selected]="item.Selected" [attr.selected]="item.Selected ? '' : null"
                                        [ngClass]="item.IsRelated && !canRemoveExistingRelated ? 'related-items' : ''">
                                    {{ item.Name }}                        
                                </option>
                            </select>
                        </virtualScrollComponent>
                        <i *ngIf="isRequired && relatedItems && !relatedItems.valid && relatedItems.touched" 
                            class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error input-error requiredIcon"></i>
                    </div>
                </div>
            </div>
        </div>`,
    providers: [ZoneService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualTwoWayListComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() leftLabel: string;
    @Input() rightLabel: string;
    @Input() canRemoveExistingRelated: boolean;
    @Input() requiredMessage: string;
    @Input() isRequired: boolean = false;
    @Input() allItems: FormControl;
    @Input() relatedItems: FormControl;
    @Input() containerHeight: number = 204; //204px
    @Input() itemHeight: number = 17; //17px which when divided by 204 (the container height) will give us 12 items per view

    @ViewChild('toolTip') toolTip: TooltipComponent;

    private textboxId: string = 'virtualTwoWayList_textbox' + MathHelpers.random();
    private leftSideListId: string = 'virtualTwoWayList_leftSideList' + MathHelpers.random();
    private rightSideListId: string = 'virtualTwoWayList_rightSideList' + MathHelpers.random();
    private moveItemToRightId: string = 'virtualTwoWayList_moveItemToRight' + MathHelpers.random();
    private moveAllItemsToRightId: string = 'virtualTwoWayList_moveAllItemsToRight' + MathHelpers.random();
    private moveItemToLeftId: string = 'virtualTwoWayList_moveItemToLeft' + MathHelpers.random();
    private moveAllItemsToLeftId: string = 'virtualTwoWayList_moveAllItemsToLeft' + MathHelpers.random();

    private filterText: string = "";
    private allSelectedItems: TwoWayListItem[] = []; //keeps track of selection in the left side list
    private relatedSelectedItems: TwoWayListItem[] = []; //keeps track of selections in the right side list
    private allFilteredItems = [];
    private allItemsObservable = new BehaviorSubject<TwoWayListItem[]>([]);
    private allItemsSubscription: Subscription;
    private relatedItemsObservable = new BehaviorSubject<TwoWayListItem[]>([]);
    private relatedItemsClassObservable = new BehaviorSubject<string>('form-control');
    private relatedItemsSubscription: Subscription;
    private filterSubscription: Subscription;
    private isInternallyChanged = false;
    private dynamicIdField = 'twoWayList_Id';
    private dynamicFilterIndexField = 'twoWayList_filterIndex';
    private containerPaddings = 12; //6px top padding + 6px bottom padding

    constructor(private zoneService: ZoneService) { }

    ngAfterViewInit() {
        if (this.toolTip) { this.toolTip.load(); }

        this.subscriptions(true);
    }

    ngOnDestroy() {
        this.subscriptions(false);
    }

    ngOnChanges(changes: SimpleChanges) {
        let allItemsChange = changes['allItems'];
        let relatedItemsChange = changes['relatedItems'];

        if (allItemsChange || relatedItemsChange) {
            this.load();
        }
    }

    private load() {
        if (this.isInternallyChanged) { return; }

        if (this.allItems) {
            let newValue = this.allItems.value ? this.allItems.value.map((item) => {
                item[this.dynamicIdField] = MathHelpers.autoIncrement();
                return item;
            }) : [];
            this.allItemsObservable.next(newValue);

        }

        if (this.relatedItems) {
            let newValue = this.relatedItems.value ? this.relatedItems.value.map((item: TwoWayListItem) => {
                item[this.dynamicIdField] = MathHelpers.autoIncrement();
                return item;
            }) : [];
            this.relatedItemsObservable.next(newValue);
            this.validateRelatedItems();
        }
    }

    private subscriptions(subscribe: boolean) {
        if (subscribe) {
            if (this.allItemsSubscription) { this.allItemsSubscription.unsubscribe(); }
            if (this.relatedItemsSubscription) { this.relatedItemsSubscription.unsubscribe(); }

            this.allItems.valueChanges.subscribe(() => this.load());
            this.relatedItems.valueChanges.subscribe(() => this.load());

            this.filterSubscription = Observable
                .fromEvent(document.getElementById(this.textboxId), 'input')
                .debounceTime(300)
                .map((event: any) => event.target.value)
                .filter(value => !value || value.length >= 3)
                .subscribe(value => this.filter(value));
        }
        else {
            this.filterSubscription.unsubscribe();
            this.allItemsSubscription.unsubscribe();
            this.relatedItemsSubscription.unsubscribe();
        }
    }

    private filter(value: string) {
        let allItems = (this.allItems.value || []).concat(this.allFilteredItems);
        let regex = new RegExp('.*' + value + '.*', 'i');
        let newAllItems = [];

        this.allFilteredItems = [];

        if (value) {
            for (var i = 0, l = allItems.length; i < l; i++) {
                let item = allItems[i];

                if (regex.test(item.Name) === false) {
                    item[this.dynamicFilterIndexField] = i;
                    this.allFilteredItems.push(item);
                }
                else {
                    newAllItems.push(item);
                }
            }
        }
        else {
            newAllItems = allItems;
        }
               
        this.filterText = value;
        this.writeValue(Helpers.sortByField(newAllItems, true, item => item[this.dynamicIdField]), this.relatedItems.value || [], false);
    }

    private onRelatedItemsFocus() {
        this.validateRelatedItems();
    }

    private onRelatedItemsBlur() {
        this.relatedItems.markAsTouched();
        this.validateRelatedItems();
    }

    /**Hack around angular issue where we are not able to use [formControl] as the directive SelectMultipControlValueAccessor has a (change) binding
     * on the host element hence overriding the full list of selections by the highlighted options which is not desired. 
     * <select multiple> fires onchange upon item selection! It also fires oninput upon selection, but fires nothing upon HTMLOptionCollection change :D
    */
    private validateRelatedItems() {
        let isReset = this.relatedItems.pristine && this.relatedItems.untouched && this.relatedItems.value === null;
        let className = 'form-control';

        if (!isReset) {
            if (this.relatedItems.touched) {
                className += this.relatedItems.valid ? ' ng-touched' : ' ng-invalid ng-touched';
            }
            else {
                className += !this.relatedItems.valid ? ' ng-invalid' : '';
            }
        }

        this.relatedItemsClassObservable.next(className);
    }

    private isItemClickable(e: MouseEvent, item: TwoWayListItem) {
        if (item.IsRelated && !this.canRemoveExistingRelated) {
            e.cancelBubble = true;
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            return false;
        }

        return true;
    }

    private syncSelection(isAllItems: boolean, e: MouseEvent) {
        let element: any = e.target;
        let selectedItems = isAllItems ? this.allSelectedItems : this.relatedSelectedItems;
        let items: TwoWayListItem[] = isAllItems ? this.allItems.value : this.relatedItems.value;

        //current rendered elements are not much, just what the virtual scroller renders so this must run fast enough
        for (let option of element.options) {
            let id = option.getAttribute('data-twowaylist-id');
            let item = items.find((item) => item[this.dynamicIdField] == id);
            let selectedItemIndex = selectedItems.indexOf(item);
            let alreadyAdded = selectedItemIndex > -1;

            if (item.IsRelated && !this.canRemoveExistingRelated) {
                option.selected = false;
                continue;
            }
            else if (!option.selected && alreadyAdded) {
                selectedItems.splice(selectedItemIndex, 1);
                item.Selected = false;
            }
            else if (option.selected && !alreadyAdded && !item.IsFiltered && (!item.IsRelated || this.canRemoveExistingRelated)) {
                selectedItems.push(item);
                item.Selected = true;
            }
        }
    }

    private moveItemToAll(e: MouseEvent, item) {
        if (!this.isItemClickable(e, item)) { return; }

        let relatedItems = this.relatedItems.value;
        let allItems = this.allItems.value || [];
        let allIndex = this.findInsertIndex(allItems, item[this.dynamicIdField]);

        relatedItems.splice(relatedItems.indexOf(item), 1);
        item.Selected = false;
        allItems.splice(allIndex, 0, item);

        this.writeValue(allItems, relatedItems);
        this.relatedSelectedItems = [];
    }

    private moveItemToRelated(item) {
        let relatedItems = this.relatedItems.value || [];
        let allItems = this.allItems.value;
        let relatedIndex = this.findInsertIndex(relatedItems, item[this.dynamicIdField]);

        allItems.splice(allItems.indexOf(item), 1);
        item.Selected = false;
        relatedItems.splice(relatedIndex, 0, item);

        this.writeValue(allItems, relatedItems);
        this.allSelectedItems = [];
    }

    private moveToRelated() {
        if (this.allSelectedItems.length < 1) { return; }

        let relatedItems = this.relatedItems.value || [];
        let allItems = this.allItems.value;

        this.allSelectedItems.forEach((item: any, i) => {
            allItems.splice(allItems.indexOf(item), 1);
            item.Selected = false;

            if (!item.IsFiltered) {
                relatedItems.splice(0, 0, item);
            }
        });

        this.writeValue(allItems, Helpers.sortByField(relatedItems, true, (item) => item[this.dynamicIdField]));
        this.allSelectedItems = [];
    }

    private moveToAll() {
        if (this.relatedSelectedItems.length < 1) { return; }

        let relatedItems = this.relatedItems.value;
        let allItems = this.allItems.value || [];

        this.relatedSelectedItems.forEach((item: any, i) => {
            relatedItems.splice(relatedItems.indexOf(item), 1);
            item.Selected = false;
            allItems.splice(0, 0, item);
        });

        this.writeValue(Helpers.sortByField(allItems, true, (item) => item[this.dynamicIdField]), relatedItems);
        this.relatedSelectedItems = [];
    }

    private moveAllToRelated() {
        if (!this.allItems.value || this.allItems.value.length < 1) { return; }

        let relatedItems = this.relatedItems.value || [];
        let allItems = this.allItems.value;
        let newRelatedItems = Helpers.sortByField(allItems.concat(relatedItems), true, (item) => item[this.dynamicIdField]);

        this.writeValue([], newRelatedItems);
        this.allSelectedItems = [];
    }

    private moveRelatedToAll() {
        if (!this.relatedItems.value || this.relatedItems.value.length < 1) { return; }

        let allItems = this.allItems.value || [];
        let relatedItems = this.relatedItems.value;

        if (this.canRemoveExistingRelated) {
            let newAllItems = Helpers.sortByField(relatedItems.concat(allItems), true, (item) => item[this.dynamicIdField]);
            this.writeValue(newAllItems, []);
        }
        else {
            let newRelatedItems = relatedItems.filter(item => item.IsRelated);
            let newAllItems = Helpers.sortByField(relatedItems.filter(item => !item.IsRelated).concat(allItems), true, (item) => item[this.dynamicIdField]);

            this.writeValue(newAllItems, newRelatedItems);
        }

        this.relatedSelectedItems = [];
    }

    private findInsertIndex(insertionList: any[], compareSeed: number) {
        if (insertionList.length < 1) { return 0; }

        let closest = insertionList.reduce((previous, current) => {
            let previousValue = Math.abs(previous[this.dynamicIdField] - compareSeed);
            let currentValue = Math.abs(current[this.dynamicIdField] - compareSeed);

            return (currentValue < previousValue ? current : previous);
        });
        let index = insertionList.indexOf(closest);

        if (closest[this.dynamicIdField] > compareSeed) { return index; }
        else { return index + 1; }
    }

    private writeValue(allItems: TwoWayListItem[], relatedItems: TwoWayListItem[], doFiltering = true) {
        //Thanks to Angular async pipe, only object references are compared and there is no array observation and that is why slice() is done.
        let relatedItemsRef = relatedItems.slice();
        let allItemsRef = allItems.slice();

        this.isInternallyChanged = true;

        this.relatedItemsObservable.next(relatedItemsRef);
        this.allItemsObservable.next(allItemsRef);
        this.relatedItems.setValue(relatedItems.length > 0 ? relatedItemsRef : null, { emitViewToModelChange: true });
        this.allItems.setValue(allItems.length > 0 ? allItemsRef : null, { emitViewToModelChange: true });
        this.validateRelatedItems();

        if (doFiltering) { this.filter(this.filterText); }

        this.isInternallyChanged = false;
    }
}

@Component({
    selector: 'fileUploadComponent',
    template:
        `<tooltipComponent *ngIf="maxSize" [controlRef]="controlRef" [elementId]="textBoxId" autoLoad="false" 
                            [message]="privateCustomMessage | async" errorType="customError" #customErrorTooltip></tooltipComponent>
    <tooltipComponent *ngIf="isRequired" [controlRef]="controlRef" [elementId]="textBoxId" autoLoad="false" [message]="requiredMessage" errorType="required" #requiredTooltip></tooltipComponent>
    <div class="form-group fileUploadContainer">
        <label [attr.for]="id" class="control-label">
            {{ labelText }}
            <i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
        </label>
        <div class="input-group">
            <input type="text" autocomplete="off" [id]="textBoxId" [name]="id" class="form-control" class="form-control textbox" 
                onkeydown="return false" onpaste="return false" oncut="return false" 
                [controlRef]="controlRef" validation [requiredValidator]="isRequired" [customValidator]="privateCustomMessage | async"
                [formControl]="controlRef" [placeholder]="placeholder" />
            <i *ngIf="controlRef.valid == false && controlRef.touched == true && showTrash == false" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error-input-group requiredIcon"></i>
            <i *ngIf="controlRef.valid == false && controlRef.touched == true && showTrash == true" style="margin-right: 80px !important"  class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error-input-group requiredIcon"></i>
            <div class="input-group-btn">
                <div class="btn btn-default" style="position: relative">
                    <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
                    <input [id]="fileUploadId" type="file" class="fileUpload" [accept]="accept" (change)="setSelectedFile($event)" [multiple]="isMultiple" />
                </div>
                 <div *ngIf="showTrash" class="btn btn-default" style="position: relative">
                 <span class="showTrash-seperator"></span>
                 <span class="glyphicon glyphicon-trash"></span>
                  <input [id]="buttonId" type="button" class="fileUpload" (click)="deleteFile($event)"/>
                </div>
            </div>
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements AfterViewInit, OnChanges {
    @Input() labelText: string;
    @Input() accept: string;
    @Input() placeholder: string;
    @Input() isMultiple: boolean;
    @Input() controlRef: FormControl;
    @Input() showTrash: boolean = false;

    @Input() maxSize: number;
    @Input() maxSizeMessage: string;

    @Input() isRequired: boolean = false;
    @Input() requiredMessage: string;

    @Input() files: File[];
    @Output() filesChange: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Output() onDelete: EventEmitter<File[]> = new EventEmitter<File[]>();
    @ViewChild('requiredTooltip') requiredTooltip: TooltipComponent;
    @ViewChild('customErrorTooltip') customErrorTooltip: TooltipComponent;

    private textBoxId: string = 'htmlTextControl' + MathHelpers.random();
    private buttonId: string = 'fileUpload_buttonId_' + MathHelpers.random();
    private fileUploadId: string = 'htmlFileControl' + MathHelpers.random();
    private privateCustomMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit() {
        if (this.requiredTooltip) { this.requiredTooltip.load(); }
        if (this.customErrorTooltip) { this.customErrorTooltip.load(); }

        let fileUpload = this.elementRef.nativeElement.querySelector('#' + this.fileUploadId);

        this.controlRef.valueChanges.subscribe((value) => {
            if (!value) {
                fileUpload.value = '';
                this.privateCustomMessage.next('');
            }
        });
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        var maxSizeMessage = changes['maxSizeMessage'];

        //re-sync custom message if already visible
        if (this.privateCustomMessage.value && maxSizeMessage) { this.privateCustomMessage.next(this.maxSizeMessage); }
    }

    private deleteFile(e) {
        this.files = null;
        this.controlRef.reset();
        this.onDelete.emit(this.files);
    }

    private setSelectedFile(e) {
        if (e.target.files.length > 0) {
            var tempFiles: any = [];
            var tempFileNames: any = [];
            var size = 0;

            for (var i = 0; i < e.target.files.length; i++) {
                var file: File = e.target.files[i];

                size += file.size;

                tempFiles.push(file);
                tempFileNames.push(file.name);
            }

            if (this.maxSize && size > this.maxSize) { this.privateCustomMessage.next(this.maxSizeMessage); }
            else if (this.maxSize && size <= this.maxSize) { this.privateCustomMessage.next(''); }

            this.writeValue(tempFileNames.join(';'));
            this.files = tempFiles;
            this.filesChange.emit(tempFiles);
        }
    }

    private writeValue(value) {
        this.controlRef.setValue(value);
        this.controlRef.markAsTouched();
        this.controlRef.markAsDirty();
    }
}

@Component({
    selector: 'stepComponent',
    template: `<ng-content></ng-content>`,
    providers: [ZoneService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() header: string;
    @Input() isComplete: boolean = false;
    @Input() isHalfStep: boolean = false;
    @Input() isSelected: boolean = false;

    static positionObservable: BehaviorSubject<StepComponent> = new BehaviorSubject<StepComponent>(null);
    static markForCheckObservable: BehaviorSubject<StepComponent> = new BehaviorSubject<StepComponent>(null);
    static destroyObservable: BehaviorSubject<StepComponent> = new BehaviorSubject<StepComponent>(null);

    private mutationObserver: MutationObserver;
    private mutationSubscription: Subscription;
    private lastPosition: Position;

    get position(): Position {
        return Helpers.domGetElementPosition(this.elementRef.nativeElement);
    }

    constructor(public elementRef: ElementRef, private zoneService: ZoneService) { }

    ngAfterViewInit() {
        this.zoneService.runAfterAngular(() => {
            this.zoneService.runOutsideAngular(() => {
                this.lastPosition = this.position;
                this.subscriptions(true);
                StepComponent.positionObservable.next(this);
            });
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        StepComponent.markForCheckObservable.next(this);
    }

    ngOnDestroy() {
        StepComponent.destroyObservable.next(this);
        this.subscriptions(false);
    }

    private subscriptions(subscribe: boolean) {
        if (subscribe) {
            if ('MutationObserver' in window) {
                this.mutationObserver = new MutationObserver((mutations) => {
                    let position = this.position;

                    if (position != this.lastPosition) {
                        this.lastPosition = position;
                        StepComponent.positionObservable.next(this);
                    }
                });

                this.mutationObserver.observe(this.elementRef.nativeElement, { attributes: true, childList: true, characterData: true, subtree: true });
            } else {
                let attributeObservable = Observable.fromEvent(this.elementRef.nativeElement, 'DOMAttrModified');
                let subtreeObservable = Observable.fromEvent(this.elementRef.nativeElement, 'DOMSubtreeModified');
                let charsObservable = Observable.fromEvent(this.elementRef.nativeElement, 'DOMCharacterDataModified');

                this.mutationSubscription = Observable.merge(attributeObservable, subtreeObservable, charsObservable)
                    .subscribe((e) => {
                        let position = this.position;

                        if (position != this.lastPosition) {
                            this.lastPosition = position;
                            StepComponent.positionObservable.next(this);
                        }
                    });
            }
        }
        else {
            if (this.mutationObserver) { this.mutationObserver.disconnect(); }
            if (this.mutationSubscription) { this.mutationSubscription.unsubscribe(); }
        }
    }
}

@Component({
    selector: 'stepMenuComponent',
    template:
        `<ul class="stepList" [style.top.px]="navTopMargin">
        <template ngFor let-step="$implicit" [ngForOf]="steps" let-i="index">
            <li *ngIf="showLarge" [ngClass]="(lastActiveIndex | async) == i ? 'selected' : undefined" (click)="navigate(i)">
                <span><i [ngClass]="getIndicatorClass(step)"></i></span>
                <button>{{ step.header }}</button>
            </li>
        </template>
    </ul>
    <div>
        <ng-content></ng-content>
    </div>`,
    providers: [ZoneService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepMenuComponent implements AfterViewInit, OnDestroy {
    private lastActiveIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private showLarge = true;
    private showSmall = false;
    private internalSteps: StepComponent[];
    private stepOffsets: number[] = [];
    private scrollSubscription: Subscription;
    private resizeSubscription: Subscription;
    private stepPositionSubscription: Subscription;
    private stepDestroySubscription: Subscription;
    private stepChangeSubscription: Subscription;
    private stepsChangeSubscription: Subscription;
    private _navTopMargin: number = Constants.PortalHeaderHeight + 20;

    @Input() set navTopMargin(value) {
        this._navTopMargin += value;
    }
    get navTopMargin() {
        return this._navTopMargin;
    }

    @ContentChildren(StepComponent) steps: QueryList<StepComponent>;

    constructor(private elementRef: ElementRef, private zoneService: ZoneService, private changeDetector: ChangeDetectorRef) { }

    ngAfterViewInit() {
        this.load();
    }

    ngOnDestroy() {
        this.subscriptions(false);
    }

    navigate(index) {
        window.scrollTo(0, this.stepOffsets[index] - this.navTopMargin);

        this.zoneService.runInsideAngular(() => {
            this.lastActiveIndex.next(index);
        });
    }

    private load() {
        this.zoneService.runOutsideAngular(() => {
            this.internalSteps = this.steps.toArray();

            this.subscriptions(true);
            this.navigateToFirstSelectedStep();
        });
    }

    private subscriptions(subscribe: boolean) {
        if (subscribe) {
            let scrollObserver = Observable.fromEvent(window, 'scroll');
            let resizeObserver = Observable.fromEvent(window, 'resize');

            this.resizeSubscription = scrollObserver
                .debounceTime(50).map(() => 'debounce')
                .subscribe(() => this.syncStepsInViewport());
            this.scrollSubscription = resizeObserver
                .debounceTime(50).map(() => 'debounce')
                .subscribe(() => this.syncStepsInViewport());

            this.stepsChangeSubscription = this.steps.changes.subscribe(() => {
                this.internalSteps = this.steps.toArray();
            });

            this.stepChangeSubscription = StepComponent.markForCheckObservable.subscribe((step) => {
                if (step) { this.changeDetector.markForCheck(); }
            });
            this.stepDestroySubscription = StepComponent.destroyObservable.subscribe((step) => {
                if (!step) { return; }

                let i = this.internalSteps.indexOf(step);
                this.internalSteps.splice(i, 1);
                this.stepOffsets.splice(i, 1);
            });
            this.stepPositionSubscription = StepComponent.positionObservable.subscribe((step) => {
                let index = this.internalSteps.indexOf(step);

                //hidden step of some sort, perhaps via ngIf. 
                //a better solution is not to have static observables for StepComponent,
                //but this also means iterating over to add a subscriber although we're already doing that somewhere so may need to revisit
                if (index < 0) { return; }

                for (let i = index; i < this.internalSteps.length; i++) {
                    let item = this.internalSteps[i];
                    this.stepOffsets[i] = item.position.top;
                }
            });
        }
        else {
            this.scrollSubscription.unsubscribe();
            this.resizeSubscription.unsubscribe();
            this.stepChangeSubscription.unsubscribe();
            this.stepDestroySubscription.unsubscribe();
            this.stepPositionSubscription.unsubscribe();
            this.stepsChangeSubscription.unsubscribe();
        }
    }

    private navigateToFirstSelectedStep() {
        for (var i = 0; i < this.internalSteps.length; i++) {
            var step = this.internalSteps[i];
            if (step.isSelected) {
                setTimeout(() => { this.navigate(i); }, 1500);
                break;
            }
        }
    }

    private syncStepsInViewport() {
        let currentScrollSize = Helpers.domGetPageScrollSize();
        let currentViewportSize = Helpers.domGetViewportSize();
        let index = -1;

        //push the code execution to the end of the event loop which gives us slightly more performance
        setTimeout(() => {
            for (var i = 0; i < this.stepOffsets.length; i++) {
                let currentOffset = this.stepOffsets[i];
                let nextOffset = i === this.stepOffsets.length - 1 ? currentOffset : this.stepOffsets[i + 1];
                let currentOffsetDiff = Math.abs(currentOffset - Math.abs(this.navTopMargin) - currentScrollSize.height);
                let nextOffsetDiff = Math.abs(nextOffset - Math.abs(this.navTopMargin) - currentScrollSize.height);

                if (currentOffsetDiff <= nextOffsetDiff) {
                    index = i;
                    break;
                }
                else if (nextOffsetDiff > currentOffsetDiff) {
                    index = i + 1;
                    break;
                }
            }

            if (index > -1 && index !== this.lastActiveIndex.value) {
                let isBottomOfPage = this.isAtBottomOfPage(currentScrollSize, currentViewportSize);
                let isTopOfPage = this.isAtTopOfPage(currentScrollSize, currentViewportSize);

                this.zoneService.runInsideAngular(() => {
                    if (isBottomOfPage) {
                        this.lastActiveIndex.next(this.internalSteps.length - 1);
                    }
                    else if (isTopOfPage) {
                        this.lastActiveIndex.next(0);
                    }
                    else {
                        this.lastActiveIndex.next(index);
                    }
                });
            }
        }, 0);
    }

    private isAtBottomOfPage(currentScrollSize, currentViewportSize) {
        let currentScrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );

        return currentScrollHeight == (currentScrollSize.height + currentViewportSize.height);
    }

    private isAtTopOfPage(pageScrollSize, pageViewportSize) {
        let currentScrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );

        return currentScrollHeight == 0;
    }

    private getIndicatorClass(step) {
        let className = 'indicator';

        if (step.isComplete) { className += ' completed'; }
        if (step.isHalfStep) { className += ' halfStep'; }

        return className;
    }
}

@Component({
    selector: 'remoteLookupComponent',
    providers: [AjaxService],
    template: `<div class="remoteLookup"><ng-content></ng-content></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteLookupComponent implements AfterContentInit, OnChanges, OnDestroy {
    @Input() url: string;
    @Input() controlRef: FormControl;
    @Input() elementId: string;
    @Input() depIDs: any[];
    @Input() enableIfNotFound: boolean = true;

    @Output() callback: EventEmitter<any> = new EventEmitter<any>();

    private htmlElement;
    private htmlElementDeps = [];
    private processingClassName = 'processing';
    private lastValue;
    private blurSubscription: Subscription;
    private focusSubscription: Subscription;

    constructor(private ajaxService: AjaxService, private elementRef: ElementRef) { }

    ngAfterContentInit() {
        this.htmlElement = Helpers.domFindElement(this.elementRef.nativeElement, '#' + this.elementId);

        if (this.htmlElement) {
            this.depIDs.forEach((id) => {
                this.htmlElementDeps.push(Helpers.domFindElement(this.elementRef.nativeElement, '#' + id));
            });

            this.blurSubscription = Observable
                .fromEvent(this.htmlElement, 'blur')
                .subscribe((e: any) => {
                    e = e.srcElement || e.target;
                    this.lookup(e.value);
                });
            this.focusSubscription = Observable
                .fromEvent(this.htmlElement, 'focus')
                .subscribe((e: any) => {
                    e = e.srcElement || e.target;
                    this.lastValue = e.value;
                });
        }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        var controlRefProp = changes['controlRef'];

        if (controlRefProp && controlRefProp.currentValue) {
            this.controlRef.valueChanges.subscribe((newValue) => {
                if (!newValue && this.controlRef.pristine) {
                    this.toggleDisabled(false);
                }
            });
        }
    }

    ngOnDestroy() {
        this.blurSubscription.unsubscribe();
        this.focusSubscription.unsubscribe();
    }

    private lookup(value) {
        var self = this;

        if (self.lastValue === value) { return; }

        self.toggleDisabled(true);
        self.toggleProcessing(false);

        self.ajaxService.get(
            self.url,
            { value: value },
            (data) => {
                if (!data) {
                    self.notFound();
                }
                else {
                    self.found(data);
                }
            },
            (ex) => {
                self.error();
            });
    }

    private notFound() {
        if (this.enableIfNotFound) {
            this.toggleDisabled(false);
            this.toggleProcessing(true);
        }

        this.htmlElementDeps[0].focus();
    }

    private found(data) {
        this.toggleDisabled(false, true, false);
        this.toggleProcessing(true);
        this.htmlElementDeps[0].focus();

        this.callback.emit(data);
    }

    private error() {
        this.toggleDisabled(false);
        this.toggleProcessing(true);
        this.htmlElementDeps[0].focus();
    }

    private toggleDisabled(disabled: boolean, srcTarget: boolean = true, deps: boolean = true) {
        if (srcTarget) { this.htmlElement.disabled = disabled; }
        if (deps) { this.htmlElementDeps.forEach((element) => { element.disabled = disabled; }); }
    }

    private toggleProcessing(done: boolean) {
        Helpers.domSetClass(this.htmlElement, this.processingClassName, done);
        this.htmlElementDeps.forEach((element) => { Helpers.domSetClass(element, this.processingClassName, done); });
    }
}

@Component({
    selector: 'addressComponent',
    template:
        `<h5 *ngIf="header != undefined">{{ header }}</h5>
        <div [formGroup]="form">
            <div class="row">
                <div class="form-group col-md-6">
                    <tooltipComponent [controlRef]="form.controls.Address1" elementId="Address1" message="Address is required." errorType="required"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.Address1" elementId="Address1" message="Address is too long." errorType="maxlength"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.Address1" elementId="Address1" message="Address must be alphanumeric." errorType="pattern"></tooltipComponent>
                    <label for="Address1" class="control-label">
                        Address<i *ngIf="isAddress1Required" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon">
                        <input id="Address1" name="Address1" type="text" class="form-control" formControlName="Address1"
                                validation [controlRef]="form.controls.Address1" [requiredValidator]="isAddress1Required" [maxLengthValidator]="100"  [patternValidator]="addressPatternValidation" />
                        <i *ngIf="form.controls.Address1.valid == false && form.controls.Address1.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                    </div>
                </div>
                <div class="form-group col-md-6">
                    <tooltipComponent [controlRef]="form.controls.Address2" elementId="Address2" message="Ste. / Apt. / etc. is too long." errorType="maxlength"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.Address2" elementId="Address2" message="Ste. / Apt. / etc. must be alphanumeric." errorType="pattern"></tooltipComponent>
                    <label for="Address2" class="control-label">Ste. / Apt. / etc.</label>
                    <div class="inner-addon right-addon">
                        <input id="Address2" name="Address2" type="text" class="form-control" formControlName="Address2"
                                [controlRef]="form.controls.Address2" validation [maxLengthValidator]="25"  [patternValidator]="addressPatternValidation" />
                        <i *ngIf="form.controls.Address2.valid == false && form.controls.Address2.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-3">
                    <tooltipComponent [controlRef]="form.controls.City" elementId="City" message="City is required." errorType="required"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.City" elementId="City" message="City is too long." errorType="maxlength"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.City" elementId="City" message="City must be alphanumeric." errorType="pattern"></tooltipComponent>
                    <label for="City" class="control-label">
                        City<i *ngIf="isCityRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon">
                        <input id="City" name="City" type="text" class="form-control" formControlName="City"
                                validation [controlRef]="form.controls.City" [requiredValidator]="isCityRequired" [maxLengthValidator]="60"  [patternValidator]="cityPatternValidation"/>
                        <i *ngIf="form.controls.City.valid == false && form.controls.City.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                    </div>
                </div>
                <div class="form-group col-md-3">
                    <tooltipComponent [controlRef]="form.controls.State" elementId="State" message="State is required." errorType="required"></tooltipComponent>
                    <label for="State" class="control-label">
                        State<i *ngIf="isStateRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon">
                        <select class="form-control" id="State" name="State" formControlName="State"
                                (blur)="onBlur()"
                                validation [controlRef]="form.controls.State" [requiredValidator]="isStateRequired">
                            <option [value]="null">--Select--</option>
                            <option *ngFor="let state of form.controls.States.value" [value]="state.StateValue">{{ state.StateName }}</option>
                        </select>
                        <i *ngIf="form.controls.State.valid == false && form.controls.State.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error-select"></i>
                    </div>
                </div>
                <div class="form-group col-md-3">
                    <tooltipComponent [controlRef]="form.controls.ZipCode" elementId="ZipCode" message="Zip is required." errorType="required"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.ZipCode" elementId="ZipCode" message="Invalid Zip format." errorType="pattern"></tooltipComponent>
                    <label for="ZipCode" class="control-label">
                        Zip<i *ngIf="isZipRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon">
                        <input id="ZipCode" name="ZipCode" type="text" class="form-control" formControlName="ZipCode"
                                validation [controlRef]="form.controls.ZipCode" [requiredValidator]="isZipRequired"
                                patternValidator="^(?!0{5})[0-9]{5}$"
                                [mask]="{ mask: '99999', placeholder: '_____', clearIfNotMatch: false }" />
                        <i *ngIf="form.controls.ZipCode.valid == false && form.controls.ZipCode.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                    </div>
                </div>
                <div class="form-group col-md-3" id="divCounty" *ngIf="showCounty">
                    <tooltipComponent [controlRef]="form.controls.County" elementId="County" message="County is required." errorType="required"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.County" elementId="County" message="County is too long." errorType="maxlength"></tooltipComponent>
                    <tooltipComponent [controlRef]="form.controls.County" elementId="County" message="County is invalid." errorType="pattern"></tooltipComponent>
                    <label for="County" class="control-label">
                        County<i *ngIf="isCountyRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
                    </label>
                    <div class="inner-addon right-addon">
                        <input id="County" name="County" type="text" class="form-control" formControlName="County" [requiredValidator]="isCountyRequired"
                            validation [maxLengthValidator]="50" [controlRef]="form.controls.County" [patternValidator]="countyPatternValidation" />
                        <i *ngIf="form.controls.County.valid == false && form.controls.County.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                    </div>
                </div>
            </div>
    </div>`
})
export class AddressComponent {
    @Input() form: any;
    @Input() header: string;
    @Input() isAddress1Required: boolean = true;
    @Input() isStateRequired: boolean = true;
    @Input() isCityRequired: boolean = true;
    @Input() isZipRequired: boolean = true;
    @Input() showCounty: boolean = false;
    @Input() cityPatternValidation: string;
    @Input() addressPatternValidation: string;
    @Input() isCountyRequired = false;
    @Input() countyPatternValidation: string;

    onBlur() {
        if (this.form.controls.State.value == 'null') { this.form.controls.State.setValue(null); }
    }
}

@Component({
    selector: 'fieldDetailComponent',
    providers: [DateSWBCPipe, CurrecnySWBCPipe, JsonToDatePipe],
    template:
        `<span>{{ label }}:&nbsp;</span>
    <template [ngIf]="value">{{ value }}</template>
    <span *ngIf="!value" class="field-detail-value">(Not Provided)</span>
    <br />`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldDetailComponent {
    @Input() label: string;
    @Input() value: string = '';
    @Input() format: string = '';
    private InvalidInput = "(Formatting is failed: invalid value)";

    constructor(private currency: CurrecnySWBCPipe, private date: DateSWBCPipe) { }

    ngOnChanges(changes: { [key: string]: SimpleChange; }) {
        let valueChange = changes['value'];
        if (this.value && this.value.toString().trim() == "") { this.value = ''; }
        if (valueChange && this.value && this.format) {
            switch (this.format) {
                case "UpperCase":
                    this.value = this.value.toUpperCase();
                    break;
                case "LowerCase":
                    this.value = this.value.toLowerCase();
                    break;
                case "Currency":
                    this.value = this.validateInput("number") ? this.currency.transform(this.value) : this.InvalidInput; // ex:$100.00
                    break;
                case "Decimal":
                    this.value = this.validateInput("number") ? this.decimalFormat(this.value) : this.InvalidInput;
                    break;
                case "Percentage":
                    this.value = this.validateInput("number") ? this.value + '%' : this.InvalidInput;
                    break;
                case "Date":
                    this.value = this.validateInput("date") ? this.date.transform(this.value, "Date") : this.InvalidInput; //ex: 04/10/2017 02:46:09 PM (April 10th 2017 02:46:09 PM)
                    break;
                case "ShortDate":
                    this.value = this.validateInput("date") ? this.date.transform(this.value, "ShortDate") : this.InvalidInput; //ex: 04/10/2017 (April 10th 2017)
                    break;
                case "Time":
                    this.value = this.validateInput("date") ? this.date.transform(this.value, "Time") : this.InvalidInput; //ex: Input value should be validate date format: 04/10/2017 02:46:09 PM, Format as: 02:46:09 PM
                    break;
                case "ShortTime":
                    this.value = this.validateInput("date") ? this.date.transform(this.value, "ShortTime") : this.InvalidInput; //ex: Input value should be validate date format: 04/10/2017 02:46:09 PM, Format as: 02:46 PM
                    break;
            }
        }
    }

    private validateInput(type: string): boolean {
        switch (type) {
            case "date":
                return !isNaN(Date.parse(this.value));
            case "number":
                return !isNaN(parseFloat(this.value));
            default:
                return false;
        }
    }

    private decimalFormat(value): string {
        return parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, " ");
    }
}

@Component({
    selector: 'addressDetailComponent',
    template:
        `<b class="control-label">{{ header }}</b>
    <div>
        <fieldDetailComponent label="Address" [value]="address1"></fieldDetailComponent>
        <fieldDetailComponent label="Ste. / Apt. / etc." [value]="address2"></fieldDetailComponent>
        <fieldDetailComponent label="City / State / Zip" [value]="cityStateZip"></fieldDetailComponent>
    </div>`
})
export class AddressDetailComponent {
    @Input() header: string;
    @Input() address1: string;
    @Input() address2: string;
    @Input() cityStateZip: string;
}

@Component({
    selector: 'alertsComponent',
    template:
        `<div class="news-alerts-height white-background">
        <div *ngIf="(alertsList | async).length == 0" class="swbc-mediumgray-background tile-title-height news-alerts-subheader">
            <span class="pull-left">{{title}}</span>
            <span class="pull-right" style="margin-top: 6px;"></span>
        </div>
        <div *ngIf="(alertsList | async).length > 0" class="swbc-orange-background tile-title-height news-alerts-subheader">
            <span class="pull-left">{{title}}</span>
            <span class="badge pull-right swbc-orange white-background" style="margin-top: 6px;">{{ (alertsList | async).length }}</span>
        </div>
        <div class="bottom-leftalign-text" style="margin-top: -10px;">
            <div>{{oneOfMessage}}</div>
        </div>
        <div *ngIf="(alertsList | async).length > 0">
            <div class="dashboard-subtext white-background">
                <b>{{alertAfterDateTime}} - {{applicationName}}</b>&nbsp;<a data-toggle="tooltip" title="{{account}}" class="alertSection" href="#" (click)="checkAlertAccount(alertAccountId, alertUrl, domainName)">
                     {{details | limitTo: 140}}.</a>
            </div>
            <div class="dashboard-subtext bottom-align-text">
                <ul class="entityCommands">
                    <li *ngIf="(alertsList | async).length > 1"><a (click)="getAlert(false)">Prev</a></li>
                    <li *ngIf="(alertsList | async).length > 1"><a (click)="getAlert(true)">Next</a></li>
                    <li><a data-toggle="modal" data-target="#myModalAlert">View All</a></li>
                </ul>
            </div>
        </div>
        <div *ngIf="(alertsList | async).length == 0" class="dashboard-subtext white-background">
            {{ noAlertsText }}
        </div>
    </div>
    <div id="myModalAlert" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">{{modalTitle}}</h4>
                </div>
                <div class="modal-body edit-content">
                    <div class="display-table" style="width: 100%">
                        <div class="display-table-row notifications-modal-header">
                            <div class="display-table-cell">Alert Date</div>
                            <div class="display-table-cell">Account</div>
                            <div class="display-table-cell">Application</div>
                            <div class="display-table-cell">Details</div>
                        </div>
                        <div class="display-table-row" *ngFor="let item of (alertsList | async)">
                            <div class="display-table-cell">{{ item.AlertAfterDateTime }}</div>
                            <div class="display-table-cell">{{ item.Account }}</div>
                            <div class="display-table-cell">{{ item.ApplicationName }}</div>
                            <div class="display-table-cell"><a (click)="checkAlertAccount(item.AccountId, item.Url, domainName)">{{ item.Detail }}</a></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">{{buttonText}}</button>
                </div>
            </div>
        </div>
    </div>
    <div id="modalConfirmationAlert" class="modal fade" role="dialog">
	    <div class="modal-dialog modal-md">
		    <div class="modal-content">
			    <div class="modal-header">
				    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				    <h4 class="modal-title" id="myModalLabel">{{confirmModalTitle}}</h4>
			    </div>
                <div class="modal-body edit-content">
                    {{confirmationMessage}}
                </div>
			    <div class="modal-footer">
				    <button *ngIf="!unAuthorizedError" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
				    <button *ngIf="!unAuthorizedError" type="button" class="btn btn-primary" (click)="setupAccountAndRedirect()">Continue</button>

                    <button *ngIf="unAuthorizedError" type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
			    </div>
		    </div>
	    </div>
    </div>`,
    providers: [AjaxService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsComponent extends Savable implements AfterViewInit {
    @Input() alertNum: number;
    @Input() userAlertsUrl: string;
    @Input() noAlertsText = "You have no alerts.";

    title: string;
    details: string;
    alertUrl: string;
    modalTitle: string;
    buttonText: string;
    alertIndex: number;
    alertAfterDateTime: string;
    applicationName: string;
    alertAccountId: number = 0;
    confirmationMessage: string = '';
    account: string;
    domainName: string = "";
    apiUrl: string;

    private $modal: any;
    private alertActionCookieName = "alertAction";
    private portalAccountCookie = "portalAccount";
    private accountCookie = "account";
    private confirmModalTitle = "Confirmation";
    private unAuthorizedError;
    private accountIdfromCookie;
    private defaultAccount: string;
    private oneOfMessage: string;
    private alertsList: BehaviorSubject<AlertItem[]> = new BehaviorSubject<AlertItem[]>([]);

    constructor(private elementRef: ElementRef, private ajaxService: AjaxService) {
        super();

        this.title = elementRef.nativeElement.getAttribute('alertsTitle');
        this.modalTitle = elementRef.nativeElement.getAttribute('modalTitle');
        this.buttonText = elementRef.nativeElement.getAttribute('buttonText');
    }

    ngAfterViewInit() {
        this.load();
        this.$modal = jQuery(this.elementRef.nativeElement.querySelector('#modalConfirmationAlert'));
        this.$modal.appendTo('body');
    }

    load() {
        var cookieName = this.accountCookie;
        this.accountIdfromCookie = this.getAcctCookie(cookieName);
        var array = this.userAlertsUrl.split("/");
        this.applicationName = array[6];
        this.domainName = array[0] + "//" + array[2];
        if (this.accountIdfromCookie != null && this.applicationName != "") {
            this.userAlertsUrl = this.userAlertsUrl + "/" + this.accountIdfromCookie
        }

        this.ajaxService.get(this.userAlertsUrl, null,
            (data) => {
                let list = JSON.parse(data);

                if (list && list.length > 0) {
                    this.alertsList.next(Helpers.sortByField(list, false, (e: AlertItem) => { return e.AlertAfterDateTime }));
                    this.details = list[0].Detail;
                    this.alertUrl = list[0].Url;
                    this.alertAfterDateTime = list[0].AlertAfterDateTime;
                    this.applicationName = list[0].ApplicationName;
                    this.alertIndex = 0;
                    this.account = list[0].Account;
                    this.alertAccountId = list[0].AccountId;
                    this.setOneOfMessage(this.alertIndex);
                }
            },
            (response) => {
                this.errored();
            });
    }

    private setOneOfMessage(index) {
        index = index + 1;
        this.oneOfMessage = "(" + index + " of " + this.alertsList.value.length + ")";
    }

    private getAlert(getNext) {
        let list = this.alertsList.value;
        this.alertIndex = getNext ? this.alertIndex = this.alertIndex++ : this.alertIndex = this.alertIndex--;

        if (getNext) { this.alertIndex = this.alertIndex + 1; }
        else { this.alertIndex = this.alertIndex - 1; }

        if (this.alertIndex > list.length - 1) { this.alertIndex = 0; }
        if (this.alertIndex < 0) { this.alertIndex = list.length - 1; }

        this.alertAfterDateTime = list[this.alertIndex].AlertAfterDateTime;
        this.applicationName = list[this.alertIndex].ApplicationName;
        this.account = list[this.alertIndex].Account;
        this.details = list[this.alertIndex].Detail;
        this.alertUrl = list[this.alertIndex].Url;
        this.setOneOfMessage(this.alertIndex);
    }

    private checkAlertAccount(accountId: number, url, domain) {
        // this method is to validate with user's default account OR recent setup account in the Header(technically it is the value from "account" cookie) with selected alerts account.
        //.... if it differs, then should give a confirmation message to user for switching account.
        var cookieName = this.portalAccountCookie;
        this.alertUrl = url;
        this.alertAccountId = accountId;
        this.accountIdfromCookie = this.getAcctCookie(cookieName);

        if (this.accountIdfromCookie === undefined || this.accountIdfromCookie === "") {
            this.setAccountCookie(accountId);
            window.location.href = url;
        }

        if (accountId == null) {
            window.location.href = url;
        }
        else {
            this.apiUrl = domain + "/api/accounts/accountNameById/";
            this.ajaxService.get(this.apiUrl + this.accountIdfromCookie, null,
                (data) => {
                    var accountDet = JSON.parse(data);
                    if (accountDet) {
                        this.defaultAccount = accountDet.AccountName;
                    }

                    // Validating user's access on the selected alerts's account.
                    this.ajaxService.get(this.apiUrl + accountId, null,
                        (data) => {
                            var accountObj = JSON.parse(data);
                            if (parseInt(this.accountIdfromCookie) !== accountId) {

                                this.confirmationMessage = 'This alert belongs to account - "' + accountObj.AccountName + '" which is different from your default account - "' + this.defaultAccount + '".' +
                                    ' Navigating to this alert will switch your default account for this session on all your open windows to "' + accountObj.AccountName + '". Any unsaved data will be lost. Do you wish to continue? ';

                                this.$modal.modal('show');
                            }
                            else {
                                window.location.href = url;
                            }
                        },
                        (error) => {
                            this.errored(error);
                            this.confirmationMessage = this.serverError;
                            this.unAuthorizedError = this.serverError;
                            this.serverError = "";
                            this.confirmModalTitle = "Information";
                            this.$modal.modal('show');
                        }
                    );
                },
                (error) => {
                    this.errored(error);
                }
            );
        }
    }

    private setupAccountAndRedirect() {
        this.setAccountCookie(this.alertAccountId);
        this.$modal.modal('hide');
        window.location.href = this.alertUrl;
    }

    private getAcctCookie(cname) {
        var name = cname + "=";
        var ca = decodeURIComponent(document.cookie).split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1);
            if (c.indexOf(name) === 0)
                return c.substring(name.length, c.length);
        }
        return '';
    }

    private setAccountCookie(val) {
        //portal master account cookie
        document.cookie = this.portalAccountCookie + '=' + val + ';path=/';
        //portal alert action cookie
        document.cookie = this.alertActionCookieName + '=Y;path=/';
    }
}

@Component({
    selector: "autoCompleteComponent",
    template:
        `<tooltipComponent [class]="labelText ? null : 'tooltipNoLabel'" [controlRef]="controlRef" [message]="requiredMessage" [autoLoad]="false" [elementId]="htmlId" errorType="required" #toolTipComp></tooltipComponent>
        <div class="form-group">
            <label *ngIf="labelText" for="controlRef" class="control-label">
                {{labelText}}
                <i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
            </label>
            <div class="dropdown autoComplete">
                <div class="inner-addon right-addon">
                    <input #autoCompleteInput class="form-control"
                           id="{{htmlId}}"
                           placeholder="{{placeholder}}"
                           (focus)="showDropdownList($event)"
                           (blur)="hideDropdownList()"
                           (keydown)="inputElKeyHandler($event)"
                           (input)="reloadListInDelay($event)"
                           [formControl]="controlRef"
                           [controlRef]="controlRef"
                           validation [requiredValidator]="isRequired"
                           [maxlength] ="maxLength"/>
                    <i *ngIf="isRequired && controlRef.valid == false && controlRef.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
                </div>
                <div *ngIf="dropdownVisible | async">
                    <div class="autoCompleteDropdown">
                        <table>
                            <th *ngFor="let header of headerNames; let i = index">{{ header }}</th>
                            <tr *ngFor="let item of (filteredList | async); let i = index" (mousedown)="selectOne(item)" [ngClass]="{ 'selected': i === itemIndex }">
                                <td *ngFor="let header of headerNames; let j = index">{{ getPropertyDisplay(item, j) }}</td>
                            </tr>
                        </table>
                        <div *ngIf="isLoading" class="loading">{{loadingText}}</div>
                        <div *ngIf="minCharsEntered && !isLoading && !filteredList.value.length" (mousedown)="selectOne('')" class="blank-item">{{ noMatchFoundText }}</div>
                        <div *ngIf="blankOptionText && filteredList.value.length" (mousedown)="selectOne('')" class="blank-item">{{ blankOptionText }}</div>
                    </div>
                </div>
            </div>
        </div>`,
    providers: [AjaxService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements AfterViewInit, OnChanges {
    @Input() source: any;
    @Input() minChars: number = 0;
    @Input() pathToData: string;
    @Input() displayPropertyNames: string[];
    @Input() displayTextPropertyName: string;
    @Input() headerNames: string[];
    @Input() placeholder: string;
    @Input() blankOptionText: string;
    @Input() noMatchFoundText: string = 'No Result Found';
    @Input() loadingText: string = 'Loading';
    @Input() maxListItems: number = 10;
    @Input() controlRef: FormControl;
    @Input() showHeaders: boolean = true;
    @Input() htmlId: string;
    @Input() filterExactMatch: any;
    @Input() filterLookupColumns: string[];
    @Input() clearIfNotMatch: boolean = false;
    @Input() readOnlyIfExactMatch: boolean = false;
    @Input() labelText: string;
    @Input() requiredMessage: string;
    @Input() isRequired: boolean = false;
    @Input() maxLength: number;

    @Output() valueSelected = new EventEmitter();
    @Output() inputChanged = new EventEmitter();

    private dropdownVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private isLoading: boolean = false;
    private filteredList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private minCharsEntered: boolean = false;
    private itemIndex: number;
    private keyword: string;
    private originalClearIfNotMatch: boolean;

    @ViewChild('toolTipComp') toolTipComponent: TooltipComponent;

    constructor(elementRef: ElementRef, private ajaxService: AjaxService) { }

    ngAfterViewInit() {
        if (!this.displayPropertyNames) { throw Error('You have to specify "displayPropertyNames" property for AutoCompleteComponent!'); }
        else if (this.displayPropertyNames.length < 1) { throw Error('You have to specify at least one element for "displayPropertyNames" in AutoCompleteComponent!'); }
        if (this.toolTipComponent) { this.toolTipComponent.load(); }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange; }) {
        if (changes['filterLookupColumns'])
            this.filterLookupColumns = this.filterLookupColumns ? this.filterLookupColumns.filter((item) => { return item.trim().length > 0 }) : null;
        if (changes['clearIfNotMatch'])
            this.clearIfNotMatch ? this.originalClearIfNotMatch = this.clearIfNotMatch : undefined;
        if (changes['source']) {
            this.source ? this.setupExactMatch() : undefined;
        }
    }

    showDropdownList(event: any): void {
        this.dropdownVisible.next(true);
        this.reloadList(event.target.value);
    }

    hideDropdownList(): void {
        this.dropdownVisible.next(false);
        this.clearIfNotMatch ? this.controlRef.setValue('') : undefined;
    }

    private setupExactMatch() {
        if (!this.isFilterExactMatchValid()) return;

        this.reloadList(this.filterExactMatch);

        if (this.filteredList && this.filteredList.value.length > 0) {
            this.selectOne(this.filteredList.value[0]);
            this.ApplyReadOnly();
        }
    }

    private isFilterExactMatchValid(): boolean {
        return typeof this.filterExactMatch === 'string' ? this.filterExactMatch.trim().length > 0 ? true : false : this.filterExactMatch;
    }

    private ApplyReadOnly() {
        (this.isFilterExactMatchValid() &&
            this.filteredList &&
            this.filteredList.value.length > 0 &&
            this.readOnlyIfExactMatch) ? this.controlRef.disable() : undefined;
    }

    private reloadListInDelay = (evt: any): void => {
        let delayMs = this.isSrcArr() ? 10 : 500;
        let keyword = evt.target.value;

        // executing after user stopped typing
        this.delay(() => this.reloadList(keyword), delayMs);
        this.inputChanged.emit(keyword);
    };

    private reloadList(keyword: string): void {
        if (keyword.length < (this.minChars || 0)) {
            this.minCharsEntered = false;
            return;
        } else {
            this.minCharsEntered = true;
        }

        if (this.isSrcArr()) {
            this.isLoading = false;
            this.filteredList.next(this.filter(this.source, keyword));

            if (this.maxListItems) { this.filteredList.next(this.filteredList.value.slice(0, this.maxListItems)); }
        } else {
            this.isLoading = true;

            if (typeof this.source === "function") {
                this.source(keyword).subscribe(
                    resp => {
                        if (this.pathToData) {
                            let paths = this.pathToData.split(".");
                            paths.forEach(prop => resp = resp[prop]);
                        }

                        if (this.maxListItems) { this.filteredList.next(resp.slice(0, this.maxListItems)); }
                        else { this.filteredList.next(resp); }
                    },
                    error => null,
                    () => this.isLoading = false
                );
            } else {
                if (typeof this.source !== 'string') { throw "Invalid type of source, must be a string. e.g. http://www.google.com?q=:my_keyword"; }

                this.ajaxService.get(this.source, { value: keyword },
                    (data) => {
                        let list = JSON.parse(data);

                        if (this.maxListItems) { this.filteredList.next(list.slice(0, this.maxListItems)); }
                        else { this.filteredList.next(list); }

                        this.isLoading = false;

                        if (this.pathToData) {
                            let paths = this.pathToData.split(".");
                            paths.forEach(prop => this.filteredList.next(this.filteredList.value[prop]));
                        }
                    },
                    (response) => {
                        this.isLoading = false;
                    });
            }
        }

        this.filteredList.value.length == 0 ? this.clearIfNotMatch = this.originalClearIfNotMatch : undefined;
    }

    private selectOne(item: any) {
        this.itemIndex = this.filteredList.value.indexOf(item);
        this.controlRef.setValue(item[this.displayTextPropertyName]);
        this.valueSelected.emit(item);
        this.clearIfNotMatch = false;
    };

    private inputElKeyHandler = (evt: any) => {
        let totalNumItem = this.filteredList.value.length;

        switch (evt.keyCode) {
            case 27: // ESC, hide auto complete
                break;

            case 38: // UP, select the previous li el
                this.itemIndex = (totalNumItem + this.itemIndex - 1) % totalNumItem;
                break;

            case 40: // DOWN, select the next li el or the first one
                this.dropdownVisible.next(true);
                this.itemIndex = (totalNumItem + this.itemIndex + 1) % totalNumItem;
                break;

            case 13: // ENTER, choose it!!
                if (this.filteredList.value.length > 0) {
                    this.selectOne(this.filteredList.value[this.itemIndex]);
                    this.dropdownVisible.next(false);
                }
                evt.preventDefault();
                break;
        }
    };

    private emptyList(): boolean {
        return !(
            this.isLoading ||
            (this.minCharsEntered && !this.isLoading && !this.filteredList.value.length) ||
            (this.filteredList.value.length)
        );
    }

    private getPropertyDisplay(item: any, index: number): string {
        return item[this.displayPropertyNames[index]];
    }

    private delay = (function () {
        let timer = 0;
        return function (callback: any, ms: number) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    private filter(list: any[], keyword: any) {
        return list.filter((item) => {
            let objStr = JSON.stringify(item, (this.filterLookupColumns && this.filterLookupColumns.length > 0) ? this.filterLookupColumns : null).toLowerCase();

            keyword = typeof keyword === 'string' ? keyword.toLowerCase() : keyword;

            return objStr.indexOf(keyword) !== -1;
        }
        );
    }

    private isSrcArr(): boolean {
        return (this.source.constructor.name === "Array");
    }
}

@Component({
    selector: "currencyLabelComponent",
    providers: [CurrecnySWBCPipe],
    template:
        `<span>{{ label }}:&nbsp;</span>
    <template [ngIf]="internalValue | async">{{ internalValue.value }}</template>
    <span *ngIf="!(internalValue | async)" class="field-detail-value">(Not Provided)</span>
    <br />`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyLabelComponent implements OnInit {
    @Input() label: string;
    @Input() value: string = '';

    private internalValue: BehaviorSubject<string> = new BehaviorSubject<string>(this.value);

    constructor(private currecny: CurrecnySWBCPipe) { }

    ngOnInit() {
        if (isNaN(parseFloat(this.value))) {
            this.internalValue.next('');
        }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange; }) {
        let valueChange = changes['value'];
        if (valueChange && this.value) {
            this.internalValue.next(this.currecny.transform(this.value));
        }
    }
}

@Component({
    selector: "currencyTextComponent",
    template:
        `<div class="form-group">
        <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [message]="requiredMessage" [autoLoad]="false" errorType="required" validationType="valueMissing"  #textBoxRequiredTooltip></tooltipComponent>
        <label [attr.for]="textBoxId" class="control-label">
            {{ labelText }}<i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>            
        </label>     
        <div class="inner-addon right-addon">
            <div class="input-group">
                <span class="input-group-addon">$</span>
                <input [id]="textBoxId" type="text" class="form-control" [formControl]="controlRef"
                    validation [controlRef]="controlRef" [requiredValidator]="isRequired"  [readonly] ="readOnly ? true : null"
                    [mask]="maskingFormat" />
            </div>
            <i *ngIf="controlRef.valid == false && controlRef.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
         </div>
    </div>`
})
export class CurrencyTextComponent implements AfterViewInit {
    @Input() labelText: string;
    @Input() controlRef: FormControl;
    @Input() maskFormat: string;
    @Input() readOnly: boolean = false;
    @Input() requiredMessage: string;
    @Input() isRequired: boolean = false;

    @ViewChild('textBoxRequiredTooltip') textBoxRequiredTooltip: TooltipComponent;

    private textBoxId = 'currency_TextBox_' + MathHelpers.random();
    isReadOnly = false;
    maskingFormat;

    ngAfterViewInit() {
        if (this.textBoxRequiredTooltip) { this.textBoxRequiredTooltip.load(); }
    }
    ngOnInit() {
        if (!this.maskFormat) {
            this.maskFormat = '[{ "mask": "#,##|.||", "placeholder": "_.__", "clearIfNotMatch": false, "reverse": true }]';
        }
        this.maskingFormat = JSON.parse(this.maskFormat)[0];
    }
}

@Component({
    selector: "ssnComponent",
    template:
        `<div class="form-group">
        <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [autoLoad]="false" [message]="patternMessage" errorType="pattern" #textBoxPatternTooltip></tooltipComponent>
        <tooltipComponent [controlRef]="controlRef" [elementId]="textBoxId" [autoLoad]="false" [message]="requiredMessage" errorType="required" #textBoxRequiredTooltip></tooltipComponent>
        <label [attr.for]="textBoxId" class="control-label">
            {{ labelText }}<i *ngIf="isRequired" class="glyphicon glyphicon-asterisk glyphicon-required"></i>
        </label>     
        <div class="inner-addon right-addon">
            <input [id]="textBoxId" type="text" class="form-control" [formControl]="controlRef" 
                validation [controlRef]="controlRef" patternValidator="[0-9]{3}[-][0-9]{2}[-][0-9]{4}" 
                [requiredValidator]="isRequired" [blurMask]="maskOptions" [displayFormatter]="getHiddenValue" />
            <i *ngIf="controlRef.valid == false && controlRef.touched == true" class="form-control-feedback glyphicon glyphicon-exclamation-sign glyphicon-error"></i>
         </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsnComponent implements AfterViewInit {
    @Input() labelText: string;
    @Input() controlRef: FormControl;
    @Input() isRequired: boolean = false;
    @Input() requiredMessage: string;
    @Input() patternMessage: string;
    @Input() autoLoad: boolean = true;

    @ViewChild('textBoxRequiredTooltip') textBoxRequiredTooltip: TooltipComponent;
    @ViewChild('textBoxPatternTooltip') textBoxPatternTooltip: TooltipComponent;

    private textBoxId: string = 'ssn_TextBox_' + MathHelpers.random();
    private maskOptions = {
        mask: '999-99-9999',
        placeholder: '___-__-____',
        clearIfNotMatch: true
    };

    ngAfterViewInit() {
        if (this.autoLoad) { this.load(); }
    }

    load() {
        this.textBoxRequiredTooltip.load();
        this.textBoxPatternTooltip.load();
    }

    private getHiddenValue(value: any) {
        return value ? '***-**' + value.slice(value.lastIndexOf('-')) : value;
    }
}

@Component({
    selector: 'dataLossConfirmationComponent',
    template: ``,
    providers: [ZoneService]
})
export class DataLossConfirmationComponent {
    @Input() form: FormGroup;
    @Input() message: string = 'You are about to lose unsaved changes. Are you sure about leaving this page and losing all of your unsaved changes?';

    private isTimeout: boolean;

    constructor() {
        var self = this;

        window.addEventListener('message', (e) => {
            // looks at the postMessage from portal MenuPartial. 
            // If this has changed in some way, 
            // this feature may not work hence the confirmation is shown at portal timeout preventing redirection to logout page redirection
            if (e.data == 'sessionTimeout|leave') { self.isTimeout = true; }
        });
        window.onbeforeunload = (e) => {
            if (self.isTimeout && swbc && swbc.framing && swbc.framing.isChildWindow()) { window.close(); }
            else if (!self.form.pristine && !self.isTimeout) return self.message;
        };
    }
}
