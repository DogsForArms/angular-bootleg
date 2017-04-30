import * as _ from 'lodash'

export enum InteractionType { MultipleChoice, YesNo, Free, Fake, None }

//Interaction
export class Interaction {
    private prompt: string          //used in rendering dialogue
    type: InteractionType           //what input type to present
    selectors: Selector[] = []      //how to parse answers, & to the next Interaction

    private context: any
    private onInputComplete:(input: string) => void
    private onPromptComplete:(interaction: Interaction) => void
    private overwrite: string

    constructor(prompt: string, context: any) {
        this.prompt = prompt
        this.type = InteractionType.None
        this.context = context
    }

    public getPrompt(): string {
        return this.replaceVariablesIn(this.prompt)
    }

    public getOverwrite(): string {
        return this.replaceVariablesIn(this.overwrite)
    }

    onPromptCompleteHandle(): void {
        if (this.onPromptComplete) {
            this.onPromptComplete(this)
        }
    }

    initializeWithYesNoSelectors(yesInteraction: Interaction, noInteraction: Interaction) {
        this.initializeWithMultipleChoiceSelector([{
            text: 'y',
            interaction: yesInteraction
        }, {
            text: 'n',
            interaction: noInteraction
        }])
        this.type = InteractionType.YesNo
    }

    initializeWithAnyResponseSelector(nextInteraction: Interaction) {
        this.type = InteractionType.Free
        this.selectors = [ new Selector([/.*/i]).setNextInteraction(nextInteraction) ]
    }

    initializeWithFakeResponseSelector(nextInteraction: Interaction) {
        this.type = InteractionType.Fake
        this.selectors = [ new Selector([/.*/i]).setNextInteraction(nextInteraction) ]
    }
    
    initializeWithMultipleChoiceSelector(choices: {text: string, interaction: Interaction}[]) {
        this.type = InteractionType.MultipleChoice
        this.selectors = _.map(choices, choice => { 
            let reg = new RegExp(choice.text, 'i')
            return new Selector([ reg ]).setNextInteraction(choice.interaction).setTitle(choice.text)
        })
    }

    setOnInputHandler(handler:(input: string)=> void): Interaction {
        this.onInputComplete = handler
        return this
    }

    setOnPromptComplete(handler:(interaction: Interaction) => void): Interaction {
        this.onPromptComplete = handler
        return this
    }

    setOverwrite(overwrite: string): Interaction {
        this.overwrite = overwrite
        return this
    }

    addSelector(selector: Selector) {
        this.selectors.push(selector)
    }

    submitResponse(input: string): Selector {
        let result: Selector
        this.selectors.forEach((sel) => {
            sel.regMatch = sel.isMatch(input)
            if (!result && sel.regMatch) {
                result = sel
                if (this.onInputComplete) {
                    this.onInputComplete(input)
                }
            }
        })
        return result
    }

    toString(): string {
        return "Interaction(prompt: " + this.prompt + ", type: " + this.type + "sel: " + this.selectors + ")"
    }

    private replaceVariablesIn(format: string) {
        if (format == null) { return null }

        let returnStr = format
        Object.keys(this.context).forEach((key) => {
            returnStr = returnStr.replace('<'+key+'>', this.context[key])
        })

        return returnStr
    }
}

//Selector
export class Selector {
    regs: RegExp[]
    nextInteraction: Interaction
    title: string
    // saved on response
    regMatch: RegExpMatchArray

    constructor(regs: RegExp[]) {
        this.regs = regs
    }

    isMatch(input: string): RegExpMatchArray {
        let result: RegExpMatchArray
        this.regs.forEach((reg) => {
            result = result || input.match(reg)
        })
        return result
    }

    setNextInteraction(interaction: Interaction): Selector {
        this.nextInteraction = interaction
        return this
    }

    setTitle(title: string) {
        this.title = title
        return this;
    }

    toString(): string {
        return "Selector(regs: "+this.regs+")"
    }
}
