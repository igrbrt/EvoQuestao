
import {
  AppRegistry,
} from 'react-native';

class GameHelper {

  constructor() {}

  static fontTituloSize = 20;
  static fontTextSize = 18; 
  static actualGame =  null;
  static indexGame =  null;
  static Player = '';
  static quizzes = [];
  static answers = [];
  static inicioGame = true;
  static coins = 0;
  static score = 0;
  static acertosConsecutivos = 0;
  static actualQuizIdx = -1;
  static position = 0;
  static n_teorias = 67;
  static n_sistematica = 62;
  static n_evidencias = 63;
  static count_teorias = 0;
  static count_sistematica = 0;
  static count_evidencias = 0;
  static quizzes_teorias = [];
  static quizzes_sistematica = [];
  static quizzes_evidencias = [];

  static getInicioGame(){
    return this.inicioGame;
  }

  static setInicioGame(flag){
    this.inicioGame = flag;
  }

  static setPlayer(nome){
    this.Player = nome;
  }

  static getPlayer(){
    return this.Player;
  }

  static plusfontTituloSize(){
    ++this.fontTituloSize;
  }

  static lessfontTituloSize(){
    --this.fontTituloSize;
  }

  static plusfontTextSize(){
    ++this.fontTextSize;
  }

  static lessfontTextSize(){
    --this.fontTextSize;
  }

  static getfontTituloSize(){
    return this.fontTituloSize;
  }

  static getfontTextSize(){
    return this.fontTextSize;
  }

  static setIndexGame (index) {
    return this.indexGame  = index;
  }

  static getIndexGame () {
    return this.indexGame;
  }

  static setActualGame (game) {
    return this.actualGame  = game;
  }

  static getActualGame () {
    return this.actualGame;
  }

  static setQuizzes (quizzes) {
    return this.quizzes  = quizzes;
  }

  static getQuizzes () {
    return this.quizzes;
  }

  static getCoins () {
    return this.coins;
  }

  static plusCoins () {
    return this.coins++;
  }

  static lessCoins () {
   return this.coins > 0 ? this.coins-- :  this.coins;
  }

  static plusAcertosConsecutivos(){
    ++this.acertosConsecutivos;
  }

  static resetAcertosConsecutivos(){
    this.acertosConsecutivos = 0;
  }

  static getAcertosConsecutivos(){
    return this.acertosConsecutivos;
  }

  static getScore () {
    return this.score;
  }

  static plusScore () {
    return this.score++;
  }

  static lessScore () {
    return this.score > 0 ? this.score-- : this.score;
  }

  static getActualQuiz () {

    const game = GameHelper.getActualGame();
    const quizIdx = GameHelper.getActualQuizIdx();
    const quiz = game.quizzes[quizIdx]; //

    return quiz;
  }

  static setActualQuizIdx (actualQuizIdx) {
    return this.actualQuizIdx  = actualQuizIdx;
  }

  static getActualQuizIdx () {
    return this.actualQuizIdx;
  }


  static generateQuizzes () {

    GameHelper.setQuizzes(GameHelper.getActualGame().quizzes);
    
    switch(this.indexGame){
      case 0: this.position = this.quizzes_teorias[this.count_teorias];
              this.count_teorias++;
              break;
      case 1: this.position = this.quizzes_sistematica[this.count_sistematica];
              this.count_sistematica++;
              break;
      case 2: this.position = this.quizzes_evidencias[this.count_evidencias];
              this.count_evidencias++;
              break;
      default: this.position = 0;
                
    }
    GameHelper.setActualQuizIdx(this.position);
  }

  /**
   * gera todas as posicoes de quizzes, embaralha (para ficar em ordem aleatoria), para depois pegar de uma por uma incrementalmente
   */
  static generateAleatoryQuizzes(){
    var i;
    for( i=0; i< this.n_teorias; i++ ){
      if( i < this.n_evidencias ){
        this.quizzes_evidencias.push(i);
      }
      if(i < this.n_sistematica ){
        this.quizzes_sistematica.push(i);
      }
      this.quizzes_teorias.push(i);
    }
    this.quizzes_evidencias = GameHelper.shuffle(this.quizzes_evidencias);
    this.quizzes_sistematica = GameHelper.shuffle(this.quizzes_sistematica);
    this.quizzes_teorias = GameHelper.shuffle(this.quizzes_teorias);
  }

  static shuffle(arra1) {
      var tam = arra1.length;
      var temp, index;
      var ctr = 0;
      while (ctr < arra1.length) {
          index = Math.floor(Math.random() * tam);
          temp = arra1[ctr];
          arra1[ctr] = arra1[index];
          arra1[index] = temp;
          ctr++;
      }
      return arra1;
  }


  static checkValidAnswer (quiz, quizOption) {
    if (quiz.quiz_option_code == quizOption.code) {
      return true;
    } else {
      return false;
    }
  }

  static updateQuizStatus (quizOption) {
    var quiz = GameHelper.getActualQuiz();
    this.answers[GameHelper.getActualQuizIdx()]  = GameHelper.checkValidAnswer(quiz, quizOption);
  }

  static isAnyQuizPending() {
    var retorno;
    switch(this.indexGame){
      case 0: retorno = (this.count_teorias - this.n_teorias) > 1 ? true : false;
      case 1: retorno =  (this.count_sistematica - this.n_sistematica) > 1 ? true : false;
      case 2: retorno =  (this.count_evidencias - this.n_evidencias) > 1 ? true : false;
      default: retorno = true;
    }
    return retorno;
  }

  static getCorrectAnswersCount () {
    var countCorrectAnswers = 0;
    for (let i = 0; i < this.answers.length; i++) {
      if (this.answers[i]) {
        countCorrectAnswers ++;
      }
    }
    return countCorrectAnswers;
  }

  static resetGame(){
    this.inicioGame = true;
    this.actualGame =  null;
    this.indexGame =  null;
    this.quizzes = [];
    this.answers = [];
    this.coins = 0;
    this.score = 0;
    this.actualQuizIdx = -1;
    this.position = 0;
    this.count_teorias = 0;
    this.count_sistematica = 0;
    this.count_evidencias = 0;
  }


}

AppRegistry.registerComponent('GameHelper', () => GameHelper);
export default GameHelper;
