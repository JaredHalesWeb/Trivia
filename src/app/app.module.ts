import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { SetupComponent } from './pages/setup/setup.component';
import { TriviaComponent } from './pages/trivia/trivia.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // REQUIRED for Material animations
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetupComponent,
    TriviaComponent,
    UserDataComponent,
    MainMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // <-- Required
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
  
  
    // Angular Material modules
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule
  ],
  providers: [provideFirebaseApp(() => initializeApp(environment.firebase)), provideFirebaseApp(() => initializeApp({ projectId: "trivia-game-4f844", appId: "1:642612144303:web:4ee9d7e4e51c4a219ecc5a", storageBucket: "trivia-game-4f844.firebasestorage.app", apiKey: "AIzaSyAHlt-o5C9FlqgnkigUGkDI2qp5R4ZBGDw", authDomain: "trivia-game-4f844.firebaseapp.com", messagingSenderId: "642612144303", measurementId: "G-B994P5Z7K6" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    console.log('Firebase initialized with:', environment.firebase);
  }
}
