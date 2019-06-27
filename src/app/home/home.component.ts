import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild, Inject } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../shared/app.service';
import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxAutoScroll } from "ngx-auto-scroll";
import { HostListener, ElementRef } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {TableModule} from 'primeng/table';
// import {Injectable, Provider} from 'angular2/core';
// import {window} from 'angular2/src/facade/browser';
// import {unimplemented} from 'angular2/src/facade/exceptions';


let $;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('scrollAnimation', [
            state('show', style({
                opacity: 1,
                transform: "translateX(0)"
            })),
            state('hide', style({
                opacity: 0,
                transform: "translateX(-100%)"
            })),
            transition('show => hide', animate('700ms ease-out')),
            transition('hide => show', animate('700ms ease-in'))
        ])
    ]
})



export class HomeComponent implements AfterViewInit, OnInit {
    @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
    state = 'hide'
    public forceScrollDown(): void {
        this.ngxAutoScroll.forceScrollDown();
    }
    apiTimer: any;
    counter = 10;
    public now: Date = new Date();
    tanggal = new Date().toLocaleDateString();
    arr = this.tanggal.split('/');
    colors = Highcharts.getOptions().colors;
    dataKamar: any;
    colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
        '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
        '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
        '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
        '#13ec30', '#7faf7a', '#408055', '#09790e'];
    color2 = ['#7cb5ec', '#FF0000', '#C71585', '#ea5f5a', '#90ed7d', '#f7a35c',
        '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b',
        '#91e8e1', '#CD5C5C', '#FF69B4', '#FF8C00', '#9370DB', '#ADFF2F',
        '#00FF00', '#9ACD32', '#66CDAA', '#00FFFF', '#4682B4', '#cdff00',
        '#CD853F', '#ffd6b1', '#1E90FF', '#00CED1'];
    jumlahTempatTidur: any = 0;
    JumlahIsi: any = 0;
    JumlahKosong: any = 0;
    constructor(
        public appservice: AppService,
        @Inject(Window) private window: Window,
        public el: ElementRef) {
    }

    ngOnInit() {
        this.getData();
        // this.apiTimer = setInterval(() => {
        //     this.gotoElement('bottom')
        // }, (this.counter * 500)); //5 detik
        // this.apiTimer = setInterval(() => {
        //     this.gotoElement('top')
        // }, (this.counter * 600)); //5 detik

        this.apiTimer = setInterval(() => {
           this.getData()
        }, (this.counter * 60000)); //60 detik

    }
    getData(){
        this.appservice.getMasters('kamar/view-bed-tea').subscribe(e => {
            var data: any = e[0];
            this.jumlahTempatTidur = data.kamartotal;
            this.JumlahIsi = data.kamarisi;
            this.JumlahKosong = data.kamarkosong;
            // this.jumlahTempatTidur=this.jumlahTempatTidur.kamartotal
        })
        this.appservice.getMasters('tarif/view-bed').subscribe(e => {
            var data: any = e;
            var arrRuang = [];
            var arrKamar = [];
            var arrTT = [];
            var arr = [];
            var arrayS = {};
            var arrayK = {};
            var arrayM = {};
            var stt = true;
            for (var i = 0; i < data.length; i++) {
                arrayM = {
                    idtempattidur: data[i].idtempattidur,
                    idruangan: data[i].idruangan,
                    namaruangan: data[i].namaruangan,
                    idkamar: data[i].idkamar,
                    namakamar: data[i].namakamar,
                    reportdisplay: data[i].reportdisplay,
                    nomorbed: data[i].nomorbed,
                    idstatusbed: data[i].idstatusbed,
                    statusbed: data[i].statusbed
                };
                arrTT.push(arrayM)
            }
            for (var i = 0; i < data.length; i++) {
                //kamar
                stt = true;
                for (var j = 0; j < arrKamar.length; j++) {
                    if (data[i].idkamar == arrKamar[j].idkamar) {
                        arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
                        if (data[i].idstatusbed == 1) {
                            arrKamar[j].isi = arrKamar[j].isi + 1;
                        } else {
                            arrKamar[j].kosong = arrKamar[j].kosong + 1;
                        }
                        stt = false;
                    }
                }
                if (stt == true) {
                    var arrTTT = [];
                    for (var j = 0; j < arrTT.length; j++) {
                        if (arrTT[j].idkamar == data[i].idkamar) {
                            arrTTT.push(arrTT[j]);
                        }
                    }

                    if (data[i].idstatusbed == 1) {
                        arrayK = {
                            idruangan: data[i].idruangan,
                            idkamar: data[i].idkamar,
                            namakamar: data[i].namakamar,
                            idkelas: data[i].idkelas,
                            namakelas: data[i].namakelas,
                            qtyBed: 1,
                            isi: 1,
                            kosong: 0,
                            tempattidur: arrTTT
                        };
                    } else {
                        arrayK = {
                            idruangan: data[i].idruangan,
                            idkamar: data[i].idkamar,
                            namakamar: data[i].namakamar,
                            idkelas: data[i].idkelas,
                            namakelas: data[i].namakelas,
                            qtyBed: 1,
                            isi: 0,
                            kosong: 1,
                            tempattidur: arrTTT
                        };
                    }
                    arrKamar.push(arrayK);
                }


            }
            var sama = false
            var newAr = [];
            console.log(arrKamar)
            for (let i = 0; i < arrKamar.length; i++) {
                sama = false;
                for (let z = 0; z < newAr.length; z++) {
                    if (arrKamar[i].namakelas == newAr[z].namakelas && arrKamar[i].idruangan == newAr[z].idruangan) {
                        sama = true;
                        // newAr[z].namakelas = arrKamar[i].namakelas
                        newAr[z].qtyBed = newAr[z].qtyBed + arrKamar[i].qtyBed
                        newAr[z].kosong = newAr[z].kosong + arrKamar[i].kosong
                        newAr[z].isi = newAr[z].isi + arrKamar[i].isi
                    }
                }
                if (sama == false) {
                    var datas = {
                        namakelas: arrKamar[i].namakelas,
                        idruangan: arrKamar[i].idruangan,
                        qtyBed: arrKamar[i].qtyBed,
                        isi: arrKamar[i].isi,
                        kosong: arrKamar[i].kosong,
                    }
                    newAr.push(datas);
                }
            }
            console.log(newAr)

            for (var i = 0; i < data.length; i++) {
                //ruang
                stt = true;
                for (var j = 0; j < arrRuang.length; j++) {
                    if (data[i].idruangan == arrRuang[j].idruangan) {
                        arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
                        if (data[i].idstatusbed == 1) {
                            arrRuang[j].isi = arrRuang[j].isi + 1;
                        } else {
                            arrRuang[j].kosong = arrRuang[j].kosong + 1;
                        }
                        stt = false;
                    }
                }
                if (stt == true) {
                    var arrTTT = [];
                    for (var j = 0; j < newAr.length; j++) {
                        if (newAr[j].idruangan == data[i].idruangan) {
                            arrTTT.push(newAr[j]);
                        }
                    }
                    if (data[i].idstatusbed == 1) {
                        arrayS = {
                            idruangan: data[i].idruangan,
                            namaruangan: data[i].namaruangan,
                            qtyBed: 1,
                            isi: 1,
                            kosong: 0,
                            kamar: arrTTT
                        };
                    } else {
                        arrayS = {
                            idruangan: data[i].idruangan,
                            namaruangan: data[i].namaruangan,
                            qtyBed: 1,
                            isi: 0,
                            kosong: 1,
                            kamar: arrTTT
                        };
                    }

                    arrRuang.push(arrayS);
                }

            }
            let warna = ['sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin']
            for (let i = 0; i < arrRuang.length; i++) {
                arrRuang[i].warna = warna[i]
                if (arrRuang[i].namaruangan.indexOf('Rawat Sehari') > -1)
                    arrRuang[i].namaruangan = 'RRS Bedah'
            }

            console.log(arrRuang)
            this.dataKamar = arrRuang
        })
    }
    scroll() {
        var scroll = setInterval(function () { window.scrollBy(0, 1000); }, 2000);
        this.window.scrollTo(0, 1400);
    }
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const componentPosition = this.el.nativeElement.offsetTop
        const scrollPosition = window.pageYOffset

        if (scrollPosition >= componentPosition) {
            this.state = 'show'
        } else {
            this.state = 'hide'
        }

    }

    autoScroll(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        var speed = Math.round(distance / 50);
        // if (distance < 100) {
        if (eID == "top") {
            // stopY = 0;
            // scrollTo(0, stopY); return;
            if (speed >= 10)
                speed = 500
            else 500;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }

        } else {
            if (speed >= 10)
                speed = 500
            else 500;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }

        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetWidth;
            var node: any = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetWidth;
            } return y;
        }

    };
    gotoElement(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll t
        if (eID == "bottom") {
            this.window.location.hash = 'bottom';
        } else {
            this.window.location.hash = 'top';
        }


        // call $anchorScroll()
        this.autoScroll(eID);

    };

    /**
     * @method ngAfterViewInit
     */
    ngAfterViewInit() {
        Prism.highlightAll();
    }
}