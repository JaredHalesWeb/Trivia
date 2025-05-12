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
  this.isLoading = true; // Show loading state
  this.errorMessage = '';
  this.successMessage = '';

  this.afAuth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Account created successfully');
      const user = userCredential.user;

      if (user) {
        // Add user data to Firestore
        const userData = {
          userId: user.uid,
          email: user.email,
          name: '', // Optional: Add a field for the user's name if you want
          createdAt: new Date(),
        };

        return firebase.firestore().collection('users').doc(user.uid).set(userData);
      } else {
        throw new Error('User creation failed');
      }
    })
    .then(() => {
      console.log('User data saved to Firestore');
      return this.afAuth.signInWithEmailAndPassword(email, password); // Log them in
    })
    .then(() => {
      console.log('Logged in after signup');
      this.router.navigate(['/setup']); // Redirect to the setup page
    })
    .catch((error) => {
      this.errorMessage = error.message;
      console.error('Signup error:', error);
    })
    .finally(() => {
      this.isLoading = false; // Hide loading state
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
