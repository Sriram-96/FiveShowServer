import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';
import { ModalController, ViewController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

declare var cordova: any;
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public username: any;
  public userData: any;
  public pic: any;
  storageDirectory: string = '';
  public logintype: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private transfer: Transfer, private file: File, public modalCtrl: ModalController, private fb: Facebook, private sqlite: SQLite) {
    this.username = sessionStorage.getItem('username');
    this.logintype = sessionStorage.getItem('logintype');
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

  profile() {
    let contactModal = this.modalCtrl.create(ProfilePage);
    contactModal.present();
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
    console.log('ionViewDidLoad MenuPage');
  }

  online() {
    this.navCtrl.push('FiveShowPage');
  }

  friends() {
    this.navCtrl.push('PlayWithFriendsPage');
  }

}
