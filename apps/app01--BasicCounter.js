const num2sign = n => [ 'negative', 'zero', 'positive' ][ Math.sign( n ) + 1 ];


[ 'def BasicCounter'
, [ '::<int>' ]
, [ '<h1> title', "Basic Counter" ]
, [ '<div> display' ]
, [ '<div> buttons'
  , [ '<button>', " -10", [ 'on click',   n => [ n-10  ] ] ]         // DECREMENT
  , [ '<button>', "  -1", [ 'on click',   n => [ n-1   ] ] ]         // DECREMENT
  , [ '<button>', "   0", [ 'on click',  _n => [ 0     ] ] ]         // RESET
  , [ '<button>', "  +1", [ 'on click',   n => [ n+1   ] ] ]         // INCREMENT
  , [ '<button>', " +10", [ 'on click',   n => [ n+10  ] ] ]         // INCREMENT
  ]
// Vertical
, [ '->INIT', ()=>[0] ]
, [ '^display-stuff', n => 
    [ '--'
    , [ 'the display'
      , n                              // display number
      , [ $$1.class, num2sign( n ) ]   // visualize sign
      ]
    ]
  ]
].read().mount(911);



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
, [ '^show-number', n => [ 'the display', n ] ]                         // display number
, [ '^show-sign'  , n => [ 'the display', [ $$1.class, num2sign( n ) ] ] ]  // visualize sign 
].read();
