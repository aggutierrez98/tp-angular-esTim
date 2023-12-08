import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { LogInRequest, RegisterRequest, Role, SafeUser, User, exclude } from '../types';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  userKey = 'currentUser';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<SafeUser[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(
          () => new Error('Something went wrong. Please try again later.')
        );
      }),
      map((userArray) => {
        return userArray.map((user) => {
          const safeUser: SafeUser = exclude<User, 'password'>(user, [
            'password',
          ]);
          return safeUser;
        })
      }),
    );
  }

  getUser(id: string): Observable<SafeUser> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(
          () => new Error('Something went wrong. Please try again later.')
        );
      }),
      map((user) => {
        const safeUser: SafeUser = exclude<User, 'password'>(user, [
          'password',
        ]);
        return safeUser;
      }),
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
        // sessionStorage.setItem(this.userKey, JSON.stringify(safeUser));
        localStorage.setItem(this.userKey, JSON.stringify(safeUser));
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
    // sessionStorage.removeItem(this.userKey);
    localStorage.removeItem(this.userKey);
  }

  buyGame(gameId: number) {
    let user = this.getCurrentUser()!
    user.games = [...user.games || [], gameId]
    return this.http.patch<User>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      }),
      tap((safeUser) => {
        localStorage.setItem(this.userKey, JSON.stringify(safeUser));
      })
    );
  }

  lendGame(gameId: number, userToLendId: number) {
    const user = this.getCurrentUser()!
    return this.getUser(String(userToLendId)).pipe(
      switchMap((userToLend) => {
        if ((userToLend.borrowedGames || []).findIndex(bg => bg.gameId === gameId) !== -1) {
          return throwError(() => new Error('Este usuario ya cuenta con este juego prestado.'));
        }
        return this.http.patch<User>(`${this.apiUrl}/users/${userToLendId}`, {
          borrowedGames: [...userToLend.borrowedGames ?? [], { gameId, userId: user.id }]
        }).pipe(
          catchError((error) => {
            console.error('API Error:', error);
            return throwError(() => new Error('Something went wrong. Please try again later.'));
          }),
        )
      })
    )
  }

  returnGame(gameId: number) {
    const user = this.getCurrentUser()!
    return this.http.patch<User>(`${this.apiUrl}/users/${user.id}`, {
      borrowedGames: user.borrowedGames?.filter(bg => bg.gameId === gameId)
    }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Something went wrong. Please try again later.'));
      }),
      tap((safeUser) => {
        localStorage.setItem(this.userKey, JSON.stringify(safeUser));
      })
    )
  }
}
