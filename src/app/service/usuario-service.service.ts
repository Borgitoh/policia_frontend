import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8999/user';

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
  editUsuario(usuario: any, id:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?id=${id}`, usuario);
  }
}
