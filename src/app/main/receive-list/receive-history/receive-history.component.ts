import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../core/api/main.service';
import { LoadingService } from '../../../core/util/loading.service'
import { FormatService } from '../../../core/util/format.service';
import { DialogService } from '../../../core/dialog/dialog.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-receive-history',
  templateUrl: './receive-history.component.html',
  styleUrls: ['./receive-history.component.css']
})
export class ReceiveHistoryComponent implements OnInit {

  private receiveList: any = [];
  private sc: any = screen.width <= 414? false: true;
  private tenkh = '';
  private madh = '';
  private from = '';
  private to = '';
  private trangthai:any = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mainService: MainService,
    private loadingService: LoadingService,
    private formatService: FormatService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {

    this.loadingService.show();

    let id = this.route.snapshot.paramMap.get('id');

    this.mainService.listReceive({makh: id}).subscribe( data => {

      this.receiveList = data;
      this.loadingService.hide();
      console.log("data: ", data);
    }, error => {

      this.loadingService.hide();
    })
  }

  openReceiveDetail(element) {

    this.dialogService.openReceive(element.manh).subscribe( data => {

      this.mainService.listReceive({manh: element.manh}).subscribe( data => {

        if(!data.length) {

          this.receiveList.splice(this.receiveList.indexOf(element), 1);
          this.receiveList = this.receiveList.concat([]);
        } else {

          this.receiveList.splice(this.receiveList.indexOf(element), 1, data[0]);
          this.receiveList = this.receiveList.concat([]);
        }
      })
    })
  }

  calculateByProp(name, name2?) {

    let sum = 0;

    this.receiveList.forEach(element => {
      
      //  = element[name2] ? element[name2]: 1;

      element[name2] ? sum += Number(element[name]) * Number(element[name2]): sum+= Number(element[name]);
    });

    return sum;
  }
}
