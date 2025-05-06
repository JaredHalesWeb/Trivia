import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-trivia',
  standalone: false,
  templateUrl: './trivia.component.html',
  styleUrl: './trivia.component.css'
})
export class TriviaComponent {
  private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  getQuestions() {
    return this.http.get(this.apiUrl);
  }

saveScore(userId: string, score: number) {
  this.firestore.collection('scores').doc(userId).set({ score });
}
}
