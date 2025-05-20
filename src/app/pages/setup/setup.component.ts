import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GameDataService } from '../../services/game-data-service.service';

import { firestore } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

@Component({
  selector: 'app-setup',
  standalone: false,
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
})
export class SetupComponent implements OnInit {
  categories: any[] = [];
  users: User[] = [];

  formData = {
    players: 1,
    questions: 10,
    category: '',
    difficulty: 'easy',
    type: 'multiple',
    selectedUsers: [] as User[],
  };

  constructor(
    private afAuth: AngularFireAuth,
    private gameDataService: GameDataService,
    private http: HttpClient,
    private router: Router,
  ) {}

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
    this.afAuth.currentUser.then(async (currentUser) => {
      if (!currentUser) {
        console.warn('❌ Not logged in.');
        return;
      }

      try {
        const snapshot = await getDocs(collection(firestore, 'users'));
        const users = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...(doc.data() as Omit<User, 'uid'>),
        }));

        // ✅ Exclude the current user from selection list
        this.users = users.filter(user => user.uid !== currentUser.uid);

        console.log('Other users available:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    });
  }

  isUserSelected(user: User): boolean {
      return this.formData.selectedUsers.some(u => u.uid === user.uid);
    }

  enforceSelectionLimit(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (this.formData.selectedUsers.length > this.formData.players - 1) {
      // Remove the most recent selection
      const lastChecked = this.formData.selectedUsers[this.formData.selectedUsers.length - 1];
      this.formData.selectedUsers = this.formData.selectedUsers.filter(
        u => u.uid !== lastChecked.uid
      );

      alert(`You can only select ${this.formData.players - 1} additional player(s).`);

      // Manually uncheck the box
      input.checked = false;
    }
  }

  onToggleUser(event: Event, user: User): void {
    const checkbox = event.target as HTMLInputElement;

    const isSelected = this.formData.selectedUsers.some(u => u.uid === user.uid);

    if (checkbox.checked && !isSelected) {
      if (this.formData.selectedUsers.length < this.formData.players - 1) {
        this.formData.selectedUsers.push(user);
      } else {
        // Undo the visual check
        checkbox.checked = false;
        alert(`You can only select ${this.formData.players - 1} additional player(s).`);
      }
    } else if (!checkbox.checked && isSelected) {
      // Uncheck/remove user
      this.formData.selectedUsers = this.formData.selectedUsers.filter(u => u.uid !== user.uid);
    }
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

    const currentUser = await this.afAuth.currentUser;

    if (!currentUser) {
      alert('You must be logged in to start a game.');
      return;
    }

    const currentUserData: User = {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || currentUser.email || '',
    };

    const allPlayers: User[] = [currentUserData, ...this.formData.selectedUsers];

    const gameData = {
      ...this.formData,
      questionsPerPlayer: totalQuestions / players,
      players: allPlayers,
    };

    console.log('Navigating with gameData:', gameData);
    this.gameDataService.setGameData(gameData);
    this.router.navigate(['/trivia'], { state: { gameData } });
  }
}
