# Angular + SSR + ngx-translate template

### I18nModule

Provides all the ngx-translate initialisation logic, with ssr and non-srr loaders, transfer-state implementation and initial language initialisation.

### I18nInterceptor

Applies the `accept-language` header to any requests and removes translation files caching.

### I18nRootGuard

Performs the redirect from base url to current language url. In SSR it's working as 302 no-cache redirect.

### I18nGuard

Sets the language from route-parameter.

### I18nPipe

Append the language prefix to path.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
