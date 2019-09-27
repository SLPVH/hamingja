import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-stamp',
  templateUrl: './create-stamp.page.html',
  styleUrls: ['./create-stamp.page.scss'],
})
export class CreateStampPage implements OnInit {
  public enableTermination: boolean;
  public cardName = '';

  constructor() { }

  ngOnInit() {
  }
}
