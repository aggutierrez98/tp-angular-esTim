import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { LogInRequest, RegisterRequest, Role, SafeUser, User, exclude } from '../types';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  userKey = 'currentUser';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(
          () => new Error('Something went wrong. Please try again later.')
        );
      })
    );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(
          () => new Error('Something went wrong. Please try again later.')
        );
      })
    );
  }

  logIn(data: LogInRequest): Observable<SafeUser> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params }).pipe(
      map((userArray) => {
        if (userArray && userArray.length > 0) {
          const safeUser: SafeUser = exclude<User, 'password'>(userArray[0], [
            'password',
          ]);
          return safeUser;
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      tap((safeUser) => {
        // admin1234
        // sessionStorage.setItem(this.userKey, JSON.stringify(safeUser));
        // localStorage.setItem(this.userKey, JSON.stringify(safeUser));
        console.log("aca")
      })
    );
  }

  register(data: RegisterRequest): Observable<SafeUser> {
    const dataToSend: Omit<User, "id"> = {
      email: data.email,
      name: data.name,
      password: data.password,
      role: Role.User
    }

    return this.http.post<User[]>(`${this.apiUrl}/users`, dataToSend).pipe(
      map((userArray) => {
        if (userArray && userArray.length > 0) {
          const safeUser: SafeUser = exclude<User, 'password'>(userArray[0], [
            'password',
          ]);
          return safeUser;
        } else {
          throw new Error('Campos ingresados no validos');
        }
      }),
      tap((safeUser) => {
        // sessionStorage.setItem(this.userKey, JSON.stringify(safeUser));
        localStorage.setItem(this.userKey, JSON.stringify(safeUser));
      })
    );
  }

  getCurrentUser(): SafeUser | null {
    // const userData = sessionStorage.getItem(this.userKey);
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  logOut(): void {
    sessionStorage.removeItem(this.userKey);
  }
}
