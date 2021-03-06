import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Router, NavigationStart, NavigationError, NavigationEnd, NavigationCancel } from '@angular/router';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private pendingRequests = 0;
  private filteredUrlPatterns: RegExp[] = [];

  private pendingRequestsStatus: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.pendingRequestsStatus.next(true);
      }

      if ((event instanceof NavigationError || event instanceof NavigationEnd || event instanceof NavigationCancel)) {
        this.pendingRequestsStatus.next(false);
      }
    });
  }

  private shouldBypass(url: string): boolean {
    return this.filteredUrlPatterns.some(e => {
      return e.test(url);
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldBypass = this.shouldBypass(req.url);
    const token: string = localStorage.getItem('token') || '';

    if (token && token !== '') {
      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    }

    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    if (!shouldBypass) {
      this.pendingRequests++;

      if (1 === this.pendingRequests) {
        this.pendingRequestsStatus.next(true);
      }
    }

    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        debugger;
        if (error.status === 401) {
          alert('No esta autorizado para consumir este recurso');
        }
        return throwError(error);
      }),
      finalize(() => {
        if (!shouldBypass) {
          this.pendingRequests--;

          if (0 === this.pendingRequests) {
            this.pendingRequestsStatus.next(false);
          }
        }
      })
    );
  }
}
