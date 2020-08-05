import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nService } from './i18n.service';

@Component({ selector: 'blank-component' })
export class BlankCmp {
    constructor() {}
}

const routes: Routes = [
    {
        path: ':lang',
        children: [{ path: 'path', component: BlankCmp }],
    },
];

describe('I18nService', () => {
    let router: any;
    let location: Location;
    let service: I18nService;
    let translate: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes), TranslateModule.forRoot()],
        });
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        service = TestBed.inject(I18nService);
        translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should convert `/path` to `/en/path`', () => {
        const path = service.localizePath('/path');
        expect(path).toEqual('/en/path');
    });

    it('should convert `path` to `/en/path`', () => {
        const path = service.localizePath('path');
        expect(path).toEqual('/en/path');
    });

    it('should convert `/path/` to `/en/path`', () => {
        const path = service.localizePath('/path/');
        expect(path).toEqual('/en/path');
    });

    it('should convert `/path` to `/ru/path`', () => {
        translate.use('ru');
        const path = service.localizePath('/path');
        expect(path).toEqual('/ru/path');
    });

    it('should navigate to `/ru/path`', fakeAsync(() => {
        router.navigate(['/en/path']);
        tick();
        service.changeLanguage('ru');
        tick();
        expect(location.path()).toBe('/ru/path');
    }));
});
