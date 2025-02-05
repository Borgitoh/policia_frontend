import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
 private apiUrl = 'http://localhost:8999/registros';

  constructor(private http: HttpClient) {}


  getRegistros(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
    addRegistro(resgitro: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, resgitro);
    }
    getRegistroId(id: any): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?id=${id}`);
    }

    editRegistro(resgitro: any, id:any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}?id=${id}`, resgitro);
    }
}
