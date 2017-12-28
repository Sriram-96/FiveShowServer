import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { ScoreCardPage } from '../score-card/score-card';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the FiveShowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-five-show',
  templateUrl: 'five-show.html',
})
export class FiveShowPage {
  public isShow: Boolean;
  public userData: any;
  public no: number;
  public cardsInDeck: number[] = [];
  public cardsInTable: number[] = [];
  public fromPage: any;
  public imagePath1: any;
  public imagePath2: any;
  public imagePath3: any;
  public imagePath4: any;
  public imagePath5: any;
  public highlightCard1: Boolean = false;
  public highlightCard2: Boolean = false;
  public highlightCard3: Boolean = false;
  public highlightCard4: Boolean = false;
  public highlightCard5: Boolean = false;
  public cardInTable1: any;
  public cardInTable2: any;
  public cardInTable3: any;
  public myTurn: Boolean;
  public sum: number;
  public correctPick: Boolean;
  public selectedCards: any[] = [];
  public timer: any;
  public currentTimer: number = 30;
  public showTimer: Boolean[] = [];
  public addedSum: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public socket: Socket, public modalCtrl: ModalController,private nativeAudio: NativeAudio) {
    this.isShow = true;
    this.myTurn = false;
    this.correctPick = false;
    this.sum = 0;
    this.selectedCards = [];
    this.userData = this.navParams.get('userData');
    this.fromPage = this.navParams.get('from');
    this.no = this.userData.length;
    for(var j=0; j<this.no; j++)
      this.showTimer.push(false);
    this.showTimer[0] = true;
    this.nativeAudio.preloadSimple('bell', 'assets/sounds/bell.wav').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.nativeAudio.preloadSimple('timer', 'assets/sounds/timer.mp3').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.socket.connect();
    this.socket.emit('join-room-2',{members: this.userData,name: sessionStorage.getItem('username'),id: sessionStorage.getItem('id'),roomCode: this.userData[0].roomCode,picture: '',color: 'green',cardsInHand: []});
    this.allUsersJoined().subscribe(data => {
      if(this.fromPage == 'CreatePage')
        this.shuffleAndAllocateCards();
    });
    this.someoneShow().subscribe(data => {
      console.log('Someone show !');
      this.userData = data['userData'];
      this.no = this.userData.length;
      var i,j;
      for(i=0; i<this.userData.length; i++)
        if(this.userData[i].id == sessionStorage.getItem('id'))
          break;
      for(j=0;j<i;j++)
        this.userData = this.arrayRotate(this.userData, false);
      let contactModal = this.modalCtrl.create(ScoreCardPage,{userData: this.userData});
      contactModal.onDidDismiss(data => {
        this.isShow = true;
        this.myTurn = false;
        this.correctPick = false;
        this.currentTimer = 30;
        if(this.fromPage == 'CreatePage')
        {
          this.shuffleAndAllocateCards();
        }
      });
      contactModal.present();
    });
    this.refreshCards().subscribe(cardsData => {
      this.nativeAudio.play('bell').then((res) => {console.log(res);}, (err) => {console.log(err);});
      this.showTimer = this.arrayRotate(this.showTimer, false);
      this.currentTimer = 30;
      this.selectedCards = [];
      this.correctPick = false;
      this.cardsInDeck = cardsData['cardsInDeck'];
      this.cardsInTable = cardsData['cardsInTable'];
      this.userData = cardsData['userData'];
      this.no = this.userData.length;
      this.cardInTable3 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-1]);
      this.cardInTable2 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-2]);
      this.cardInTable1 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-3]);
        var i,j;
        for(i=0; i<this.userData.length; i++)
          if(this.userData[i].id == sessionStorage.getItem('id'))
            break;
        for(j=0;j<i;j++)
        {
          this.userData = this.arrayRotate(this.userData, false);
          this.showTimer = this.arrayRotate(this.showTimer, false); 
        }
        this.showTimer = this.arrayRotate(this.showTimer, true);
        this.calculateSum();
        this.imagePath1 = this.convertCardToImage(this.userData[0].cardsInHand[0]);
        this.imagePath2 = this.convertCardToImage(this.userData[0].cardsInHand[1]);
        this.imagePath3 = this.convertCardToImage(this.userData[0].cardsInHand[2]);
        this.imagePath4 = this.convertCardToImage(this.userData[0].cardsInHand[3]);
        this.imagePath5 = this.convertCardToImage(this.userData[0].cardsInHand[4]);
    });
    this.nextTurn().subscribe(data => {
      if(data['id'] == sessionStorage.getItem('id'))
      {
        this.myTurn = true;
        this.nativeAudio.loop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
      }
    });
    var test = this;
    this.timer = setInterval(function() {
      test.currentTimer--;
      if(test.currentTimer < 0)
      {
        test.currentTimer = 30;
        if(test.showTimer[0])
        {
        test.nativeAudio.stop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
        test.addedSum += 10;
        test.highlightCard1 = test.highlightCard2 = test.highlightCard3 = test.highlightCard4 = test.highlightCard5 = false;
        test.calculateSum();
        test.selectedCards = [];
        test.correctPick = false;
        test.showTimer = test.arrayRotate(test.showTimer, false);
        this.nativeAudio.play('bell').then((res) => {console.log(res);}, (err) => {console.log(err);});
        test.socket.emit('send-cards',{userData: test.userData, cardsInDeck: test.cardsInDeck, cardsInTable: test.cardsInTable, roomCode: test.userData[0].roomCode});    
        if(test.userData.length == 1)
          test.socket.emit('next-turn',{id: test.userData[0].id,roomCode: test.userData[0].roomCode});
        else
          test.socket.emit('next-turn',{id: test.userData[1].id,roomCode: test.userData[0].roomCode});
        test.myTurn = false; 
        test.isShow = true;
        }
      }
    },1000);
  }

  cardSelected(n) {
    var i;
    if(n==1)
    {
      this.highlightCard1 = !this.highlightCard1;
      if(this.highlightCard1)
        this.selectedCards.push(n);
      else
      {
        for(i=0; i<this.selectedCards.length; i++)
          if(this.selectedCards[i] == n)
            this.selectedCards.splice(i,1);
      }
    }
    if(n==2)
    {
      this.highlightCard2 = !this.highlightCard2;
      if(this.highlightCard2)
        this.selectedCards.push(n);
      else
      {
        for(i=0; i<this.selectedCards.length; i++)
          if(this.selectedCards[i] == n)
            this.selectedCards.splice(i,1);
      }
    }
    if(n==3)
    {
      this.highlightCard3 = !this.highlightCard3;
      if(this.highlightCard3)
        this.selectedCards.push(n);
      else
      {
        for(i=0; i<this.selectedCards.length; i++)
          if(this.selectedCards[i] == n)
            this.selectedCards.splice(i,1);
      }
    }
    if(n==4)
    {
      this.highlightCard4 = !this.highlightCard4;
      if(this.highlightCard4)
        this.selectedCards.push(n);
      else
      {
        for(i=0; i<this.selectedCards.length; i++)
          if(this.selectedCards[i] == n)
            this.selectedCards.splice(i,1);
      }
    }
    if(n==5)
    {
      this.highlightCard5 = !this.highlightCard5;
      if(this.highlightCard5)
        this.selectedCards.push(n);
      else
      {
        for(i=0; i<this.selectedCards.length; i++)
          if(this.selectedCards[i] == n)
            this.selectedCards.splice(i,1);
      }
    }
    if(this.highlightCard1 || this.highlightCard2 || this.highlightCard3 || this.highlightCard4 || this.highlightCard5)
      this.isShow = false;
    else
      this.isShow = true;
    for(i=0; i<this.selectedCards.length-1; i++)
      if(this.getValueForACard(this.userData[0].cardsInHand[this.selectedCards[i]-1]) != this.getValueForACard(this.userData[0].cardsInHand[this.selectedCards[i+1]-1]))
        break;
    if(i!=this.selectedCards.length-1)
      this.correctPick = false;
    else
      this.correctPick = true;
    console.log(this.selectedCards);
  }

  arrayRotate(arr, reverse){
    if(reverse)
      arr.unshift(arr.pop())
    else
      arr.push(arr.shift())
    return arr;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiveShowPage');
  }

  refreshCards() {
    let observable = new Observable(observer => {
      this.socket.on('refresh-cards', (cardsData) => {
        observer.next(cardsData);
      });
    })
    return observable;
  }

  nextTurn() {
    let observable = new Observable(observer => {
      this.socket.on('next-turn', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  allUsersJoined() {
    let observable = new Observable(observer => {
      this.socket.on('allUsersJoined', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  someoneShow() {
    let observable = new Observable(observer => {
      this.socket.on('show', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  score() {
    let contactModal1 = this.modalCtrl.create(ScoreCardPage,{userData: this.userData});
    contactModal1.present();
  }

  shuffleAndAllocateCards() {
    this.nativeAudio.play('bell').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.nativeAudio.loop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.cardsInTable = [];
    this.cardsInDeck = [];
    for(var i=0; i<this.no; i++)
      this.userData[i].cardsInHand = [];
    for(i=1; i<=54; i++)
      this.cardsInDeck.push(i);
    this.cardsInDeck = this.shuffleArray(this.cardsInDeck);
    for(i=0; i<this.no; i++)
    {
      for(var j=0; j<5; j++)
        this.userData[i].cardsInHand.push(this.cardsInDeck.pop());
    }
    this.cardsInTable.push(this.cardsInDeck.pop());
    this.imagePath1 = this.convertCardToImage(this.userData[0].cardsInHand[0]);
    this.imagePath2 = this.convertCardToImage(this.userData[0].cardsInHand[1]);
    this.imagePath3 = this.convertCardToImage(this.userData[0].cardsInHand[2]);
    this.imagePath4 = this.convertCardToImage(this.userData[0].cardsInHand[3]);
    this.imagePath5 = this.convertCardToImage(this.userData[0].cardsInHand[4]);
    this.cardInTable3 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-1]);
    this.cardInTable2 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-2]);
    this.cardInTable1 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-3]);
    this.calculateSum();
    this.selectedCards = [];
    this.correctPick = false;
    this.socket.emit('send-cards',{userData: this.userData, cardsInDeck: this.cardsInDeck, cardsInTable: this.cardsInTable, roomCode: this.userData[0].roomCode});    
    this.myTurn = true;
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

  convertCardToImage(n) {
    var imagePath = 'assets/imgs/cards/';
    if(n==53)
      imagePath = imagePath + 'black_joker';
    else if(n==54)
      imagePath = imagePath + 'red_joker';
    else if(n%13==1)
    {
      if(n/13<1)
        imagePath = imagePath + 'ace_of_clubs';
      else if(n/13<2)
        imagePath = imagePath + 'ace_of_diamonds';
      else if(n/13<3)
        imagePath = imagePath + 'ace_of_hearts';
      else
        imagePath = imagePath + 'ace_of_spades';
    }
    else if(n%13==11)
    {
      if(n/13<1)
        imagePath = imagePath + 'jack_of_clubs';
      else if(n/13<2)
        imagePath = imagePath + 'jack_of_diamonds';
      else if(n/13<3)
        imagePath = imagePath + 'jack_of_hearts';
      else
        imagePath = imagePath + 'jack_of_spades';
    }
    else if(n%13==12)
    {
      if(n/13<1)
        imagePath = imagePath + 'queen_of_clubs';
      else if(n/13<2)
        imagePath = imagePath + 'queen_of_diamonds';
      else if(n/13<3)
        imagePath = imagePath + 'queen_of_hearts';
      else
        imagePath = imagePath + 'queen_of_spades';
    }
    else if(n%13==0)
    {
      if(n/13==1)
        imagePath = imagePath + 'king_of_clubs';
      else if(n/13==2)
        imagePath = imagePath + 'king_of_diamonds';
      else if(n/13==3)
        imagePath = imagePath + 'king_of_hearts';
      else
        imagePath = imagePath + 'king_of_spades';
    }
    else
    {
      if(n/13<1)
        imagePath = imagePath + n%13 + '_of_clubs';
      else if(n/13<2)
        imagePath = imagePath + n%13 + '_of_diamonds';
      else if(n/13<3)
        imagePath = imagePath + n%13 + '_of_hearts';
      else
        imagePath = imagePath + n%13 + '_of_spades';
    }
    imagePath = imagePath + '.svg';
    return imagePath;
  }

  calculateSum() {
    this.sum = this.addedSum;
    for(var i=0;i<this.userData[0].cardsInHand.length;i++)
      this.sum += this.getValueForACard(this.userData[0].cardsInHand[i]);
    this.userData[0].score = this.sum;
  }

  getValueForACard(n) {
    if(n==53 || n==54)
      return 0;
    else if(n%13==0)
      return 13;
    else
      return n%13;
  }

  pickFromDeck() {
    this.nativeAudio.stop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
    var droppedCard = [];
    if(this.highlightCard1)
      droppedCard.push(this.userData[0].cardsInHand[0]);
    if(this.highlightCard2)
      droppedCard.push(this.userData[0].cardsInHand[1]);
    if(this.highlightCard3)
      droppedCard.push(this.userData[0].cardsInHand[2]);
    if(this.highlightCard4)
      droppedCard.push(this.userData[0].cardsInHand[3]);
    if(this.highlightCard5)
      droppedCard.push(this.userData[0].cardsInHand[4]);
    if(this.highlightCard1)
      this.userData[0].cardsInHand[0] = -1;
    if(this.highlightCard2)
      this.userData[0].cardsInHand[1] = -1;
    if(this.highlightCard3)
      this.userData[0].cardsInHand[2] = -1;
    if(this.highlightCard4)
      this.userData[0].cardsInHand[3] = -1;
    if(this.highlightCard5)
      this.userData[0].cardsInHand[4] = -1;
    for(var i=0; i<this.userData[0].cardsInHand.length; i++)
      if(this.userData[0].cardsInHand[i] == -1)
      {
        this.userData[0].cardsInHand.splice(i,1);
        i--;
      }
    this.highlightCard1 = this.highlightCard2 = this.highlightCard3 = this.highlightCard4 = this.highlightCard5 = false;
    this.cardsInTable = this.cardsInTable.concat(droppedCard);
    var takenCard = this.cardsInDeck.pop();
    this.userData[0].cardsInHand.push(takenCard);
    this.cardInTable3 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-1]);
    this.cardInTable2 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-2]);
    this.cardInTable1 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-3]);
    this.imagePath1 = this.convertCardToImage(this.userData[0].cardsInHand[0]);
    this.imagePath2 = this.convertCardToImage(this.userData[0].cardsInHand[1]);
    this.imagePath3 = this.convertCardToImage(this.userData[0].cardsInHand[2]);
    this.imagePath4 = this.convertCardToImage(this.userData[0].cardsInHand[3]);
    this.imagePath5 = this.convertCardToImage(this.userData[0].cardsInHand[4]);
    this.calculateSum();
    this.selectedCards = [];
    this.correctPick = false;
    this.currentTimer = 30;
    this.showTimer = this.arrayRotate(this.showTimer, false);
    this.nativeAudio.play('bell').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.socket.emit('send-cards',{userData: this.userData, cardsInDeck: this.cardsInDeck, cardsInTable: this.cardsInTable, roomCode: this.userData[0].roomCode});    
    if(this.userData.length == 1)
      this.socket.emit('next-turn',{id: this.userData[0].id,roomCode: this.userData[0].roomCode});
    else
      this.socket.emit('next-turn',{id: this.userData[1].id,roomCode: this.userData[0].roomCode});
    this.myTurn = false; 
    this.isShow = true;
  }

  pickFromTable() {
    this.nativeAudio.stop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
    var droppedCard = [];
    if(this.highlightCard1)
      droppedCard.push(this.userData[0].cardsInHand[0]);
    if(this.highlightCard2)
      droppedCard.push(this.userData[0].cardsInHand[1]);
    if(this.highlightCard3)
      droppedCard.push(this.userData[0].cardsInHand[2]);
    if(this.highlightCard4)
      droppedCard.push(this.userData[0].cardsInHand[3]);
    if(this.highlightCard5)
      droppedCard.push(this.userData[0].cardsInHand[4]);
    if(this.highlightCard1)
      this.userData[0].cardsInHand[0] = -1;
    if(this.highlightCard2)
      this.userData[0].cardsInHand[1] = -1;
    if(this.highlightCard3)
      this.userData[0].cardsInHand[2] = -1;
    if(this.highlightCard4)
      this.userData[0].cardsInHand[3] = -1;
    if(this.highlightCard5)
      this.userData[0].cardsInHand[4] = -1;
    for(var i=0; i<this.userData[0].cardsInHand.length; i++)
      if(this.userData[0].cardsInHand[i] == -1)
      {
        this.userData[0].cardsInHand.splice(i,1);
        i--;
      }
    this.highlightCard1 = this.highlightCard2 = this.highlightCard3 = this.highlightCard4 = this.highlightCard5 = false;
    var takenCard = this.cardsInTable.pop();
    this.cardsInTable = this.cardsInTable.concat(droppedCard);
    this.userData[0].cardsInHand.push(takenCard);
    this.cardInTable3 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-1]);
    this.cardInTable2 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-2]);
    this.cardInTable1 = this.convertCardToImage(this.cardsInTable[this.cardsInTable.length-3]);
    this.imagePath1 = this.convertCardToImage(this.userData[0].cardsInHand[0]);
    this.imagePath2 = this.convertCardToImage(this.userData[0].cardsInHand[1]);
    this.imagePath3 = this.convertCardToImage(this.userData[0].cardsInHand[2]);
    this.imagePath4 = this.convertCardToImage(this.userData[0].cardsInHand[3]);
    this.imagePath5 = this.convertCardToImage(this.userData[0].cardsInHand[4]);
    this.calculateSum();
    this.selectedCards = [];
    this.correctPick = false;
    this.currentTimer = 30;
    this.showTimer = this.arrayRotate(this.showTimer, false);
    this.nativeAudio.play('bell').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.socket.emit('send-cards',{userData: this.userData, cardsInDeck: this.cardsInDeck, cardsInTable: this.cardsInTable, roomCode: this.userData[0].roomCode});    
    if(this.userData.length == 1)
      this.socket.emit('next-turn',{id: this.userData[0].id,roomCode: this.userData[0].roomCode});
    else
      this.socket.emit('next-turn',{id: this.userData[1].id,roomCode: this.userData[0].roomCode});
    this.myTurn = false; 
    this.isShow = true;
  }

  calculateFinalScore()
  {
    var min = 999, minIndexes = [],penalty=100;
    for(var i=0; i<this.userData.length; i++)
      if(this.userData[i].score<min)
        min = this.userData[i].score;
    for(i=0; i<this.userData.length; i++)
      if(this.userData[i].score == min)
        minIndexes.push(i);
    if(minIndexes.length > 1)
    {
      this.userData[0].finalScore.push(penalty);
      for(i=0; i<minIndexes.length; i++)
       if(minIndexes[i]!=0)
        this.userData[0].finalScore.push(0);
      for(i=0; i<this.userData.length; i++)
        if(this.userData[i].finalScore.length<this.userData[0].finalScore.length)
          this.userData[i].finalScore.push(this.userData[i].score);
    }
    else if(minIndexes[0] == 0)
    {
      this.userData[0].finalScore.push(0);
      for(i=1; i<this.userData.length; i++)
        this.userData[i].finalScore.push(this.userData[i].score);
    }
    else
    {
      this.userData[minIndexes[0]].finalScore.push(0);
      this.userData[0].finalScore.push(penalty);
      for(i=1; i<this.userData.length; i++)
        if(i != minIndexes[0])
          this.userData[i].finalScore.push(this.userData[i].score);
    }
  }

  show() {
    this.nativeAudio.stop('timer').then((res) => {console.log(res);}, (err) => {console.log(err);});
    this.calculateFinalScore();
    this.socket.emit('show',{userData: this.userData,roomCode: this.userData[0].roomCode});    
  }

}
