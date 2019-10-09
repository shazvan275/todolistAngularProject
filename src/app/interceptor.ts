import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, } from 'rxjs/observable';
import { catchError } from 'rxjs/operators';


@Injectable()
export class RequestLogInterceptor implements HttpInterceptor {
    constructor(public router: Router, ) { }
    intercept(
        request: HttpRequest<any>, next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            request = request.clone({
                headers: request.headers.set(
                    'x-access-token',
                    JSON.parse(userToken).token
                )
            });
        }
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error.status === 401) {
                    alert('Access Denied');
                    this.router.navigateByUrl('/login');
                    localStorage.removeItem("userToken");
                    return Observable.throw(error);
                }
                return Observable.throw(error);
            })
        );
    }
}