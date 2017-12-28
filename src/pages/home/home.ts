import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

declare var cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private sqlite: SQLite, public platform: Platform) {
    var test = this;    
    this.platform.ready().then(() => {
    this.sqlite.create({
      name: 'fiveshow.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        db.executeSql('create table if not exists profile(name VARCHAR(32),email VARCHAR(32),dob VARCHAR(32),id VARCHAR(32),logintype VARCHAR(32))', {})
          .then((data) => console.log('Table Created :',data))
          .catch(e => console.log(e));
        db.executeSql('select * from profile', {})
          .then((res) => {
            if(res.rows.length == 0)
            {
              test.navCtrl.setRoot('LoginPage');
            }
            else
            {
              sessionStorage.setItem('username',res.rows.item(0).name);
              sessionStorage.setItem('email',res.rows.item(0).email);
              sessionStorage.setItem('dob',res.rows.item(0).dob);
              sessionStorage.setItem('id',res.rows.item(0).id);
              sessionStorage.setItem('logintype',res.rows.item(0).logintype);
              test.navCtrl.setRoot('MenuPage');
            }
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
    });
      //this.navCtrl.setRoot('LoginPage');
  }

}
