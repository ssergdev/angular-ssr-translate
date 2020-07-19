import { Component, PLATFORM_ID, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Routes, Router } from '@angular/router';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { I18nModule } from './i18n.module';
import { Lang } from './i18n.interface';
import { I18nRootGuard, I18nGuard } from './i18n.guards';

@Component({ selector: 'blank-component' })
export class BlankCmp {
    constructor() {}
}

export class TranslateLoaderMock implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of({});
    }
}

const languages: Lang[] = [
    { name: 'English', code: 'en' },
    { name: 'Russian', code: 'ru' },
];
const defaultLang = languages.map((i) => i.code)[0];

const routes: Routes = [
    { path: '', component: BlankCmp, canActivate: [I18nRootGuard] },
    {
        path: ':lang',
        canActivate: [I18nGuard],
        canActivateChild: [I18nGuard],
        children: [{ path: 'home', component: BlankCmp }],
    },
];

describe('I18nModule', () => {
    let router: any;
    let translateService: TranslateService;
    let ngZone: NgZone;
    const response = jasmine.createSpyObj('Response', ['header', 'location', 'status']) as Response;

    function init(req: Request = {} as Request) {
        TestBed.configureTestingModule({
            declarations: [BlankCmp],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderMock,
                    },
                }),
                RouterTestingModule.withRoutes(routes),
                I18nModule.forRoot(languages),
            ],
            providers: [
                { provide: PLATFORM_ID, useValue: 'server' },
                { provide: REQUEST, useValue: req },
                { provide: RESPONSE, useValue: response },
            ],
        }).compileComponents();
        translateService = TestBed.inject(TranslateService);
        router = TestBed.inject(Router);
        ngZone = TestBed.inject(NgZone);
    }

    beforeEach(async(() => {}));

    it('should get language from cookies', () => {
        const req = { cookies: { lang: 'ru' } } as Request;
        init(req);
        expect(translateService.currentLang).toEqual('ru');
    });

    it('should get language from accept-language', () => {
        const req = { headers: { 'accept-language': 'ru-RU,ru,ru' } } as Request;
        init(req);
        expect(translateService.currentLang).toEqual('ru');
    });

    it('should set default language if no language provided', () => {
        const req = {} as Request;
        init(req);
        expect(translateService.currentLang).toEqual(defaultLang);
    });

    it('should get language from url', async () => {
        init();
        await ngZone.run(() => router.navigate(['/ru']));
        expect(translateService.currentLang).toEqual('ru');
    });

    it('should redirect from `/` to `/[lang]/`', async () => {
        const req = { cookies: { lang: 'ru' } } as Request;
        init(req);
        expect(translateService.currentLang).toEqual('ru');
        await ngZone.run(() => router.navigate(['/']));
        expect(response.location).toHaveBeenCalledWith('/ru');
    });

    it('should redirect from `/` to `/[defaultLang]/` if language is incorrect', async () => {
        const req = { cookies: { lang: 'cz' } } as Request;
        init(req);
        expect(translateService.currentLang).toEqual(defaultLang);
        await ngZone.run(() => router.navigate(['/']));
        expect(response.location).toHaveBeenCalledWith(`/${defaultLang}`);
    });

    it('should redirect from `/` to `/[defaultLang]/` if no language provided', async () => {
        const req = {} as Request;
        init(req);
        expect(translateService.currentLang).toEqual(defaultLang);
        await ngZone.run(() => router.navigate(['/']));
        expect(response.location).toHaveBeenCalledWith(`/${defaultLang}`);
    });
});
