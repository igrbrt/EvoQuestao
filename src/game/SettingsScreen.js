import React, { Component, useCallback } from 'react';

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    BackHandler
  } from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import GameHelper from './GameHelper';
import * as Font from "expo-font";

class SettingsScreen extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
          fontLoaded: false,
          fontTitulo:  GameHelper.getfontTituloSize(),
          fontText:   GameHelper.getfontTextSize(),
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        await Font.loadAsync({
            'mikadoblack': require('../fonts/mikadoblack.ttf'),
        });
        this.setState({ fontLoaded: true });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        // faz com que o botao de voltar do android nao faca nada, so da pra voltar pelo meu botao de voltar
		return true;
	}

    _onMinusButton = () => {
        if(this.state.fontTitulo == 20){
            this.refs.toast.show(<Text style={styles.toast}>Tamanho mínimo permitido!</Text>, DURATION.LENGTH_LONG);
        }else{
            this.setState({ fontTitulo: --this.state.fontTitulo });
            this.setState({ fontText: --this.state.fontText });
            GameHelper.lessfontTituloSize();
            GameHelper.lessfontTextSize();
            if(this.state.fontTitulo == 20){
                this.refs.toast.show(<Text style={styles.toast}>Tamanho: Normal</Text>, DURATION.LENGTH_LONG);
            }else if(this.state.fontTitulo == 22){
                this.refs.toast.show(<Text style={styles.toast}>Tamanho: Médio</Text>, DURATION.LENGTH_LONG);
            }
        }
    }

    _onPlusButton = () => {
        if(this.state.fontTitulo == 24){
            this.refs.toast.show(<Text style={styles.toast}>Tamanho máximo permitido!</Text>, DURATION.LENGTH_LONG);
        }else{
            this.setState({ fontTitulo: ++this.state.fontTitulo });
            this.setState({ fontText: ++this.state.fontText });
            GameHelper.plusfontTituloSize();
            GameHelper.plusfontTextSize();
            if(this.state.fontTitulo == 24){
                this.refs.toast.show(<Text style={styles.toast}>Tamanho: Grande</Text>, DURATION.LENGTH_LONG);
            }else if(this.state.fontTitulo == 22){
                this.refs.toast.show(<Text style={styles.toast}>Tamanho: Médio</Text>, DURATION.LENGTH_LONG);
            }
        }
    }

    _onPressVoltar = () => {
        this.props.navigation.navigate ('Inicio');
    }

    render() {  
          
        return (
  
              this.state.fontLoaded ? (
  
              
                <View style={styles.container}>
                    <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
                        <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
                            onPress={() => this._onPressVoltar() }>
                            <FontAwesome name="chevron-left" size={25} color="white" />
                        </TouchableOpacity>
                        <Text style = {styles.headerTitle}>Configurações</Text>
                        <Text style = {styles.headerTitle}></Text>
                    </LinearGradient>  
                      
                    <View style={styles.scrollArea}>
                        

                        <View style={styles.quizDataContainer}>
                            <Text style={[styles.titulo_palavra,{fontSize: 20}]}>Ajuste tamanho da fonte</Text>

                            <TouchableOpacity size={30} style={styles.acceptButton} onPress={this._onPlusButton}>
                                <FontAwesome name="plus" size={30} color="white"/>
                            </TouchableOpacity> 

                            <View style={styles.actionSeparator} />
                        
                            <TouchableOpacity size={30} style={styles.cancelButton} onPress={this._onMinusButton}>
                                <FontAwesome name="minus" size={30} color="white" />
                            </TouchableOpacity>
                            <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Título: {this.state.fontTitulo}</Text>
                            <Text style={[styles.text1, {fontSize: this.state.fontText}]}>Texto: {this.state.fontText}</Text>
                            
                            <Toast ref="toast" position='bottom' positionValue={150}/>
                            
                        </View>

                    </View>
                   
                </View>
              
  
              ): null
              
          );
      }


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
    },

    quizOption: {
      flex: 1,
      alignSelf: 'stretch',
      minHeight: 32,
      marginTop: 10,
      marginBottom: 4,
      backgroundColor: 'rgba(255, 255, 255,0.7)',
      borderRadius: 8,
      alignItems: 'center',
    },

    toast:{
        fontSize: 20, 
        color: 'white'
    },

    quizOptionDescription: {
      flex: 1,
      padding: 12,
      color: '#000',
      //fontSize: 16, 
      fontWeight:'normal',
      justifyContent: 'center',
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
        height : 10,
    },
  
    quizDataContainer : {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
      marginRight: 16,
    },

    scrollArea:{
      flex: 1,
      marginTop: Platform.OS === 'ios' ? '20%' : '20%',
    },
  
    imagem:{
      marginTop: Platform.OS === 'ios' ? '18%' : '16%',
      width: 64,
      height: 64,
    },
  
    botao:{
      padding: 10
    },

  
    titulo_palavra:{
      fontFamily: 'mikadoblack',
      //fontSize: 20,
      padding: 10,
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
      marginTop : 0,
      paddingBottom: 12,
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
  
    text1:{
      //fontSize: 18,
      justifyContent: 'center',
      textAlign: 'justify',
      paddingLeft: 10,
      paddingRight: 10,
    },

    textoReferencias:{
      fontSize: 18,
      justifyContent: 'center',
      textAlign: 'justify',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
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

AppRegistry.registerComponent('SettingsScreen', () => SettingsScreen);
export default SettingsScreen;