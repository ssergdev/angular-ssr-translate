import { Inject, ModuleWithProviders, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import {
    TranslateCacheModule,
    TranslateCacheService,
    TranslateCacheSettings,
} from 'ngx-translate-cache';

import { translateLoaderFactory } from './i18n.loaders';
import { I18nInterceptor } from './i18n.inteceptors';
import { I18nRootGuard, I18nGuard } from './i18n.guards';
import { Lang, LANGUAGES } from './i18n.interface';

@NgModule({
    imports: [
        BrowserTransferStateModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translateLoaderFactory,
                deps: [HttpClient, TransferState, PLATFORM_ID],
            },
        }),
        TranslateCacheModule.forRoot({
            cacheService: {
                provide: TranslateCacheService,
                useFactory: translateCacheFactory,
                deps: [TranslateService, TranslateCacheSettings],
            },
            cacheMechanism: 'Cookie',
        }),
    ],
    providers: [
        I18nRootGuard,
        I18nGuard,
        { provide: HTTP_INTERCEPTORS, useClass: I18nInterceptor, multi: true },
    ],
    exports: [TranslateModule],
})
export class I18nModule {
    constructor(
        translate: TranslateService,
        translateCacheService: TranslateCacheService,
        @Optional() @Inject(REQUEST) private req: Request,
        @Inject(PLATFORM_ID) private platform: any,
        @Inject(LANGUAGES) private languages: Lang[]
    ) {
        const langs = languages.map((i) => i.code);

        if (isPlatformBrowser(platform)) {
            translateCacheService.init();
        }

        translate.addLangs(langs);

        let lang = isPlatformBrowser(platform)
            ? translateCacheService.getCachedLanguage() || translate.getBrowserLang()
            : getLanguageFromRequest(req, langs);
        lang = langs.includes(lang) ? lang : langs[0];

        translate.use(lang);
    }
    static forRoot(languages: Lang[] = []): ModuleWithProviders<I18nModule> {
        return {
            ngModule: I18nModule,
            providers: [{ provide: LANGUAGES, useValue: languages }],
        };
    }
}

export function getLanguageFromRequest(req: any, langs: string[]): string {
    let lang: string;
    if (req) {
        // Get language from cookies
        if (req.cookies) {
            lang = req.cookies.lang;
        }

        // Get the first accepted language
        if (lang == null && req.headers && req.headers['accept-language']) {
            const headerLang = req.headers['accept-language'].split(',')[0].trim();
            if (headerLang.length > 1) {
                lang = headerLang.split('-')[0];
            }
        }
    }
    return lang;
}

export function translateCacheFactory(
    translateService: TranslateService,
    translateCacheSettings: TranslateCacheSettings
) {
    return new TranslateCacheService(translateService, translateCacheSettings);
}
