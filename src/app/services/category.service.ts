import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

const API_URL = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getRandomCategory(exclude?: string): Observable<Category> {
    const params = exclude ? { exclude } : undefined;
    return this.http.get<Category>(`${API_URL}/api/categories/random`, { params });
  }
}
