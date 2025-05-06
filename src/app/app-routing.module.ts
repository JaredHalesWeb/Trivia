import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SetupComponent } from './pages/setup/setup.component';
import { TriviaComponent } from './pages/trivia/trivia.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'setup', component: SetupComponent, canActivate: [AuthGuard] },
  { path: 'trivia', component: TriviaComponent, canActivate: [AuthGuard] },
  { path: 'user-data', component: UserDataComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
