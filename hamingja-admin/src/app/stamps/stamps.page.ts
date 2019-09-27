import { Component, OnInit } from '@angular/core';
import { Stamp } from './stamp';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit {
  public stamps: Stamp[] = [{name: 'dummy', max: 5}];

  constructor() { }

  ngOnInit() {
  }

}
