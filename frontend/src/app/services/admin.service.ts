import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  toggleBanUser(userId: number, banned: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/ban?banned=${banned}`, {});
  }

  promoteToAdmin(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/promote-admin`, {});
  }

  demoteAdmin(userId: number, targetRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/demote?targetRole=${targetRole}`, {});
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getSystemStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
