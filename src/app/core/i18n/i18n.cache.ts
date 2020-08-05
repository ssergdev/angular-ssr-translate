import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { CookieService } from '@gorniv/ngx-universal';

const KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class I18nCacheService {
    constructor(
        private cookies: CookieService,
        private translateService: TranslateService,
        @Inject(PLATFORM_ID) private platform: any
    ) {
        if (isPlatformBrowser(platform)) {
            this.translateService.onLangChange.subscribe((event: TranslationChangeEvent) => {
                return this.cacheWithCookies(event.lang);
            });
        }
    }

    public getCachedLanguage(): string {
        return this.cookies.get(KEY);
    }

    private cacheWithCookies(value: string) {
        this.cookies.put(encodeURIComponent(KEY), value, { path: '/' });
    }
}
