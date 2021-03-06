import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2CompleterModule } from "ng2-completer";

import { routing } from './finishStore.routing';
import { FinStoreHomeComponent, StoreBalanceComponent, BarcodeComponent, FinReceivingComponent, FinRecDetailsComponent,
  FinDispensingComponent, FinDispDetailsComponent, FinEqualizeComponent, FinEqualDetailsComponent,
  FinReturnComponent, FinReturnDetailsComponent, ModelSelectComponent, FinTransferComponent,
  FinTransDetailsComponent
} from './index';
import { FinStoreService, FinDetailService, FinReceivingService, FinDispensingService, SalesHeaderService, SalesDetailService,
  FinEqualizeService, FinRejectService, FinReturnService, FinTransferService } from '../../services';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, NgxPaginationModule, Ng2CompleterModule
  ],
  declarations: [
      FinStoreHomeComponent, StoreBalanceComponent, BarcodeComponent,
      FinReceivingComponent, FinRecDetailsComponent,
      FinDispensingComponent, FinDispDetailsComponent,
      FinEqualizeComponent, FinEqualDetailsComponent,
      FinReturnComponent, FinReturnDetailsComponent, ModelSelectComponent,
      FinTransferComponent, FinTransDetailsComponent
  ],
  providers: [
      FinStoreService, FinDetailService, FinReceivingService, FinDispensingService, SalesHeaderService, SalesDetailService,
      FinEqualizeService, FinRejectService, FinReturnService, FinTransferService
  ]
})
export class FinStoreModule { }
