/**
 * @file Component: BusyBackdrop
 * @author yumao<yuzhang.lille@gmail.com>
 */
import { Component, trigger, style, transition, animate } from '@angular/core';
import { PromiseTrackerService } from './promise-tracker.service';
var inactiveStyle = style({
    opacity: 0,
});
var timing = '.3s ease';
export var BusyBackdropComponent = (function () {
    function BusyBackdropComponent(tracker) {
        this.tracker = tracker;
    }
    BusyBackdropComponent.prototype.isActive = function () {
        return this.tracker.isActive();
    };
    BusyBackdropComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-busy-backdrop',
                    template: "\n        <div class=\"ng-busy-backdrop\"\n             @fadeInOut\n             *ngIf=\"isActive()\">\n        </div>\n    ",
                    animations: [
                        trigger('fadeInOut', [
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
    BusyBackdropComponent.ctorParameters = function () { return [
        { type: PromiseTrackerService, },
    ]; };
    return BusyBackdropComponent;
}());
//# sourceMappingURL=busy-backdrop.component.js.map