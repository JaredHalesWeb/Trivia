import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { LoginComponent } from './pages/login/login.component';
import { SetupComponent } from './pages/setup/setup.component';
import { TriviaComponent } from './pages/trivia/trivia.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/main-menu', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main-menu', component: MainMenuComponent, canActivate: [AuthGuard] },
  { path: 'setup', component: SetupComponent, canActivate: [AuthGuard] },
  { path: 'trivia', component: TriviaComponent, canActivate: [AuthGuard] },
  { path: 'user-data', component: UserDataComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/main-menu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
