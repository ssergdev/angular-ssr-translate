import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class I18nInterceptor implements HttpInterceptor {
    constructor(public translateService: TranslateService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Set the language header (need for ssr requests)
        const lang = this.translateService.currentLang;
        if (lang) {
            request = request.clone({
                setHeaders: {
                    'Accept-Language': lang,
                },
            });
        }

        // Solve the issue with cached translation files
        // https://github.com/ngx-translate/http-loader/issues/25
        if (request.url.startsWith('/assets/i18n/')) {
            request = request.clone({
                setHeaders: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
            });
        }

        return next.handle(request);
    }
}
