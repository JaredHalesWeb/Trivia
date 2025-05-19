import { Component, OnInit } from '@angular/core';
import { TriviaService } from '../../services/trivia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDataService } from '../../services/game-data-service.service';

@Component({
  selector: 'app-trivia',
  standalone:false,
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.css']
})
export class TriviaComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  score: number = 0;
  isLoading: boolean = true;
  gameData: any;

  constructor(
    private gameDataService: GameDataService,
    private triviaService: TriviaService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.gameData = this.gameDataService.getGameData();

  console.log('Received gameData:', this.gameData); // Debug log

  if (!this.gameData || Object.keys(this.gameData).length === 0) {
    alert('Game data is missing. Redirecting to setup...');
    this.router.navigate(['/setup']);
    return;
  }

  this.loadQuestions();
}

  loadQuestions(): void {
  const { questions, category, difficulty, type } = this.gameData;
  this.triviaService.fetchQuestions(questions, category, difficulty, type).subscribe(
    (response: any) => {
      console.log('API response:', response); // Debug log

      if (response.results && response.results.length > 0) {
        this.questions = response.results.map((q: any) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));
      } else {
        alert('No questions found for the selected settings.');
      }

      this.isLoading = false;
    },
    (error) => {
      console.error('Error fetching questions:', error);
      alert('Failed to fetch questions. Please try again.');
      this.isLoading = false;
    }
  );
}


  checkAnswer(option: string): void {
    if (option === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
      alert('Correct!');
    } else {
      alert('Wrong!');
    }
    this.nextQuestion();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      alert(`Game Over! Your final score is ${this.score}.`);
      this.router.navigate(['/setup']);
      return;
    }
  }
}
