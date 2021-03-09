/*global define, requirejs */
/* eslint-disable no-console */


define(function () {
  return function posing( target, keyStates ){
    requirejs(
      [
        'lodash-min',
        'gsap/minified/gsap.min'
      ],
    function ( _, gsapFunction ) {
      const gsap = gsapFunction.gsap;

      var goodClasses = [
        'head',
        'hand', 
        'forearm', 
        'arm', 

        'chest',
        'core',
        'shoulder',
        'neck',

        'hip',
        'leg',
        'shin',
        'foot'
      ]


      function isRelevantElement(){
        var statement = false;
        goodClasses.forEach(clazz => {
          if(target.classList.contains( clazz ) ){
            statement = true;
          }
        });
        return statement;
      }


      var activeElement = document.querySelector('.is-posing')
      var infoBoxRight = document.querySelector('#info-box .right');
      
      function writeInfoBox(element){
        var s = 'rotate: '
          s += gsap.getProperty(element, 'rotate')
          s += '  |  x: '
          s += gsap.getProperty(element, 'x')
          s += '  |  y: '
          s += gsap.getProperty(element, 'y')

        infoBoxRight.innerHTML = s
      }

      
      // add class to new element 
      if( isRelevantElement() && !target.classList.contains('is-posing') ){
        if( activeElement !== null){
          activeElement.classList.remove('is-posing')
        }
        target.classList.add('is-posing')
        keyStates.posing = true;
        writeInfoBox(target)
        // activeElement = target;

        console.log('if')
      }else{
        target.classList.remove('is-posing')
        keyStates.posing = false;      
        console.log('else')
      }


      activeElement = document.querySelector('.is-posing')



      function onMouseMove(e){
        var diffX = startX - e.pageX
        var diffY = startY - e.pageY 
        startX = e.pageX
        startY = e.pageY
        
        if( keyStates.shift ){
          gsap.set(activeElement, {
            x: "-=" + (diffX * 0.1) + 'rem',
            y: "-=" + (diffY * 0.1) + 'rem'
          })
        }else{
          gsap.set(activeElement, {
            rotate: "-="+ (diffX - diffY)
          })
        }

        writeInfoBox(activeElement)
      }
      


      var startX, 
          startY,
          throttled = _.throttle( onMouseMove, 100 );

      document.onmousedown = (e) => {
        startX = e.pageX;
        startY = e.pageY;

        if( activeElement !== null ){
          document.addEventListener('mousemove', throttled, false);
        
          document.onmouseup = () => {
            document.removeEventListener('mousemove', throttled, false );
            document.onmouseup = null;
          }
        }
      }
    }); // requirejs end 
  };
});
