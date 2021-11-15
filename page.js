let page;
page = 
  [ itag2.block
  , [ '<h1>', "Hello itags!" ]
  , [ '<ul>'
    , [ '<li>', "Hej" ]
    , [ '<li>', "Hej" ]
    , [ '<li>', "Hej" ]
    , [ '<li>', "Hej" ] 
    ]
  ];

  page = 
  [ itag2.block
  , [ '<h1>', "Hello itags!" ]
  , [ '<ul>'
    , [ itag2.Each([1,2,3,4,5])
      , x => [ '<li>', `Hej ${ x*1000 } !` ]
      ]
    ]
  ];


page100 = 
  [ itag2.block
  , [ '<h1>', "Hello itags!" ]
  , [ '<ul>', [ itag2.Each(0,1000), x => [ '<li>', `Hej ${ x } !` ] ] ]
  ];

  
page = 
  [ itag2.block
  , [ '<h1> title', "Hello itags!", [ itag2.attr, 'title', "Hellu itags!" ] ]
  , [ '<ul>'
    , [ '<li>', "Hej" ]
    , [ '<li>', "Hej" ]
    , [ '<li>', "Hej" ] 
    ]
  , page100
  , [ 'the title'
    , [ itag1.Class, 'nice-class', 'super-nice-class' ]
    , [ itag1.Style, '~background-color', 'green' ]
    , [ itag1.Style, 'color', 'white' ]
    ]
  ];



/**
 * Counter -- named functions
 * -- version with separate reactivity definitions
 */
const int2color = n => [ 'red', 'black', 'green' ][ Math.sgn( n ) + 1 ];
counter = 
  [ itag2.block( 'Counter' )
    , [ '<h1>', "Counter" ]
    , [ '<div> display' ]
    , [ '<div>'
      , [ '<button>', "-", [ OnClick, 'DECR' ] ] // named functions
      , [ '<button>', "0", [ OnClick, 'RES'  ] ]
      , [ '<button>', "+", [ OnClick, 'INCR' ] ]
      ]

    , [ Val, 0 ]

    , [ Fn, 'DECR' ,  n => n - 1 ] // function definitions
    , [ Fn, 'RES'  , _n => 0     ]
    , [ Fn, 'INCR' ,  n => n + 1 ]

    , [ Layer, n => [ 'the display', n ] ]
    , [ Layer, n => [ 'the display', [ itag1.Style, 'color', int2color( n ) ] ] ]
  ]
;


/**
 * Counter -- inlined functions
 * -- version with separate reactivity definitions
 */
 const int2color = n => [ 'red', 'black', 'green' ][ Math.sgn( n ) + 1 ];

counter = 
  [ itag2.block( 'Counter' )

  , [ '<h1>', "Counter" ]
  , [ '<div> display' ]
  , [ '<div>'
    , [ '<button>', "-", [ OnClick,  n => n - 1 ] ] // inlined functions
    , [ '<button>', "0", [ OnClick, _n => 0     ] ]
    , [ '<button>', "+", [ OnClick,  n => n + 1 ] ]
    ]

    , [ Value, 0 ]
    , [ Layer, n => [ 'the display', n ] ]
    , [ Layer, n => [ 'the display', [ itag1.Style, 'color', int2color( n ) ] ] ]
  ]
;

/**
 * TempConv
 * -- version with inline layer definitions
 */

const c2f = c => ( c -32  ) *1.8;
const f2c = f => ( f /1.8 ) +32 ;

temp_conv = 
  [ itag2.block( 'TempConv' )
    , [ '<h1>', "Temperature Converter" ]
    , [ '<div>'
      , [ '<input/number> c'
        , [ Layer, { f: [ Layer, f => f2c( f ) ] } ]
        , [ Layer, { c: [ Value, 0 ] } ] // reflect the parsed number as tha value of the overlayer
        ]
      , [ '<span>', "°C" ]
      ]  
    , [ '<div> arrow'
      , [ Layer, { c: ' =>' } ]
      , [ Layer, { f: '<= ' } ]
      ]
    , [ '<div>'
      , [ '<input/number> f'
        , [ Layer, { c: [ Layer, c => c2f( c ) ]  } ]
        , [ Layer, { f: [ Value, 32 ] } ]  // reflect the parsed number as tha value of the overlayer
        ]
      , [ '<span>', "°F" ]
      ]  

    , [ Focus, [ Value, 'c' ] ] // reflect the focus as the value of the base layer
  ]
;

/**
 * TempConv 
 * -- version with separated reactivity -- arranged by DOM elements
 */

 const c2f = c => ( c -32  ) *1.8;
 const f2c = f => ( f /1.8 ) +32 ;
 
 temp_conv = 
   [ itag2.block( 'TempConv' )
     , [ '<h1>', "Temperature Converter" ]
     , [ '<div>'
       , [ '<input/number> c' ]
       , [ '<span>', "°C" ]
       ]  
     , [ '<div> arrow' ]
     , [ '<div>'
       , [ '<input/number> f' ]
       , [ '<span>', "°F" ]
       ]  
 
     , [ Focus, [ Value, 'c' ] ] // reflect the focus as the value of the base layer
     , [ 'the c'
       , [ Layer, { f: [ Layer, f => f2c( f ) ] } ]
       , [ Layer, { c: [ Value, 0 ] } ] // reflect the parsed number as tha value of the overlayer
       ]
     , [ 'the arrow'
       , [ Layer, { c: ' =>' } ]
       , [ Layer, { f: '<= ' } ]
       ]
     , [ 'the f'
       , [ Layer, { c: [ Layer, c => c2f( c ) ]  } ]
       , [ Layer, { f: [ Value, 32 ] } ]  // reflect the parsed number as tha value of the overlayer
       ]
   ]
 ; 


/**
 * TempConv 
 * -- version with separated reactivity -- arranged by Layers
 */

temp_conv = 
  [ itag2.block( 'TempConv' )
  , [ '<h1>', "Temperature Converter" ]
  , [ '<div>'
    , [ '<input/number> c' ]
    , [ '<span>', "°C" ]
    ]  
  , [ '<div> arrow' ]
  , [ '<div>'
    , [ '<input/number> f' ]
    , [ '<span>', "°F" ]
    ]  

  , [ Focus, [ Value, 'c' ] ] // reflect the focus as the level A value
  , [ Layer, 
      { c:
        [ itag2.block
        , [ 'the c', [ Value, 0 ] ] // reflect this input as the level B value
        , [ 'the arrow', ' =>' ]
        , [ Layer, c => [ 'the f', c2f( c ) ] ]
        ] } ]
  , [ Layer,
      { f:  
        [ itag2.block
        , [ 'the arrow', '<= ' ]
        , [ 'the f', [ Value, 0 ] ] // reflect this input as the level B value
        , [ Layer, f => [ 'the c', f2c( f ) ] ]
        ] } ]
  , [ Layer, k => [ itag1.log, `focus is ${ k }` ] ] // Logging the level A value
  ]
;