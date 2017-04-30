import { Component, Input } from "@angular/core"
import { Interaction, Selector } from './interaction'

@Component({
    moduleId: module.id,
    selector: 'multiple-choice',
    template: `
    <span class='options-container'>(
        <span *ngFor='let selector of interaction.selectors; let i = index; let last = last'>
        <span [ngClass]='selectedIndex === 0 ? "selected" : ""'>{{selector.title}}</span>
        <span [hidden]='last'>/</span>
        </span>
    )</span>
    <input  class='transparentGone'
            [focus]='focus'
            [disabled]='!focus'
            (keydown)='userTypedSomething($event)'
            type='text'/>
    `
})

export class MultipleChoiceComponent {

    @Input()
    interaction: Interaction

    @Input()
    tryToSubmit: (input: String) => void

    @Input()
    focus: boolean

    selectedIndex: number = 0

    constructor() {
     }

    numChoices(): number {
        return this.interaction.selectors.length;
    }

    getSelector(index: number): Selector {
        return this.interaction.selectors[index]
    }

    userTypedSomething(event: any) {
        var userInput: string
        
        let nChoices = this.numChoices()

        switch (event.keyCode) {
            case 37: // left
                this.selectedIndex = (this.selectedIndex - 1 + nChoices) % nChoices
                break;
            case 39: // right arrow
                this.selectedIndex = (this.selectedIndex + 1 + nChoices) % nChoices
                break;

            case 13: // enter, override select the index
                userInput = this.getSelector(this.selectedIndex).title
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
