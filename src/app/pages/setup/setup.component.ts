import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-setup',
  standalone:false,
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
})
export class SetupComponent implements OnInit {
  categories: any[] = [];
  users: any[] = [];
  formData = {
    players: 1,
    questions: 10,
    category: '',
    difficulty: 'easy',
    type: 'multiple',
    selectedUsers: [],
  };

  constructor(private http: HttpClient, private firestore: AngularFirestore, private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchUsers();
  }

  fetchCategories(): void {
    this.http.get('https://opentdb.com/api_category.php').subscribe((response: any) => {
      this.categories = response.trivia_categories;
    });
  }

  fetchUsers(): void {
  this.ngZone.run(() => {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (users: any[]) => {
          this.users = users;
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  });
}

  onPlayerChange(): void {
    if (this.formData.players === 1) {
      this.formData.selectedUsers = [];
    }
  }

  createGame(): void {
    const totalQuestions = this.formData.questions;
    const players = this.formData.players;

    if (totalQuestions % players !== 0) {
      alert('The number of questions must be evenly divisible by the number of players.');
      return;
    }

    const gameData = {
      ...this.formData,
      questionsPerPlayer: totalQuestions / players,
    };

    // Navigate to the trivia page with the game setup as state
    this.router.navigate(['/trivia'], { state: { gameData } });
  }
}
