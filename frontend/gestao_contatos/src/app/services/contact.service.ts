import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../types/contact.type';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://gestaocontatos.eastus2.cloudapp.azure.com:8000/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    const token = sessionStorage.getItem("auth-token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Contact[]>(this.apiUrl, { headers });
  }

  createContact(contact: Contact): Observable<any> {
    const token = sessionStorage.getItem("auth-token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, contact, { headers });
  }

  deleteContact(contactId: number): Observable<any> {
    const token = sessionStorage.getItem("auth-token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${contactId}`, { headers });
  }

  exportContacts(): Observable<Blob> {
    const token = sessionStorage.getItem("auth-token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/export/csv`, {
      headers,
      responseType: 'blob'
    });
  }
}
