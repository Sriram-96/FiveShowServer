import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinARoomPage } from './join-a-room';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    JoinARoomPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinARoomPage),
  ],
  providers: [
    BarcodeScanner
  ]
})
export class JoinARoomPageModule {}
