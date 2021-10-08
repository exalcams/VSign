import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';import { Observable } from 'rxjs';
import { DocTag } from '../models/Tag.model';
@Injectable({
    providedIn: 'root'
  })
  export class TagService {
    constructor(private http: HttpClient) { }
    private baseUrlVsign = 'http://localhost:57308'
    getTags():Observable<any>{
        return this.http.get<any>(this.baseUrlVsign+"api/getTag/GetAllTags1");
      }
  }