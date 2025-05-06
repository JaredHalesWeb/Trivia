import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  isSignup = false; // Flag to toggle between login and signup

  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(user => console.log('Logged in:', user))
      .catch(error => console.error('Login error:', error));
  }

  signup(email: string, password: string): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(user => console.log('Signed up:', user))
      .catch(error => console.error('Signup error:', error));
  }

  toggleAuthMode(event: Event): void {
    event.preventDefault(); // Prevents the default behavior of the link
    this.isSignup = !this.isSignup;
  }
onLogin(email: string, password: string): void {
  this.login(email, password);
}

logout(): void {
  this.afAuth.signOut().then(() => console.log('Logged out'));
}

}
