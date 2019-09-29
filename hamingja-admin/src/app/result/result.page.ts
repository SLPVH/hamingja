import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  result: string;
  backPath: string;
  param: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.result = params.get('result');
      this.backPath = params.get('back_path') || '';
      this.param = JSON.parse(params.get('param')) || undefined;

      console.log(this.result, this.backPath, this.param)
    });
  }

  onBackClicked() {
    const navParam = [this.backPath];
    if (this.param) {
      navParam.push(this.param);
    }
    this.router.navigate(navParam);
  }
}
