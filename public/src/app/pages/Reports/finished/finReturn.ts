import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { FinStoreService } from '../../../services';
import { FinishedReturn } from '../../../Models'
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-finRet',
    templateUrl: './finReturn.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptFinRetPeriodComponent implements OnInit {
    constructor(private srvFin: FinStoreService, private loc: Location) { }
    
    collection: any[] = []
    srchObj = new FinishedReturn()
    fromDate: string
    toDate: string
    reportHeader: string
    subHeader: string

    ngOnInit() {
        this.fromDate = hf.handleDate(new Date())
        this.toDate = hf.handleDate(new Date())
    }

    ViewReport() {
        this.srvFin.getReturnPeriod(this.fromDate, this.toDate).subscribe(ret => {
            this.collection = ret
            // this.barChartData = ret.map(data => { return data.Amount })
            // this.barChartLabels = ret.map(data => { return data.Country })
            this.reportHeader = `Finished Store Return Details`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
        })
    }
    AfterViewInit() {
        // window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    goBack() {
        this.loc.back();
    }
    printReport() {
        window.print();
    }
}