import React, { Component, useCallback } from 'react';

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    BackHandler,
    Linking,
    SafeAreaView,
  } from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import referenciasList from '../raw/referencias.json';
import GameHelper from './GameHelper';
import * as Font from "expo-font";

const { height } = Dimensions.get('window');
const url_USP = "https://evosite.ib.usp.br/";
const url_UCMP = "http://www.ucmp.berkeley.edu/";
const url_BERKELEY = "https://evolution.berkeley.edu/";
const url_COROFLOT = "https://www.coroflot.com";
const url_PLANT = "https://plantconvergentevolution.weebly.com/convergent-evolution.html";
const url_FAPESP = "https://revistapesquisa.fapesp.br/";
const url_CIENCIA = "https://cienciahoje.org.br/";
const url_BIOLOGO = "http://biologoemcena.blogspot.com/";
const url_BIOMA = "http://nossobioma.blogspot.com/";
const url_EVOLUTION = "https://evolution.berkeley.edu/";
const url_PNAS = "https://www.pnas.org/";
const url_UFOP = "www.repositorio.ufop.br";
const url_SUPER = "https://super.abril.com.br/ciencia/conheca-o-blob-a-criatura-misteriosa-que-tem-720-sexos/";
const url_MOSQUITO = "http://amazonia.org.br/2014/04/mosquito-da-dengue-est%C3%A1-mais-forte-e-resistente-%C3%A0-inseticidas-segundo-pesquisador/";
const url_ROSALITO = "http://www.rosalito.com.br/";
const url_JABUTI = "http://www.espacojabuti.com.br/";
const url_NG = "https://blog.nationalgeographic.org/";
const url_DEPOSITO = "http://depositodabiologia.blogspot.com/";
const url_CIENCIANATURAL = "https://www.blogs.unicamp.br/cienciaaonatural/tag/evolucao/page/2/";
const url_DJALMA = "https://djalmasantos.wordpress.com/category/evolucao/";
const url_BRASILESCOLA = "https://exercicios.brasilescola.uol.com.br/exercicios-biologia/exercicios-sobre-filogenia.htm#questao-1";



class CreditosScreen extends Component {

    state = {
      screenHeight: 0,
    }

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        
        const referencias =  referenciasList.referencias;

