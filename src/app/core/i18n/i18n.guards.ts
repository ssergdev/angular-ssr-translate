import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { isPlatformServer } from '@angular/common';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES, Lang } from './i18n.interface';

@Injectable()
export class I18nRootGuard implements CanActivate {
    constructor(
        private router: Router,
        private translateService: TranslateService,
        @Inject(PLATFORM_ID) private platform: any,
        @Optional() @Inject(RESPONSE) private res: Response
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const lang = this.translateService.currentLang;
        if (isPlatformServer(this.platform)) {
            // In SSR, Perform the redirect with 302 status and no cache
            this.res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            this.res.header('Pragma', 'no-cache');
            this.res.header('Expithis.res', '0');
            this.res.status(302);
            this.res.location(`/${lang}`);
            return true;
        } else {
            return this.router.navigate([`/${lang}`]);
        }
    }
}

@Injectable()
export class I18nGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private translateService: TranslateService,
        @Inject(LANGUAGES) private languages: Lang[]
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const lang = route.root.firstChild.params.lang;
        if (lang && this.languages.map((i) => i.code).includes(lang)) {
            return this.translateService
                .use(lang)
                .toPromise()
                .then(
                    (res) => true,
                    (err) => false
                );
        } else {
            this.router.navigate([`/404`]);
            return false;
        }
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
