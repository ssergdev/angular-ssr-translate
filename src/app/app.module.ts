import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { I18nModule } from './core/i18n/i18n.module';
import { BlankComponent } from './blank.component';
import { CookieService, CookieModule } from '@gorniv/ngx-universal';

@NgModule({
    declarations: [AppComponent, BlankComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        CookieModule.forRoot(),
        I18nModule.forRoot({
            locales: ['en', 'ru'],
            defaultLocale: 'en',
        }),
    ],
    providers: [CookieService],
    bootstrap: [AppComponent],
})
export class AppModule {}
