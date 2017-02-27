/**
 * @file Module: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentModule } from 'angular2-dynamic-component/index';
import { BusyDirective } from './busy.directive';
import { BusyService } from './busy.service';
import { BusyBackdropComponent } from './busy-backdrop.component';
import { BusyComponent } from './busy.component';
import { BusyConfig } from './busy-config';
export var BusyModule = (function () {
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
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        DynamicComponentModule
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
//# sourceMappingURL=busy.module.js.map