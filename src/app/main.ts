import {Component} from '@angular/core';

@Component({
  selector: 'App',
  template: require('./hello.html')
})
export class Main {
  public hello: string;

  constructor() {
    this.hello = 'Start Dev!';
  }
}
