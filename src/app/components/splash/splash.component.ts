import { Component, ElementRef, ViewChild } from '@angular/core'
import { InteractionType, Interaction, Selector } from './interaction/interaction'
import { ConversationContextService, ConversationContextSaveParams, ConversationContextSaveResponse } from '../../services/conversationContext.service'
import { VideoComponent } from '../video.component'

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

    @ViewChild('scroll')
    private scrollContainer: ElementRef;

    constructor(private conversationContextService: ConversationContextService) {
    }
    
    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    ngOnInit() {
        const self = this
        self.boundAddInteraction = self.addInteraction.bind(self)
        
        this.conversationContextService.save({ conversationId: 1 })
            .subscribe(convContext => {
                self.conversationContextId = convContext.id
                self.addInteraction(self.buildConversationTree())
            })
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    addInteraction(interaction: Interaction) {
        this.interactions.push(interaction)
    }

    // generate the conversation tree.
    buildConversationTree(): Interaction {
        let ctxt = {}
        let self = this

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

        let areYouATheaterProfessional = new Interaction("Hey <name>, are you a theater professional?", InteractionType.YesNo, ctxt);
        whoWasIt_no.initializeWithAnyResponseSelector(areYouATheaterProfessional);
        whoWasIt_yes.initializeWithAnyResponseSelector(areYouATheaterProfessional);

        let theaterBusinessFeedback = new Interaction("If you could change just one thing about the business of theater in Chicago what would it be?", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext("whatIWouldChangeAboutTheaterBusiness", ctxt))
        let areYouATheaterGoer = new Interaction("Does that make you a theatergoer in Chicago?", InteractionType.YesNo, ctxt)
        areYouATheaterProfessional.initializeWithYesNoSelectors(theaterBusinessFeedback, areYouATheaterGoer);

        let theatergoerFeedback = new Interaction("Is there anything about seeing theater in Chicago that leaves something to be desired?", InteractionType.Free, ctxt);
        let areYouOutsideOfChicago = new Interaction("Are you a theatergoer outside of Chicago?", InteractionType.YesNo, ctxt);

        areYouATheaterGoer.initializeWithYesNoSelectors(theatergoerFeedback, areYouOutsideOfChicago)

        let doYouPlanTripsToChicagoToSeeTheater = new Interaction("Have you ever planned a trip to Chicago with the intent of seeing theater?", InteractionType.YesNo, ctxt)
            .setOnInputHandler(this.saveInputInContext("isAChiagoTheaterTripPlanner", ctxt));

        //ends
        let awardsShowQuestion = new Interaction("Hey I have another question for you: what do you think of awards for theater?  What do you think their purpose is?  Do they have their desired effects?  Is there a good example of an effective theater award? (double spaced, due in 2 minutes).", InteractionType.Free, ctxt)
            .setOnInputHandler(this.saveInputInContext("purposeAndEffectsOfAwardsShowOpinion", ctxt));
        areYouOutsideOfChicago.initializeWithYesNoSelectors(doYouPlanTripsToChicagoToSeeTheater, awardsShowQuestion)

        theatergoerFeedback.initializeWithAnyResponseSelector(awardsShowQuestion);
        theaterBusinessFeedback.initializeWithAnyResponseSelector(awardsShowQuestion);

        awardsShowQuestion.setOnInputHandler(this.saveInputInContext("awardsShowResponse", ctxt))
        awardsShowQuestion.initializeWithAnyResponseSelector(self.buildAfterPitchConversationTree2(ctxt))

        return hello
    }

    buildAfterPitchConversationTree2(ctxt: any): Interaction {
        let twentyQuestions = new Interaction("Well that's what this whole game of 20 questions is about.  We're building a service that will film bootlegs of the best new theater being born in Chicago, and we'll host it on an exclusive streaming site.  This one, actually.", InteractionType.Free, ctxt);

        return twentyQuestions;
    }

    buildAfterPitchConversationTree(ctxt: any): Interaction {
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
            .setOnInputHandler(this.saveInputInContext('reasonForNotGivingEmail', ctxt))
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
