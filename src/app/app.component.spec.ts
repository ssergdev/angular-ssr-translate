import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { I18nModule } from '@app/core/i18n/i18n.module';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CookieModule.forRoot(),
                I18nModule.forRoot({
                    locales: ['en', 'ru'],
                    defaultLocale: 'en',
                }),
            ],
            declarations: [AppComponent],
            providers: [CookieService],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
