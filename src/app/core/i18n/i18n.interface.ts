import { InjectionToken } from '@angular/core';

export const LANGUAGES = new InjectionToken<Lang[]>('LANGUAGES');

export interface Lang {
    name: string;
    code: string;
}
