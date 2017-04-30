import {Component, Input} from '@angular/core'
import {FormBuilder} from '@angular/forms'

import {Interaction, InteractionType} from './interaction'
import {FakePipe} from './fake.pipe'

@Component({
    moduleId: module.id,
    selector: 'interaction',
    templateUrl: 'interaction.component.html'
})

export class InteractionComponent {
    debugging = false;

    @Input()
    interaction: Interaction

    @Input()
    addNextInteraction: (interaction: Interaction) => void

    @Input()
    isActive: boolean = false

    output: string
    botIsTalking: boolean

    private index: number = 0
    private prompt: string
    private typeTimeout: any
    private fakePipe: FakePipe
    waitingForInput: boolean
    private interactionType = InteractionType

    //#Bound functions start
    tryToSubmitBound: (userInput: string) => void

    //#Bound functions end

    constructor() {
        this.index = 0
        this.output = ''
        this.botIsTalking = true
        this.waitingForInput = false
        this.tryToSubmitBound = this.tryToSubmit.bind(this)
    }

    ngAfterViewInit() {
        this.prompt = this.interaction.getPrompt()

        let overwrite = this.interaction.getOverwrite()
        if (this.interaction.type == InteractionType.Fake && overwrite) {
            this.fakePipe = new FakePipe(overwrite)
        }
        this.typeLoop()
    }

    renderUserInput() {
        this.botIsTalking = false
        this.waitingForInput = true
    }

    typeLoop() {
        if (this.typeTimeout) {
            clearTimeout(this.typeTimeout)
            this.typeTimeout = null
        }
        this.typeTimeout = setTimeout(()=> {
            if (this.index < this.prompt.length) {
                this.output += this.prompt[this.index]
                this.index++
                this.typeLoop()
            } else {
                this.interaction.onPromptCompleteHandle()
                if (this.interaction.type != InteractionType.None) {
                    this.renderUserInput()
                }
            }
        }, this.debugging ? 0 : Math.random() * 80 + 20)
    }

    userTypedSomething(event: any) {
        let userInput = event.target.value
        let key = event.key

        if (this.fakePipe && key !== 'Enter') {
            userInput = this.fakePipe.transform(userInput)
            event.target.value = userInput
        }

        //don't submit if i've already submitted, or if the key isn't "Enter"
        if (!this.waitingForInput || key !== 'Enter') {
            return
        }

        this.tryToSubmit(userInput)
    }

    tryToSubmit(userInput: string) {
        let sel = this.interaction.submitResponse(userInput)

        if (!sel) {
            return false
        } else
        if (sel && sel.nextInteraction) {
            this.waitingForInput = false
            this.addNextInteraction(sel.nextInteraction)
        } else
        if (sel && !sel.nextInteraction) {
            console.log("conversation finished!")
        }
        return true
    }

    isFocused(): boolean {
        return this.isActive && this.waitingForInput
    }
}
