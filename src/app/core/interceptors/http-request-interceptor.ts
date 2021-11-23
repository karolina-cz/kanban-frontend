import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LoadingService} from '../services/loading/loading.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isTargetRequest = this.isTargetRequest(request);
    this.setLoadingIfTargetRequest(request.url, true, isTargetRequest);
    return next.handle(request)
      .pipe(catchError((err) => {
        this.setLoadingIfTargetRequest(request.url, false, isTargetRequest);
        return err;
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.setLoadingIfTargetRequest(request.url, false, isTargetRequest);
        }
        return evt;
      }));
  }

  setLoadingIfTargetRequest(url: string, isLoading: boolean, isTargetRequest: boolean): void {
    if (isTargetRequest) {
      this.loadingService.setLoading(isLoading, url);
    }
  }

  isTargetRequest(request: HttpRequest<any>): boolean {
    return ((request.method === 'POST'  || request.method === 'GET') && request.url.includes('/api/room')) ||
      ((request.method === 'POST') && request.url.includes('/api/roomMember'));
  }
}
