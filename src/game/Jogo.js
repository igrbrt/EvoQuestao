import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Animated,
	Image,
	ImageBackground,
	TouchableOpacity,
	BackHandler,
	Alert,
	Modal,
} from 'react-native';

import ConfettiCannon from 'react-native-confetti-cannon';
import Toast, {DURATION} from 'react-native-easy-toast';
import {LinearGradient} from 'expo-linear-gradient';
import localGameList from '../raw/gamelist.json';
import { FontAwesome } from '@expo/vector-icons';
import RNExitApp from 'react-native-exit-app';
import GameHelper from './GameHelper';
import * as Font from "expo-font";
import { Audio } from 'expo-av';

const numberOfSegments = 6;
const oneTurn = 360;
const oneAngle = 60;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment;


class Jogo extends Component {

	static navigationOptions = {
		header: null
	}
	
  	_angle = new Animated.Value(0);
	angle = 0;
	anterior = 0;
	proximo = 0;
	giro = new Audio.Sound();
	//questao = new Audio.Sound();
	//aplausos = new Audio.Sound();
	  
	state = {
		enabled: true,
		finished: false,
		winner: null,
		fontLoaded: false,
	};
  
	constructor(props) {
		super(props);
		this.animatedValue = new Animated.Value(0);
		this.state = {
			loading: false,
			data: [],
			error: null,
			fontLoaded: false,
			bonus: false,
			inicioGame: GameHelper.getInicioGame(),
			primeiroAcerto: false,
			fontTitulo:  GameHelper.getfontTituloSize(),
			fontText:   GameHelper.getfontTextSize(),
			inativo: 0.3,
			ativo: 1,
			score: GameHelper.getScore(),
			coins: GameHelper.getCoins(),
			bronze: false,
			prata: false,
			ouro: false,
			campeao: false,
			animationValue : new Animated.Value(1),
		};

		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		//console.log(this.state.inicioGame);
	}

	async componentDidMount() {
		await Font.loadAsync({
			'mikadoblack': require('../fonts/mikadoblack.ttf'),
		});
		
		this.setState({ fontLoaded: true });
		
		this._angle.addListener(event => {
			if (this.state.enabled) {
				this.setState({
					enabled: false,
					finished: false
				});
			}

			this.angle = event.value;
		});

		this._makeLocalRequestForGameList();

		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	
		if((this.state.coins > 0 && this.state.inicioGame) || (this.state.score > 0 && this.state.inicioGame)){
			this.setState({ primeiroAcerto: true})
			GameHelper.setInicioGame(false);
			
			this.playAplausosSound();
			
		}
		if(GameHelper.acertosConsecutivos == 3){
			this.setState({ bonus: true });
			GameHelper.resetAcertosConsecutivos();

			
			this.playAplausosSound();
			
			
			GameHelper.plusCoins();
			GameHelper.plusCoins();
			GameHelper.plusCoins();
			this.setState({ coins: GameHelper.getCoins(),});
		}
		if(this.state.score == 10){ // medalha de bronze
			this.playAplausosSound();
			this.startScaleAnimation();
			this.setState({ bronze: true});
		}else if(this.state.score == 30){ // medalha de prata
			this.playAplausosSound();
			this.startScaleAnimation();
			this.setState({ prata: true});
		}else if(this.state.score == 50){ // medalha de prata
			this.playAplausosSound();
			this.startScaleAnimation();
			this.setState({ ouro: true});
		}else if(this.state.score == 120){ // medalha de prata
			this.playAplausosSound();
			this.startScaleAnimation();
			this.setState({ campeao: true});
		}
		
	}

	playGiroSound = async () => {
		this.giro = new Audio.Sound();
		try {
			await this.giro.loadAsync(require('../sounds/spiral.mp3'));
			await this.giro.playAsync();
		} catch (error) {
			await this.giro.unloadAsync();
			this.giro.setOnPlaybackStatusUpdate(null);
			this.retryPlayGiroSound();
		}
	};

	retryPlayGiroSound = () => this.playGiroSound();

	playQuestaoSound = async () => {
		let questao = new Audio.Sound();
		try {
			await questao.loadAsync(require('../sounds/questao.mp3'));
			await questao.playAsync();
		} catch (error) {
			await questao.unloadAsync();
			questao.setOnPlaybackStatusUpdate(null);
			this.retryPlayQuestaoSound();
		}
	};

	retryPlayQuestaoSound = () => this.playQuestaoSound();

