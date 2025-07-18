import { Component, OnInit } from '@angular/core';
import { TriviaService } from '../../services/trivia.service';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

@Component({
  selector: 'app-trivia',
  standalone: false,
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.css']
})
export class TriviaComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex = 0;
  answered = false;
  selectedAnswer: string | null = null;
  isLoading = true;

  gameData: any;
  players: User[] = [];
  playerScores: { [uid: string]: number } = {};
  questionOwnership: string[] = [];
  // firestore: any;

  constructor(
    private gameDataService: GameDataService,
    private triviaService: TriviaService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.gameData = this.gameDataService.getGameData();

    if (!this.gameData || Object.keys(this.gameData).length === 0) {
      alert('Game data is missing. Redirecting to setup...');
      this.router.navigate(['/setup']);
      return;
    }

    this.loadQuestions();
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  loadQuestions(): void {
    const { questions, category, difficulty, type } = this.gameData;
    this.players = this.gameData.players;
    const questionsPerPlayer = this.gameData.questionsPerPlayer;

    this.triviaService.fetchQuestions(questions, category, difficulty, type).subscribe(
      (response: any) => {
        if (response.results?.length > 0) {
          let questionIndex = 0;

          this.players.forEach(player => {
            this.playerScores[player.uid] = 0;

            for (let i = 0; i < questionsPerPlayer; i++) {
              const raw = response.results[questionIndex];
              const question = {
                question: this.decodeHtml(raw.question),
                options: [...raw.incorrect_answers, raw.correct_answer]
                  .map(ans => this.decodeHtml(ans))
                  .sort(() => Math.random() - 0.5),
                correctAnswer: this.decodeHtml(raw.correct_answer),
              };

              this.questions.push(question);
              this.questionOwnership.push(player.uid);
              questionIndex++;
            }
          });
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

  get currentPlayer(): User | undefined {
    const uid = this.questionOwnership[this.currentQuestionIndex];
    return this.players.find(p => p.uid === uid);
  }

  checkAnswer(option: string): void {
    this.selectedAnswer = option;
    this.answered = true;

    const currentUid = this.questionOwnership[this.currentQuestionIndex];
    const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;

    if (option === correctAnswer) {
      this.playerScores[currentUid]++;
    }
  }

  nextQuestion(): void {
    this.answered = false;
    this.selectedAnswer = null;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
     const maxScore = Math.max(...Object.values(this.playerScores));

    // Gather promises
    const updatePromises = this.players.map(player => {
      const uid = player.uid;
      const score = this.playerScores[uid] || 0;
      const didWin = score === maxScore;
      const correctCount = score;
      const incorrectCount = this.gameData.questionsPerPlayer - score;

      return this.updateStatsForPlayer(uid, didWin, this.gameData.category, correctCount, incorrectCount);
    });

    Promise.all(updatePromises)
      .then(() => {
        const winner = this.getWinner();
        alert(`🎉 Game Over!\n${winner}`);
        this.router.navigate(['/setup']);
      })
      .catch(error => {
        console.error('Error updating stats:', error);
        alert('Game over, but stats could not be saved.');
        this.router.navigate(['/setup']);
      });

    }
  }

  getWinner(): string {
    const maxScore = Math.max(...Object.values(this.playerScores));
    const winners = this.players.filter(p => this.playerScores[p.uid] === maxScore);

    if (winners.length === 1) {
      return `${winners[0].displayName || winners[0].email} wins with ${maxScore} points!`;
    } else {
      return `It's a tie! ${winners.map(w => w.displayName || w.email).join(' & ')} with ${maxScore} points.`;
    }
  }

  updateStatsForPlayer(
  playerUid: string,
  didWin: boolean,
  category: string,
  correctCount: number,
  incorrectCount: number
): Promise<void> {
  return runInInjectionContext(this.injector, () => {
    const userRef = this.firestore.collection('users').doc(playerUid);

    // Ensure category is not empty or invalid
    const safeCategory = category && category.trim() ? category : "Unknown";

    const statUpdates: any = {
  gamesPlayed: firebase.firestore.FieldValue.increment(1),
  questionsCorrect: firebase.firestore.FieldValue.increment(correctCount),
  questionsIncorrect: firebase.firestore.FieldValue.increment(incorrectCount),
};

if (didWin) {
  statUpdates.gamesWon = firebase.firestore.FieldValue.increment(1);
  statUpdates.categoryWins = {
    [safeCategory]: firebase.firestore.FieldValue.increment(1),
  };
} else {
  statUpdates.gamesLost = firebase.firestore.FieldValue.increment(1);
  statUpdates.categoryLosses = {
    [safeCategory]: firebase.firestore.FieldValue.increment(1),
  };
}

return userRef.set(
  { stats: statUpdates }, // 👈 NESTED UNDER "stats"
  { merge: true }
);

  });
}

}
