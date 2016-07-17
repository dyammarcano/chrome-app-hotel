/// <reference path="../typings/index.d.ts"/>

import 'reflect-metadata';
import 'zone.js/dist/zone';
import {bootstrap} from '@angular/platform-browser-dynamic';

// import './index.styl';

import {provideRouter} from '@angular/router';
import {enableProdMode} from '@angular/core';
import {routes, Root} from './routes';

declare var process: any;
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

bootstrap(Root, [
  provideRouter(routes)
]);
