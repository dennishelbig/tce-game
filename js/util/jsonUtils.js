/*global define, requirejs, gsap */
/* eslint-disable no-console */

define(function () {
  return {
    createJson: function (){
      var textarea = document.querySelector('textarea');
      var properties = ['rotate', 'x', 'y' ]


      requirejs(['bodyParts'],function ( bodyParts ) {
        var json = {};
        const keys = Object.keys(bodyParts)
        const values = Object.values(bodyParts)

        // loop through elements
        for (let i = 0; i < values.length; i++) {
          var element = keys[i]
          var elementDOM = values[i].el
          var elementProps = {};

          for (let ii = 0; ii < properties.length; ii++) {
            const property = properties[ii];
            elementProps[property] = gsap.getProperty(elementDOM, property);
          }

          json[element] = elementProps
        }

        // innerHTML works only once
        textarea.value = JSON.stringify(json, undefined, 2)
      })
    },

    
    loadJson: function (){
      var textarea = document.querySelector('textarea');
      var ugly = textarea.value;
      var jsonObj = JSON.parse(ugly);

      requirejs(['bodyParts'],function ( bodyParts ) {
        const keys = Object.keys( bodyParts )
        const values = Object.values( bodyParts )

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          const object = values[i].el
          gsap.set(object, jsonObj[key] )
        }

      })
    }
  }
});
