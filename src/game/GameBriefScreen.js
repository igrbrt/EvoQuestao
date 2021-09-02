import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import { FontAwesome } from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import * as Font from "expo-font";

import GameHelper from './GameHelper';
import Images from './ImageCollection.js';
import { Audio } from 'expo-av';



class GameBriefScreen extends Component {

  //_isMounted = false;

  static navigationOptions = {
        header: null
    }

  state = {
    fontLoaded: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      fontText: GameHelper.getfontTextSize(),
		};

    //this.click = new Audio.Sound();
    //this.menos_dinheiro = new Audio.Sound();
    //this.sem_dinheiro = new Audio.Sound();
  }

  handleBackButtonClick() {
    // faz com que o botao de voltar do android nao faca nada
    return true;
  }
    
  async componentDidMount() {
    //this._isMounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    await Font.loadAsync({
			'mikadoblack': require('../fonts/mikadoblack.ttf'),
    });
    this.setState({ fontLoaded: true });
    //await this.click.loadAsync(require('../sounds/click.mp3'));
    //await this.menos_dinheiro.loadAsync(require('../sounds/menos_dinheiro.mp3'));
    //await this.sem_dinheiro.loadAsync(require('../sounds/sem_dinheiro.mp3'));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  playClickSound = async () => {
		click = new Audio.Sound();
		try {
			await click.loadAsync(require('../sounds/click.mp3'));
			await click.playAsync();
		} catch (error) {
			await click.unloadAsync();
			click.setOnPlaybackStatusUpdate(null);
			this.retryPlayClickSound();
		}
	};

  retryPlayClickSound = () => this.playClickSound();
  
  playMenosDinheiroSound = async () => {
		menos_dinheiro = new Audio.Sound();
		try {
			await menos_dinheiro.loadAsync(require('../sounds/menos_dinheiro.mp3'));
			await menos_dinheiro.playAsync();
		} catch (error) {
			await menos_dinheiro.unloadAsync();
			menos_dinheiro.setOnPlaybackStatusUpdate(null);
			this.retryPlayMenosDinheiroSound();
		}
	};

	retryPlayMenosDinheiroSound = () => this.playMenosDinheiroSound();

  playSemDinheiroSound = async () => {
		sem_dinheiro = new Audio.Sound();
		try {
			await sem_dinheiro.loadAsync(require('../sounds/sem_dinheiro.mp3'));
			await sem_dinheiro.playAsync();
		} catch (error) {
			await sem_dinheiro.unloadAsync();
			sem_dinheiro.setOnPlaybackStatusUpdate(null);
			this.retryPlaySemDinheiroSound();
		}
	};

  retryPlaySemDinheiroSound = () => this.playSemDinheiroSound();
  
  _onCancelButton = () => {
    if(GameHelper.getCoins() <= 0){
      this.refs.toast.show(<Text style={{fontSize: this.state.fontText, color: '#fff'}}>Você não tem moedas suficientes!</Text>, DURATION.LENGTH_LONG);
      this.playSemDinheiroSound();
    }else{
      GameHelper.lessCoins();
      this.playMenosDinheiroSound();
      this.props.navigation.navigate('Jogo');
    }
  }

  _onAcceptButton = () => {

    //  Create quiz List
    GameHelper.generateQuizzes ();

    this.playClickSound();

    //  Navigate to the first quiz
    this.props.navigation.navigate('QuizScreen');

  }

  render() {

    const game = GameHelper.getActualGame();
    
    return (
      
      this.state.fontLoaded ? (
        <LinearGradient colors={[game.color2, game.color1, game.color1]} style={{flex: 1}}>

          <View style={[styles.headerContainer]}>
            <Text style = {styles.headerTitle}>{game.name}</Text>
          </View>
          <View style={styles.gameDataContainer}>

            <View style={[ {borderColor: game.color2},styles.gameData]}>
              
              <Image style = {[{width: game.width, height: game.height}]} source={Images[game.code]}></Image>
              
            </View>

          </View>

          <Toast ref="toast" position='bottom' />

          <View style={[styles.actionsContainer]}>
            
            <TouchableOpacity size={30} style={styles.cancelButton} onPress={this._onCancelButton}>
              <FontAwesome name="dollar" size={30} color="white" />
              <Text style={styles.textoBotao}>Pular</Text>
            </TouchableOpacity>
            
            
            <View style={styles.actionSeparator} />
            
            <TouchableOpacity size={30} style={styles.acceptButton} onPress={this._onAcceptButton}>
              <FontAwesome name="play" size={30} color="white"/>
              <Text style={styles.textoBotao}>Jogar</Text>
              
            </TouchableOpacity>            

          </View>
        </LinearGradient>
      ) : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },

  gameDataContainer : {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gameData: {
    flex: 1,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 24,
    margin : 16,
    marginTop : 32,
    marginBottom : 62,
    borderWidth: 2,
    borderRadius: 18,
  },

  gameDescription : {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },

  actionsContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    margin : 8,

  },

  actionSeparator : {
    width : 16,
  },

  cancelButton : {
    flexDirection: 'row',
    width: 140,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#d33',
    borderRadius: 8,
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center', 
  },

  acceptButton : {
    flexDirection: 'row',
    width: 140,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',    
  },

  textoBotao: {
    fontSize: 20,
    marginLeft: 10,
    color: '#fff',
    fontFamily: 'mikadoblack',
  },

  headerContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
    paddingBottom: 12,
    margin : 8,
    marginTop : 36,
  },

  headerTitle : {
    fontWeight: '300',
    color: '#000',
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'mikadoblack',
    textAlign: 'center',
  },

});

AppRegistry.registerComponent('GameBriefScreen', () => GameBriefScreen);
export default GameBriefScreen;