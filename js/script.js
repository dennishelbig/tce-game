/* eslint-disable no-console */
/* eslint no-unused-vars: off */
/*global requirejs */


requirejs(
  [
    'lodash-min',
    'gsap/minified/gsap.min',
    'bodyPositions'
  ],
  function (_, gsapFunction, bodyPosition) {
    //loaded and can be used here now.

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

  const gsap = gsapFunction.gsap;

  var infoBox = document.querySelector('#info-box');

  var states = {
    direction : 0,
    up : false,
    right : false,
    down : false,
    left : false
  }

  var currentStates = Object.assign({}, states);



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




  function assignClockDirection(){
    if( states['up'] && states['right'] ){
      states['clock'] = 1
    }
    else if( states['right'] && states['down'] ){
      states['clock'] = 3
    }
    else if( states['down'] && states['left'] ){
      states['clock'] = 5
    }
    else if( states['left'] && states['up'] ){
      states['clock'] = 7
    }

    else if( states['right'] ){
      states['clock'] = 2
    }
    else if( states['down'] ){
      states['clock'] = 4
    }
    else if( states['left'] ){
      states['clock'] = 6
    }
    else if( states['up'] ){
      states['clock'] = 8
    }
    else{
      states['clock'] = 0
    }
  }


  function setDirection( direction ){
    states[direction] = true;
  }

  function unsetDirection( direction ){
    states[direction] = false;
  }


  var Body = {
    armLeft:{
      el: document.querySelector('.arm.left')
    },
    armRight: {
      el: document.querySelector('.arm.right')
    },
    foreArmLeft:{
      el: document.querySelector('.arm.left .forearm')
    },
    foreArmRight: {
      el: document.querySelector('.arm.right .forearm')
    },
    upperBody: {
      el: document.querySelector('.body')
    },
    legLeft: {
      el: document.querySelector('.leg.left')
    },
    legRight: {
      el: document.querySelector('.leg.right')
    },
    shinLeft: {
      el: document.querySelector('.leg.left .shin')
    },
    shinRight: {
      el: document.querySelector('.leg.right .shin')
    }
  }

  var bodyPartNames = Object.keys( Body );
  var bodyPartElements = Object.values( Body );

  function animate(){
    if( 
      (states['clock'] === 0)||
      (states['clock'] === 1)||
      (states['clock'] === 2)||
      (states['clock'] === 4)||
      (states['clock'] === 6)||
      (states['clock'] === 7)||
      (states['clock'] === 8) 
    ){



      // 1: go throught body parts
      // for (let [name, value] of Object.entries(Body) ) {
      for( let i = 0; i < bodyPartNames.length; i++ ){

        var args = { 
          duration: 0.25,
          force3D: true,
          ease: "power4.out",
          // default if key doesn't exist
          rotate: 0,
          yPercent: 0
        }


        let bodyPartName = bodyPartNames[i];
        let bodyPart = bodyPartElements[i].el;
        let bodyPartArgs = bodyPosition[ states['clock']][bodyPartName]; 
        

        // prepare for round 2
        let propsKeys = bodyPartArgs ? Object.keys( bodyPartArgs ) : false;
        let propsValues = bodyPartArgs ? Object.values( bodyPartArgs ) : false;


        // 2: go throught transform props
        for( let ii = 0; ii < propsKeys.length; ii++ ){
          let prop = propsKeys[ii];
          let value = propsValues[ii];

          let start = gsap.getProperty(bodyPart, prop );
          let end = value;
          
          let aniValue = end;


          // prevent turning in wrong direction
          if( prop === 'rotate' ){

            let difference = Math.abs(start - end); 
            let deg = ( difference > 180 ) ? 360 - difference : difference;

            // only if angle is larger than 180deg
            if( difference > 180 ){
              // if(deg < start){
              //   aniValue = start + deg
              // }
              // if(deg > start){
              //   aniValue = start - deg
              // }

              aniValue = (deg < start) ? start + deg : start - deg;

              // maybe this isn't needed
              // args['onComplete'] = () => {
                // gsap.set( bodyPart,{ rotate: end })
              // }
            }
          }
          // add transform prop & value to args
          args[prop] = aniValue;
        }

        // do the animation
        gsap.to( bodyPart, args);
      }
    }
  }



  function changePosition(){
    // states.up ? body.classList.add('up') : body.classList.remove('up');
    // states.right ? body.classList.add('right') : body.classList.remove('right');
    // states.down ? body.classList.add('down') : body.classList.remove('down');
    // states.left ? body.classList.add('left') : body.classList.remove('left');
  }


  function onKeyChange(){

    assignClockDirection();
    changePosition();
    if( _.isEqual(currentStates, states) ){
      return;
    }
    animate();
    currentStates = Object.assign({}, states);
    infoBox.innerHTML = states['clock'];

  }



      

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
    if( !_.isEqual(currentStates, states) ){
      onKeyChange();
    }

    window.requestAnimationFrame(gameLoop)
  }

  window.requestAnimationFrame(gameLoop)

}); // requirejs end 