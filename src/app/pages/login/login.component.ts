import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  isSignup = false;
  isLoading = false; // Loading state
  errorMessage = ''; // Error message
  successMessage = ''; // Success message
  isLogin: boolean = true;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  toggleForm(): void {
    this.isLogin = !this.isLogin;
  }

  login(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      this.isLoading = true; // Show loading state
      this.errorMessage = '';
      this.successMessage = '';

      this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.successMessage = 'Successfully logged in!';
        console.log('Logged in:', user);
        this.router.navigate(['/setup']);
      })
      .catch((error) => {
        this.errorMessage = error.message;
        console.error('Login error:', error);
      })
      .finally(() => {
        this.isLoading = false; // Hide loading state
      });
      
  }

  signup(email: string, password: string): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Account created successfully');
        return this.afAuth.signInWithEmailAndPassword(email, password); // Log them in
      })
      .then(() => {
        console.log('Logged in after signup');
        this.router.navigate(['/setup']); // Redirect to the setup page
      })
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
