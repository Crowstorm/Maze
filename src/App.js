import React, { Component } from 'react';
import './App.css';

import Maze from './maze.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        entranceX: null, entranceY: null
    };
  }

  handleSetX = (x) =>{
    this.setState({
      entranceX: x
    })

  }
  handleSetY = (y) =>{
    this.setState({
      entranceY: y
    })
  }

  render() {
    return (
      <div className="App">
        <Maze 
        entranceX={this.state.entranceX} 
        entranceY={this.state.entranceY}
        handleSetX = {this.handleSetX}
        handleSetY = {this.handleSetY}
        />
      </div>
    );
  }
}

export default App;
