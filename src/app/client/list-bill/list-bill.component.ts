import { Component, OnInit } from '@angular/core';

//service
import { UserService } from '../../core/api/user.service';
import { LoadingService } from '../../core/util/loading.service';
import { DialogService } from '../../core/dialog/dialog.service';
import { FormatService } from '../../core/util/format.service';
import { UserDialogService } from '../../core/dialog/user/user-dialog.service';
import { MainService } from '../../core/api/main.service';
import { ClientService } from '../../core/dialog/client/client.service';
import { StorageService } from '../../core/util/storage.service';
import { PopupService } from '../../core/dialog/popup/popup.service';
import { BillService } from '../../core/api/bill.service';

declare var $:any;

@Component({
  selector: 'app-list-bill',
  templateUrl: './list-bill.component.html',
  styleUrls: ['./list-bill.component.css']
})
export class ListBillComponent implements OnInit {

  private productId = '';
  private billData: any = [];
  private user: any = {};
  private waitingBills: any = [];

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private formatService: FormatService,
    private userDialog: UserDialogService,
    private mainService: MainService,
    private clientService: ClientService,
    private storageService: StorageService,
    private popupService: PopupService,
    private billService: BillService
  ) { }

  ngOnInit() {

    this.loadingService.show();

    let id = this.storageService.get('userInfo').id;

    console.log("id dep trai: ", id);

    this.billService.search({userId: id, include: true}).subscribe( bills => {

      this.billData = bills.data;
      console.log("data: ", bills);

      if(this.billData.length) {
        this.user = this.billData[0].user;
      } else {
        this.userService.getById(id).subscribe( userData => this.user = userData, error => this.loadingService.hide());
      }
      this.loadingService.hide();
    }, error => {

      this.loadingService.hide();
    })
  }


  updateUser() {

    this.userDialog.openUserDetail(this.user);
  }

  gotoDetail(item) {

    if(item.receiverId || item.trangthai > 2) {

      this.popupService.showWanning("Không Thể Chỉnh Sửa Đơn khi đã Đặt Đơn bên Nhật, liên hệ admin để biết thêm chi tiết nhé");
      return;
    }

    this.passBill(item);
  }

  passBill(item) {

    this.clientService.openBook({user: this.user, bill: JSON.parse(JSON.stringify(item))}).subscribe( data => {

      console.log("close: ", data);
    })
  }

  addBill() {

    this.dialogService.openBill({user: this.user}).subscribe( data => {

      if(typeof(data) == "object") {
        
        this.billData = this.billData.concat([data]);
      }
    })
  }
  calculateByProp(name, name2?) : number{

    let sum = 0;

    this.billData.forEach(element => {
      
      //  = element[name2] ? element[name2]: 1;

      element[name2] ? sum += Number(element[name]) * Number(element[name2]): sum+= Number(element[name]);
    });

    return sum;
  }
}

