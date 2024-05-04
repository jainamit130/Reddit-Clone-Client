import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../authorization/shared/auth.service";
import { LogInResponse } from "../dto/ResponsePayload/log-in-response";

@Injectable({
    providedIn:'root'
})
export class TokenInterceptor implements HttpInterceptor {
    isTokenRefershing: boolean=false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
            return next.handle(req);
        }
        
        const jwtToken = this.authService.getJwtToken();

        if (jwtToken) {
            return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse
                    && error.status === 403) {
                    return this.handleAuthError(req, next);
                } else {
                    return throwError(error);
                }
            }));
        }
        return next.handle(req);
    }

    addToken(req: HttpRequest<any>, jwtToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + jwtToken)
        });
    }
    
    private handleAuthError(req: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {
        if(!this.isTokenRefershing) {
            this.isTokenRefershing=true;
            this.refreshTokenSubject.next(null);
             
            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LogInResponse) => {
                    this.isTokenRefershing=false;
                    this.refreshTokenSubject
                    .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req,
                        refreshTokenResponse.authenticationToken));
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result === null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.authService.getJwtToken()))
                })
            );
        }
    }
}