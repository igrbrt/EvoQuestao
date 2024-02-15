import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight,
  ScrollView,
  AsyncStorage,
  Animated,
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import QuizOptionItem from './QuizOptionItem';
import GameHelper from './GameHelper';
//import localGameList from '../raw/gamelist.json';
import questoes from './Questoes.js';
import * as Font from "expo-font";
import { Audio } from 'expo-av';



class QuizScreen extends Component {
  
  
  img_ids_segunda_tela = [22, 27, 29, 33, 125, 126, 127, 128, 147, 153, 159, 160, 214, 216, 217, 218, 219, 221, 223, 224, 225, 
                          226, 227, 228, 229, 235, 236, 237, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 
                          254, 255, 256, 317, 318, 319, 320, 321, 322, 323, 326, 327, 329, 339, 340, 341, 359, 360, 361, 363];

  static navigationOptions = {
    header: null
  }

  state = {
    fontLoaded: false,
  };

  constructor (props) {

    super(props);

    const game = GameHelper.getActualGame(); // localGameList.games[0]; 
    const quiz = GameHelper.getActualQuiz(); //localGameList.games[0].quizzes[0]; 
    
    this.actualQuizOption = -1;
    this.state = {
      game: game,
      quiz: quiz,
      modalCorrectVisible: false,
      modalWrongVisible: false,
      isVisible: false,
      fontLoaded: false,
      fontTitulo: GameHelper.getfontTituloSize(),
      fontText: GameHelper.getfontTextSize(),
      correto: 0,
      animationValue : new Animated.Value(1),
    };

    //this.error = new Audio.Sound();
    //this.success = new Audio.Sound();
    this.startScaleAnimation();
  }

  startScaleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animationValue, {
          toValue: 1.5,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.animationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]),
      {
        iterations: 10
      }
    ).start();
	}

  async componentDidMount(){
    await Font.loadAsync({
      'mikadoblack': require('../fonts/mikadoblack.ttf'),
      'mikadoblack-Italic': require('../fonts/mikadoblack-Italic.otf'),
      'Lato-Bold': require('../fonts/Lato-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
    //await this.error.loadAsync(require('../sounds/errado.mp3'));
    //await this.success.loadAsync(require('../sounds/correto.mp3'));
  }

  _onPressOption = (quizOption) => {
      this.actualQuizOption = quizOption;
      this._checkValidAnswer(quizOption);
      this.setState({ correto: this.state.quiz.quiz_option_code});
  };

  playSucessSound = async () => {
		let success = new Audio.Sound();
		try {
			await success.loadAsync(require('../sounds/correto.mp3'));
			await success.playAsync();
		} catch (error) {
			await success.unloadAsync();
			success.setOnPlaybackStatusUpdate(null);
			this.retryPlaySucessSound();
		}
	};

  retryPlaySucessSound = () => this.playSucessSound();
  
  playErrorSound = async () => {
		let error = new Audio.Sound();
		try {
			await error.loadAsync(require('../sounds/errado.mp3'));
			await error.playAsync();
		} catch (erro) {
			await error.unloadAsync();
			error.setOnPlaybackStatusUpdate(null);
			this.retryPlayErrorSound();
		}
	};

	retryPlayErrorSound = () => this.playErrorSound();

  _checkValidAnswer = (quizOption) => {

    this.correctAnswer = GameHelper.checkValidAnswer (this.state.quiz, quizOption);

    if (this.correctAnswer) {

      this._setModalCorrectVisible();
      this.playSucessSound();
      if(this.state.game.code == 1){ // categoria 1 vale e 1 ponto, pois existem mais questoes
        
        GameHelper.plusScore();
      }else if(this.state.game.code == 2){ // categoria 2 vale e pontos
        GameHelper.plusScore();
        GameHelper.plusScore();

      }else{ // categoria 3 so vale moedas
         GameHelper.plusCoins();
      }

      GameHelper.plusAcertosConsecutivos();
      
      this._storeData();
      
      setTimeout(() => {
        this._hideModals();
        this.props.navigation.navigate('Jogo');
      }, 5000);


    } else {
      
      this._setModalWrongVisible();

      this.playErrorSound();

      GameHelper.resetAcertosConsecutivos();

      setTimeout(() => {
        this._hideModals();
        this.props.navigation.navigate('Jogo');
      }, 5000);     
      
    }

  }

  _storeData = async () => {
    try {
      var value = '';
      const user = GameHelper.getPlayer();
      const placar = GameHelper.getScore();
      for(let i = 1; i<= 5; i++){
        value = await AsyncStorage.getItem(i.toString());
        if (value !== null) { //se ja tem algum valor salvo
          var numero = value.split('-')[1];
          if(placar > numero){ // se o meu placar eh melhor
            await AsyncStorage.setItem(i.toString(), user + ' - ' + placar);
            if(i < 5){
              await AsyncStorage.setItem((i+1).toString(), value);
            }
            break;
          }
        }else{          
          await AsyncStorage.setItem(i.toString(), user + ' - ' + placar);
          break;
        }
      }
      
    } catch (error) {
      //console.log(error);
    }
  };

  _renderQuizOption = ({item}) => (
    <QuizOptionItem
      quizOption={item}
      onPressItem={this._onPressOption}
      correto={this.state.correto}   
      />
  );

  _keyExtractor = (item, index) => index.toString();

  _setModalCorrectVisible() {
    this.setState({modalCorrectVisible: true});
    this.setState({modalWrongVisible: false});
  }

  _setModalWrongVisible(visible) {
    this.setState({modalCorrectVisible: false});
    this.setState({modalWrongVisible: true});
  }

  _hideModals () {
    this.setState({modalCorrectVisible: false});
    this.setState({modalWrongVisible: false});
  }

  resposta = function(texto){
    if(texto == 'PARABÉNS'){
      return {
        color: 'darkgreen',
        justifyContent: 'center',
        fontSize: 54,
        fontFamily: 'mikadoblack',
        //textShadowColor:'#fff',
        //textShadowOffset:{width: 2, height: 2},
        //textShadowRadius:2,
        backgroundColor: '#fff',
        borderRadius: 20,
      }
    }
    else{
      return {
        color: 'red',
        justifyContent: 'center',
        fontSize: 34,
        fontFamily: 'mikadoblack',
        //textShadowColor:'#fff',
        //textShadowOffset:{width: 2, height: 2},
        //textShadowRadius:2,
        backgroundColor: '#fff',
        borderRadius: 20,
      }
    }
  }

  _renderQuizStatus = () => {

      //const image = (this.state.modalCorrectVisible) ? imageCorrect : imageWrong;

      const texto = (this.state.modalCorrectVisible) ? 'PARABÉNS' : 'TENTE NOVAMENTE';

      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={(this.state.modalCorrectVisible || this.state.modalWrongVisible)}
          >
          
            <View style={styles.statusContainer}>

              <TouchableHighlight
                  onPress={() => {
                    //this._hideModals();
                  }}>
                <Text style = {this.resposta(texto)}>{texto}</Text>
              </TouchableHighlight>

            </View>
        </Modal>
      );

  }

  renderElement(){
    let description_2 = this.state.quiz.description_2 == undefined ? '' : this.state.quiz.description_2;
    let description_3 = this.state.quiz.description_3 == undefined ? '' : this.state.quiz.description_3;

    if(this.img_ids_segunda_tela.indexOf(this.state.quiz.img_code) != -1){ // so imagem ou imagem e texto

      return (     

        <View style={styles.modal}>
          <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
            <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
              onPress={() => this.setState({ isVisible: !this.state.isVisible }) }>
              <FontAwesome name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
            <Text style = {styles.headerTitle}>Saiba Mais</Text>
            <Text style = {styles.headerTitle}></Text>
          </LinearGradient>
          <ScrollView style={styles.scrollArea} scrollEnabled={true}>
            <View style={styles.imagem_tela2}>
              <Image style={[{width: this.state.quiz.width, height: this.state.quiz.height}]} source={questoes[this.state.quiz.img_code]} ></Image>
            </View>
            <View style={styles.texto_quiz_description_2}>
              <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+ description_2 +'</p>'}/>
              <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+ description_3 +'</p>'}/>
              {/*<Text style = {[styles.quizDescription, {fontSize: this.state.fontText}]}>{this.state.quiz.description_2}</Text>
              <Text style = {[styles.quizDescription_2, {fontSize: this.state.fontText}]}>{this.state.quiz.description_3}</Text>*/}
            </View>
          </ScrollView>
        </View>
        
      );
    }else if(this.state.quiz.description_2 != ''){ // somente texto
      return (
        <View style={styles.modal}>
          <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
            <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
              onPress={() => this.setState({ isVisible: !this.state.isVisible }) }>
              <FontAwesome name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
            <Text style = {styles.headerTitle}>Saiba Mais</Text>
            <Text style = {styles.headerTitle}></Text>
          </LinearGradient>
          <ScrollView style={styles.scrollArea} scrollEnabled={true}>
            <View style={[styles.texto_quiz_description_2]}>
              <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+ description_2 +'</p>'}/>
              <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+ description_3 +'</p>'}/>
              {/*<Text style = {[styles.quizDescription, {fontSize: this.state.fontText}]}>{this.state.quiz.description_2}</Text>
              <Text style = {[styles.quizDescription_2, {fontSize: this.state.fontText}]}>{this.state.quiz.description_3}</Text>*/}
            </View>
          </ScrollView>
        </View>
      );
    }else{
      return null;
    }
  }

  _onPressGlossario = () => {
    this.setState({ isVisible: !this.state.isVisible });
    this.props.navigation.navigate('GlossarioScreen'); 
  };

  render() {

    let actualQuizNumber = GameHelper.getActualQuizIdx() + 1;
    let totalQuizNumber = GameHelper.getQuizzes().length;

    const animatedStyle = {
 
      transform : [
        {
          scale : this.state.animationValue
        }
      ]
 
    }

    const getHeader = () => {

      return (
        <View style={{marginBottom: 30}}>

            <View style={styles.question}>
              <View style={styles.quizData}>
                {/*<Text style = {[styles.quizDescription, {fontSize: this.state.fontText}]}>{this.state.quiz.description}</Text>*/}
               <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+this.state.quiz.description+'</p>'}/>
                {this.state.quiz.curiosidade == 1 ? 
                  // atribui o style do container de acordo com os itens
                  // quando so tem duvida, fica no canto direito
                  // quando tem imagem e duvida ficam espacadas
                  <View style={(this.state.quiz.width != 0 && this.state.quiz.img_tela_2 == 1) ? styles.so_duvida : styles.imagem_duvida}>
                    {this.state.quiz.img_tela_2 == 1 ? null :
                      <Image style={[{width: this.state.quiz.width, height: this.state.quiz.height, marginTop: 10, left: '25%'}]} source={questoes[this.state.quiz.img_code]} />
                    }
                    <TouchableOpacity activeOpacity = { .4 } onPress={ () => {this.setState({ isVisible: true, animationValue: new Animated.Value(1) });}}>
                    <View style={styles.duvida}>
                      <Animated.View style={[animatedStyle]}>
                        <Image style={[{width: 24, height: 24}]} source={require('../images/question.png')}/>
                      </Animated.View>
                    </View>
                    </TouchableOpacity>  
                  </View> :
                  // quando so tem imagem
                  <View style={styles.so_imagem}>
                    <Image style={[{width: this.state.quiz.width, height: this.state.quiz.height, marginTop: 10}]} source={questoes[this.state.quiz.img_code]} />
                  </View>
                }
              </View>
            </View>

        </View>
      );

    };

    return (

      this.state.fontLoaded ? (
      <View style={styles.container}>

        <ImageBackground
         style = {styles.imageBackground}
         source = {require('../images/5.jpg')}
         resizeMode = "cover"
        >

          <View style={styles.quizDataContainer}>

            <Modal
              animationType={'slide'}
              transparent={false}
              visible={this.state.isVisible}
              >

                {this.renderElement()}

                <View style={styles.botao}> 
                  <TouchableOpacity
                    onPress={() => this._onPressGlossario()}
                    style={styles.botao_voltar}>
                    <Text style={styles.texto_botao_voltar}>Glossário</Text>
                  </TouchableOpacity>
                </View> 
              
            </Modal>
            
                <FlatList
                  style={styles.quizOptions}
                  data={this.state.quiz.options}
                  renderItem={this._renderQuizOption}
                  keyExtractor={this._keyExtractor}
                  onPressItem={this._onPressOption}
                  extraData={this.state.correto}
                  ListHeaderComponent={getHeader}
                  />            
            
          </View>

        </ImageBackground>

        {this._renderQuizStatus()}
      </View>

       ) : null
    );

  }

}

