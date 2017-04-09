import { Component, Input } from "@angular/core"

@Component({
    moduleId: module.id,
    selector: 'free-type',
    template: `
    <textarea   (keydown)='userTypedSomething($event)'
                [focus]='focus'
                [disabled]='!focus'
                spellcheck='false'
                autosize></textarea>
    `
})

export class FreeTypeComponent {

    @Input()
    tryToSubmit: (input: String) => void

    @Input()
    focus: boolean

    constructor() { }

    userTypedSomething(event: any) {

        if (event.keyCode === 13) {
            this.tryToSubmit(event.target.value)
            return false
        }

        return true
    }
}
