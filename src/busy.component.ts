/**
 * @file Component: Busy
 * @author yumao<yuzhang.lille@gmail.com>
 */

import {
    Component,
    trigger,
    state,
    style,
    transition,
    animate,
    Compiler, 
    NgModule, 
    OnInit, 
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {PromiseTrackerService} from './promise-tracker.service';


const inactiveStyle = style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
const timing = '.3s ease';

export interface IBusyContext {
    message: string;
};

@Component({
    selector: 'ng-busy',
    template: `
        <div [class]="wrapperClass" *ngIf="isActive()" @flyInOut>
        <div #templateContainer></div>
    `,
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
})
export class BusyComponent implements OnInit {
    message: string;
    wrapperClass: string;
    template: string = "";
    context: IBusyContext = {
        message: ""
    };

    @ViewChild('templateContainer', { read: ViewContainerRef }) templateContainer: ViewContainerRef;


    constructor(private compiler: Compiler, private tracker: PromiseTrackerService) {
    }

    isActive() {
        return this.tracker.isActive();
    }

    ngOnInit() {
        this.addComponent(this.template);
      }

    private addComponent(template: string) {
        @Component({template: template})
        class TemplateComponent {}

        @NgModule({declarations: [TemplateComponent]})
        class TemplateModule {}

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) =>
          comp.componentType === TemplateComponent
        );
        if (factory) {
            const component = this.templateContainer.createComponent(factory);
        }
    }
}
