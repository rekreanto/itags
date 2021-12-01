const num2sign = n => [ 'negative', 'zero', 'positive' ][ Math.sign( n ) + 1 ];


  [ 'def BasicCounter' 
  , [ '::<int>' ] // the value of this layer is an integer
  , [ '<h1> title', "Basic Counter" ]
  , [ '<div> display' // embodiments are inlined using lexical scope
    , n => n.toString()
    , n => [ 'class', num2sign( n ) ]
    ]
  , [ '<div> buttons' // transition defs are inlined
    , [ '<button>', "  -1", [ '!click',   n => State( n-1  ) ] ] 
    , [ '<button>', "   0", [ '!click',  _n => State( 0    ) ] ] 
    , [ '<button>', "  +1", [ '!click',   n => State( n+1  ) ] ]
    ]
  , [ 'INIT', () => State( 0 ) ] // Initial transition
  ].read(); // 11sLOC

  [ 'def BasicCounter' 
  // Layer type definition
  , [ '::<int>' ] // the value of this layer is an integer
  // Body tags
  , [ '<h1> title', "Basic Counter" ]
  , [ '<div> display' ]
  , [ '<div> buttons' 
  //  Buttons with event-to-transition bindings
    , [ '<button>', "  -1", [ '!click', 'DECR'  ] ]
    , [ '<button>', "   0", [ '!click', 'RESET' ] ] 
    , [ '<button>', "  +1", [ '!click', 'INCR'  ] ]
    ]
    // Transition definitions
  , [ 'INIT',  () => State( 0 ) ] // Initial transition
  , [ 'DECR',   n => State( n-1  ) ] 
  , [ 'RES' ,  _n => State( 0    ) ] 
  , [ 'INCR',   n => State( n+1  ) ]
    // Embodiments
  , n => [ 'the display', n ]
  , n => [ 'the display', [ 'class', num2sign( n ) ] ]
  ].read(); // 14sLOC





[ 'def BasicCounterPro'
, [ '::<int>' ]
// Horizontal & Bindings
, [ '<h1> title', "Basic Counter 3" ]
, [ '<div> display' ]
, [ '<div> buttons' 
  , [ $$2.Each([ 1000, 100, 10, 1 ]), dn => [ '<button>', "-", dn , [ 'on click',   n => [ n - dn ] ] ] ] 
  , [ '<button>', "0", [ 'on click',  _n => [ 0 ] ] ]
  , [ $$2.Each([ 1, 10, 100, 1000 ]), dn => [ '<button>', "+", dn , [ 'on click',   n => [ n + dn ] ] ] ]
  ]
// Vertical
, [ '->INIT', 0 ]
, [ '     ^show-number', n => [ 'the display', n ] ]                    // display number
, [ '^show-sign'  , n => [ 'the display', [ $$1.class, num2sign( n ) ] ] ]  // visualize sign 
].read();
