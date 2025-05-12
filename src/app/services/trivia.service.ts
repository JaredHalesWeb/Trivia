import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private baseUrl = 'https://opentdb.com/api_category.php';

  constructor(private http: HttpClient) {}

  fetchQuestions(amount: number, category: string, difficulty: string, type: string): Observable<any> {
    let url = `${this.baseUrl}?amount=${amount}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    return this.http.get(url);
  }
}
