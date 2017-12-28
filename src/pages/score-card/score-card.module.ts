import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreCardPage } from './score-card';

@NgModule({
  declarations: [
    ScoreCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreCardPage),
  ],
})
export class ScoreCardPageModule {}
