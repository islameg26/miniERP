import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinDispensingService, FinDetailService, ModelService, SalesHeaderService, SalesDetailService } from '../../../services';
import { CurrentUser, FinishedDispensing, FinishedStoreDetail, Model, SalesHeader } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as hf from '../../helper.functions'

@Component({
    selector: 'fin-Disp',
    templateUrl: './dispensing.component.html',
    animations: [
        trigger(
            'myAnimation', [
                transition(':enter', [
                    style({ transform: 'translateX(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateX(0)', 'opacity': 1 }),
                    animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class FinDispensingComponent implements OnInit {


    currentUser: CurrentUser = this.auth.getUser();
    collection: FinishedDispensing[] = [];
    finDetails: FinishedStoreDetail[] = [];
    modelsList: Model[];
    SOList: SalesHeader[] = [];
    model: FinishedDispensing = new FinishedDispensing();
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    srchObj: FinishedDispensing = new FinishedDispensing();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvRecDate: string;
    basicform: FormGroup;
    stillSaving: boolean
    selModID: number
    reset: boolean

    constructor(public srvDisp: FinDispensingService, private auth: AuthenticationService,
        private srvDet: FinDetailService, private srvModel: ModelService, private srvSO: SalesHeaderService,
        private srvSODet: SalesDetailService, fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            soID: [{ value: '', disabled: true }],
            chkSOID: [''],
            RecDate: ['', Validators.required],
            DispenseTo: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        this.basicform.controls['chkSOID'].valueChanges.subscribe(value => this.onchkchange(value));
        this.basicform.controls['soID'].valueChanges.subscribe(value => this.onSOIDchange(value));
    }

    ngOnInit() {
        this.srvDisp.getDispensing().subscribe(cols => {
            this.collection = cols;
            this.srvModel.getModel().subscribe(mod => {
                this.modelsList = mod;
                this.srvSO.getUnFinishedSalesHeader().subscribe(so => this.SOList = so, err => hf.handleError(err));
                this.TableBack();
            }, err => hf.handleError(err))
        }, err => hf.handleError(err));
    }

    CreateNew() {
        this.model = new FinishedDispensing();
        this.cnvRecDate = this.model.DispensingDate ? hf.handleDate(new Date(this.model.DispensingDate)) : hf.handleDate(new Date());
        // this.srvDet.getFinRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Finished Store Dispensing';
        // })
    }
    LoadDetails(id, state) {
        this.srvDisp.getDispensing(id).subscribe(mat => {
            this.model = mat[0];
            this.srvSO.getSalesHeader(this.model.SOID).subscribe(so => {
                this.SOList.push(so[0])
                this.basicform.controls['soID'].setValue(this.model.SOID)
                this.srvDet.getFinDispDetail(id).subscribe(det => {
                    this.finDetails = det;
                    this.cnvRecDate = this.model.DispensingDate ? hf.handleDate(new Date(this.model.DispensingDate)) : hf.handleDate(new Date());
                    this.showTable = false;
                    this.Formstate = state;
                    this.headerText = state == 'Detail' ? `Finished Store Dispensing ${state}s` : `${state} Finished Store Dispensing`;
                }, err => hf.handleError(err))
            }, err => hf.handleError(err));
        }, err => hf.handleError(err));
    }
    EditThis(id: number) {
        this.LoadDetails(id, 'Edit');
    }
    ShowDetails(id: number) {
        this.LoadDetails(id, 'Detail');
    }
    Delete(id: number) {
        this.LoadDetails(id, 'Delete');
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = "";
        this.errorMessage = null;
        this.RemoveSOIDfromtheList()
        this.model = new FinishedDispensing();
        this.Detmodel = new FinishedStoreDetail();
        this.finDetails = [];
        this.stillSaving = false
        this.basicform.reset();
    }
    RemoveSOIDfromtheList() {
        var index = this.SOList.findIndex(a => a.SOID == this.model.SOID)
        this.SOList.splice(index, 1);
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;
        this.model.RecYear = new Date().getFullYear();
        // this.model.SOID = this.basicform.controls['soID'].value
        if (this.finDetails.length == 0) {
            hf.handleError('Must Add some Products First')
            this.stillSaving = false
            return;
        }
        this.RemoveSOIDfromtheList()
        switch (this.Formstate) {
            case 'Create':
                this.srvDisp.insertDispensing(this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.srvDisp.updateDispensing(this.model.FinDispensingID, this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.srvDisp.deleteDispensing(this.model.FinDispensingID).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;

            default:
                break;
        }
    }

    SortTable(column: string) {
        if (this.orderbyString.indexOf(column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-asc";
            this.orderbyString = '+' + column;
        } else if (this.orderbyString.indexOf('-' + column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-desc";
            this.orderbyString = '-' + column;
        } else {
            this.orderbyClass = 'fa fa-sort';
            this.orderbyString = '';
        }
    }
    onRecDatechange(value) {
        if (value) {
            this.model.DispensingDate = value;
        }
    }
    onchkchange(value) {
        if (value) {
            this.basicform.controls['soID'].enable()
        } else {
            this.basicform.controls['soID'].disable()
        }
    }
    onSOIDchange(value) {
        if (!value || this.basicform.controls['chkSOID'].value == null) { return }
        this.srvSODet.getSalesFinishDetail(value).subscribe(sd => {
            this.finDetails = sd
            var selSo = this.SOList.filter(so => so.SOID == value)[0]
            this.model.DispenseTo = selSo.CustName + ' ' + selSo.ContactPerson
            this.finDetails.map(det => {
                det.RecordDate = new Date()
                // det.FinDispensingID = this.model.FinDispensingID
                det.UserID = this.currentUser.userID
                // det.BatchNo = 'Edit TO Fill This'
            })
        }, err => hf.handleError(err))
    }
    DeleteDetail(i: number) {
        this.finDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new FinishedStoreDetail()
        this.Detmodel.FinStoreID = this.finDetails[i].FinStoreID;
        this.Detmodel.FinDispensingID = this.finDetails[i].FinDispensingID;
        this.Detmodel.RecordDate = this.finDetails[i].RecordDate;
        this.Detmodel.RecYear = this.finDetails[i].RecYear;
        this.Detmodel.SerialNo = this.finDetails[i].SerialNo;
        this.Detmodel.ModelID = this.finDetails[i].ModelID;
        this.Detmodel.Quantity = this.finDetails[i].Quantity;
        this.Detmodel.BatchNo = this.finDetails[i].BatchNo;
        this.Detmodel.ColorID = this.finDetails[i].ColorID;
        this.Detmodel.StoreTypeID = this.finDetails[i].StoreTypeID;
        this.Detmodel.StoreType = this.finDetails[i].StoreType;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/finDisp', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
    StartSearch() {
        if (!this.selModID) return
        this.srvDisp.searchModelCode(this.selModID).subscribe(cols => this.collection = cols, err => hf.handleError(err))
    }
    ResetSearch() {
        this.reset = true
        this.selModID = undefined
        this.srvDisp.getDispensing().subscribe(cols => this.collection = cols, err => hf.handleError(err), () => this.reset = false)
    }
    modSearchSelect(value) {
        this.selModID = value
    }
}
