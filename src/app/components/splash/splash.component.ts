import { Component } from '@angular/core'
import { InteractionType, Interaction, Selector } from './interaction/interaction'
import { ConversationContextService, ConversationContextSaveParams, ConversationContextSaveResponse } from '../../services/conversationContext.service'


@Component({
    moduleId: module.id,
    selector: "splash",
    templateUrl: "splash.component.html",
    providers: [ ConversationContextService ]
})

export class SplashComponent {

    interactions: Interaction[] = []
    boundAddInteraction: (interaction: Interaction) => void
    conversationContextId: number

    constructor(private conversationContextService: ConversationContextService) {
        
        // this.addInteraction(this.buildAfterPitchConversationTree({}))
    }

    ngOnInit() {
        const self = this
        self.boundAddInteraction = self.addInteraction.bind(self)
        
        this.conversationContextService.save({ conversationId: 1 })
            .subscribe(convContext => {
                self.conversationContextId = convContext.id
                self.addInteraction(self.buildConversationTree())
            })
    }

    addInteraction(interaction: Interaction) {
        this.interactions.push(interaction)
    }

    // generate the conversation tree.
    buildConversationTree(): Interaction {
        let ctxt = {}

        function startVideo(interaction: Interaction) {
            let self = this
            console.log('state: playVideo')
            setTimeout(()=> {
                console.log('state: resumeConversation')
                self.addInteraction(self.buildAfterPitchConversationTree(ctxt))
            }, 5 * 1000)
        }

        let hello = new Interaction("Is someone there?", InteractionType.YesNo, ctxt)

        let whatsYourName_yes = new Interaction("Finally!  Someone came!  What is your name?", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('name', ctxt))
        let whatsYourName_no = new Interaction("Not falling for that one again...  What's your name?", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('name', ctxt))

        hello.initializeWithYesNoSelectors(whatsYourName_yes, whatsYourName_no)

        let afterGettingYourName = new Interaction("Ahhh, I once knew someone named <name>.  Wait... who told you about this place?  Was it Steve?", InteractionType.YesNo, ctxt)
        whatsYourName_yes.initializeWithAnyResponseSelector(afterGettingYourName)
        whatsYourName_no.initializeWithAnyResponseSelector(afterGettingYourName)

        let whoWasIt_yes = new Interaction("Steve huh?  Well, I made him up.  Who referred you?", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('referred', ctxt))
        let whoWasIt_no = new Interaction("Okay, well then who was it?", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('referred', ctxt))
        afterGettingYourName.initializeWithYesNoSelectors(whoWasIt_yes, whoWasIt_no)

        let afterGettingReference = new Interaction("So, then I assume <referred> filled you in.  Right?", InteractionType.YesNo, ctxt)
        whoWasIt_yes.initializeWithAnyResponseSelector(afterGettingReference)
        whoWasIt_no.initializeWithAnyResponseSelector(afterGettingReference)

        let afterGettingReference_yes = new Interaction("Well, listen, my papas worked really hard on this pitch, so .... just... so just listen.  Okay?  Is your sound on? Turn it on!", InteractionType.None, ctxt)
            .setOnPromptComplete(startVideo.bind(this))
        let afterGettingReference_no = new Interaction("Oh.  Great!  Good good good!  Just... relax then.  Turn up your sound!  Here we go!", InteractionType.None, ctxt)
            .setOnPromptComplete(startVideo.bind(this))

        afterGettingReference.initializeWithYesNoSelectors(afterGettingReference_yes, afterGettingReference_no)

        return hello
    }

    buildAfterPitchConversationTree(ctxt: any): Interaction {
        this.interactions = []
        let askForFeedbackFake = new Interaction("Well, what did you think?", InteractionType.Fake, ctxt)
            .setOverwrite("Brilliant!  How did you ever come up with this idea?  Please take my money now.  Please take my social security.  My social security is 012-553-0213.  Tyler is so talented.  Ethan is so talented.  I love the internet, the internet loves me!")

        let askForFeedbackReal = new Interaction('Lolcats. <br>Anyway what did you really thinnk? My "daddies" do want your honest input.  How do you see yourself using bootleg, if at all?  Take your time!', InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('feedback', ctxt))
        askForFeedbackFake.initializeWithAnyResponseSelector(askForFeedbackReal)

        let doYouWantToBeNotified = new Interaction('Bootleg is almost a real thing, it will be here as soon as the founders quit their day-jobs.  Do you want me to tell you when it is real?', InteractionType.YesNo, ctxt)
        askForFeedbackReal.initializeWithAnyResponseSelector(doYouWantToBeNotified)

        let doYouWantToBeNotified_yes = new Interaction('Great!  Now,  can I please have your email?  I swear upon the spirit of the internet that I will not spam you.', InteractionType.YesNo, ctxt)
        let doYouWantToBeNotified_no = new Interaction("Oh well aren't you a busy person.  Too busy to be notified, but not too busy to stick around navigating a conversation tree.  Well congradulations - You turn down the corridor labeled \"no\" and a vampire appears.  You die horribly.  Maybe you want to try again...?", InteractionType.YesNo, ctxt)

        doYouWantToBeNotified.initializeWithYesNoSelectors(doYouWantToBeNotified_yes, doYouWantToBeNotified_no)

        let doYouWantToBeNotified_yes_yes = new Interaction('Awesome!  Glad to hear.  Just leave your email down bellow.  Oops, g2g, dinner time.', InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('email', ctxt))
        let doYouWantToBeNotified_yes_no = new Interaction('Woa... geeze, sorry.  Why not?', InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext('no-email-reason', ctxt))
        doYouWantToBeNotified_yes.initializeWithYesNoSelectors(doYouWantToBeNotified_yes_yes, doYouWantToBeNotified_yes_no)

        let doYouWantToBeNotified_no_yes = doYouWantToBeNotified_yes
        let doYouWantToBeNotified_no_no = new Interaction('Alright.  It doesn\'t matter to me, I get paid per character.<br>  Welllllllllll I guess this is goooooodbyyyyyeeeeeeeeee.  Dooooooo noooot beeeee a stranger! ', InteractionType.None, ctxt)
        doYouWantToBeNotified_no.initializeWithYesNoSelectors(doYouWantToBeNotified_no_yes, doYouWantToBeNotified_no_no)
        doYouWantToBeNotified_yes_no.initializeWithAnyResponseSelector(doYouWantToBeNotified_no_no)

        let wink = new Interaction(";)", InteractionType.None, ctxt)
        doYouWantToBeNotified_yes_yes.initializeWithAnyResponseSelector(wink)


        return askForFeedbackFake
    }

    private saveInputInContext(key: string, ctxt: any) : (input:string) => void {
        var self = this;
        return function(input: string): void {
            //local ctxt save
            ctxt[key] = input
            
            //server ctxt save
            var updatedCtxt = {}
            updatedCtxt[key] = input
            self.conversationContextService.save({
                id: self.conversationContextId,
                conversationId: 1,
                context: updatedCtxt
            }).subscribe(convContext => {})
        }
    }
}
