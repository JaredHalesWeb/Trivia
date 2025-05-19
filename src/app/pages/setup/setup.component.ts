import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgZone } from '@angular/core';
import { GameDataService } from '../../services/game-data-service.service';

@Component({
  selector: 'app-setup',
  standalone: false,
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

  constructor(
    private afAuth: AngularFireAuth,
    private gameDataService: GameDataService,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    // this.firestore.firestore.settings({ ignoreUndefinedProperties: true });
    console.log('Firestore settings applied');
  }

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
  this.afAuth.currentUser.then(currentUser => {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe({
        next: (users: any[]) => {
          // Remove the current user from the list so they don't select themselves
          this.users = users.filter(user => user.uid !== currentUser?.uid);
          console.log('Filtered users:', this.users);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
    });
  }

  onPlayerChange(): void {
    if (this.formData.players === 1) {
      this.formData.selectedUsers = [];
    }
  }

  async createGame(): Promise<void> {
    const totalQuestions = this.formData.questions;
    const players = this.formData.players;

    if (totalQuestions % players !== 0) {
      alert('The number of questions must be evenly divisible by the number of players.');
      return;
    }

    if (players > 1 && this.formData.selectedUsers.length !== players - 1) {
      alert(`Please select ${players - 1} other player(s).`);
      return;
    }

    // ✅ Get current Firebase user
    const currentUser = await this.afAuth.currentUser;

    if (!currentUser) {
      alert('You must be logged in to start a game.');
      return;
    }

    const currentUserData = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || currentUser.email
    };

    const allPlayers = [currentUserData, ...this.formData.selectedUsers];

    const gameData = {
      ...this.formData,
      questionsPerPlayer: totalQuestions / players,
      players: allPlayers
    };

    console.log('Navigating with gameData:', gameData);
    this.gameDataService.setGameData(gameData);
    this.router.navigate(['/trivia'], { state: { gameData } });
  }
}
