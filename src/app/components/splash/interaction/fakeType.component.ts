import { Component, Input } from "@angular/core"

@Component({
    moduleId: module.id,
    selector: 'fake-type',
    template: `
    <textarea   (keydown)='userTypedSomething($event)'
                [focus]='focus'
                [disabled]='!focus'
                spellcheck='false'
                autosize>{{fakeInput}}</textarea>
    `
})

export class FakeTypeComponent {

    @Input()
    tryToSubmit: (input: String) => void

    @Input()
    focus: boolean

    @Input()
    replacementSentence: string

    private wordCount = 0
    fakeInput = ''

    constructor() {

    }

    private advanceFakeInput() {
        this.fakeInput = this.replacementSentence
            .split(' ')
            .slice(0, ++this.wordCount)
            .join(' ')
    }

    userTypedSomething(event: any): boolean {
        let interupt = false
        switch (event.keyCode) {
            case 13:
                this.tryToSubmit(this.fakeInput)
                // interupt = true
                break
            default:
                this.advanceFakeInput()
        }

        return false
    }
}
