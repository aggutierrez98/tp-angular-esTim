import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Genre } from '../types';
import { environment } from '../environment';

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
  // getGenre(id: string): Observable<Genre> {
  //   return this.http.get<Genre>(`${this.apiUrl}/genres/${id}`).pipe(
  //     catchError((error) => {
  //       console.error('API Error:', error);
  //       return throwError(() => new Error('Something went wrong. Please try again later.'));
  //     })
  //   );
  // }

  // createPost(newPost: Post): Observable<Post> {
  //   // API request logic
  // }
}
