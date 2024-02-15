import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
	ImageBackground,
  TouchableOpacity,
  Platform,
  TextInput,
  View,
  Modal,
  Alert,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import GameHelper from './GameHelper';
import * as Font from "expo-font";


class Inicio extends Component {
  
  static navigationOptions = {
		header: null
  }
  
  constructor(props) {
    super(props);
    
		this.state = {
      fontLoaded: false,
      textInputData: '',
      getValue: '',
      popup: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'mikadoblack': require('../fonts/mikadoblack.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  

  _onPressPlay = () => {
    this.setState({ popup: true });
  };

  _onPressGlossario = () => {
    GameHelper.resetGame();
    this.props.navigation.navigate ('GlossarioScreen', {});
  };

  _onPressCreditos = () => {
    this.props.navigation.navigate ('CreditosScreen', {});
  };

  _onPressSettings = () => {
    GameHelper.resetGame();
    this.props.navigation.navigate ('SettingsScreen', {});
  };

  _onPressRanking = () => {
    GameHelper.resetGame();
    this.props.navigation.navigate ('Ranking', {});
  };

  saveValueFunction = () => {
    if (this.state.textInputData) {
      
      GameHelper.setPlayer(this.state.textInputData);

      this.setState({ textInputData: '' });

      this.setState({ popup: false });

      GameHelper.resetGame();
      GameHelper.generateAleatoryQuizzes();
      this.props.navigation.navigate ('Jogo', {}); 

    } else {
      Alert.alert(
        'Atenção',
        'Preencha seu nome!',
        [
          {text: 'Ok', onPress: () => this.setState({ popup: true })},
        ],
        { cancelable: false }
        )
    }
  };

  _renderBonus = () => {
  
		return (
		  <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={ () => this.setState({ popup: false })}
			visible={(this.state.popup)}
			>
        
			  <View style={[styles.MainContainer,{marginTop: '30%', borderRadius: 15}]}>
            <FontAwesome name="gamepad" size={40} color="#000" style={{alignSelf: 'center',}}/>
            <View style={{flexDirection: 'row'}}>
              <Text style = {[styles.texto, {textAlign: 'center'}]}>Digite seu nome</Text>
			      </View>
            <TextInput
              placeholder=""
              value={this.state.textInputData}
              onChangeText={data => this.setState({ textInputData: data })}
              underlineColorAndroid="transparent"
              style={styles.TextInputStyle}
            />
            <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
            <View style={[styles.actionsContainer]}>
              <TouchableOpacity size={30} style={styles.cancelButton} onPress={() => this.setState({ popup: false }) }>
                <FontAwesome name="close" size={30} color="white" />
                <Text style={[styles.texto_botao_sem_sombra, {marginLeft: 10}]}>Cancelar</Text>
              </TouchableOpacity>
              <View style={styles.actionSeparator} />
              <TouchableOpacity size={30} style={styles.acceptButton} onPress={this.saveValueFunction}>
                  <FontAwesome name="play" size={30} color="white"/>
                  <Text style={[styles.texto_botao_sem_sombra, {marginLeft: 10}]}>Jogar</Text>    
              </TouchableOpacity>
            </View>
        </View>
		  </Modal>
		);
  
	}

  render() {

    return (
      
      this.state.fontLoaded ? (

      <ImageBackground
					style = {styles.imageBackground}
					source = {require('../images/3.jpg')}
					resizeMode = "cover"
					>

          <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
            <Text style = {styles.headerTitle}>EvoQuizz</Text>
          </LinearGradient>
            {/* <View style={{marginTop: '40%'}}> */}
              <TouchableOpacity style={[styles.botao_jogar,styles.botao]} onPress={this._onPressPlay}>
                  <Text style={styles.texto_botao}>Jogar</Text>        
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao_ranking,styles.botao]} onPress={this._onPressRanking}>
                  <Text style={styles.texto_botao}>Ranking</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao_glossario,styles.botao]} onPress={this._onPressGlossario}>
                  <Text style={styles.texto_botao}>Glossário</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao_configuracoes,styles.botao]} onPress={this._onPressSettings}>
                  <Text style={styles.texto_botao}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao_creditos,styles.botao]} onPress={this._onPressCreditos}>
                  <Text style={styles.texto_botao}>Créditos</Text>
              </TouchableOpacity>
            {/* </View> */}
            {this._renderBonus()}
      </ImageBackground>

      ): null
      
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: '20%',
  },
  container_botao:{
    marginTop: 60,
  },
  imageBackground : {
		flex: 1,
    justifyContent: 'center',
	},
  gradient:{
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
    alignSelf: 'stretch',
    top: 0,
		position: 'absolute',
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

  botao:{
    width: '70%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },

  botao_jogar: {
    backgroundColor: 'rgba(46, 204, 113,0.9)',
  },

  botao_ranking:{
    marginTop: 10,
    backgroundColor: 'rgba(243, 56, 104,0.9)', //249, 85, 128
  },

  botao_glossario: {
    marginTop: 10,
    backgroundColor: 'rgba(35, 134, 199,0.9)',
  },

  botao_creditos: {
    marginTop: 10,
    backgroundColor: 'rgba(181, 174, 130,0.9)', //'rgba(210, 185, 243,0.9)', 'rgba(185, 164, 269,0.9)'
  },

  botao_configuracoes:{
    marginTop: 10,
    backgroundColor: 'rgba(185, 164, 269,0.9)', //'rgba(210, 185, 243,0.9)', 'rgba(185, 164, 269,0.9)'
  },

  texto_botao: {
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

  texto_botao_sem_sombra: {
    color: '#fff',
    fontSize: 20,
    fontWeight:'normal',
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'mikadoblack',
  },

  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  TextInputStyle: {
    textAlign: 'center',
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: 'grey',
    fontFamily: 'mikadoblack',
    fontSize: 20,
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

  actionSeparator : {
    width : 16,
  },

  texto: {
    flex: 1,
    padding: 8,
    color: '#000',
    fontSize: 20,
    fontWeight:'normal',
    textAlign: 'justify',
    justifyContent: 'center',
    fontFamily: 'mikadoblack',
  },

});

AppRegistry.registerComponent('Inicio', () => Inicio);
export default Inicio;