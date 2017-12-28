import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ScoreCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-score-card',
  templateUrl: 'score-card.html',
})
export class ScoreCardPage {
  public userData: any;
  public temp: any[] = [];
  public total: number[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userData = this.navParams.get('userData');
    for(var i=0; i<this.userData[0].finalScore.length; i++)
      this.temp.push(i);
    var s = 0;
    for(i=0; i<this.userData.length; i++)
    {
      s = 0;
      for(var j=0; j<this.userData[i].finalScore.length; j++)
        s += this.userData[i].finalScore[j];
      this.total.push(s);
    }
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScoreCardPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