	playAplausosSound = async () => {
		let aplausos = new Audio.Sound();
		try {
			await aplausos.loadAsync(require('../sounds/aplausos.mp3'));
			await aplausos.playAsync();
		} catch (error) {
			await aplausos.unloadAsync();
			aplausos.setOnPlaybackStatusUpdate(null);
			this.retryPlayAplausosSound();
		}
	};

	retryPlayAplausosSound = () => this.playAplausosSound();

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	_makeLocalRequestForGameList = () => {

		this.setState({ loading: true });

		this.setState({ error: null });
		this.setState({ gameList: localGameList.games });

		this.setState({ loading: false });

	};

	_getWinnerIndex = () => {
		const index = Math.abs((this.proximo % oneTurn) / oneAngle);
		var indice =  Math.floor(index); //> 1 ? Math.round(index) : 1;
		switch(indice){
			case 0: return 0;
			case 1: return 1;
			case 2: return 2;
			case 3: return 0;
			case 4: return 1;
			case 5: return 2;
			default: return (indice);
		}
	};

	handleBackButtonClick() {
		BackHandler.exitApp();
	}

	_onExitButton = () =>{
		Alert.alert(
			'Aten????o',
			'Deseja realmente sair?',
			[
			  {text: 'N??o', onPress: () => null},
			  {text: 'Sim', onPress: () => BackHandler.exitApp()},
			],
			{ cancelable: false }
		  )
	}

	selectArea = async () => {
		
		GameHelper.setActualGame(localGameList.games[this.state.winner]); //
		GameHelper.setIndexGame(this.state.winner); //
		if(GameHelper.isAnyQuizPending()){
			setTimeout(
				() => {
				this.props.navigation.navigate('GameBriefScreen',{}); 
				
				this.playQuestaoSound();
				
				},
				1000
			);
		}else{
			if(this.state.score == 120){
				this.refs.toast.show('Voc?? zerou o jogo! Para continuar reinicie o game!', DURATION.LENGTH_LONG);
			}else{
				this.refs.toast.show('Voc?? j?? dominou esta categoria, rode novamente!', DURATION.LENGTH_LONG);
			}
		}
	};


	rotateWheel = async () =>
	{
		
		this.playGiroSound();

		const aleatorio = Math.floor(Math.random() * (oneTurn - 1)) + 1;
		this.anterior = this.proximo + aleatorio;
		this.proximo = Math.abs(Math.floor(aleatorio * numberOfSegments)) + 1800;
		this.proximo = this.proximo + this.anterior;
		Animated.timing(this._angle, {
			toValue: this.proximo,
			duration: 1500
		}).start(() => {
			const winnerIndex = this._getWinnerIndex();
			this.setState({
			  enabled: true,
			  finished: true,
			  winner: winnerIndex
			});
			
			this.giro.stopAsync();
			this.selectArea();
			
		});

	}

