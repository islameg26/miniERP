import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2CompleterModule } from "ng2-completer";
// import { CustomMaterialModule } from '../customMaterial.module'

import { routing } from './sales.routing';
import {
	Sales, CustomerComponent, SalesOrderComponent, SalesHeaderComponent,
	SalesRepComponent, SalesDetailComponent, SalesPaymentComponent,
	PaymentComponent, CommissionComponent
} from './index';
import { CustomerService, SalesDetailService, SalesHeaderService, SalesPaymentService, SalesRepService, FinDetailService } from '../../services';
import { PipeModule } from '../../pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule, FormsModule, ReactiveFormsModule,
		NgaModule, routing, NgxPaginationModule, Ng2CompleterModule
	],
	declarations: [
		Sales, SalesOrderComponent, SalesHeaderComponent,
		CustomerComponent, SalesRepComponent, SalesDetailComponent,
		SalesPaymentComponent, PaymentComponent, CommissionComponent
	],
	providers: [
		CustomerService, SalesDetailService, SalesHeaderService,
		SalesPaymentService, SalesRepService, FinDetailService
	]
})
export class SalesModule { }
