const convLay = ( from, to, conv ) => 
  [ itag1.layer
  , [ itag2.the( from ), [ itag0.select ], [ 'state input', e => [ e.target.value ] ] ] 
  , [ '^convert', Match
      ( ''         , ()  => [ itag2.the( from ), [ itag1.class, 'empty' ], [ itag2.the( to ), itag2.attr( 'value' )( "" ) ] ]
      , _parseFloat, num => [ itag2.the( to ), itag2.attr( 'value' )( conv( num ).toFixed( 2 ) ) ]
                   , ()  => [ itag2.the(from ), [ itag1.class, 'invalid' ] ]  
      ) ] ];

const TempConv = 
  [ 'block TempConv'
  // Horizontal
  , [ '<h1> title', "Temperature Converter" ]
  , [ '<div> main'
    , [ '<span>'
      , [ '<input/text> c' ]
      , [ '<span>', "°C", [ '.unit' ]  ]
      ]
    , [ '<span> arrow'
      , [ 'html', '&nbsp&rarr;' ]
      ]
    , [ '<span>'
      , [ '<input/text> f' ]
      , [ '<span>', "°F", [ '.unit' ] ]
      ]
    ]
  // Bindings
  , [ 'state focusin', e => [ e.target.name ] ]    // reflect focused elements name as essential state 
  // Vertical
  , [ '->INIT', () =>  [ 'f' ] ]
  , [ '^converting'
    , { c: convLay( 'c', 'f', c => ( c *1.8) +32  )
      , f: convLay( 'f', 'c', f => ( f -32 ) /1.8 )
      } ] ]
;

/* 
itag2.attr, alt monotonic description, men funkar ej
if( ctx.node.hasAttribute( k ) ) console.error( `Non-monotonic add of itag2.attr( '${ k }', '${ v }' )` );
ctx.node.setAttribute( k, v );
ctx.layer.exits.push( () => { ctx.node.removeAttribute( k ); }); */