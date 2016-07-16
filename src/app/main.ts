import {Component} from '@angular/core';

@Component({
  selector: 'App',
  template: require('./main.html')
})
export class Main {
  public text: string;

  constructor() {
    this.text = 'Start Dev!';
  }
}
