import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PatchWorkPoint} from '../../interfaces/work-point/work-point';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkPointService {

  constructor(private httpClient: HttpClient) { }

  patchWorkPoint(workPointId: string, workPoint: PatchWorkPoint): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + '/workPoint/' + workPointId, workPoint);
  }
}