const estilo = function(tamanho) {
  return {
    p:{
      fontSize: tamanho,
      fontFamily: 'mikadoblack',
      textAlign: 'justify',
    },
    i:{
      fontFamily: 'mikadoblack-Italic',
    },
  }
}

const styles = StyleSheet.create({
  p:{
    fontFamily: 'mikadoblack',
  },
  i:{
    fontFamily: 'mikadoblack-Italic',
  },
  container: {
    flex: 1,
    flexDirection: 'column', //default
    paddingTop: 0,
  },

  quizDataContainer : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginTop: Platform.OS === 'ios' ? '6%' : '6%',
  },

  quizOptions : {
    width : '100%',
    //marginTop : 100, // antes era 40
  },

  scrollArea:{
    flex: 1,
    marginTop: Platform.OS === 'ios' ? '18%' : '18%',
    //paddingTop: 20,
  },

  question:{
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center'
    //marginTop: 90, // antes era 20
    marginTop: Platform.OS === 'ios' ? '12%' : '12%',
    //marginBottom: '15%',
  },

  gradient:{
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignSelf: 'stretch',
		top: 0,
		position: 'absolute',
  },

  botao:{
    padding: 10,
  },

  imagem_tela2:{
    alignSelf: 'center',
    //justifyContent: 'center',
    //marginTop: Platform.OS === 'ios' ? '18%' : '15%',
    padding: 12,
  },

  voltar:{
    top: Platform.OS === 'ios' ? '9%' : '9%',
		left: Platform.OS === 'ios' ? '25%' : '25%',
    width: 30,
    height: 35,
  },

  imagem_duvida:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
  },

  so_imagem:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  so_duvida:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  duvida:{
    marginTop: 5,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  // container do enunciado da questao
  quizData: {
    minHeight: 120,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    alignSelf: 'center',
    resizeMode: 'contain',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#fff',
    backgroundColor: '#fff',
    //position: 'absolute',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  // texto enunciado da questao
  quizDescription : {
    color: '#000',
    //fontSize: 16, // antes era 20
    textAlign: 'justify', // antes era center
    fontFamily: 'mikadoblack',
  },

  quizDescription_2: {
    color: '#000',
    //fontSize: 16, // antes era 20
    textAlign: 'justify', // antes era center
    fontFamily: 'mikadoblack',
  },

  imageBackground : {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
  },

  headerTitle : {
    color: '#fff',
		fontSize: 32,
		textShadowColor:'gray',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
    fontFamily: 'mikadoblack',
    marginTop :  Platform.OS === 'ios' ? '6%' : '6%',
  },
  
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '25%',
  },

  texto_quiz_description_2:{
    justifyContent: 'flex-start',
    padding: 12,
  },

  //  Modal status
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    top: 100,
  },

  statusImage: {
    width: 120,
    height: 120,
  },

  botao_voltar: {
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(35, 134, 199,0.9)',
    borderRadius: 8,
  },

  texto_botao_voltar: {
    color: '#fff',
    fontSize: 20,
    fontWeight:'normal',
    textAlign: 'center',
    justifyContent: 'center',
    textShadowColor:'gray',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:0,
    fontFamily: 'mikadoblack',
  },
});

AppRegistry.registerComponent('QuizScreen', () => QuizScreen);
export default QuizScreen;