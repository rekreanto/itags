const pages = {};

$$.random = {};
$$.random.pick = ( xs ) => {
  const index = Math.floor( Math.random() * xs.length );
  return xs[ index ];
};

// $$.random.lorem = ({ words:<arr|str alphabet>, sentences: <number|arr result> })
$$.random.lorem = ({ words, sentences }) => {
  words = isString( words )? words.split( /\s+/ ).map( str => str.toLowerCase() ) : words;
  sentences = isNumber( sentences )? new Array( sentences ): sentences;
  for( let i = 0; i < sentences.length; i++ ){
    const ws = [];
    ws.push( $$.random.pick( words ) );                             // First word
    ws[ 0 ] = ws[ 0 ].charAt(0).toUpperCase() + ws[ 0 ].slice( 1 ); // Inital with upper case
    const len = 8 + Math.random()*6 - 3;              // sentence length
    for( let i = 0; i < len; i++ ) ws.push( $$.random.pick( words ) ); // Append words
    ws[ ws.length - 1 ] = `${ws[ ws.length - 1 ]}.`;  // End with a dot
    sentences[ i ] = ws.join( ' ' );
  }
  return sentences.join( ' ' );
};
const _ = undefined;
// console.log( $$.random.lorem({ words: "hej du din ko", sentences: new Array( 5 ) }) );
// console.log( $$.random.lorem({ words: "hi there man how area you today great maybe awesome", sentences: 5 }) );



[ '.Itags'
, [ '<div>'
  , [ '<h1> main-title', "Itags" ] 
  , [ '<i> subtitle', "An implementation of uH abstract syntax and LM semantics" ]
  ]
, [ '<p>', $$.random.lorem(
    { words: "An implementation of Universal HTML abstract syntax and Layer Machine semantics"
    , sentences: 10
    })
  ]
].def(); 

[ '.UniHTML Page'
, [ '<h1> title', "Universal HTML" ] 
, [ '<i> subtitle', "HTML, but with tags added for reactivity and state managment" ]
, [ '<p>', $$.random.lorem(
    { words: "HTML, but with tags added for reactivity and state managment"
    , sentences: 16 
    })
  ]
].def(); 


[ '.LayerMachine Page'
, [ '<h1> title', "Layer Machines" ] 
, [ '<i> subtitle', "Statecharts generalized to be amenable to language level integration" ]
, [ '<p>', $$.random.lorem(
    { words: "Statecharts generalized to be amenable to language level integration"
    , sentences: 8 
    })
  ]
].def(); 

[ '.Demos Page'
, [ '<h1> title', "Layer Machines" ] 
, [ '<i> subtitle', "Some simple examples of toy apps implmented expressed as layer machines in uh/itags" ]
, [ '<p>', $$.random.lorem(
    { words: "SSome simple examples of toy apps implmented expressed as layer machines in uh/itags"
    , sentences: 24 
    })
  ]
].def(); 

// Itags Landing Page

[ 'block LandingPage'
, [ '::one of itags uh lm demos' ]
, [ '<nav>'
  , [ '=click', ev => ev.target.value ]
  , [ '<button>', "Itags" , [ '@value', 'itags' ] ] 
  , [ '<button>', "uH"    , [ '@value', 'uh'    ] ] 
  , [ '<button>', "LM"    , [ '@value', 'lm'    ] ] 
  , [ '<button>', "Demos" , [ '@value', 'demos' ] ]
  ]
, [ '<article> content'
  , [ '/itags', $.Itags        ]
  , [ '/uh'   , $.UniHTML      ]
  , [ '/lm'   , $.LayerMachine ]
  , [ '/demos', $.Demos        ]
  ] 
].def().main( 'itags' );

[ 'block YeahYeah'
, [ '<h1>', "Yeah, uh, uuh..." ]  
];