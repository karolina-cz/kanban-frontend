import { Injectable } from '@angular/core';
import {CreateAssigneeInterface} from '../../interfaces/assignee/assignee-interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssigneeService {

  constructor(private httpClient: HttpClient) { }

  createAssignee(assignee: CreateAssigneeInterface): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/assignee', assignee);
  }

  deleteAssignee(assigneeId: string): Observable<any> {
    return this.httpClient.delete(environment.apiUrl + '/assignee/' + assigneeId);
  }
}
