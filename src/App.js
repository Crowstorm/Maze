import React, { Component } from 'react';
import './App.css';

import Maze from './maze.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        entranceX: null, entranceY: null,
        currentX: null, currentY: null
    };
  }

  handleSetEntranceX = (x) =>{
    this.setState({
      entranceX: x
    })

  }
  handleSetEntranceY = (y) =>{
    this.setState({
      entranceY: y
    })
  }

  handleSetCurrentX = (x) =>{
    this.setState((prevState)=>{
      return {currentX: prevState.currentX +x}
    })

  }
  handleSetCurrentY = (y) =>{
    this.setState((prevState)=>{
      return {currentY: prevState.currentY +y}
    })
  }

  render() {
    // setInterval(() =>console.log(this.state),1000)
    return (
      <div className="App">
        <Maze 
        entranceX={this.state.entranceX} 
        entranceY={this.state.entranceY}
        currentX={this.state.currentX} 
        currentY={this.state.currentY}
        handleSetEntranceX = {this.handleSetEntranceX}
        handleSetEntranceY = {this.handleSetEntranceY}
        handleSetCurrentY = {this.handleSetCurrentY}
        handleSetCurrentX = {this.handleSetCurrentX}
        />
      </div>
    );
  }
}

export default App;
