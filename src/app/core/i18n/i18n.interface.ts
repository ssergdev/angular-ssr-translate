import { InjectionToken } from '@angular/core';

export interface I18nConfig {
    locales: string[];
    defaultLocale: string;
}
export const I18N_CONFIG = new InjectionToken<I18nConfig>('I18N_CONFIG');
