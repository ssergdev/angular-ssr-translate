import { PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { I18nCacheService } from './i18n.cache';
import { I18nModule } from './i18n.module';

export class TranslateLoaderMock implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of({});
    }
}

const defaultLocale = 'en';

describe('I18nModule', () => {
    const req = {} as Request;
    const cache = { getCachedLanguage: () => null } as I18nCacheService;
    let translateService: TranslateService;

    function init(req = {}, platform = 'browser') {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                I18nModule.forRoot({
                    locales: ['en', 'ru'],
                    defaultLocale: defaultLocale,
                }),
                CookieModule.forRoot(),
            ],
            providers: [
                CookieService,
                { provide: PLATFORM_ID, useValue: platform },
                { provide: REQUEST, useValue: req as Request },
                { provide: I18nCacheService, useValue: cache },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
            ],
        }).compileComponents();

        translateService = TestBed.inject(TranslateService);
    }
    afterEach(() => (cache.getCachedLanguage = () => null));

    it('should get language from cache', () => {
        cache.getCachedLanguage = () => 'ru';
        expect(cache.getCachedLanguage()).toEqual('ru');
        init();
        expect(translateService.currentLang).toEqual('ru');
    });

    it('should set language from `accept-language`', () => {
        const req = { headers: { 'accept-language': 'ru' } };
        init(req, 'server');
        expect(translateService.currentLang).toEqual('ru');
    });

    it('should set default language if no language provided', () => {
        init();
        expect(translateService.currentLang).toEqual(defaultLocale);
    });
});
