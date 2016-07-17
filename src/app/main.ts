import {Component} from '@angular/core';

@Component({
  selector: 'App',
  directives: [],
  templateUrl: 'app/main.html',
  styleUrls: []
})
export class Main {
  public text: string;

  constructor() {
    this.text = 'Start Dev!';
  }
}
