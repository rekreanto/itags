const isArray    = x => Array.isArray( x );
const isBoolean  = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isNumber   = x => typeof x === 'number' && isFinite(x);
const isObjectLiteral   = x => x && typeof x === 'object' && x.constructor === Object 
const isRegExp   = x => x && typeof x === 'object' && x.constructor === RegExp;
const isString   = x => typeof x === 'string' || x instanceof String;
const isSymbol   = x => typeof x === 'symbol';
const isNode     = x => typeof x  === 'object' && x.nodeType !== undefined;
const Fun = 42;

// const PerceiveAs = ( p, f ) => ( ...xs ) => p( x )? f( x ): x;
const PerceiveAs = ( expected, ...clauses ) => ( x ) => {
  if( expected( x ) ) return x;
  // Must be an even number of clauses followinf the `expected`
  if( clauses.length % 2 !== 0 ) 
    throw `Must be an even number of clauses,
    but there was ${ clauses.length } 
    in PerceiveAs( ${ expected }, ${ clauses } ).`;
  const failed = x => {
    throw `Couldn't normalize ${ x }
    Tried PerceiveAs( ${ expected }, ${ clauses } )`;
  }; // failed is given
  return Case( ...clauses, failed )( x );
}

const CaseArity = ( ...pfs ) => ( ...xs ) => {
  const len = pfs.length;
  if( len === 0 ) throw `non-exhaustive clauses in CaseArity for input ${ xs }`; // no match
  if( len === 1 ) return pfs[ 0 ]( ...xs ); // default clause
  if( len >= 2 ){
    const [ p, f, ...rest ] = pfs;
    return xs.length === p
      ? f( ...xs )
      : CaseArity( ...pfs.slice(2) )( ...xs )
    ; } };

const Case = ( ...pfs ) => ( ...xs ) => {
  const len = pfs.length;
  // console.log(len)
  if( len === 0 ) throw `non-exhaustive clauses in CaseArity for input ${ xs }`; // no match
  if( len === 1 ){
    const [ f ] = pfs;
    return f( ...xs );
  }  // default clause
  if( len >= 2 ){
    const [ p, f, ...rest ] = pfs;
    return Case.perceive_as( p )( ...xs )
      ? f( ...xs )
      : Case( ...rest )( ...xs )
    ; } };

Case.perceive_as = p => ( ...xs ) => {
  if( isFunction( p ) ) return  p( ...xs );
  if( xs.length === 1 ){
    const x = xs[ 0 ];
    if( isNumber( p ) ) return  p === x;
    if( isString( p ) ) return  p === x;
    if( isRegExp( p ) && isString( x ) ) return p.test( x );
  }
};


// Asserts
const testCase = Case
  ( 'abc'    , () => "the string abc"
  , 42       , () => "forty-two"
  , isNode   , () => "<node>"
  , /^\d+$/  , () => "string-of-digits" 
             , () => `yeah`
  )
;
[ [ 42       , "forty-two" ]
, [ "abc"    , "the string abc" ]
, [ document , "<node>" ]
, [ "2010"   , "string-of-digits" ]
].forEach( ( [ a, b ] ) => { 
    console.assert( testCase( a ) == b , `testCase( ${ a } ) !== ${ b }` ) 
  } );



// Matching

const _pred2pat = ( p ) => ( ...xs ) => ( succ, fail ) => ( p( ...xs )? succ: fail )( ...xs );

const _Array    = _pred2pat ( isArray ) ;
const _Boolean  = _pred2pat ( isBoolean ) ;
const _Function = _pred2pat ( isFunction ) ;
const _Number   = _pred2pat ( isNumber ) ;
const _Object   = _pred2pat ( isObjectLiteral ) ;
const _RegExp   = _pred2pat ( isRegExp ) ;
const _String   = _pred2pat ( isString ) ;
const _Symbol   = _pred2pat ( isSymbol ) ;
const _Node     = _pred2pat ( isNode ) ;

const _isNaN    = _pred2pat ( isNaN ) ;

const _parseFloat = str => ( succ, fail ) => Case
  ( isNumber , n => succ( n )
  , isNaN    , n => fail( str )
  )( parseFloat( str ) )
;

const _eq  = y => ( x, ...xs ) => ( succ, fail ) => ( x === y? succ: fail )( x, ...xs );
const _gt  = y => x => ( succ, fail ) => ( x  >  y? succ: fail )( x );
const _lt  = y => x => ( succ, fail ) => ( x  <  y? succ: fail )( x );
const _gte = y => x => ( succ, fail ) => ( x  >= y? succ: fail )( x );
const _lte = y => x => ( succ, fail ) => ( x  <= y? succ: fail )( x );
const _fail = x => ( succ, fail ) => fail( x )
const _zip = preds => ( ...xs ) => ( succ, fail ) => {
  const len = preds.length;
  for( let i = 0; i < len; i++ ) if( !preds[ i ]( xs[ i ]) ) return fail( ...xs );
  return succ( ...xs );
};

const _re = re => x => ( succ, fail ) => {
  if( !isString( x ) ) return fail( x );
  const str = x;
  const match_data   = re.exec( str );            // try to match
  if( match_data === null ) return fail( str );   // fail with original string
  const captures     = match_data.slice( 1 );     // continue towards succeeding
  const match_start  = match_data.index;          
  const match_length = match_data[ 0 ].length; 
  const match_end    = match_start + match_length;
  const rest         = str.substr( match_end );
  // succeed with substrings captured by groups, followed by the rest of the input string
  return succ( ...captures, rest );
};

// Match( ( <pattern>, <fn> )+ | <fn> )
const Match = ( ...pfs ) => ( ...xs ) => {
  if( pfs.length === 0 ) throw `Non-exhaustive clauses in Match for ${pfs}, ${xs}`;  // non-exhaustive clauses
  if( pfs.length === 1 ) return pfs[0]( ...xs );    // default clause
  if( pfs.length > 1 ){ 
    let [ p, f, ...rest ] = pfs;
    return Match.perceive_as( p )( ...xs )( f, () => Match( ...rest )( ...xs ) );
  }; // recursive case
};

Match.perceive_as = PerceiveAs
( isFunction // normalized case
, isSymbol    , _eq
, isString    , _eq
, isNumber    , _eq
, isRegExp    , _re
)
;

// asserts


// Asserts
const testMatch = Match
  ( /^(\d+)-(\d+)-(\d+)$/  , ( y, m, d ) => `the date ${ d }.${ m }.${ y }`
  , 'abc'    , () => "the string abc"
  , _Node    , () => "<node>"
  , 42       , () => "forty-two"
  , /^\d+$/  , () => "a string of digits"
  , _String  , () => "a string"

             , () => `yeah`
  )
;
[ [ "abc"    , "the string abc" ]
, [ document , "<node>" ]
, [ "2010"   , "a string of digits" ]
, [ "hej"    , "a string" ]
, [ "2010-12-14", "the date 14.12.2010" ]
].forEach( ( [ a, b ] ) => { 
    console.assert( testMatch( a ) == b , `testCase( ${ a } ) !== ${ b }` ) 
  } );
