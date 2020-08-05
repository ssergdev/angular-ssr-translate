import { Inject, ModuleWithProviders, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    TranslateLoader,
    TranslateModule,
    TranslateService,
    TranslateCompiler,
} from '@ngx-translate/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { pick } from 'accept-language-parser';

import { I18nCacheService } from './i18n.cache';
import { translateLoaderFactory } from './i18n.loaders';
import { I18nInterceptor } from './i18n.inteceptors';
import { I18nGuard } from './i18n.guards';
import { I18nConfig, I18N_CONFIG } from './i18n.interface';

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
    ],
    providers: [
        I18nGuard,
        I18nCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: I18nInterceptor, multi: true },
    ],
    exports: [TranslateModule],
})
export class I18nModule {
    constructor(
        translate: TranslateService,
        translateCache: I18nCacheService,
        @Optional() @Inject(REQUEST) req: Request,
        @Inject(PLATFORM_ID) platform: any,
        @Inject(I18N_CONFIG) config: I18nConfig
    ) {
        const locales = config.locales;
        const defaultLocale = config.defaultLocale;

        const lang = isPlatformBrowser(platform)
            ? translateCache.getCachedLanguage() || translate.getBrowserLang()
            : translateCache.getCachedLanguage() ||
              (req && req.headers ? pick(locales, req.headers['accept-language']) : null);

        translate.addLangs(locales);
        translate.setDefaultLang(defaultLocale);
        translate.use(lang && locales.includes(lang) ? lang : defaultLocale);
    }
    static forRoot(config: I18nConfig): ModuleWithProviders<I18nModule> {
        return {
            ngModule: I18nModule,
            providers: [{ provide: I18N_CONFIG, useValue: config }],
        };
    }
}
