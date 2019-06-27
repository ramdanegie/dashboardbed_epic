import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-headerbed',
  templateUrl: './headerbed.component.html',
  styleUrls: ['./headerbed.component.css']
})
export class HeaderbedComponent implements OnInit {
  public now: Date = new Date();
  tanggal = new Date().toLocaleDateString();
  jumlahTempatTidur: any = 0;
  JumlahIsi: any = 0;
  JumlahKosong: any = 0;
  constructor(public appservice: AppService) {

  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.appservice.getMasters('kamar/view-bed-tea').subscribe(e => {
      var data: any = e[0];
      this.jumlahTempatTidur = data.kamartotal;
      this.JumlahIsi = data.kamarisi;
      this.JumlahKosong = data.kamarkosong;
      // this.jumlahTempatTidur=this.jumlahTempatTidur.kamartotal
    })
  }

}
