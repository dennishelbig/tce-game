/* eslint-disable no-console */
/* eslint no-unused-vars: off */
/*global requirejs */
/* 
  keycodes
  q = 81
  w = 87
  e = 69
  d = 68
  c = 67
  x = 88
  y = 89
  a = 65
  */


requirejs(
  [
    'lodash-min',
    'gsap/minified/gsap.min',
    'bodyPositions',
    'bodyParts'

  ],
function (_, gsapFunction, bodyPosition, bodyParts ) {
  

  const gsap = gsapFunction.gsap;

  var infoBox = document.querySelector('#info-box');

  var directionStates = {
    clock : 0,
    up : false,
    right : false,
    down : false,
    left : false
  }

  var currentStates = Object.assign({}, directionStates);



  function getKeyDirection(input) {
    var inputMap = {
      38: "up", // up
      87: "up", // w
      39: "right", // right
      68: "right", // d
      40: "down", // down
      83: "down", // s
      37: "left", // left
      65: "left" // a
    };

    var defaultCode = 0;
    return inputMap[input] || defaultCode;
  }



  // merge arrow directions to create clockwork direction
  function assignClockDirection(){
    var up = directionStates['up'],
     right = directionStates['right'],
      down =  directionStates['down'],
      left = directionStates['left'];


    if( up && right ){
      directionStates['clock'] = 1
    }
    else if( right && down ){
      directionStates['clock'] = 3
    }
    else if( down && left ){
      directionStates['clock'] = 5
    }
    else if( left && up ){
      directionStates['clock'] = 7
    }
    else if( right ){
      directionStates['clock'] = 2
    }
    else if( down ){
      directionStates['clock'] = 4
    }
    else if( left ){
      directionStates['clock'] = 6
    }
    else if( up ){
      directionStates['clock'] = 8
    }
    else{
      directionStates['clock'] = 0
    }
  }


  function setDirection( direction ){
    directionStates[direction] = true;
  }

  function unsetDirection( direction ){
    directionStates[direction] = false;
  }


  /*********************************************/
  /*********    BODY PART ANIMATION    *********/
  /*********************************************/

  
  var bodyKeys = Object.keys( bodyParts );
  var bodyValues = Object.values( bodyParts );


  function animate(direction){
    if( 
      (directionStates['clock'] !== 3)&&
      (directionStates['clock'] !== 5)
    ){

      var clockdirection = direction ? direction : directionStates['clock'];

      // 1: go throught body parts
      for( let i = 0; i < bodyKeys.length; i++ ){

        // maybe try map instead of object

        let animationArgs = { 
          duration: 0.25,
          force3D: true,
          ease: "power3.out",
          // defaults if key doesn't exist
          rotate: 0,
          yPercent: 0
        }

        let bodyPartName = bodyKeys[i];
        let bodyPartDOMElement = bodyValues[i].el;
        let bodyPartArgs = bodyPosition[ clockdirection ][ bodyPartName ]; 

        

        // prepare keys & values for level 2
        let propsKeys = bodyPartArgs ? Object.keys( bodyPartArgs ) : false;
        let propsValues = bodyPartArgs ? Object.values( bodyPartArgs ) : false;


        // 2: go throught transform props
        for( let ii = 0; ii < propsKeys.length; ii++ ){
          let prop = propsKeys[ii];
          let startValue = gsap.getProperty(bodyPartDOMElement, prop ); // get realtime current transform value 
          let endValue = propsValues[ii];


          // prevent turning in wrong direction on rotate
          if( prop === 'rotate' ){
            let difference = Math.abs(startValue - endValue); 
            let deg = ( difference > 180 ) ? 360 - difference : difference;

            // only if angle is larger than 180deg
            if( difference > 180 ){
              endValue = (deg < startValue) ? startValue + deg : startValue - deg;
            }
          }
          // add transform prop & value to args
          animationArgs[prop] = endValue;

        }

        // if( bodyPartName === 'upperBody' ){
        //   animationArgs['ease'] = 'power3.out';
        // }
        console.log(bodyPartName, animationArgs);

        // do the animation
        gsap.to( bodyPartDOMElement, animationArgs);
      }
    }
  }



  /********************************************/
  /***********       "ENGINE"       ***********/
  /********************************************/

  function onKeyChange(){
    assignClockDirection();
    if( _.isEqual(currentStates, directionStates) ){
      return;
    }
    animate();
    currentStates = Object.assign({}, directionStates);
    infoBox.innerHTML = directionStates['clock'];
  }

  // animate
  animate(4);



  function keydown(e){
    var keyDirection = getKeyDirection(e.keyCode);
      setDirection( keyDirection );
      onKeyChange(e)
  }


  function keyup(e){
    var keyDirection = getKeyDirection(e.keyCode);
      unsetDirection( keyDirection );
      onKeyChange(e)
  }


  document.addEventListener('keydown', keydown );
  document.addEventListener('keyup', keyup );


  function gameLoop(){
    if( !_.isEqual(currentStates, directionStates) ){
      onKeyChange();
    }

    window.requestAnimationFrame(gameLoop)
  }

  window.requestAnimationFrame(gameLoop)

}); // requirejs end 