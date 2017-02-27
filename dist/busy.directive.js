/**
 * @file Directive: Bus
 * @author yumao<yuzhang.lille@gmail.com>
 */
import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { equals } from './util';
import { PromiseTrackerService } from './promise-tracker.service';
import { BusyService } from './busy.service';
import { BusyComponent } from './busy.component';
import { BusyBackdropComponent } from './busy-backdrop.component';
/**
 * ### Syntax
 *
 * - `<div [ngBusy]="busy">...</div>`
 * - `<div [ngBusy]="[busyA, busyB, busyC]">...</div>`
 * - `<div [ngBusy]="{busy: busy, message: 'Loading...', backdrop: false, delay: 200, minDuration: 600}">...</div>`
 */
export var BusyDirective = (function () {
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
            || options instanceof Subscription) {
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
        { type: Directive, args: [{
                    selector: '[ngBusy]',
                    providers: [PromiseTrackerService]
                },] },
    ];
    /** @nocollapse */
    BusyDirective.ctorParameters = function () { return [
        { type: BusyService, },
        { type: PromiseTrackerService, },
        { type: ComponentFactoryResolver, },
        { type: ViewContainerRef, },
        { type: Injector, },
    ]; };
    BusyDirective.propDecorators = {
        'options': [{ type: Input, args: ['ngBusy',] },],
    };
    return BusyDirective;
}());
//# sourceMappingURL=busy.directive.js.map