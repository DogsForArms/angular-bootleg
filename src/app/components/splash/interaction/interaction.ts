
export enum InteractionType { YesNo, Free, Fake, None }

//Interaction
export class Interaction {
    private prompt: string          //used in rendering dialogue
    type: InteractionType           //what input type to present
    selectors: Selector[] = []      //how to parse answers, & to the next Interaction

    private context: any
    private onInputComplete:(input: string) => void
    private onPromptComplete:(interaction: Interaction) => void
    private overwrite: string

    constructor(prompt: string, type: InteractionType, context: any) {
        this.prompt = prompt
        this.type = type
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
        if (this.type != InteractionType.YesNo) {
            console.error("InteractionType is not of YesNo, can't set nextInteraction(%s) response selector.  Interaction(%s)", (yesInteraction.prompt + ':' + noInteraction.prompt), this.prompt)
            return
        }

        this.selectors = [
            new Selector([/y/i]).setNextInteraction(yesInteraction),
            new Selector([/n/i]).setNextInteraction(noInteraction)
        ]
    }

    initializeWithAnyResponseSelector(nextInteraction: Interaction) {

        switch (this.type) {
            case InteractionType.Free:
            case InteractionType.Fake:
            this.selectors = [ new Selector([/.*/i]).setNextInteraction(nextInteraction) ]
                break;
            default:
                console.error("InteractionType is not of TextField or Fake type, can't set nextInteraction(%s) response selector.  Interaction(%s)", nextInteraction.prompt, this.prompt)
        }

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
        if (this.type != InteractionType.Fake) { return }
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

    toString(): string {
        return "Selector(regs: "+this.regs+")"
    }
}