        this.state = {
          referencias: referencias,
          fontLoaded: false,
          fontTitulo: GameHelper.getfontTituloSize(),
          fontText: GameHelper.getfontTextSize(),
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

    _renderQuizOption = ({item}) => (
      <View style={styles.quizOption}>
        <Text style={[styles.quizOptionDescription, {fontSize: this.state.fontText}]}>{item.name}</Text>
      </View>
    );

    _keyExtractor = (item, index) => index.toString();

    _onPressVoltar = () => {
        this.props.navigation.navigate ('Inicio');
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
      this.setState({ screenHeight: contentHeight });
    };

    render() {
      const scrollEnabled = this.state.screenHeight > height;

      const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
          // Checking if the link is supported for links with custom URL scheme.
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
          } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
          }
        }, [url]);
      
        return <View style={{marginTop: 10}}><Button title={children} onPress={handlePress} /></View>;
      };

      const getHeader = () => {
          return (
            <View>
            <View style={styles.quizDataContainer}>
              <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Aplicativo</Text>
              <Text style={[styles.text1, {fontSize: this.state.fontText}]}>
                Este aplicativo foi desenvolvido como parte do Mestrado da Professora Petronila Wanzeler Rodrigues, 
                sob orientação da Profa. Jussara M. M. Lemos (PROFBIO-UFPA).
              </Text>
            </View>
            <View style={styles.quizDataContainer}>
              <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Glossário</Text>
              <Text style={[styles.text1, {fontSize: this.state.fontText}]}>
                Os termos e definições do glossário foram obtidos da página da USP:
              </Text>
              <OpenURLButton url={url_USP}>evosite.ib.usp.br</OpenURLButton>
              <Text style={[styles.text1, {fontSize: this.state.fontText}]}>
                Tendo requerida autorização para publicação 
                neste app sem benefício financeiro de qualquer parte, uma vez que os direitos autorais pertencem ao Museu de Paleontologia 
                da Universidade da Califórnia (The University of California Museum of Paleontology – UCMP), em Berkeley e à junta de Regentes da 
                Universidade da Califórnia.
                Todos os materiais que aparecem nos servidores web do Museu de Paleontologia da Universidade da Califórnia (UCMP):
              </Text>
              <Text style={[styles.text1, {fontSize: this.state.fontText, marginTop: 10, fontStyle: 'italic'}]}>
                Understanding Evolution. 2020. University of California Museum of Paleontology. 
                24 August 2020.
                Copyright 2020 by The University of California Museum of Paleontology, Berkeley, and the Regents 
                of the University of California. All materials appearing on the UCMP Web Servers:
              </Text>
              <OpenURLButton url={url_UCMP}>ucmp.berkeley.edu</OpenURLButton>
              <OpenURLButton url={url_BERKELEY}>evolution.berkeley.edu</OpenURLButton>
              <Text style={[styles.text1, {fontSize: this.state.fontText}]}>
                Não podem ser reproduzidos ou armazenados em um sistema de recuperação de informações sem prévia permissão escrita do editor e em 
                nenhum caso, para lucro.
              </Text>
              <Text style={[styles.text1, {fontSize: this.state.fontText, marginTop: 10, fontStyle: 'italic'}]}>
                May not be reproduced or stored in a retrieval 
                system without prior written permission of the publisher and in no case for profit.
              </Text>
            </View>
            <View style={styles.quizDataContainer}>
              <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Imagens</Text>
              <OpenURLButton url={url_PNAS}>pnas.org</OpenURLButton>
              <OpenURLButton url={url_COROFLOT}>coroflot.com</OpenURLButton>
              <OpenURLButton url={url_ROSALITO}>rosalito.com.br</OpenURLButton>
              <OpenURLButton url={url_USP}>evosite.ib.usp.br</OpenURLButton>
              <OpenURLButton url={url_CIENCIA}>cienciahoje.org.br</OpenURLButton>
              <OpenURLButton url={url_JABUTI}>espacojabuti.com.br</OpenURLButton>
              <OpenURLButton url={url_EVOLUTION}>evolution.berkeley.edu</OpenURLButton>
              <OpenURLButton url={url_FAPESP}>revistapesquisa.fapesp.br</OpenURLButton>
              <OpenURLButton url={url_BIOMA}>nossobioma.blogspot.com</OpenURLButton>
              <OpenURLButton url={url_NG}>blog.nationalgeographic.org</OpenURLButton>
              <OpenURLButton url={url_BIOLOGO}>biologoemcena.blogspot.com</OpenURLButton>
              <OpenURLButton url={url_DEPOSITO}>depositodabiologia.blogspot.com</OpenURLButton>
              <OpenURLButton url={url_CIENCIANATURAL}>blogs.unicamp.br/cienciaaonatural</OpenURLButton>
              <OpenURLButton url={url_PLANT}>plantconvergentevolution.weebly.com</OpenURLButton>          
              <Text style={styles.textoReferencias}>Arthur Anker/Acervo Pessoal</Text>
              <Text style={styles.textoReferencias}>Pedro Peloso/Acervo Pessoal</Text>
              <Text style={styles.textoReferencias}>SADAVA, D. et al. Vida: a ciência da biologia. Porto Alegre: Artmed, 2009. Vol. II.</Text>
              <Text style={styles.textoReferencias}>REECE, Jane B. et al. Biologia de Campbell. Artmed Editora, 2015.</Text>
              <Text style={styles.textoReferencias}>RAVEN, P. Biologia Vegetal-7a Edição. Ed. 2014.</Text>
              <Text style={styles.textoReferencias}>LINHARES, Sérgio; GEWANDSZNAJDER, Fernando. Biologia hoje. São Paulo: Ática, v. 1, p. 2, 2010.</Text>
              <Text style={styles.textoReferencias}>CESAR, S. J. ; SEZAR, S. Biologia, Vol. 3. São Paulo: Saraiva, 2005. p. 255 e 260. </Text>
              <Text style={styles.textoReferencias}>AVANCINI E.; FAVARETTO, J. A. Biologia: uma abordagem evolutiva e ecológica, Vol. 2. São Paulo: Moderna, 1997. p. 177</Text>
            </View>
            <View style={styles.quizDataContainer}>
              <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Trechos de Textos</Text>
              <OpenURLButton url={url_USP}>Entendendo a Evolução</OpenURLButton>
              <OpenURLButton url={url_SUPER}>Revista Super Interessante</OpenURLButton>
              <OpenURLButton url={url_MOSQUITO}>Amazônia, Notícia e Informação</OpenURLButton>
              <OpenURLButton url={url_UFOP}>Repositório Institucional da UFOP</OpenURLButton>
              <Text style={styles.textoReferencias}>KELLNER, Alexander. O estudo dos répteis fósseis-cresce a contribuição da ciência brasileira. Ciência e Cultura, v. 67, n. 4, p. 32-39, 2015.</Text>
              <Text style={styles.textoReferencias}>FREIRE FILHO, Francisco Rodrigues. Feijão-caupi no Brasil: produção, melhoramento genético, avanços e desafios. Embrapa Meio-Norte-Livro científico (ALICE), 2011.</Text>
            </View>
            <View style={styles.quizDataContainer}>
              <Text style={[styles.titulo_palavra,{fontSize: this.state.fontTitulo}]}>Questões</Text>
              <OpenURLButton url={url_DJALMA}>Djalma Santos</OpenURLButton>
              <OpenURLButton url={url_BRASILESCOLA}>Brasil Escola</OpenURLButton>
            </View>
            </View>
          );
          
          
      };
        
      return (

            this.state.fontLoaded ? (

            
              <View style={styles.container}>
                  <LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
                      <TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
                          onPress={() => this._onPressVoltar() }>
                          <FontAwesome name="chevron-left" size={25} color="white" />
                      </TouchableOpacity>
                      <Text style = {styles.headerTitle}>Créditos</Text>
                      <Text style = {styles.headerTitle}></Text>
                  </LinearGradient>  
                    
                  <View style={styles.scrollArea}>
                    
                    <SafeAreaView style={{flex: 1}}>
                      <FlatList 
                      style={styles.quizOptions}
                      data={this.state.referencias}
                      renderItem={this._renderQuizOption}
                      keyExtractor={this._keyExtractor}
                      ListHeaderComponent={getHeader}
                      />
                    </SafeAreaView>
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

    quizOptionDescription: {
      flex: 1,
      padding: 12,
      color: '#000',
      //fontSize: 16, 
      fontWeight:'normal',
      justifyContent: 'center',
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
    
  });

AppRegistry.registerComponent('CreditosScreen', () => CreditosScreen);
export default CreditosScreen;
