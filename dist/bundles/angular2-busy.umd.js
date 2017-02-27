(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subscription'), require('@angular/common'), require('angular2-dynamic-component/index')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subscription', '@angular/common', 'angular2-dynamic-component/index'], factory) :
	(factory((global.ng2 = global.ng2 || {}, global.ng2.busy = global.ng2.busy || {}),global.ng.core,global.Rx.Subscription,global.ng.common,global['angular2-dynamic-component/index']));
}(this, (function (exports,_angular_core,rxjs_Subscription,_angular_common,angular2DynamicComponent_index) { 'use strict';

/**
 * @file Util
 * @author yumao<yuzhang.lille@gmail.com>
 */
// from AngularJS
function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]';
}
function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}
function isWindow(obj) {
    return obj && obj.window === obj;
}
function isFunction(value) {
    return typeof value === 'function';
}
function isDefined(value) {
    return typeof value !== 'undefined';
}
function equals(o1, o2) {
    if (o1 === o2) {
        return true;
    }
    
    if (o1 === null || o2 === null) {
        return false;
    }
    if (o1 !== o1 && o2 !== o2) {
        return true; // NaN === NaN
    }
    var t1 = typeof o1;
    var t2 = typeof o2;
    var length;
    var key;
    var keySet;
    if (t1 === t2 && t1 === 'object') {
        if (Array.isArray(o1)) {
            if (!Array.isArray(o2)) {
                return false;
            }
            if ((length = o1.length) === o2.length) {
                for (key = 0; key < length; key++) {
                    if (!equals(o1[key], o2[key])) {
                        return false;
                    }
                }
                return true;
            }
        }
        else if (isDate(o1)) {
            if (!isDate(o2)) {
                return false;
            }
            return equals(o1.getTime(), o2.getTime());
        }
        else if (isRegExp(o1)) {
            if (!isRegExp(o2)) {
                return false;
            }
            return o1.toString() === o2.toString();
        }
        else {
            if (isWindow(o1) || isWindow(o2)
                || Array.isArray(o2) || isDate(o2) || isRegExp(o2)) {
                return false;
            }
            
            keySet = Object.create(null);
            for (key in o1) {
                if (key.charAt(0) === '$' || isFunction(o1[key])) {
                    continue;
                }
                
                if (!equals(o1[key], o2[key])) {
                    return false;
                }
                keySet[key] = true;
            }
            for (key in o2) {
                if (!(key in keySet)
                    && key.charAt(0) !== '$'
                    && isDefined(o2[key])
                    && !isFunction(o2[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

/**
 * @file Service: PromiseTracker
 * @author yumao<yuzhang.lille@gmail.com>
 */
var PromiseTrackerService = (function () {
    function PromiseTrackerService() {
        this.promiseList = [];
        this.delayJustFinished = false;
    }
    PromiseTrackerService.prototype.reset = function (options) {
        var _this = this;
        this.minDuration = options.minDuration;
        this.promiseList = [];
        options.promiseList.forEach(function (promise) {
            if (!promise || promise['busyFulfilled']) {
                return;
            }
            _this.addPromise(promise);
        });
        if (this.promiseList.length === 0) {
            return;
        }
        this.delayJustFinished = false;
        if (options.delay) {
            this.delayPromise = setTimeout(function () {
                _this.delayPromise = null;
                _this.delayJustFinished = true;
            }, options.delay);
        }
        if (options.minDuration) {
            this.durationPromise = setTimeout(function () {
                _this.durationPromise = null;
            }, options.minDuration + (options.delay || 0));
        }
    };
    PromiseTrackerService.prototype.addPromise = function (promise) {
        var _this = this;
        if (this.promiseList.indexOf(promise) !== -1) {
            return;
        }
        this.promiseList.push(promise);
        if (promise instanceof Promise) {
            promise.then.call(promise, function () { return _this.finishPromise(promise); }, function () { return _this.finishPromise(promise); });
        }
        else if (promise instanceof rxjs_Subscription.Subscription) {
            promise.add(function () { return _this.finishPromise(promise); });
        }
    };
    PromiseTrackerService.prototype.finishPromise = function (promise) {
        promise['busyFulfilled'] = true;
        var index = this.promiseList.indexOf(promise);
        if (index === -1) {
            return;
        }
        this.promiseList.splice(index, 1);
    };
    PromiseTrackerService.prototype.isActive = function () {
        if (this.delayPromise) {
            return false;
        }
        if (!this.delayJustFinished) {
            if (this.durationPromise) {
                return true;
            }
            return this.promiseList.length > 0;
        }
        this.delayJustFinished = false;
        if (this.promiseList.length === 0) {
            this.durationPromise = null;
        }
        return this.promiseList.length > 0;
    };
    PromiseTrackerService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    PromiseTrackerService.ctorParameters = function () { return []; };
    return PromiseTrackerService;
}());

/**
 * @file Busy Config
 * @author yumao<yuzhang.lille@gmail.com>
 */
var BusyConfig = (function () {
    function BusyConfig(config) {
        if (config === void 0) { config = {}; }
        for (var option in BUSY_CONFIG_DEFAULTS) {
            this[option] = config[option] != null ? config[option] : BUSY_CONFIG_DEFAULTS[option];
        }
    }
    return BusyConfig;
}());
var BUSY_CONFIG_DEFAULTS = {
    template: "\n        <div class=\"ng-busy-default-wrapper\">\n            <div class=\"ng-busy-default-sign\">\n                <div class=\"ng-busy-default-spinner\">\n                    <div class=\"bar1\"></div>\n                    <div class=\"bar2\"></div>\n                    <div class=\"bar3\"></div>\n                    <div class=\"bar4\"></div>\n                    <div class=\"bar5\"></div>\n                    <div class=\"bar6\"></div>\n                    <div class=\"bar7\"></div>\n                    <div class=\"bar8\"></div>\n                    <div class=\"bar9\"></div>\n                    <div class=\"bar10\"></div>\n                    <div class=\"bar11\"></div>\n                    <div class=\"bar12\"></div>\n                </div>\n                <div class=\"ng-busy-default-text\">{{message}}</div>\n            </div>\n        </div>\n    ",
    delay: 0,
    minDuration: 0,
    backdrop: true,
    message: 'Please wait...',
    wrapperClass: 'ng-busy'
};

/**
 * @file Service: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
var BusyService = (function () {
    function BusyService(config) {
        this.config = config || new BusyConfig();
    }
    BusyService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    BusyService.ctorParameters = function () { return [
        { type: BusyConfig, decorators: [{ type: _angular_core.Optional },] },
    ]; };
    return BusyService;
}());

/**
 * @file Component: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
var inactiveStyle = _angular_core.style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
var timing = '.3s ease';

var BusyComponent = (function () {
    function BusyComponent(tracker) {
        this.tracker = tracker;
        this.context = {
            message: ""
        };
    }
    BusyComponent.prototype.isActive = function () {
        return this.tracker.isActive();
    };
    BusyComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ng-busy',
                    template: "\n        <div [class]=\"wrapperClass\" *ngIf=\"isActive()\" @flyInOut>\n            <DynamicComponent [componentTemplate]=\"template\" [componentContext]=\"context\">\n            </DynamicComponent>\n        </div>\n    ",
                    animations: [
                        _angular_core.trigger('flyInOut', [
                            _angular_core.transition('void => *', [
                                inactiveStyle,
                                _angular_core.animate(timing)
                            ]),
                            _angular_core.transition('* => void', [
                                _angular_core.animate(timing, inactiveStyle)
                            ])
                        ])
                    ]
                },] },
    ];
    /** @nocollapse */
    BusyComponent.ctorParameters = function () { return [
        { type: PromiseTrackerService, },
    ]; };
    return BusyComponent;
}());

/**
 * @file Component: BusyBackdrop
 * @author yumao<yuzhang.lille@gmail.com>
 */
var inactiveStyle$1 = _angular_core.style({
    opacity: 0,
});
var timing$1 = '.3s ease';
var BusyBackdropComponent = (function () {
    function BusyBackdropComponent(tracker) {
        this.tracker = tracker;
    }
    BusyBackdropComponent.prototype.isActive = function () {
        return this.tracker.isActive();
    };
    BusyBackdropComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ng-busy-backdrop',
                    template: "\n        <div class=\"ng-busy-backdrop\"\n             @fadeInOut\n             *ngIf=\"isActive()\">\n        </div>\n    ",
                    animations: [
                        _angular_core.trigger('fadeInOut', [
                            _angular_core.transition('void => *', [
                                inactiveStyle$1,
                                _angular_core.animate(timing$1)
                            ]),
                            _angular_core.transition('* => void', [
                                _angular_core.animate(timing$1, inactiveStyle$1)
                            ])
                        ])
                    ]
                },] },
    ];
    /** @nocollapse */
    BusyBackdropComponent.ctorParameters = function () { return [
        { type: PromiseTrackerService, },
    ]; };
    return BusyBackdropComponent;
}());

/**
 * @file Directive: Bus
 * @author yumao<yuzhang.lille@gmail.com>
 */
/**
 * ### Syntax
 *
 * - `<div [ngBusy]="busy">...</div>`
 * - `<div [ngBusy]="[busyA, busyB, busyC]">...</div>`
 * - `<div [ngBusy]="{busy: busy, message: 'Loading...', backdrop: false, delay: 200, minDuration: 600}">...</div>`
 */
var BusyDirective = (function () {
    function BusyDirective(service, tracker, cfResolver, vcRef, injector) {
        this.service = service;
        this.tracker = tracker;
        this.cfResolver = cfResolver;
        this.vcRef = vcRef;
        this.injector = injector;
    }
    BusyDirective.prototype.normalizeOptions = function (options) {
        if (!options) {
            options = { busy: null };
        }
        else if (Array.isArray(options)
            || options instanceof Promise
            || options instanceof rxjs_Subscription.Subscription) {
            options = { busy: options };
        }
        options = Object.assign({}, this.service.config, options);
        if (!Array.isArray(options.busy)) {
            options.busy = [options.busy];
        }
        return options;
    };
    BusyDirective.prototype.dectectOptionsChange = function () {
        if (equals(this.optionsNorm, this.optionsRecord)) {
            return false;
        }
        this.optionsRecord = this.optionsNorm;
        return true;
    };
    // As ngOnChanges does not work on Object detection, ngDoCheck is using
    BusyDirective.prototype.ngDoCheck = function () {
        var options = this.optionsNorm = this.normalizeOptions(this.options);
        if (!this.dectectOptionsChange()) {
            return;
        }
        if (this.busyRef) {
            this.busyRef.instance.context.message = options.message;
        }
        !equals(options.busy, this.tracker.promiseList)
            && this.tracker.reset({
                promiseList: options.busy,
                delay: options.delay,
                minDuration: options.minDuration
            });
        if (!this.busyRef
            || this.template !== options.template
            || this.backdrop !== options.backdrop) {
            this.destroyComponents();
            this.template = options.template;
            this.backdrop = options.backdrop;
            options.backdrop && this.createBackdrop();
            this.createBusy();
        }
    };
    BusyDirective.prototype.ngOnDestroy = function () {
        this.destroyComponents();
    };
    BusyDirective.prototype.destroyComponents = function () {
        this.busyRef && this.busyRef.destroy();
        this.backdropRef && this.backdropRef.destroy();
    };
    BusyDirective.prototype.createBackdrop = function () {
        var backdropFactory = this.cfResolver.resolveComponentFactory(BusyBackdropComponent);
        this.backdropRef = this.vcRef.createComponent(backdropFactory, undefined, this.injector);
    };
    BusyDirective.prototype.createBusy = function () {
        var busyFactory = this.cfResolver.resolveComponentFactory(BusyComponent);
        this.busyRef = this.vcRef.createComponent(busyFactory, undefined, this.injector);
        var _a = this.optionsNorm, message = _a.message, wrapperClass = _a.wrapperClass, template = _a.template;
        var instance = this.busyRef.instance;
        instance['context']['message'] = message;
        instance['wrapperClass'] = wrapperClass;
        instance['template'] = template;
    };
    BusyDirective.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[ngBusy]',
                    providers: [PromiseTrackerService]
                },] },
    ];
    /** @nocollapse */
    BusyDirective.ctorParameters = function () { return [
        { type: BusyService, },
        { type: PromiseTrackerService, },
        { type: _angular_core.ComponentFactoryResolver, },
        { type: _angular_core.ViewContainerRef, },
        { type: _angular_core.Injector, },
    ]; };
    BusyDirective.propDecorators = {
        'options': [{ type: _angular_core.Input, args: ['ngBusy',] },],
    };
    return BusyDirective;
}());

/**
 * @file Module: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
var BusyModule = (function () {
    function BusyModule() {
    }
    BusyModule.forRoot = function (config) {
        return {
            ngModule: BusyModule,
            providers: [
                { provide: BusyConfig, useValue: config }
            ]
        };
    };
    BusyModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule,
                        angular2DynamicComponent_index.DynamicComponentModule
                    ],
                    declarations: [
                        BusyDirective,
                        BusyComponent,
                        BusyBackdropComponent,
                    ],
                    providers: [BusyService],
                    exports: [BusyDirective],
                    entryComponents: [
                        BusyComponent,
                        BusyBackdropComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    BusyModule.ctorParameters = function () { return []; };
    return BusyModule;
}());

/**
 * @file Busy index
 * @author yumao<yuzhang.lille@gmail.com>
 */

exports.BusyDirective = BusyDirective;
exports.BusyService = BusyService;
exports.BusyConfig = BusyConfig;
exports.BUSY_CONFIG_DEFAULTS = BUSY_CONFIG_DEFAULTS;
exports.BusyModule = BusyModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
