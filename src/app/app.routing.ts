import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UserComponent} from './components/user.component'
import {AboutComponent} from './components/about.component'
import {SplashComponent} from './components/splash/splash.component'

const appRoutes: Routes = [
  {
    path:'',
    component: UserComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'splash',
    component: SplashComponent
  }
]

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes)
