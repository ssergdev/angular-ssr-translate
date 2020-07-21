import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { I18nModule } from './core/i18n/i18n.module';
import { BlankComponent } from './blank.component';

@NgModule({
    declarations: [AppComponent, BlankComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        I18nModule.forRoot([
            { name: 'English', code: 'en' },
            { name: 'Russian', code: 'ru' },
        ]),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
