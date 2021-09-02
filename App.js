import { AppRegistry } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Jogo from './src/game/Jogo';
import Inicio from './src/game/Inicio';
import Ranking from './src/game/Ranking';
import QuizScreen from './src/game/QuizScreen';
import GlossarioScreen from './src/game/GlossarioScreen';
import GameBriefScreen from './src/game/GameBriefScreen';
import CreditosScreen from './src/game/CreditosScreen';
import SettingsScreen from './src/game/SettingsScreen';


const App = createSwitchNavigator(
  {
    Jogo: { screen: Jogo },
    Inicio: { screen: Inicio },
    Ranking: { screen: Ranking },
    QuizScreen : { screen: QuizScreen },
    SettingsScreen : {screen: SettingsScreen},
    CreditosScreen: {screen: CreditosScreen},
    GlossarioScreen: { screen: GlossarioScreen },
    GameBriefScreen: { screen: GameBriefScreen },
  },
  {
    initialRouteName: 'Inicio'
  }
);

export default createAppContainer(App);
AppRegistry.registerComponent('App', () => App);
