import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { isPlatformServer } from '@angular/common';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nConfig, I18N_CONFIG } from './i18n.interface';
import { Location } from '@angular/common';

const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/;

@Injectable()
export class I18nGuard implements CanActivate {
    constructor(
        private router: Router,
        private translateService: TranslateService,
        @Inject(PLATFORM_ID) private platform: any,
        @Optional() @Inject(REQUEST) private req: Request,
        @Inject(I18N_CONFIG) private config: I18nConfig,
        private loc: Location
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const locales = this.config.locales;
        const prefix = route.params.lang;
        const lang = this.translateService.currentLang;

        if (prefix && locales.includes(prefix)) {
            // Set language from prefix
            return this.translateService.use(prefix).pipe(map(() => true));
        } else {
            // if no prefix, redirect from `/about/..` to '/:lang/about/...'
            const path = isPlatformServer(this.platform)
                ? this.req.originalUrl
                : window.location.pathname;

            if (DOCUMENT_REGEX.test(path)) {
                this.router.navigate([`/${lang}/${path}`]);
            }
            return true;
        }
    }
}
