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

const Normalize = ( p, f ) => ( ...xs ) => p( x )? f( x ): x;

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
    return Case.normalize( p )( ...xs )
      ? f( ...xs )
      : Case( ...rest )( ...xs )
    ; } };

Case.normalize = p => ( ...xs ) => {
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


Array.prototype.call = function(){
  const [ fn, ...args ] = this;
  return fn( ...args );
};


// Matching

