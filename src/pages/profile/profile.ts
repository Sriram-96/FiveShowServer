import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';
import { ModalController, ViewController } from 'ionic-angular';

declare var cordova: any;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public pic: any;
  storageDirectory: string = '';
  public name: any;
  public email: any;
  public dob: any;
  public id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private transfer: Transfer, private file: File, public viewCtrl: ViewController) {
    this.name = sessionStorage.getItem('username');
    this.email = sessionStorage.getItem('email');
    this.dob = sessionStorage.getItem('dob');
    this.id = sessionStorage.getItem('id');
    if(this.dob == 'undefined' || this.dob == '')
      this.dob = 'NA';
    this.platform.ready().then(() => {
      if(!this.platform.is('cordova')) {
        return false;
      }
      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        return false;
      }
      this.getUserImage();
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getUserImage() {
    var test = this;
    this.file.checkFile(this.storageDirectory, 'FiveShowProfile.jpg')
    .then(_ => {
      console.log('image found at ',test.storageDirectory + 'sriram.jpg');
      this.file.readAsDataURL(test.storageDirectory,'FiveShowProfile.jpg')
        .then(value => {
          test.pic = value;
        })
        .catch(err => {
          console.log('error is ',err);
        });
    })
    .catch(err => {
      console.log('error is ',err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
