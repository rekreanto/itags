const num2sign = n => [ 'negative', 'zero', 'positive' ][ Math.sign( n ) + 1 ];

const BasicCounter = 
  [ BaseLayer( 'BasicCounter' )
  // Horizontal
  , [ '<h1> title', "Basic Counter" ]
  , [ '<div> display', [ Class, 'display' ] ]
  , [ '<div> buttons'
    , [ '<button> minus-btn', "-1" ]         // DECREMENT
    , [ '<button> zero-btn' , "0"  ]         // RESET
    , [ '<button> plus-btn' , "+1" ]         // INCREMENT
    ]
  // Bindings
  , [ 'the minus-btn', [ 'on click',   n => [ n-1 ] ] ]
  , [ 'the zero-btn' , [ 'on click',  _n => [ 0 ]  ] ]
  , [ 'the plus-btn' , [ 'on click',   n => [ n+1 ] ] ]
  // Vertical
  , [ Init, 0 ]
  , [ xLayer, n => [ 'the display', n ] ]                        // display number
  , [ xLayer, n => [ 'the display', [ Class, num2sign( n ) ] ] ]  // visualize sign 
  ]
;


/**
 ## itags -- User stories
 + [  ] Static Tags of Body are rendered
 + [  ] Tag reference works
 + [  ] BEM classes area reflected as html classes
 + [  ] Bound events area captured
 
 */

 const BasicCounter2 = 
  [ BaseLayer( 'BasicCounter2' )
  // Horizontal & Bindings
  , [ '<h1> title', "Basic Counter 2" ]
  , [ '<div> display', [ Class, 'display' ] ]
  , [ '<div> buttons'
    , [ '<button>', "-100", [ 'on click',   n => [ n-100 ] ] ]         // DECREMENT
    , [ '<button>', " -10", [ 'on click',   n => [ n-10  ] ] ]         // DECREMENT
    , [ '<button>', "  -1", [ 'on click',   n => [ n-1   ] ] ]         // DECREMENT
    , [ '<button>', "   0", [ 'on click',  _n => [ 0     ] ] ]         // RESET
    , [ '<button>', "  +1", [ 'on click',   n => [ n+1   ] ] ]         // INCREMENT
    , [ '<button>', " +10", [ 'on click',   n => [ n+10  ] ] ]         // INCREMENT
    , [ '<button>', "+100", [ 'on click',   n => [ n+100 ] ] ]         // INCREMENT
    ]
  // Vertical
  , [ Init, 0 ]
  , [ xLayer, n => [ 'the display', n ] ]                        // display number
  , [ xLayer, n => [ 'the display', [ Class, num2sign( n ) ] ] ]  // visualize sign 
  ]
;


const BasicCounter3 = 
[ BaseLayer( 'BasicCounter3' )
// Horizontal & Bindings
, [ '<h1> title', "Basic Counter 3" ]
, [ '<div> display', [ Class, 'display' ] ]
, [ '<div> buttons', [ Class, 'buttons' ] 
  , [ Each([ 1000, 100, 10, 1 ]), dn => [ '<button>', "-", dn , [ 'on click',   n => [ n-dn ] ] ] ] 
  , [ '<button>', "0", [ 'on click',  _n => [ 0     ] ] ]
  , [ Each([ 1, 10, 100, 1000 ]), dn => [ '<button>', "+", dn , [ 'on click',   n => [ n+dn ] ] ] ]
  ]
// Vertical
, [ Init, 0 ]
, [ xLayer, n => [ 'the display', n, [ Class, num2sign( n ) ] ] ]                         // display number
]
;


