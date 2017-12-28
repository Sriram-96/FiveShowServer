import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ProfilePage } from '../pages/profile/profile';
import { ScoreCardPage } from '../pages/score-card/score-card';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://192.168.0.105:3001', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    ScoreCardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    ScoreCardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidFullScreen,
    SQLite,
    Facebook,
    File,
    Camera,
    Transfer, TransferObject,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
