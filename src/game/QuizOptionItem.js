import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import alternativas from './Alternativas.js';
import GameHelper from './GameHelper';

export default class QuizOptionItem extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      correto: 'darkgreen',
      errado: 'red',
      normal: 'rgba(255, 255, 255,0.9)',
      fontTitulo: GameHelper.getfontTituloSize(),
      fontText: GameHelper.getfontTextSize(),
    }
  }

  correto(){
    this.state.normal = 'darkgreen';
  }

  _onPress = () => {
    this.props.onPressItem(this.props.quizOption);
  };

  render() {
    const { quizOption } = this.props
    const {correto} = this.props
    let alternativa;
    if(quizOption.code == 1){
      alternativa = 'A) ';
    }else if(quizOption.code == 2){
      alternativa = 'B) ';
    }else if(quizOption.code == 3){
      alternativa = 'C) ';
    }else{
      alternativa = 'D) ';
    }

    return (
      <TouchableOpacity
        onPress={this._onPress}
      >
        <View style={[styles.quizOption, {backgroundColor: correto == quizOption.code ? this.state.correto : this.state.normal}]}>
          { quizOption.image == 1 && <Image style={[styles.quizImage]} source={alternativas[quizOption.code]} /> }
          {quizOption.image == 1 ? null : 
            <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>'+ alternativa + quizOption.description + '</p>'}/>  
          }
          
          {/*<Text style={[styles.quizOptionDescription, {fontSize: this.state.fontText}]}>
            {quizOption.code == 1 && 'A) '}
            {quizOption.code == 2 && 'B) '}
            {quizOption.code == 3 && 'C) '}
            {quizOption.code == 4 && 'D) '}
            {quizOption.description}
          </Text>*/}
          
          
        </View>
      </TouchableOpacity>
    );
  }
}

const estilo = function(tamanho) {
  return {
    p:{
      fontSize: tamanho,
      fontFamily: 'mikadoblack',
      textAlign: 'justify',
      padding: 8,
    },
    i:{
      fontFamily: 'mikadoblack-Italic',
    },
  }
}

const styles = StyleSheet.create({

  quizOption: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 32,
    marginTop: 10,
    marginBottom: 4,
    //backgroundColor: 'rgba(255, 255, 255,0.7)',
    borderRadius: 8,
    alignItems: 'center',
  },

  quizOptionDescription: {
    flex: 1,
    padding: 8,
    color: '#000',
    //fontSize: 15,
    fontWeight:'normal',
    textAlign: 'justify',
    justifyContent: 'center',
    fontFamily: 'mikadoblack',
  },

  quizImage: {
    width: 110,
    height: 60
  },

});
