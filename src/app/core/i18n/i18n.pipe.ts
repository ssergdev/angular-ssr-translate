import { NgModule, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Pipe({
    name: 'localize',
    pure: false,
})
export class I18nPipe implements PipeTransform, OnDestroy {
    private lang: string;
    private value: string;
    private subscription: Subscription;

    constructor(private translateService: TranslateService) {
        this.lang = translateService.currentLang;
        this.subscription = translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.lang = event.lang;
            this.transform(this.value);
        });
    }

    transform(value: string): string {
        if (!value || !this.lang) {
            return value;
        }
        this.value = value;
        if (value[0] != '/') {
            value = '/' + value;
        }
        return `/${this.lang}${value}`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

@NgModule({
    declarations: [I18nPipe],
    exports: [I18nPipe],
})
export class I18nPipeModule {}
