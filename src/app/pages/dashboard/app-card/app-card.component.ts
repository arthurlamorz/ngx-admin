import { Component, Input, OnInit } from '@angular/core';
import { AppListService, AppList } from '../../../services/cms-services/list-app.service';

@Component({
  selector: 'ngx-app-card',
  styleUrls: ['./app-card.component.scss'],
  template: `
  <div *ngFor="let item of appList?.appList; odd as isOdd">
  <div class="col-xxxl-3 col-md-6">
    <nb-card>
      <div class="icon-container">
        <div class="icon {{ isOdd? 'success' : 'warning' }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ item.appName }}</div>
        <div class="status">ON</div>
      </div>
    </nb-card>
    </div>
  </div>
  `,
})
export class AppCardComponent implements OnInit {

  @Input() title: string;
  @Input() status: string;
  @Input() description: string;
  @Input() on = true;

  appList: AppList;

  constructor(private appListService: AppListService) {


  }

  ngOnInit() {
    const self = this;
    this.appListService.listApp()
      .subscribe(al => {
        if (al)
          self.appList = al;
      }, error => {

      });


  }
}
