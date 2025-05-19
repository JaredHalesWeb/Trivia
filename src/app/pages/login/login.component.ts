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

  private formatFirebaseError(message: string): string {
    // Remove the "Firebase: " prefix
    let cleaned = message.replace(/^Firebase:\s*/, '');
  
    // Remove trailing error code in parentheses like (auth/xxx)
    cleaned = cleaned.replace(/\s*\(auth\/[^\)]+\)\.?$/, '');
  
    // Trim any leftover whitespace or period
    return cleaned.trim().replace(/\.$/, '');
  }  

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
      .catch(error => {
        console.error('Login error:', error);
        this.errorMessage = this.formatFirebaseError(error.message);
      })      
      .finally(() => {
        this.isLoading = false; // Hide loading state
      });
      
  }

  signup(email: string, password: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Account created successfully');
        const user = userCredential.user;

        if (!user) throw new Error('User creation failed');

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          createdAt: new Date(),
          stats: {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            questionsCorrect: 0,
            questionsIncorrect: 0,
            categoryWins: {},     // e.g., { 'Science': 2 }
            categoryLosses: {}    // e.g., { 'History': 3 }
          }
        };

        return firebase.firestore().collection('users').doc(user.uid).set(userData);
      })
      .then(() => {
        // Now sign the user in again
        return this.afAuth.signInWithEmailAndPassword(email, password);
      })
      .then(() => {
        this.successMessage = 'Account created and logged in!';
        this.router.navigate(['/setup']);
      })
      .catch(error => {
        console.error('Signup error:', error);
        this.errorMessage = this.formatFirebaseError(error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
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
