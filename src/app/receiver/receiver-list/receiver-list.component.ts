import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { LoadingService } from '../../core/util/loading.service';
import { FormatService } from '../../core/util/format.service';
import { ClientService } from '../../core/dialog/client/client.service';
import { MainService } from '../../core/api/main.service';
import { StorageService } from '../../core/util/storage.service';
import { ReceiveService } from '../../core/api/receive.service';
import { PopupService } from '../../core/dialog/popup/popup.service';
declare var $: any;

@Component({
  selector: 'app-receiver-list',
  templateUrl: './receiver-list.component.html',
  styleUrls: ['./receiver-list.component.css']
})
export class ReceiverListComponent implements OnInit {

  private madh = '';
  private fakedData = [];
  private from: any;
  private to: any;
  private sr = true;
  private user: any = {};

  constructor(
    private matDialg: MatDialog,
    private loadingService: LoadingService,
    private formatService: FormatService,
    private clientService: ClientService,
    private mainService: MainService,
    private storageService: StorageService,
    private receiveService: ReceiveService,
    private popupService: PopupService
  ) { }

  ngOnInit() {

    let id = this.storageService.get("userInfo").makh;

    this.sr = screen.width <= 412? false: true;

    this.fakedData = [];

    this.loadingService.show();

    this.mainService.listReceive({makh: id}).subscribe( data => {

      console.log("main service data: ", data);
      this.fakedData = data;
      this.loadingService.hide();
    })
  }

  formatDate(data) {

    return this.formatService.formatDate(data);
  }

  gotoDetail(element) {

    this.clientService.openReceiverForm(element.manh).subscribe( data => {

      console.log("data: ", data);
    })
  }

  changeStatus(value, item) {

    this.loadingService.show();

    item.trangthai = value;
    console.log("item regist: ", item, value);

    this.receiveService.update(item).subscribe( data => {

      this.loadingService.hide();
      this.popupService.showSuccess();
    }, error => {

      this.loadingService.hide();
      this.popupService.showError(error.message).subscribe( () => {

        this.ngOnInit();
      })
    });
  }

  changeWeight(item) {

    
    this.clientService.openReceiverWeightForm(item.chitietdh).subscribe( state => {

    })
  }

  calculateByProp(name, name2?) {

    let sum = 0;

    this.fakedData.forEach(element => {
      
      //  = element[name2] ? element[name2]: 1;

      element[name2] ? sum += Number(element[name]) * Number(element[name2]): sum+= Number(element[name]);
    });

    return sum;
  }
}
