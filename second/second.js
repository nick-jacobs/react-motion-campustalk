import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'

import range from 'lodash.range'

// Components 

//Constants 
// Value of 1 degree in radians
const DEG_TO_RAD = 0.0174533;
// Diameter of the main button in pixels
const MAIN_BUTTON_DIAM = 90;
const CHILD_BUTTON_DIAM = 50;
// The number of child buttons that fly out from the main button
const NUM_CHILDREN = 5;
// Hard coded position values of the mainButton
const M_X = 200;
const M_Y = 300;

const SPRING_CONFIG = {stiffness: 400, damping: 15};

// How far away from the main button does the child buttons go
const FLY_OUT_RADIUS = 120,
  SEPARATION_ANGLE = 40, //degrees
  FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE, //degrees
  BASE_ANGLE = ((180 - FAN_ANGLE)/2); // degrees

// Utility functions 

// Since JS Math. functions accept value of angle in radians and we've been working in degrees we will need to covert
// degrees to radians first.
function toRadians(degrees) {
  return degrees * DEG_TO_RAD;
}

function finalDeltaPositions(index) {
  let angle = BASE_ANGLE + ( index * SEPARATION_ANGLE );
  return {
    deltaX: FLY_OUT_RADIUS * Math.cos(toRadians(angle)) - (CHILD_BUTTON_DIAM/2),
    deltaY: FLY_OUT_RADIUS * Math.sin(toRadians(angle)) + (CHILD_BUTTON_DIAM/2)
  };
}


class App extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {
      isOpen: false
    };

    // Bind this to the functions 
    this.openMenu = this.openMenu.bind(this);
  }

  mainButtonStyles() {
    return {
      width: MAIN_BUTTON_DIAM,
      height: MAIN_BUTTON_DIAM,
      top: M_Y - (MAIN_BUTTON_DIAM/2),
      left: M_X - (MAIN_BUTTON_DIAM/2)
    };
  }

  initialChildButtonStyles() {
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      top: spring(M_Y - (CHILD_BUTTON_DIAM/2), presets.stiff),
      left: spring(M_X - (CHILD_BUTTON_DIAM/2), presets.stiff)
    };
  }

  finalChildButtonStyles(childIndex) {
    let{deltaX, deltaY} = finalDeltaPositions(childIndex);
    return {
      width: CHILD_BUTTON_DIAM,
      height: CHILD_BUTTON_DIAM,
      left: spring(M_X + deltaX, presets.stiff),
      top: spring(M_Y - deltaY, presets.stiff)
    };
  }

  openMenu() {
    let{isOpen} = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  render() {
    let {isOpen} = this.state;
    return (
      <div>
        {range(NUM_CHILDREN).map( index => {
          let style = isOpen ? this.finalChildButtonStyles(index) : this.initialChildButtonStyles();
          return (
            <Motion style={ style } key={ index }>
            { ({width, height, top, left}) =>
              <div  
                className='child-button'
                style={{width: width, height: height, top: top, left: left} }
                />
            }
            </Motion>
          )
        })}
        <div 
          className="main-button"
          style={this.mainButtonStyles()}
          onClick={this.openMenu}/>
      </div>
    );
  } 
};

ReactDOM.render(<App />, document.getElementById('root'))
