import React from 'react';
import _ from 'lodash'

import { grid, grid2 } from './grids'

class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            exit: [],
            value: '',
            startX: '',
            startY: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Zapisanie stanu formularza do stanu aplikacji
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    //Na podstawie stanu aplikacji wyrenderowanie labiryntu
    handleSubmit(event) {
        event.preventDefault();
        //wyczyszczenie
        this.setState({ value: '' });

        for (let i = 0; i < this.state.value; i++) {
            this.state.grid.push([0]);
            for (let j = 0; j < this.state.value; j++) {
                this.state.grid[i][j] = {'x': j, 'y': i, 'type': 'x'};
            }
        }
    }

    //render labiryntu
    renderGrid() {
        return _.map(grid2, row => {
            return (
                <div className="row d-flex justify-content-center align-items-center" style={{ margin: 0 }}>
                    {_.map(row, cell => {

                        return (
                            <div
                                id={'d' + cell.x + '_' + cell.y}
                                style={{ height: 100, width: 100, boxSizing: 'border-box', border: '1px solid red', fontSize: '3em', color: 'white' }}>
                                {cell.type}
                            </div>
                        )
                    })
                    } </div>
            )
        })
    }

    //render dynamicznego labiryntu
    renderDynamicGrid() {
    
        return _.map(this.state.grid, row => {
            return (
                <div className="row d-flex justify-content-center align-items-center" style={{ margin: 0 }}>
                    {_.map(row, cell => {
                        return (
                            <div
                                id={'d' + cell.x + '_' + cell.y}
                                style={{ height: 100, width: 100, boxSizing: 'border-box', border: '1px solid red', fontSize: '2em', color: 'red' }}>
                                {cell.type}
                                <div>
                             {/* Funkcje do zmiany wlasciwosci kratki w labiryncie */}
                                <span style={{height: 30, width:30, fontSize: 20, color: 'white'}} onClick={()=> {this.state.grid[cell.y][cell.x].type = 'o'; this.setState({value: ''})}}> o</span>
                                <span style={{height: 30, width:30, fontSize: 20, color: 'white'}} onClick={()=> {this.state.grid[cell.y][cell.x].type = 's'; this.setState({value: ''})}}> s</span>
                                <span style={{height: 30, width:30, fontSize: 20, color: 'white'}} onClick={()=> {this.state.grid[cell.y][cell.x].type = 'w'; this.setState({value: ''})}}> w </span>
                                </div>
                            </div>
                        )
                    })
                    } </div>
            )
        })
    }

    //Znalezienie startu
    findStart2() {
        _.map(this.state.grid, row => {
            _.map(row, cell => {
                if (cell.type === 's') {
                    this.state.startX = cell.x;
                    this.state.startY = cell.y;
                }
            }
            )
        })
    }

    //Szukanie drogi na podstawie przekazanego labiryntu
    findWay(passedGrid) {
        // console.log('moj gridek', passedGrid)
        var pathFinder = (entranceX, entranceY, grid) => {
            var distanceFromTop = entranceX;
            var distanceFromLeft = entranceY;

            var location = {
                distanceFromTop: distanceFromTop,
                distanceFromLeft: distanceFromLeft,
                path: [],
                status: 'Start'
            }

            //inicjalizacja kolejki
            var queue = [];
            queue.push(location);

            //loop grida
            while (queue.length > 0) {
                //zwrocenie pierwszego elementu z kolejki
                var currentLocation = queue.shift();

                //polnoc
                var newLocation = explore(currentLocation, 'North', grid);
                //jesli wyjscie przekazac do stanu aplikacji kolejke z najkrotsza sciezka
                if (newLocation.status === 'Exit') {
                    this.setState(prevState => ({
                        exit: [...prevState.exit, newLocation.path]
                    }))
                    return newLocation.path;
                    //droga
                } else if (newLocation.status === 'Valid') {
                    queue.push(newLocation);
                }

                //wschod
                var newLocation = explore(currentLocation, 'East', grid);
                if (newLocation.status === 'Exit') {
                    this.setState(prevState => ({
                        exit: [...prevState.exit, newLocation.path]
                    }))
                    return newLocation.path;
                } else if (newLocation.status === 'Valid') {
                    queue.push(newLocation);
                }

                //poludnie
                var newLocation = explore(currentLocation, 'South', grid);
                if (newLocation.status === 'Exit') {
                    this.setState(prevState => ({
                        exit: [...prevState.exit, newLocation.path]
                    }))
                    return newLocation.path;
                } else if (newLocation.status === 'Valid') {
                    queue.push(newLocation);
                }

                //zachod
                var newLocation = explore(currentLocation, 'West', grid);
                if (newLocation.status === 'Exit') {
                    this.setState(prevState => ({
                        exit: [...prevState.exit, newLocation.path]
                    }))
                    return newLocation.path;
                } else if (newLocation.status === 'Valid') {
                    queue.push(newLocation);
                }
            }
            //nie znaleziono drogi
            this.setState(prevState => ({
                exit: [...prevState.exit, 'Nie znaleziono wyjścia, ten grobowiec będzie twoim grobowcem']
            }))
            return false;
        }

        //sprawdzenie typu lokacji
        var locationStatus = (location, grid) => {
            let gridSize = grid.length;
            let dft = location.distanceFromTop;
            let dfl = location.distanceFromLeft;
            // console.log(gridSize, 'size')
            // console.log(location)
            // console.log(grid, dft, dfl);

            if (location.distanceFromLeft < 0 ||
                location.distanceFromLeft >= gridSize ||
                location.distanceFromTop < 0 ||
                location.distanceFromTop >= gridSize) {
                //poza gridem
                return 'Invalid';
                //jesli wyjscie
            } else if (grid[dft][dfl].type === 'w') {
                return 'Exit';
                //jesli nie droga (zablokowana lub odwiedzona)
            } else if (grid[dft][dfl].type !== 'o') {
                return 'Blocked';
                //jesli droga
            } else {
                return 'Valid';
            }
        }

        //chodzenie
        var explore = (currentLocation, direction, grid) => {
            var newPath = currentLocation.path.slice();
            newPath.push(direction);

            var dft = currentLocation.distanceFromTop;
            var dfl = currentLocation.distanceFromLeft;

            if (direction === 'North') {
                dft -= 1;
            } else if (direction === 'East') {
                dfl += 1;
            } else if (direction === 'South') {
                dft += 1;
            } else if (direction === 'West') {
                dfl -= 1;
            }

            var newLocation = {
                distanceFromTop: dft,
                distanceFromLeft: dfl,
                path: newPath,
                status: 'Unknown'
            };

            newLocation.status = locationStatus(newLocation, grid);

            //jesli droga, to oznacz lokacje jako odwiedzoną
            if (newLocation.status === 'Valid') {
                grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
            }

            return newLocation;
        }
        console.log(pathFinder(this.state.startY, this.state.startX, passedGrid));
    }

    componentDidMount() {
        // pathFinder(this.props.entranceY, this.props.entranceX, grid2)
    }


    render() {

        return (
            <div>
                <div id="maze">
                    {/* <p style={{ color: 'white' }}> Przygotowane gridy </p> */}
                    {/* {this.renderGrid()} */}

                    {/* <div style={{ color: 'white' }}>
                        Start: {this.props.entranceX}, {this.props.entranceY}
                    </div>

                    <button onClick={() => this.findWay()}> Click </button> */}

                    {/* <div style={{ color: 'white' }}>
                        Current position: {this.props.currentX}, {this.props.currentY}
                    </div> */}

                    {/* // <button onClick={() => this.findTest()}> Click </button>
                    // <div style={{ color: 'white' }}> Droga: {this.state.exit} </div>

                    // <p style={{ color: 'white' }}> Gridy generowane: </p> */}

                    <h1 style={{ color: 'white', paddingTop: '1em' }}> Labirynt </h1>
                     <form style={{ color: 'white', paddingTop: '1em' }} onSubmit={this.handleSubmit}>
                        <label>
                            Rozmiar:
                             <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>

                    {this.renderDynamicGrid()}
                    <button onClick={() => this.findStart2()}> Znajdź start </button>
                    <button onClick={() => this.findWay(this.state.grid)}> Znajdź drogę </button>
                    <div style={{ color: 'white' }}> Droga: {this.state.exit} </div>
                </div>
            </div>
        )
    }
}

export default Maze;