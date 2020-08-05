import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { I18nGuard } from '@app/core/i18n/i18n.guards';
import { BlankComponent } from '@app/blank.component';

const routes: Routes = [
    { path: '', component: BlankComponent, canActivate: [I18nGuard] },

    { path: '404', component: BlankComponent },
    {
        path: ':lang',
        canActivate: [I18nGuard],
        children: [
            { path: '', component: BlankComponent },
            { path: 'home', component: BlankComponent },
        ],
    },
    { path: '**', redirectTo: '/404' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
