import React, { Component, useCallback } from 'react';

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    FlatList,
    AsyncStorage,
    Image,
  } from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import GameHelper from './GameHelper';
import * as Font from "expo-font";

class Ranking extends Component {

    static navigationOptions = {
        header: null
    }

    ranking = [];

    constructor(props) {
        super(props);        

        this.state = {
          fontLoaded: false,
          fontTitulo:  GameHelper.getfontTituloSize(),
          fontText:   GameHelper.getfontTextSize(),
          ranking_total: [],
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this._retrieveData();
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

    _onPressVoltar = () => {
        this.props.navigation.navigate ('Inicio');
    }

    _retrieveData = async () => {
        try {
            for(let i = 1; i<= 5; i++){
                const value = await AsyncStorage.getItem(i.toString());
                if (value !== null) {
                    this.ranking.push(value);
                }
            }
        } catch (error) {
          console.log(error);
        }
        this.setState({ ranking_total: this.ranking }); 
      };

    _renderQuizOption = ({item, index}) => (
        <View style={styles.quizOption}>
          {index == 0 && <FontAwesome name="child" size={35} color="#2ecc71" />}
          {index == 1 && <FontAwesome name="heart" size={35} color="#b80000" />}
          {index > 1 && <FontAwesome name="star" size={35} color="#fcb900" />}
          <Text style={[styles.quizOptionDescription, {fontSize: this.state.fontTitulo}]}>{item + ' pontos'}</Text>
        </View>
    );

    _keyExtractor = (item, index) => index.toString();

    

    render() {  

        const getHeader = () => {
            return (

                <View style={{alignItems: 'center'}}>
                    <Text style = {[styles.headerTitleAnimacao]}>Top Five</Text>
                     <View style={styles.estrelas}>
                        <Image source={require('../images/star.png')} style={styles.star}/>
                        <Image source={require('../images/star.png')} style={styles.star}/>
                        <Image source={require('../images/star.png')} style={styles.star}/>
                        <Image source={require('../images/star.png')} style={styles.star}/>
                        <Image source={require('../images/star.png')} style={styles.star}/>
                    </View>
                    <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 10, }} />
                </View>
            )
        };
          
        return (
  
              this.state.fontLoaded ? (
  
              
                <View style={styles.container}>
                    <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
                        <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
                            onPress={() => this._onPressVoltar() }>
                            <FontAwesome name="chevron-left" size={25} color="white" />
                        </TouchableOpacity>
                        <Text style = {styles.headerTitle}>Ranking</Text>
                        <Text style = {styles.headerTitle}></Text>
                    </LinearGradient>  
                      
                    <View style={styles.scrollArea}>

                        <FlatList 
                        style={styles.quizOptions}
                        data={this.state.ranking_total}
                        renderItem={this._renderQuizOption}
                        keyExtractor={this._keyExtractor}
                        ListHeaderComponent={getHeader}
                        />

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
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(64, 64, 64,0.3)'
    },

    estrelas:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 4,
    },

    quizOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 32,
      marginTop: 10,
      marginBottom: 4,
      backgroundColor: '#fff', //rgba(64, 64, 64,0.3)
      borderRadius: 8,
      padding: 5,
    },

    toast:{
        fontSize: 20, 
        color: 'white'
    },

    quizOptionDescription: {
      padding: 12,
      color: '#000',
      fontFamily: 'mikadoblack',
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
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Platform.OS === 'ios' ? '14%' : '14%',
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
    star:{
		width: 50,
		height: 50,
		//position: 'absolute',
		//right: 10,
		//top: 78,
    },
    headerTitleAnimacao:{
		fontSize: 32,
		fontFamily: 'mikadoblack',
	},
    
  });

AppRegistry.registerComponent('Ranking', () => Ranking);
export default Ranking;