import {Directive, Input, ElementRef, HostListener} from '@angular/core'

@Directive({
    selector: '[focus]'
})

export class FocusDirective {
    @Input()
    focus:boolean

    constructor(private element: ElementRef) { }

    protected ngOnChanges() {
        this.updateFocus()
    }

    private updateFocus() {
        if (this.focus) {
            this.element.nativeElement.focus()
        }
    }

    @HostListener('blur')
    onBlur(){
        this.updateFocus()
     }

}