	_renderPrimeiroAcerto = () => {
  
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.primeiroAcerto)}
			>
			
			  <View style={styles.card}>
				  
				<ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
				<Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>Parab??ns</Text>
				<View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
				<FontAwesome name="child" size={30} color={'#9900ef'}/>
				<Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>Voc?? acertou a primeira quest??o!</Text>
				<Text style = {[styles.textAnimation, {color: '#0693e3', fontSize: this.state.fontText}]}>REGRAS</Text>
				
				<View style={{flexDirection: 'row'}}>
					<Text style = {[styles.textAnimation,{fontSize: this.state.fontText}]}>Teorias Evolutivas:</Text>
					<Image source={require('../images/star.png')} style={{width: 35, height: 35}}/>
				</View>
				<View style={{flexDirection: 'row'}}>
					<Text style = {[styles.textAnimation, {fontSize: this.state.fontText}]}>Sistem??tica Filogen??tica:</Text>
					<Image source={require('../images/star.png')} style={{width: 35, height: 35}}/>
					<Image source={require('../images/star.png')} style={{width: 35, height: 35}}/>
				</View>
				<View style={{flexDirection: 'row'}}>
					<Text style = {[styles.textAnimation, {fontSize: this.state.fontText}]}>Evid??ncias da Evolu????o:</Text>
					<Image source={require('../images/coin.png')} style={{width: 35, height: 35}}/>
				</View>
				<Text style = {[styles.textAnimation, {color: '#ff6900', fontSize: this.state.fontText}]}>O que posso fazer com minhas moedas?</Text>
				<Text style = {[styles.textAnimation, {fontSize: this.state.fontText}]}>Pular tema de quest??o</Text>
				<Text style = {[styles.textAnimation, {color: '#ff6900', fontSize: this.state.fontText}]}>Para que servem as estrelas?</Text>
				<Text style = {[styles.textAnimation, {fontSize: this.state.fontText}]}>Desbloquear badges e zerar o jogo</Text>
				<View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 10 }} />
			  	<TouchableOpacity size={30} style={styles.closeButton} onPress={() => this.setState({ primeiroAcerto: false })}>
					<FontAwesome name="close" size={30} color={'#ff0004'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	_renderBonus = () => {
  
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.bonus)}
			>
			
			  <View style={styles.card}>
			  <ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
			  <Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>B??nus</Text>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
			  <FontAwesome name="gift" size={30} color={'#9900ef'}/>
			  <Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>Voc?? acertou 3 quest??es consecutivas!</Text>
			
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Reivindicar Pr??mio</Text>
			  <View style={{flexDirection: 'row', marginTop: 20}}>
				<Image source={require('../images/coin.png')} style={styles.coinBonus}/>
				<Image source={require('../images/coin.png')} style={styles.coinBonus}/>
				<Image source={require('../images/coin.png')} style={styles.coinBonus}/>
			  </View>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
			  	<TouchableOpacity size={30} style={[styles.closeButton, {backgroundColor: '#2ecc71'}]} onPress={() => this.setState({ bonus: false })}>
					<FontAwesome name="check" size={30} color={'#fff'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	_renderBronze = () => {
		const animatedStyleZoom = {
 
			transform : [
			  {
				scale : this.state.animationValue
			  }
			]
	   
		  }
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.bronze)}
			>
			
			  <View style={styles.card}>
			  <ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
			  <Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>Bagde Desbloqueado</Text>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
			  <FontAwesome name="gift" size={30} color={'#9900ef'}/>
			  <Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>MEDALHA DE BRONZE</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Voc?? atingiu 10 estrelas</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Reivindicar Pr??mio</Text>
			  <View style={{flexDirection: 'row', marginTop: 20}}>
			  	<Animated.View style={[animatedStyleZoom]}>
					<Image source={require('../images/10_pts.png')} style={styles.coinBonus}/>
				</Animated.View>
			  </View>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
			  	<TouchableOpacity size={30} style={[styles.closeButton, {backgroundColor: '#2ecc71'}]} onPress={() => this.setState({ bronze: false})}>
					<FontAwesome name="check" size={30} color={'#fff'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	_renderPrata = () => {
		const animatedStyleZoom = {
 
			transform : [
			  {
				scale : this.state.animationValue
			  }
			]
	   
		  }
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.prata)}
			>
			
			  <View style={styles.card}>
			  <ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
			  <Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>Bagde Desbloqueado</Text>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
			  <FontAwesome name="gift" size={30} color={'#9900ef'}/>
			  <Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>MEDALHA DE PRATA</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Voc?? atingiu 30 estrelas</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Reivindicar Pr??mio</Text>
			  <View style={{flexDirection: 'row', marginTop: 20}}>
			  	<Animated.View style={[animatedStyleZoom]}>
					<Image source={require('../images/30_pts.png')} style={styles.coinBonus}/>
				</Animated.View>
			  </View>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
			  	<TouchableOpacity size={30} style={[styles.closeButton, {backgroundColor: '#2ecc71'}]} onPress={() => this.setState({ prata: false})}>
					<FontAwesome name="check" size={30} color={'#fff'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	_renderOuro = () => {
		const animatedStyleZoom = {
 
			transform : [
			  {
				scale : this.state.animationValue
			  }
			]
	   
		  }
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.ouro)}
			>
			
			  <View style={styles.card}>
			  <ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
			  <Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>Desbloqueadooooo</Text>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
			  <FontAwesome name="gift" size={30} color={'#9900ef'}/>
			  <Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>Bagde de Ouro</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Voc?? atingiu 50 estrelas</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Reivindicar Pr??mio</Text>
			  <View style={{flexDirection: 'row', marginTop: 20}}>
			  	<Animated.View style={[animatedStyleZoom]}>
					<Image source={require('../images/50_pts.png')} style={styles.coinBonus}/>
				</Animated.View>
			  </View>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
			  	<TouchableOpacity size={30} style={[styles.closeButton, {backgroundColor: '#2ecc71'}]} onPress={() => this.setState({ ouro: false })}>
					<FontAwesome name="check" size={30} color={'#fff'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	_renderCampeao = () => {
		const animatedStyleZoom = {
 
			transform : [
			  {
				scale : this.state.animationValue
			  }
			]
	   
		  }
		return (
		  <Modal
			animationType="slide"
			transparent={true}
			visible={(this.state.campeao)}
			>
			
			  <View style={styles.card}>
			  <ConfettiCannon count={200} origin={{ x: -10, y: 20 }} />
			  <Image source={require('../../assets/icon.png')} style={{width: 100, height: 100}}/>
			  <Text style = {[styles.headerTitleAnimacao,{color: '#eb144c'}]}>Campe??OoO</Text>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginBottom: 10 }} />
			  <FontAwesome name="trophy" size={30} color={'#9900ef'}/>
			  <Text style = {[styles.textAnimation, {color: '#2ecc71', fontSize: this.state.fontText}]}>PARAB??NS</Text>
			
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Voc?? zerou o JOGO!</Text>
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>E foi nomeado um especialista!</Text>
			  <View style={{flexDirection: 'row', marginTop: 20}}>
			  	<Animated.View style={[animatedStyleZoom]}>
					<Image source={require('../images/120_pts.png')} style={{width: 80, height: 80}}/>
				</Animated.View>
			  </View>
			  <View style={{ backgroundColor: 'grey', width: '80%', height: 1, marginTop: 20 }} />
			  <Text style = {[styles.textAnimation, {color: '#000', fontSize: this.state.fontText}]}>Tire um print e compartilhe com os amigos</Text>
			  	<TouchableOpacity size={30} style={[styles.closeButton, {backgroundColor: '#2ecc71'}]} onPress={() => this.setState({ campeao: false })}>
					<FontAwesome name="check" size={30} color={'#fff'}/>
				</TouchableOpacity>
			  </View>
		  </Modal>
		);
  
	}

	startScaleAnimation = () => {
		Animated.loop(
			Animated.sequence([
			Animated.timing(this.state.animationValue, {
				toValue: 1.5,
				duration: 500,
				delay: 1000
			}),
			Animated.timing(this.state.animationValue, {
				toValue: 1,
				duration: 500
			})
			]),
			{
			iterations: 10
			}
		).start();
	}

  
  render() {
    const interpolateRotation = this._angle.interpolate({
      inputRange: [-oneTurn, 0, oneTurn],//[0, 1],
      outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`], //['0rad', '10rad'],
    })
    const animatedStyle = {
      transform: [
        { rotate: interpolateRotation }
      ]
	}
	const YOLO = Animated.modulo(
		Animated.divide(
		  Animated.modulo(Animated.subtract(this._angle, angleOffset), oneTurn),
		  new Animated.Value(angleBySegment)
		),
		1
	  );
	const spinnerRotation = YOLO.interpolate({
		inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
		outputRange: ['0deg', '0deg', '0deg', '5deg', '0deg', '0deg'],
	  })
	const spinnerStyle = {
		transform: [
		  { rotate: spinnerRotation }
		]
	  }

    return (
	  
			this.state.fontLoaded ? (
			<View style={styles.principal}>
			<ImageBackground
				style = {styles.imageBackground}
				source = {require('../images/4.jpg')}
				resizeMode = "cover">
				
				<LinearGradient colors={['#48BCF2', '#3b9ac7', '#2386c7']} style={styles.gradient}>
					<TouchableOpacity style={styles.voltar} activeOpacity = { .1 }
						onPress={() => this.props.navigation.navigate ('Inicio', {}) }>
						<FontAwesome name="chevron-left" size={25} color="white" />
					</TouchableOpacity>
					<Text style = {styles.headerTitle}>EvoQuest??o</Text>
					<Text style = {styles.headerTitle}></Text>
				</LinearGradient>
        		
				<View style={styles.containerCoin}>
					<Text style = {styles.coinTitle}>{this.state.coins}</Text>
				</View>
				<Image source={require('../images/coin.png')} style={styles.coin}/>
				<View style={styles.containerStar}>
					<Text style = {styles.starTitle}>{this.state.score}</Text>
				</View>
				<Image source={require('../images/star.png')} style={styles.star}/>
				<View style={styles.container}>
					<TouchableOpacity activeOpacity = { .5 } onPress={ this.rotateWheel }>
						<View tyle={[styles.box]}>
							<Animated.View style={[animatedStyle]}>
								<Image source={require('../images/wheel.png')} style={styles.wheel}/>
							</Animated.View>
							<Animated.Image source={require('../images/spinner.png')} style={[spinnerStyle,styles.spinner]}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.rodape}>

					<View style={styles.trofeis}>
						<Image source={require('../images/10_pts.png')} style={{width: 40, height: 40, opacity: this.state.score < 10 ? this.state.inativo: this.state.ativo}}/>
						<Image source={require('../images/30_pts.png')} style={{width: 40, height: 40, marginLeft: 5, opacity: this.state.score < 30 ? this.state.inativo: this.state.ativo}}/>
						<Image source={require('../images/50_pts.png')} style={{width: 40, height: 40, marginLeft: 5, opacity: this.state.score < 50 ? this.state.inativo: this.state.ativo}}/>
						<Image source={require('../images/120_pts.png')} style={{width: 40, height: 40, marginLeft: 8, opacity: this.state.score < 120 ? this.state.inativo: this.state.ativo}}/>
					</View>

					<TouchableOpacity size={30} style={styles.exitButton} onPress={this._onExitButton}>
						<FontAwesome name="sign-out" size={30}/>
					</TouchableOpacity>
				</View>
				
				<Toast ref="toast" position='bottom' />
			</ImageBackground>
			 {this._renderPrimeiroAcerto()}
			 {this._renderBonus()}
			 {this._renderBronze()}
			 {this._renderPrata()}
			 {this._renderOuro()}
			 {this._renderCampeao()}
			</View>
			) : null
    );
  }
}

const styles = StyleSheet.create({
	principal:{
		flex: 1,
		flexDirection: 'column', //default
		paddingTop: 0,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: "center",
		justifyContent: "center",
		top: '5%',
	},
	box: {
    	backgroundColor: '#333',
    	alignItems: "center",
		justifyContent: "center",
		marginBottom: 40,
	},
	card: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		//marginTop: '6%',
		backgroundColor: 'white',
	},
	imageBackground : {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerContainer : {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignSelf: 'stretch',
		top: 0,
		position: 'absolute',
		backgroundColor : 'rgba(64, 64, 64,0.3)',
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
	headerTitleAnimacao:{
		fontSize: 32,
		fontFamily: 'mikadoblack',
	},
	textAnimation: {
		padding: 8,
		color: '#000',
		fontSize: 20,
		fontWeight:'normal',
		textAlign: 'justify',
		justifyContent: 'center',
		fontFamily: 'mikadoblack',
	},
	coin:{
		width: 50,
		height: 50,
		position: 'absolute',
		left: 10,
		top: 78,
	},
	coinBonus:{
		width: 50,
		height: 50,
	},
	containerCoin:{
		flex: 1,
		position: 'absolute',
		left: 15,
		top: 80,
		width: 105,
		height: 45,
		backgroundColor : 'rgba(64, 64, 64,0.3)',
		borderRadius: 20,
	},
	coinTitle:{
		color: "#fff",
		fontSize: 28,
		left: 55,
		top: 5,
		fontFamily: 'mikadoblack',
		textShadowColor:'gray',
		textShadowOffset:{width: 2, height: 2},
		textShadowRadius:2,
	},
	star:{
		width: 50,
		height: 50,
		position: 'absolute',
		right: 10,
		top: 78,
	},
	containerStar:{
		flex: 1,
		position: 'absolute',
		right: 28,
		top: 80,
		width: 92,
		height: 45,
		backgroundColor : 'rgba(64, 64, 64,0.3)',
		borderRadius: 20,
	},
	starTitle:{
		color: "#fff",
		fontSize: 28,
		left: 20,
		top: 5,
		fontFamily: 'mikadoblack',
		textShadowColor:'gray',
		textShadowOffset:{width: 2, height: 2},
		textShadowRadius:2,
	},
	trofeis:{
		flexDirection: 'row',
		backgroundColor : 'rgba(64, 64, 64,0.3)',
		padding: 8,
		borderRadius: 10,
		marginBottom: 10,
		marginLeft: 10,
	},
	rodape:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	text: {
		color: "#FFF",
	},
	wheel: {
		width: 300,
		height: 300,
	},
	spinner: {
		width: 52,
		height: 65,
		position: 'absolute',	
		alignSelf: 'center',
		top: 116
	},
	voltar:{
		top: Platform.OS === 'ios' ? '9%' : '9%',
		left: Platform.OS === 'ios' ? '25%' : '25%',
		width: 30,
		height: 35,
	},
	exitButton : {
		//flexDirection: 'row',
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignSelf: 'flex-end',
		alignItems: 'center', 
		backgroundColor: 'rgba(64, 64, 64,0.3)',
		borderRadius: 8,
		padding: 10,
		marginBottom: 10,
		marginRight: 10,
	},
	closeButton:{
		//flexDirection: 'row',
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center', 
		backgroundColor: 'rgba(64, 64, 64,0.3)',
		borderRadius: 30,
		padding: 10,
		marginTop: 40,
		//marginRight: 10,
	},
});

AppRegistry.registerComponent('Jogo', () => Jogo);
export default Jogo;
