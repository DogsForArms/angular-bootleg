import { NgModule }             from '@angular/core'
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms'
import { HttpModule }           from '@angular/http'
import { ReactiveFormsModule }  from '@angular/forms'

import { AppComponent }         from './app.component'

import { AboutComponent }       from './components/about.component'
import { UserComponent }        from './components/user.component'
import { SplashComponent }      from './components/splash/splash.component'
import { InteractionComponent } from './components/splash/interaction/interaction.component'
import { VideoComponent }       from './components/video.component'

import { FreeTypeComponent }    from './components/splash/interaction/freeType.component'
import { YesNoComponent }       from './components/splash/interaction/yesNo.component'
import { FakeTypeComponent }    from './components/splash/interaction/fakeType.component'

import { FocusDirective }       from './directives/focus.directive'
import { Autosize }             from './directives/autosize.directive'

import { routing }              from './app.routing'

// console.log(Autosize)

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, ReactiveFormsModule, routing],
  declarations: [ AppComponent, UserComponent, AboutComponent, SplashComponent, InteractionComponent, FreeTypeComponent, YesNoComponent, FakeTypeComponent, FocusDirective, Autosize, VideoComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
