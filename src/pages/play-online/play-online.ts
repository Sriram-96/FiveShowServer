import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlayOnlinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-play-online',
  templateUrl: 'play-online.html',
})
export class PlayOnlinePage {
  public members: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.members = [
      {name: 'Sriram'},
      {name: 'Siva'},
      {name: 'Aravind'},
      {name: 'Saketh'}
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayOnlinePage');
  }

  start() {
    this.navCtrl.push('FiveShowPage');
  }

}
