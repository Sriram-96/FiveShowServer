import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateARoomPage } from './create-a-room';

@NgModule({
  declarations: [
    CreateARoomPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateARoomPage),
  ],
})
export class CreateARoomPageModule {}
