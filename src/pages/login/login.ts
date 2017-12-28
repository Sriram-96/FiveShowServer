import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';

declare var cordova: any;
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public userData: any;
  storageDirectory: string = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: Facebook, private sqlite: SQLite, public platform: Platform, private transfer: Transfer, private file: File) {
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
    console.log('ionViewDidLoad LoginPage');
  }

  guest() {
    this.navCtrl.push('GuestPage');
  }

  facebook() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', res);
      this.fb.api('me?fields=id,name,birthday,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
      this.userData = {
        email: profile['email'], 
        first_name: profile['first_name'],
        last_name: profile['last_name'],
        picture: profile['picture_large']['data']['url'], 
        username: profile['name'],
        id: profile['id'],
        birthday: profile['birthday']
      }
      console.log('birthday',this.userData.birthday);
      var uname = this.userData.first_name + ' ' + this.userData.last_name;
      this.sqlite.create({
        name: 'fiveshow.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.sqlBatch(['delete from profile' , 'insert into profile values("'+ uname + '","' + this.userData.email + '","' + this.userData.birthday + '","' + this.userData.id + '","' + 'facebook' +'")'])
        .then((data) => {
              console.log('Value Inserted :',data);
              sessionStorage.setItem('username',this.userData.first_name + ' ' + this.userData.last_name);
              sessionStorage.setItem('email',this.userData.email);
              sessionStorage.setItem('id',this.userData.id);
              sessionStorage.setItem('dob',this.userData.birthday);
              sessionStorage.setItem('logintype','facebook');
              const fileTransfer: TransferObject = this.transfer.create();
              const imageLocation = this.userData.picture;
              fileTransfer.download(imageLocation, this.storageDirectory + 'FiveShowProfile.jpg').then((entry) => {
                console.log('picture stored ',this.storageDirectory);
                this.navCtrl.setRoot('MenuPage');
            }, (error) => {
                console.log('picture store error',error);
                this.navCtrl.setRoot('MenuPage');
            });
            })
            .catch(e => console.log(e));
        }).catch(e => console.log(e));
      })
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

}
