import { Component, Input } from "@angular/core"

@Component({
    moduleId: module.id,
    selector: 'yes-no',
    template: `
    <span class='options-container'>(
        <span [ngClass]='selectedIndex === 0 ? "selected" : ""'>y</span>
        /
        <span [ngClass]='selectedIndex === 1 ? "selected" : ""'>n</span>
    )</span>
    <input  class='transparentGone'
            [focus]='focus'
            [disabled]='!focus'
            (keydown)='userTypedSomething($event)'
            type='text'/>
    `
})

export class YesNoComponent {

    @Input()
    tryToSubmit: (input: String) => void

    @Input()
    focus: boolean

    selectedIndex: number = 0

    constructor() { }

    userTypedSomething(event: any) {

        var userInput: string

        switch (event.keyCode) {
            case 89: // y
                userInput = 'y'
                this.selectedIndex = 0
                break;
            case 78: // n
                userInput = 'n'
                this.selectedIndex = 1
                break;
            case 37: // left
                this.selectedIndex = (this.selectedIndex - 1 + 2) % 2
                break;
            case 39: // right arrow
                this.selectedIndex = (this.selectedIndex + 1 + 2) % 2
                break;

            case 13: // enter, override select the index
                userInput = this.selectedIndex == 0 ? 'y' : 'n'
                break;
        }

        if (!userInput) {
            return;
        }

        if (!this.tryToSubmit) {
            console.error("Initialize YesNo error: \ntryToSubmit was not assigned? (!this.tryToSubmit) => " + (!this.tryToSubmit))
        }
        this.tryToSubmit(userInput)
    }
}
