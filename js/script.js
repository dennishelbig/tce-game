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
    'bodyParts',
    'util/adjustPose',
    'util/jsonUtils'
  ],
  function (_, gsapFunction, bodyPosition, bodyParts, posing, jsonUtils ) {



  const gsap = gsapFunction.gsap;
  var infoBoxLeft = document.querySelector('#info-box .left');
  var infoBoxRight = document.querySelector('#info-box .right');
  var createJsonButton = document.querySelector('#create-json');
  var loadJsonButton = document.querySelector('#load-json');

  createJsonButton.addEventListener('click', jsonUtils.createJson )
  loadJsonButton.addEventListener('click', jsonUtils.loadJson )


  var inputs = {
    rotate: infoBoxRight.querySelector('input[name="info-rotate"]'),
    x : infoBoxRight.querySelector('input[name="info-x"]'),
    y : infoBoxRight.querySelector('input[name="info-y"]'),
    height : infoBoxRight.querySelector('input[name="info-height"]')
  }


  var keyStates = {
    clock : 0,
    up : false,
    right : false,
    down : false,
    left : false,
    move : false,
    shift: false,
    cmd: false,
    posing: false
  }
  var currentStates = Object.assign({}, keyStates);


  posing( keyStates, inputs )


  function getKeyDirection(input) {
    var inputMap = {
      16: "shift",
      91: "cmd",
      38: "up", // up
      87: "up", // w
      39: "right", // right
      68: "right", // d
      40: "down", // down
      83: "down", // s
      37: "left", // left
      65: "left", // a
      32: "move" // space
    };

    var defaultCode = 0;
    return inputMap[input] || defaultCode;
  }



  // merge arrow directions to create clockwork direction
  function assignClockDirection(){

    var up = keyStates['up'],
      right = keyStates['right'],
      down =  keyStates['down'],
      left = keyStates['left'];
    
    if( up && right ){
      keyStates['clock'] = 1
    }
    else if( right && down ){
      keyStates['clock'] = 3
    }
    else if( down && left ){
      keyStates['clock'] = 5
    }
    else if( left && up ){
      keyStates['clock'] = 7
    }
    else if( right ){
      keyStates['clock'] = 2
    }
    else if( down ){
      keyStates['clock'] = 4
    }
    else if( left ){
      keyStates['clock'] = 6
    }
    else if( up ){
      keyStates['clock'] = 8
    }
    else{
      keyStates['clock'] = 0
    }
  }




  /*********************************************/
  /*********    BODY PART ANIMATION    *********/
  /*********************************************/


  var bodyKeys = Object.keys( bodyParts );
  var bodyValues = Object.values( bodyParts );


  function animatePoses( direction ){
    if(
      keyStates['clock'] === 5
    ){
      return
    }
    
    var clockdirection = direction ? direction : keyStates['clock'];

    // 1: go throught body parts
    for( let i = 0; i < bodyKeys.length; i++ ){

      // maybe try map instead of object
      let animationArgs = { 
        duration: 0.2,
        force3D: true,
        height: '',
        ease: "power3.out",
        // defaults if key doesn't exist
        rotate: 0,
        xPercent: 0,
        yPercent: 0,
        x: 0,
        y: 0
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
      // do the animation
      gsap.to( bodyPartDOMElement, animationArgs);
    }
  }

  function ifDirectionKeyDown(){
    if( keyStates['up'] || 
        keyStates['right'] || 
        keyStates['down'] || 
        keyStates['left']
    ){
      return true;
    }else{
      return false;
    }
  }

  /********************************************/
  /***********       "ENGINE"       ***********/
  /********************************************/

  function keyAction(){
    // dont change of still same key combo
    if( 
      _.isEqual(currentStates, keyStates) ||
      keyStates['shift'] ||
      keyStates['cmd'] || 
      keyStates['posing'] ||
      document.querySelector('.is-posing') !== null // not move  if "is-posing"

    ){
      return
    }

    // pose
    if( keyStates['clock'] >= 0 && keyStates['clock'] <= 8 ){
      animatePoses();
    }

    // if any direction key is down
    if( ifDirectionKeyDown() ){
      infoBoxLeft.classList.add('direction-key-down')
    }else{
      infoBoxLeft.classList.remove('direction-key-down')
    }

    // if move key is down
    if(keyStates.move){
      infoBoxLeft.classList.add('move-key-down')
    }else{
      infoBoxLeft.classList.remove('move-key-down')
    }

    // update current state
    currentStates = Object.assign({}, keyStates);
    infoBoxLeft.innerHTML = keyStates['clock'];
  }


  /********************************************/
  /*********       KEY STROKES       **********/
  /********************************************/
  document.addEventListener('keydown', keydown );
  function keydown(e){
    var direction = getKeyDirection(e.keyCode);  // returns converted keyCode to direction
      keyStates[direction] = true; // assign keyState to true
      assignClockDirection( direction );
      keyAction()
  }

  document.addEventListener('keyup', keyup );
  function keyup(e){
    var direction = getKeyDirection(e.keyCode);  // returns converted keyCode to direction
      if(
        direction === 'cmd' ||
        direction === 'shift'
      ){
        setTimeout(()=>{
          keyStates[direction] = false; // assign keyState to false
        },0)
      }else{
        keyStates[direction] = false; // assign keyState to false
      }

      assignClockDirection( direction );
      keyAction()
  }
}); // requirejs end 