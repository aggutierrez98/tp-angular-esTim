import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Genre } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  getGenre(id: string): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/genres/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  createGenre(data: Omit<Genre, "id">): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiUrl}/genres`, data).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  updateGenre(id: string, data: Partial<Omit<Genre, "id">>): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}/genres/${id}`, data).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }

  deleteGenre(id: string): Observable<Genre> {
    return this.http.delete<Genre>(`${this.apiUrl}/genres/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      })
    );
  }
}
