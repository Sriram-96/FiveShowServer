import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';

declare var cordova: any;
/**
 * Generated class for the GuestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guest',
  templateUrl: 'guest.html',
})
export class GuestPage {
  public name: any;
  public email: any;
  public dob: any;
  storageDirectory: string = '';
  public imageSrc: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private camera: Camera, public platform: Platform, private transfer: Transfer, private file: File) {
    this.imageSrc = 'assets/imgs/avatar.jpg';
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
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestPage');
  }

  login() {
    this.sqlite.create({
      name: 'fiveshow.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        var rand = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
        db.sqlBatch(['delete from profile' , 'insert into profile values("'+ this.name + '","' + this.email + '","' + this.dob + '","' + rand + '","' + 'guest' +'")'])
          .then((data) => {
            console.log('Value Inserted :',data);
            sessionStorage.setItem('username',this.name);
            sessionStorage.setItem('email',this.email);
            sessionStorage.setItem('dob',this.dob);
            sessionStorage.setItem('id',rand);
            sessionStorage.setItem('logintype','guest');
            this.navCtrl.setRoot('MenuPage');
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
      //this.navCtrl.setRoot('MenuPage');
      //sessionStorage.setItem('username',this.name);
  }

  uploadFromCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 100,
      targetHeight: 100
    }
    this.camera.getPicture(options).then((imageData) => {
     const fileTransfer: TransferObject = this.transfer.create();
     console.log(imageData);
     const imageLocation = imageData;
     fileTransfer.download(imageLocation, this.storageDirectory + 'FiveShowProfile.jpg').then((entry) => {
       console.log('picture stored ',this.storageDirectory);
   }, (error) => {
       console.log('picture store error',error);
   });
   this.file.readAsDataURL(this.storageDirectory,'FiveShowProfile.jpg')
   .then(value => {
     this.imageSrc = value;
   })
   .catch(err => {
     console.log('error is ',err);
   });
    }, (err) => {
      console.log('Camera error');
    });
  }

  uploadFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 100,
      targetHeight: 100
    }
    this.camera.getPicture(options).then((imageData) => {
     const fileTransfer: TransferObject = this.transfer.create();
     console.log(imageData);
     const imageLocation = imageData;
     fileTransfer.download(imageLocation, this.storageDirectory + 'FiveShowProfile.jpg').then((entry) => {
       console.log('picture stored ',this.storageDirectory);
   }, (error) => {
       console.log('picture store error',error);
   });
   this.file.readAsDataURL(this.storageDirectory,'FiveShowProfile.jpg')
   .then(value => {
     this.imageSrc = value;
   })
   .catch(err => {
     console.log('error is ',err);
   });
    }, (err) => {
      console.log('Camera error');
    });
  }

}
