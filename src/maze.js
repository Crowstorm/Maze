import React from 'react';
import _ from 'lodash'

import { grid } from './grids'

class Maze extends React.Component {


    renderGrid() {
        return _.map(grid, row => {
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

    findStart() {
        _.map(grid, row => {
            _.map(row, cell => {
                if (cell.type === 's') {
                    console.log(cell.x, cell.y)
                    this.props.handleSetX(cell.x);
                    this.props.handleSetY(cell.y);
                }
            }
            )
        })
    }

    componentDidMount() {
        this.findStart();
        console.log(this.props);

    }

    render() {
        return (
            <div>
                <div id="maze">
                    {this.renderGrid()}
                    <div style={{color: 'white'}}>
                        Start: {this.props.entranceX}, {this.props.entranceY}
                    </div>
                </div>
            </div>
        )
    }
}

export default Maze;