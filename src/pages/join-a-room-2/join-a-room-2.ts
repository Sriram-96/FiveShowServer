import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {File} from '@ionic-native/file';

declare var cordova: any;
/**
 * Generated class for the JoinARoom_2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-a-room-2',
  templateUrl: 'join-a-room-2.html',
})
export class JoinARoom_2Page {
  public members: any;
  public code: any;
  storageDirectory: string = '';
  public pic: any;
  public currentColor: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, public platform: Platform, private transfer: Transfer, private file: File) {
    this.currentColor = 'red';
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
      this.code = this.navParams.get('code');
    });
    this.getFriends().subscribe(users => {
      this.members = users;
    });
    this.startGame().subscribe(users => {
      this.socket.emit('leave-room',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'red',cardsInHand: [],score: -1,finalScore: []});      
      var i,j;
      for(i=0; i<this.members.length; i++)
        if(this.members[i].id == sessionStorage.getItem('id'))
          break;
      for(j=0;j<i;j++)
        this.members = this.arrayRotate(this.members, false);
      this.socket.disconnect();
      this.navCtrl.push('FiveShowPage',{from: 'JoinPage',userData: this.members,socket: this.socket});
    });
  }

  arrayRotate(arr, reverse){
    if(reverse)
      arr.unshift(arr.pop())
    else
      arr.push(arr.shift())
    return arr
  } 

  getUserImage() {
    var test = this;
    this.file.checkFile(this.storageDirectory, 'FiveShowProfile.jpg')
    .then(_ => {
      console.log('image found at ',test.storageDirectory + 'sriram.jpg');
      this.file.readAsDataURL(test.storageDirectory,'FiveShowProfile.jpg')
      .then(value => {
        test.pic = value;
        this.joinRoom();
      })
      .catch(err => {
        console.log('error is ',err);
        this.joinRoom();
      });
    })
    .catch(err => {
      console.log('error is ',err);
      this.joinRoom();
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

  startGame() {
    let observable = new Observable(observer => {
      this.socket.on('start-game', (users) => {
        observer.next(users);
      });
    })
    return observable;
  }

  joinRoom() {
    this.socket.connect();
    this.socket.emit('join-room',{name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.code,picture: this.pic,color: 'red',cardsInHand: [],score: -1,finalScore: []});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinARoom_2Page');
  }

  ionViewWillLeave() {
    
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
