import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteDto } from '../dto/VoteDto';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private httpClient:HttpClient) { }

  vote(voteDto:VoteDto): Observable<any>{
    return this.httpClient.post(environment.baseUrl+'/reddit/vote/',voteDto);
  } 
}
