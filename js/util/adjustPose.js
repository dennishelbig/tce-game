/*global define, requirejs */
/* eslint-disable no-console */


define(function () {
  return function posing(keyStates, inputs ){
    requirejs(
      [
        'lodash-min',
        'gsap/minified/gsap.min'
      ],
    function ( _, gsapFunction ) {
      const gsap = gsapFunction.gsap;

      var goodClasses = [
        'body',
        
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


      function isRelevantElement(target){
        var statement = false;
        goodClasses.forEach( clazz => {
          if(target.classList.contains( clazz ) ){
            statement = true;
          }
        });
        return statement;
      }




      function writeInfoBox(element){
        let getter =  gsap.getProperty(element)
        inputs.rotate.value = Math.floor( getter('rotate') ) 
        inputs.x.value = Math.floor( getter('x') ) 
        inputs.y.value = Math.floor( getter('y') ) 
        inputs.height.value = Math.floor( getter('height', 'rem') ) 
      }


      function nullInfoBox(){
        inputs.rotate.value = '' 
        inputs.x.value = '' 
        inputs.y.value = '' 
        inputs.height.value ='' 
      }

      var activeElement;

      function changeRotate(){
        gsap.set(activeElement, {
          rotate: this.value
        })
      }

      function changeX(){
        gsap.set(activeElement, {
          x: this.value
        })
      }

      function changeY(){
        gsap.set(activeElement, {
          y: this.value
        })
      }

      function changeHeight(){
        gsap.set(activeElement, {
          height: this.value + 'rem'
        })
      }


      document.addEventListener('click', (e)=>{
        activeElement = document.querySelector('.is-posing')
        let target = e.target;

        // add class to new element 
        if( isRelevantElement(target) && !target.classList.contains('is-posing') ){
          if( activeElement !== null){
            activeElement.classList.remove('is-posing')
          }
          target.classList.add('is-posing')
          keyStates.posing = true;
          writeInfoBox(target)
        }else if( target.classList.contains('is-posing') ){
          target.classList.remove('is-posing')
          keyStates.posing = false;   
          nullInfoBox()   
        }else{
          return; // prevent addEventlisteners multiple times 
        }
      

        activeElement = document.querySelector('.is-posing')


     


      // pose on input change  
      inputs.rotate.removeEventListener('change', changeRotate );
      inputs.x.removeEventListener('change', changeX );
      inputs.y.removeEventListener('change', changeY );
      inputs.height.removeEventListener('change', changeHeight );
      
      
      
      inputs.rotate.addEventListener('change', changeRotate );
      inputs.x.addEventListener('change', changeX );
      inputs.y.addEventListener('change', changeY );
      inputs.height.addEventListener('change', changeHeight );



        function onMouseMove(e){
          // not over Input =>  selecting text will move active element
          if(e.target.tagName === 'INPUT'){
            return;
          }
          
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
      })
    }); // requirejs end 
  };
});
