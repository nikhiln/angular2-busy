/**
 * @file Service: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */
import { Injectable, Optional } from '@angular/core';
import { BusyConfig } from './busy-config';
export var BusyService = (function () {
    function BusyService(config) {
        this.config = config || new BusyConfig();
    }
    BusyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BusyService.ctorParameters = function () { return [
        { type: BusyConfig, decorators: [{ type: Optional },] },
    ]; };
    return BusyService;
}());
//# sourceMappingURL=busy.service.js.map