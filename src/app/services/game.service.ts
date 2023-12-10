import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Game } from '../../types';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }
  getGame(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  createGame(data: Omit<Game, "id">): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games`, data).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }
  updateGame(id: string, data: Partial<Omit<Game, "id">>): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/games/${id}`, data).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  deleteGame(id: string): Observable<Game> {
    return this.http.delete<Game>(`${this.apiUrl}/games/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }
}
