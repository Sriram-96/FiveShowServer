import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayOnlinePage } from './play-online';

@NgModule({
  declarations: [
    PlayOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(PlayOnlinePage),
  ],
})
export class PlayOnlinePageModule {}
