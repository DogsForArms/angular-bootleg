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
        let self = this
        if (self.focus) {
            //in safari, blur is called before blur actually happens, so calling focus now is lost in a frame.
            setTimeout(function() {
                self.element.nativeElement.focus()
            }, 1)
        }
    }

    @HostListener('blur')
    onBlur(){
        this.updateFocus()
     }
}
