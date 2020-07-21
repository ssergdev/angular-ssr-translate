import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-blank',
    template: '<p>{{"title"|translate}}<p>',
})
export class BlankComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
