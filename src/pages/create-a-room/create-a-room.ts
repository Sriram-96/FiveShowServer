import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';

declare var cordova: any;
/**
 * Generated class for the CreateARoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-a-room',
  templateUrl: 'create-a-room.html',
})
export class CreateARoomPage {
  public members: any;
  public code: any;
  storageDirectory: string = '';
  public pic: any;
  public currentColor: any;
  public canStart: Boolean;
  public showQR: Boolean = false;
  public qrURL: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, public platform: Platform, private transfer: Transfer, private file: File) {
    this.showQR = false;
    this.currentColor = 'red';
    this.canStart = false;
    this.pic = 'assets/imgs/avatar.jpg';
    this.platform.ready().then(() => {
      if(!this.platform.is('cordova')) {
      }
      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
      }
      this.getUserImage();
    });
    this.getFriends().subscribe(users => {
      this.members = users;
      for(var i=0; i<this.members.length; i++)
      {
        if(this.members[i].color == 'red')
          break;
      }
      if(i==this.members.length)
        this.canStart = true;
      else
        this.canStart = false;
    });
    this.canDisconnect().subscribe(data => {
      this.socket.emit('leave-room',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'red',cardsInHand: [],score: -1,finalScore: []});   
      this.socket.disconnect();
      this.navCtrl.push('FiveShowPage',{from: 'CreatePage',userData: this.members,socket: this.socket});
    });
  }

  getUserImage() {
    var test = this;
    this.file.checkFile(this.storageDirectory, 'FiveShowProfile.jpg')
    .then(_ => {
      console.log('image found at ',test.storageDirectory + 'sriram.jpg');
      this.file.readAsDataURL(test.storageDirectory,'FiveShowProfile.jpg')
        .then(value => {
          test.pic = value;
          this.generateRandomCode();
        })
        .catch(err => {
          console.log('error is ',err);
          this.generateRandomCode();
        });
    })
    .catch(err => {
      console.log('error is ',err);
      this.generateRandomCode();
    });
  }

  getFriends() {
    let observable = new Observable(observer => {
      this.socket.on('joined', (users) => {
        observer.next(users);
      });
    })
    return observable;
  }

  canDisconnect() {
    let observable = new Observable(observer => {
      this.socket.on('canDisconnect', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  generateRandomCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(var i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.code = text;
    this.qrURL = "https://api.qrserver.com/v1/create-qr-code/?data=FiveShowQR_" + text;
    this.joinRoom();
  }

  joinRoom() {
    this.socket.connect();
    this.socket.emit('join-room',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'red',cardsInHand: [],score: -1,finalScore: []});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateARoomPage');
  }

  ionViewWillLeave() {
    
  }

  start() {
    this.socket.emit('start-game',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'green',cardsInHand: [],score: -1,finalScore: []});
  }

  qr() {
    this.showQR = !this.showQR;
  }

  ready() {
    if(this.currentColor == 'red')
    {
      this.socket.emit('ready',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'green',cardsInHand: [],score: -1,finalScore: []});        
      this.currentColor = 'green';      
    }
    else
    {
      this.socket.emit('ready',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'red',cardsInHand: [],score: -1,finalScore: []});        
      this.currentColor = 'red';      
    }
  }

}
