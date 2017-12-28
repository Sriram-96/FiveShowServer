import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiveShowPage } from './five-show';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { NativeAudio } from '@ionic-native/native-audio';

@NgModule({
  declarations: [
    FiveShowPage,
  ],
  imports: [
    IonicPageModule.forChild(FiveShowPage),
    RoundProgressModule,
  ],
  providers: [
    NativeAudio
  ]
})
export class FiveShowPageModule {}
