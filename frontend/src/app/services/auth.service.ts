import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse, Role, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('realestate_user');
    if (saved) {
      try {
        this.currentUserSubject.next(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('realestate_user');
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  public isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  public isSeller(): boolean {
    return this.currentUserValue?.role === 'SELLER' || this.currentUserValue?.originalRole === 'SELLER';
  }

  public isNominatedAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN' && this.currentUserValue?.id !== 1;
  }

  public isBuyer(): boolean {
    return this.currentUserValue?.role === 'BUYER';
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        const user: User = {
          id: res.id,
          email: res.email,
          firstName: res.fullName.split(' ')[0] || '',
          lastName: res.fullName.split(' ')[1] || '',
          fullName: res.fullName,
          phone: res.phone,
          role: res.role,
          originalRole: res.originalRole || res.role
        };
        localStorage.setItem('realestate_user', JSON.stringify(user));
        localStorage.setItem('realestate_token', res.token);
        this.currentUserSubject.next(user);
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        const user: User = {
          id: res.id,
          email: res.email,
          firstName: res.fullName.split(' ')[0] || '',
          lastName: res.fullName.split(' ')[1] || '',
          fullName: res.fullName,
          phone: res.phone,
          role: res.role,
          originalRole: res.originalRole || res.role
        };
        localStorage.setItem('realestate_user', JSON.stringify(user));
        localStorage.setItem('realestate_token', res.token);
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('realestate_user');
    localStorage.removeItem('realestate_token');
    this.currentUserSubject.next(null);
  }
}
