import { Component } from '@angular/core';

@Component({
  selector: 'app-setup',
  standalone:false,
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
})
export class SetupComponent {
  categories = [];
  numberOfPlayers = 1;
  numberOfQuestions = 10;
  selectedCategory: any = null;
  difficulty = 'medium';
  type = 'multiple';

  constructor() {}

  startGame() {
    console.log({
      numberOfPlayers: this.numberOfPlayers,
      numberOfQuestions: this.numberOfQuestions,
      selectedCategory: this.selectedCategory,
      difficulty: this.difficulty,
      type: this.type,
    });
  }
}
