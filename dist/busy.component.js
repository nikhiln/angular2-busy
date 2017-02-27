/**
 * @file Component: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
import { Component, trigger, style, transition, animate } from '@angular/core';
import { PromiseTrackerService } from './promise-tracker.service';
var inactiveStyle = style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
var timing = '.3s ease';
;
export var BusyComponent = (function () {
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
        { type: Component, args: [{
                    selector: 'ng-busy',
                    template: "\n        <div [class]=\"wrapperClass\" *ngIf=\"isActive()\" @flyInOut>\n            <DynamicComponent [componentTemplate]=\"template\" [componentContext]=\"context\">\n            </DynamicComponent>\n        </div>\n    ",
                    animations: [
                        trigger('flyInOut', [
                            transition('void => *', [
                                inactiveStyle,
                                animate(timing)
                            ]),
                            transition('* => void', [
                                animate(timing, inactiveStyle)
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
//# sourceMappingURL=busy.component.js.map