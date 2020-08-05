import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '@app/core/i18n/i18n.service';

@Component({
    selector: 'app-root',
    template: ` <select (change)="i18nService.changeLanguage($event.target.value)">
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
    constructor(public translateService: TranslateService, public i18nService: I18nService) {}
}
