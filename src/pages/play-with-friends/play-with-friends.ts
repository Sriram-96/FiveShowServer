import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayWithFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-play-with-friends',
  templateUrl: 'play-with-friends.html',
})
export class PlayWithFriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayWithFriendsPage');
  }

  create() {
    this.navCtrl.push('CreateARoomPage');
  }

  join() {
    this.navCtrl.push('JoinARoomPage');
  } 
}
