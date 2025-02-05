import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8999/user';
  private userKey = 'userData';

  constructor(private http: HttpClient) {}
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  addUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, usuario);
  }
  getClienteId(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }
  getUserByLogin(login: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?login=${login}`);
  }
  editUsuario(usuario: any, id:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?id=${id}`, usuario);
  }
  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
  logout(): void {
    localStorage.removeItem(this.userKey);
  }
  isLoggedIn(): boolean {
    return !!this.getUser();
  }
  isAuthenticated(): boolean {
    return localStorage.getItem(this.userKey) !== null; 
  }
}
