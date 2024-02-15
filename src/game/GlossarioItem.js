import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import GameHelper from './GameHelper';
import HTMLView from 'react-native-htmlview';

class GlossarioItem extends PureComponent {

  constructor(props) {
    super(props);
    
    this.state = {  
      fontTitulo: GameHelper.getfontTituloSize(),
      fontText: GameHelper.getfontTextSize(),
    };
  }

  _onPress = () => {
    this.props.onPressItem(this.props.quizOption);
  };

  render() {
    const { quizOption } = this.props;

    return (
      
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.quizOption}>
            
            <HTMLView stylesheet={estilo(this.state.fontText)} value={'<p>' + quizOption.name + '</p>'}/> 
            {/*<Text style={[styles.quizOptionDescription, {fontSize: this.state.fontTitulo}]}>{quizOption.name}</Text>*/}
            
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
      padding: 12,
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
    fontFamily: 'mikadoblack',
  },

});

export default GlossarioItem;
