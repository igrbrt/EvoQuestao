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
  BackHandler,
  ScrollView,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import glossarioList from '../raw/glossario.json';
import { FontAwesome } from '@expo/vector-icons';
import HTMLView from 'react-native-htmlview';
import GlossarioItem from './GlossarioItem';
import GameHelper from './GameHelper';
import * as Font from "expo-font";

class GlossarioScreen extends Component {

  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const glossario =  glossarioList.glossario;

    super(props);
    this.state = {
      glossario: glossario,
      isVisible: false,
      fontLoaded: false,
      actualWord: 0,
      fontTitulo: GameHelper.getfontTituloSize(),
      fontText: GameHelper.getfontTextSize(),
    };
    
  }

  async componentDidMount() {
    await Font.loadAsync({
      'mikadoblack': require('../fonts/mikadoblack.ttf'),
      'mikadoblack-Italic': require('../fonts/mikadoblack-Italic.otf'),
    });
    this.setState({ fontLoaded: true });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}


  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    
    return true;
  }

  _onPressOption = (quizOption) => {
    this.setState({ actualWord: quizOption.code });
    this.setState({ isVisible: true });    
};

  _renderQuizOption = ({item}) => (
    <GlossarioItem
      quizOption={item}
      onPressItem={this._onPressOption}
      />
  );

  _onPressVoltar = () => {
    if(GameHelper.getActualGame() != null){
      this.props.navigation.navigate ('QuizScreen'); 
    }else{
      this.props.navigation.navigate ('Inicio');
    }

  }

  _keyExtractor = (item, index) => index.toString();

  render() {
    
    return (
      
      this.state.fontLoaded ? (
        <View style={styles.container}>

          <ImageBackground
          style = {styles.imageBackground}
          source = {require('../images/3.jpg')}
          resizeMode = "cover"
          >
            <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
              <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
                onPress={() => this._onPressVoltar() }>
                <FontAwesome name="chevron-left" size={25} color="white" />
              </TouchableOpacity>
              <Text style = {styles.headerTitle}>Glossário</Text>
              <Text style = {styles.headerTitle}></Text>
            </LinearGradient>

            <View style={styles.quizDataContainer}>

              <FlatList
                style={styles.quizOptions}
                data={this.state.glossario}
                renderItem={this._renderQuizOption}
                keyExtractor={this._keyExtractor}
                onPressItem={this._onPressOption}
                scrollEnabled={true}
                />

            </View>

          </ImageBackground>

          <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.isVisible}
            >
          <View style={styles.modal}>
            <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
              <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
                onPress={() => this.setState({ isVisible: !this.state.isVisible }) }>
                <FontAwesome name="chevron-left" size={25} color="white" />
              </TouchableOpacity>
              <Text style = {styles.headerTitle}>Glossário</Text>
              <Text style = {styles.headerTitle}></Text>
            </LinearGradient>
            <ScrollView style={styles.scrollArea} scrollEnabled={true}>
              <Image style={styles.imagem} source = {require('../images/conversation.png')}></Image>
              <View style={styles.textos}>
                {/*<Text style={[styles.titulo_palavra, {fontSize: this.state.fontTitulo}]}>{this.state.glossario[this.state.actualWord].name}</Text>
                <Text style={[styles.text1, {fontSize: this.state.fontText}]}>{this.state.glossario[this.state.actualWord].description}</Text>*/}
                <HTMLView stylesheet={estilo(this.state.fontTitulo)} value={'<p>' + this.state.glossario[this.state.actualWord].name + '</p>'}/> 
                <HTMLView stylesheet={estilo(this.state.fontText)} value={'<div>' + this.state.glossario[this.state.actualWord].description + '</div>'}/> 
              </View> 
            </ScrollView>
          </View>   
          <View style={styles.botao}> 
          <TouchableOpacity
            onPress={() => this.setState({ isVisible: !this.state.isVisible })}
            style={styles.botao_voltar}>
            <Text style={styles.texto_botao_voltar}>Voltar</Text>
          </TouchableOpacity>
          </View>   
            
        </Modal>

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
      padding: 10,
    },
    i:{
      fontFamily: 'mikadoblack-Italic',
    },
    div:{
      fontSize: tamanho,
      textAlign: 'justify',
      padding: 10,
    },
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },

  quizDataContainer : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginTop: Platform.OS === 'ios' ? '14%' : '14%',
  },

  scrollArea:{
    flex: 1,
    marginTop: Platform.OS === 'ios' ? '18%' : '18%',
  },

  imagem:{
    marginTop: Platform.OS === 'ios' ? '5%' : '5%',
    width: 64,
    height: 64,
    alignSelf: 'center',
  },

  botao:{
    padding: 10
  },

  textos:{
    justifyContent: 'flex-start',
  },

  titulo_palavra:{
    fontFamily: 'mikadoblack',
    //fontSize: 20,
    padding: 10,
  },

  text1:{
    fontWeight: '300',
    //fontSize: 18,
    justifyContent: 'center',
    textAlign: 'justify',
    paddingLeft: 10,
    paddingRight: 10,
  },

  voltar:{
    top: Platform.OS === 'ios' ? '9%' : '9%',
		left: Platform.OS === 'ios' ? '25%' : '25%',
    width: 30,
    height: 35,
  },

  quizData: {
    padding: 16,
    marginBottom: 8,
    alignSelf: 'center',
    resizeMode: 'contain',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#fff',
    backgroundColor: '#fff',
    position: 'absolute',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  imageBackground : {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  headerContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 12,
    marginTop : 0,
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
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },

  quizOptions : {
    width : '100%',
    marginTop : 20, // antes era 40
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

AppRegistry.registerComponent('GlossarioScreen', () => GlossarioScreen);
export default GlossarioScreen;