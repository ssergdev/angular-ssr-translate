import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class I18nService {
    constructor(private translateService: TranslateService, private router: Router) {}

    /*
     * Change language and redirect
     */
    changeLanguage(lang: string) {
        const path = this.router.url.split('/').slice(2).join('/');
        const newPath = path ? `/${lang}/${path}` : `/${lang}`;

        this.translateService
            .use(lang)
            .toPromise()
            .then(() => this.router.navigate([newPath]));
    }

    /*
     * Add language prefix to path
     */
    localizePath(path: string): string {
        const lng = this.translateService.currentLang;
        path = path.replace(/^\/|\/$/g, ''); // trim trailing slash
        return `/${lng}/${path}`;
    }
}
