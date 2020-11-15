
import './App.css';
import React from 'react';

class Start extends React.Component{
  render() {
    return (
      <button className="StartGame" onClick={this.props.startGame}>Start</button>
    );
  }
}

class Clock extends React.Component {
  render() {
    return (
      <div className="Clock">Time: {this.props.time}</div>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <button className={this.props.highlighted.indexOf(this.props.index) !== -1 ? "Button Highlight" : "Button"} onClick={this.props.onClick}>
        <p>{this.props.number.toFixed(1)}</p>
      </button>
    );
  }
}

class ScoreDisplay extends React.Component {
  render() {
    return (
      <div className="ScoreDisplay">
        Score: {this.props.score}
      </div>
    );
  }
}

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
    //   buttons: this.randomizeButtons(),
    //   highlighted: [],
      playing: false
    };
    for (let i = 0; i < 1000; i++) {
      this.randomizeButtons();
    }

    this.randomizeButtons = this.randomizeButtons.bind(this);
    this.clickButton = this.clickButton.bind(this);
    this.startGame = this.startGame.bind(this);
    console.log(this.state.buttons);
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState(state => {
      if (state.time <= 1) {
        clearInterval(state.timerID);
      }
      return {
        time: state.time-1,
        playing: (this.state.time > 1)
      }
    });
  }

  startGame() {
    this.setState({
      score: 0,
      buttons: this.randomizeButtons(),
      highlighted: [],
      playing: true,
      time: 150,
      timerID: setInterval(() => this.tick(), 1000)
    })
  };

  clickButton(index) {
    this.setState(state => {
      let highlighted = [...state.highlighted];
      if (highlighted.length === 0) {
        highlighted.push(index);
      }
      else {
        let firstIndex = highlighted.pop();
        if (index === firstIndex) {
          highlighted.pop();
        }
        else if (state.buttons[index] + state.buttons[firstIndex] === 10){
          let randButtons = this.randomizeButtons();
          return {highlighted: highlighted, buttons: randButtons, score: state.score+1};
        }
      }
      return {highlighted: highlighted};
    });
  }

  randomizeButtons() {
    let choices = [];
    for (let i = 1; i < 100; i++) {
      if (i === 50) {
        continue;
      }
      choices.push(i);
    }

    let x = choices[Math.floor(Math.random()*choices.length)]; // Random from 1-99
    choices.splice(choices.indexOf(x), 1);
    choices.splice(choices.indexOf(100-x), 1);
    
    let randButtons = Array(16);
    let start = Math.floor(Math.random()*16);
    let end = (start + Math.floor(Math.random()*15+1))%16;

    randButtons[start] = x/10;
    randButtons[end] = (100-x)/10;
    

    for (let i = 0; i < 16; i++) {
      if (i !== start && i !== end) {
        let rand = choices[Math.floor(Math.random()*choices.length)];
        choices.splice(choices.indexOf(rand), 1);
        choices.splice(choices.indexOf(100-rand), 1);
        randButtons[i] = rand/10;
      }
    }
    return randButtons
  }

  render() {
    return (
      <div className="Game">
        <ScoreDisplay score={this.state.score}/>
        {this.state.playing ?
          <div>
            <Clock time={this.state.time}/>
            <div className="Grid">
              {this.state.buttons.map((button, index)=><Button index={index} highlighted={this.state.highlighted} key={index} number={button} onClick={this.clickButton.bind(this, index)}/>)}
            </div>
          </div>
          : <Start startGame={this.startGame}/>}
      </div>
    );
  }
}

class App extends React.Component {
  render()  {
    return (
      <div className="App">
        <div className="App-body">
          <h1 className="Title">Sum To Ten</h1>
          <p>Given a grid of numbers, click the pair that sums to 10!</p>
          <Game/>
        </div>
      </div>
    );
  }
}

export default App;
