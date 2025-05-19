import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  stats: any = null;
  bestCategory: string = '';
  worstCategory: string = '';
  loading = true;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).get().subscribe(doc => {
          const data = doc.data();
          if (data && data.stats) {
            this.stats = data.stats;
            this.bestCategory = this.getBestCategory(data.stats.categoryWins || {});
            this.worstCategory = this.getWorstCategory(data.stats.categoryLosses || {});
          }
          this.loading = false;
        });
      }
    });
  }

  getBestCategory(wins: any): string {
    let max = -1;
    let category = '';
    for (const key in wins) {
      if (wins[key] > max) {
        max = wins[key];
        category = key;
      }
    }
    return category || 'N/A';
  }

  getWorstCategory(losses: any): string {
    let max = -1;
    let category = '';
    for (const key in losses) {
      if (losses[key] > max) {
        max = losses[key];
        category = key;
      }
    }
    return category || 'N/A';
  }

  getAccuracy(): number {
    if (!this.stats) return 0;
    const correct = this.stats.questionsCorrect || 0;
    const total = (this.stats.questionsCorrect || 0) + (this.stats.questionsIncorrect || 0);
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  }
}
