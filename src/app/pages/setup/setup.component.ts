import { Component, Injector, OnInit, inject, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgZone } from '@angular/core';
import { GameDataService } from '../../services/game-data-service.service';

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

  constructor(private gameDataService: GameDataService, private http: HttpClient,private injector: Injector, private firestore: AngularFirestore, private router: Router, private ngZone: NgZone,) {this.firestore.firestore.settings({ ignoreUndefinedProperties: true });
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
  runInInjectionContext(this.injector, () => {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe({
        next: (users: any[]) => {
          console.log('Fetched users:', users);
          this.users = users;
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

    console.log('Navigating with gameData:', gameData);
    this.gameDataService.setGameData(gameData);

    this.router.navigate(['/trivia'], { state: { gameData } });
  }
  
}
