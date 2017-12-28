import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the JoinARoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-a-room',
  templateUrl: 'join-a-room.html',
})
export class JoinARoomPage {
  public code: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController,private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinARoomPage');
  }

  join() {
    this.navCtrl.push('JoinARoom_2Page',{code: this.code});
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
        if(barcodeData.text.substr(0,11) != 'FiveShowQR_')
        {
        let alert = this.alertCtrl.create({
          title: 'Scan Incorrect !',
          subTitle: 'Please scan the correct QR code shown on the other device',
          buttons: ['Dismiss']
        });
        alert.present();
        }
        else
        {
          this.navCtrl.push('JoinARoom_2Page',{code: barcodeData.text.substr(11)});
        }
     }, (err) => {
        console.log(err);
        let alert = this.alertCtrl.create({
          title: 'Plugin Error !',
          subTitle: 'Error in Barcode Scanner Plugin. Please try again later.',
          buttons: ['Dismiss']
        });
        alert.present();
     });
  }

}
