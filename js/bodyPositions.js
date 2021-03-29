/*global define */

// define bodyPositions


define({
  1: {
    head: {
      rotate: -20
    },
    shoulder:{
      rotate: 20
    },
    armLeft: {
      rotate: 100,
      height: '4rem'
    },
    foreArmLeft: {
      rotate: 140
    },
    armRight: {
      rotate: 240
    },
    chest: {
      rotate: 340
    },
    core:{
      rotate: 0
    },
    legLeft:{
      rotate: 20
    },
    shinLeft:{
      rotate: -40
    },
    footLeft: {
      rotate: -20
    }
  },

  2: {
    body:{
      rotate: -20,
      yPercent: 5
    },
    chest:{
      rotate: 20
    },

    armLeft:{
      rotate: 30
    },
    armRight: {
      rotate: 30
    },

    hip:{
      rotate: 11
    },
    legLeft:{
      rotate: 27
    },
    footLeft: {
      rotate: -20
    },
    legRight:{
      rotate: 10
    },
    footRight: {
      rotate: -3
    }
  },

  3: {
    body:{
      y: '21rem'
    },
    armLeft: {
      rotate: 80
    },
    foreArmLeft:{
      rotate: 280
    },
    handLeft:{
      rotate: 90
    },

    armRight: {
      rotate: 260
    },
    foreArmRight:{
      rotate: 280
    },
    handRight:{
      rotate: 90
    },

    legLeft: {
      rotate: 0
    },
    shinLeft: {
      rotate: 105
    },
    footLeft: {
      rotate: 180
    },

    legRight: {
      rotate: 270
    },
    shinRight: {
      rotate: 90
    }
  },

  4:{
    body: {
      ease: 'power3.out',
      y: '24rem'
    },
    armLeft: {
      rotate: 50
    },
    armRight: {
      rotate: 310
    },

    foreArmLeft: {
      rotate: 290 
    },
    foreArmRight: {
      rotate: 70 
    },

    handLeft:{
      rotate: 110
    },
    handRight:{
      rotate: 250
    },

    legLeft: {
      rotate: 100
    },
    legRight: {
      rotate: 260
    },

    shinLeft: {
      rotate: 240
    },
    shinRight: {
      rotate: 120
    },

    footLeft:{
      rotate: 20
    },

    footRight:{
      rotate: 340
    }
  },
  6: {
    body:{
      rotate: 20,
      yPercent: 5
    },
    chest:{
      rotate: -20
    },

    armLeft:{
      rotate: -30
    },
    armRight: {
      rotate: -30
    },

    hip:{
      rotate: -11
    },
    legLeft:{
      rotate: -10
    },
    footLeft: {
      rotate: -3
    },
    legRight:{
      rotate: -27
    },
    footRight: {
      rotate: 20
    }
  },
  7: {
    armLeft: {
      rotate: 135
    },
    armRight: {
      rotate: 135
    }
  },
  8: {
    armLeft: {
      rotate: 180
    },
    armRight: {
      rotate: 180
    }
  },
  0: {
    armLeft : {
      rotate: 10
    },
    armRight : {
      rotate: 350
    },
    legLeft:{
      rotate: 8
    },
    legRight:{
      rotate: -8
    },
    footLeft:{
      rotate: -8,
      xPercent: 50
    },
    footRight:{
      rotate: 8,
      xPercent: -50
    }
  }
});