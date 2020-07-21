import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    template: ` <select (change)="setLang($event.target.value)">
            <option
                *ngFor="let lang of translateService.getLangs()"
                [value]="lang"
                [attr.selected]="lang === translateService.currentLang ? '' : null"
                >{{ lang }}</option
            >
        </select>
        <router-outlet></router-outlet>`,
})
export class AppComponent {
    constructor(private router: Router, public translateService: TranslateService) {}

    setLang(lang: string) {
        const path = this.router.url.split('/').slice(2).join('/');
        const newPath = path ? `${lang}/${path}` : lang;

        this.translateService
            .use(lang)
            .toPromise()
            .then(() => this.router.navigate([newPath]));
    }
}
