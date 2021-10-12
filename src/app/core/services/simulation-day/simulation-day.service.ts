import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { SimulationDayInterface} from '../../interfaces/day-interface';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SimulationDayService {

  constructor(private httpClient: HttpClient) { }

  getDays(roomType: string): Observable<SimulationDayInterface[]> {
    return this.httpClient.get<SimulationDayInterface[]>(environment.apiUrl + '/simulationDay/' + roomType);
  }
}
