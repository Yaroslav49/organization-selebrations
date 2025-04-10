import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { AuthorizationService } from "../services/authorization.service";
import { Role } from "../services/role.model";
import { Router } from "@angular/router";

// Перехватывает http-запросы и добавляет к ним токен авторизации
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('jwt');
      const authService: AuthorizationService = inject(AuthorizationService);
      if (token) {
         let decoded = Object(jwtDecode(token));
         let nowSeconds = new Date().getTime() / 1000;
         console.log(`секунд до сброса jwt: ${decoded.exp - nowSeconds}`);
         if (nowSeconds >= decoded.exp) { // сбрасываем невалидный jwt
            localStorage.removeItem('jwt');
            authService.isLoggedIn = false;
            authService.role = Role.GUEST;
            inject(Router).navigate(['']);
            return next.handle(req);
         }
         const authReq = req.clone({
            setHeaders: {
               Authorization: `Bearer ${token}`
            }
         });
         return next.handle(authReq);
      } else {
         return next.handle(req);
      }
   }
}