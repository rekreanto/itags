/** Table of Contents
 * 1. Namespaces
 * 2. Prelude
 * 3. Tags
 * 4. Embodimentation
 * 5. Syntax
 */


// 1. NAMESPACES

// namespaces for itags off different valence (number of applications)
$$ = {};
const $0 = {};
const $$1 = {};
const $2 = {};


// 2. PRELUDE

// prelude -- predicates

const isArray    = x => Array.isArray( x );
const isBoolean  = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isNumber   = x => typeof x === 'number' && isFinite(x);
const isObjectLiteral   = x => x && typeof x === 'object' && x.constructor === Object 
const isRegExp   = x => x && typeof x === 'object' && x.constructor === RegExp;
const isString   = x => typeof x === 'string' || x instanceof String;
const isSymbol   = x => typeof x === 'symbol';
const isNode     = x => typeof x  === 'object' && x.nodeType !== undefined;
const FailNonExhaustive = ( x ) => { throw `Case: Non-exhaustive clauses for input ${ x }` } 


const isEq = ( y ) => ( x ) => x === y;
const isZip = ( preds, xs ) => {
  const len = preds.length;
  for( let i = 0; i < len; i++ ) if( !preds[ i ]( xs[ i ]) ) return false;
  return true;
};

const as_pred = ( p ) => ( x, ...xs ) =>
  isFunction( p )? p( x, ...xs )
  : isNumber( p )? p === x
  : isString( p )? p === x
  : isSymbol( p )? p === x
  : isArray ( p )? isZip( p, [ x, ...xs ] )
  : FailNonExhaustive( p )
; // can't use Case to define as_pred, due to js eagerness

// prelude -- predicates -- adapters

// Case( ( <pred>, <fn> )+ | <fn> )
const Case = ( ...clauses ) => ( ...xs ) => {
  if( clauses.length === 0 ) throw `Non-exhaustive clauses in Case`;  // non-exhaustive clauses
  if( clauses.length === 1 ) return clauses[0]( ...xs );    // default clause
  if( clauses.length > 1 ){ 
    let [ p, f, ...rest ] = clauses;
    return as_pred( p )( ...xs )? f( ...xs ): Case( ...rest )( ...xs );
  }; // recursive case
};

// prelude -- patterns

const Return = x => () => x;
const Result = ( ...xs ) => [ ...xs ];   

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

const _eq  = y => x => ( succ, fail ) => ( x === y? succ: fail )( x );
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

const _re_shortform = re => str => ( succ, fail ) => {
  const match_data   = re.exec( str );            // try to match
  if( match_data === null ) return fail( str );   // match failed
  // continue with the successful match data
  // return substrings captured by groups, followed by the rest of the input string
  return succ( ...match_data.slice( 1 ), str.substr( match_data.index + match_data[ 0 ].length ) );
};

// prelude -- patterns
const isPred = ( fn ) => /^(?:is|has)/.test( fn.name );

const as_pattern = Case
    ( isPred      , _pred2pat  
    , isFunction  , fn => fn
    , isSymbol    , _eq
    , isString    , _eq
    , isNumber    , _eq
    , isRegExp    , _re
//  , isArray    , _zip 
    )
  ;

// Match( ( <pattern>, <fn> )+ | <fn> )
const Match = ( ...pfs ) => ( ...xs ) => {
  if( pfs.length === 0 ) throw `Non-exhaustive clauses in Match for ${pfs}, ${xs}`;  // non-exhaustive clauses
  if( pfs.length === 1 ) return pfs[0]( ...xs );    // default clause
  if( pfs.length > 1 ){ 
    let [ p, f, ...rest ] = pfs;
    return as_pattern( p )( ...xs )( f, () => Match( ...rest )( ...xs ) );
  }; // recursive case
};


// 3. TAGS

// tags -- helpers
const project = ( ...ctxs ) =>  Object.assign( {}, ...ctxs.reverse() ); // inefficient

// [ $$1.layer, <itag>* ]  
$$1.layer = ( ...itags ) => ( ctx ) => {
  for( let itag of itags ) itag2fn( itag )( ctx );      // process itag syntax
}; // entry 


// [ $2.block( <name> ), <itag>* ]  
$2.block = ( ...names ) => ( ...itags ) => ( ctx ) => {
  for( let name of names ) $$1.class( name )( ctx );
  ctx.layer.h_env[ '_block_' ] = names;
  $$1.layer( ...itags )( ctx );
}; // entry

// identity itag valence 1
$$1.id = ( ...itags ) => ( ctx ) => {
  for( let itag of itags ) itag2fn( itag )( ctx ); 
};
// identity itag valence 2
$2.id = () => ( ...itags ) => ( ctx ) => {
  for( let itag of itags ) itag2fn( itag )( ctx ); 
};


$$1.html = str => ctx => {
  // if not empty => non-monotonic
  ctx.node.innerHTML = str;
}

$$1.textnode = ( ...strs ) => ( ctx ) => {
  const el = document.createTextNode( strs.join( '' ) );
  ctx.node.appendChild( el );
  ctx.layer.h_vals.push( el );  // store exit
}; // entry 

// [ $2.mk( <tag>, <role>? ), <itag>* ] 
$2.mk = ( tag, role ) => ( ...itags ) => ( ctx ) => {
  const [ tagName, type ] = tag.split('/');
  const el = document.createElement( tagName );          // create elem
  ctx.layer.h_vals.push( el );                         // store exit effect
  const ctx_ = project( { node: el }, ctx );         // project context
  if( type ) el.setAttribute( 'type', type );                    // set type if given
  if( role ) el.setAttribute( 'name', role );
  if( role ){
    ctx.layer.h_env[ role ] = el;                      // make elem referable
    const blocks = ctx.layer.h_lookup( '_block_' );
    for( let block of blocks ) $$1.class( `${ block }__${ role }` )( ctx_ ); // add BEM class, use for precise targeting in CSS
  };
  $$1.layer( ...itags )( ctx_ ); // process child itags 
  ctx.node.appendChild( el );      // mount element
}; // entry 


// [ $2.the( <key> ), <itag>* ] 
$2.the = ( k ) => ( ...itags ) => ( ctx ) => {
  // process child itags in horizontally projected context
  // const nd = lookup3( ctx.layer, 'env', k );
  const nd = ctx.layer.h_lookup( k )
  $$1.layer( ...itags )( project( { node: nd }, ctx ) );
}; // entry

const Each__Arr = xs => x2itag => ctx => { 
  xs.forEach( ( ...xs ) => itag2fn( x2itag( ...xs ) )( ctx ) );
};

const Each__NumNum = ( a, b ) => x2itag => ctx => {
  let N = Math.abs( b - a );
  let m = Math.min( a, b );
  let n = 0;
  while( n <= N ) itag2fn( x2itag( m + n++ ) )( ctx );
};
$2.Each = Case
  ( isArray  , Each__Arr
  , isNumber , Each__NumNum 
  )
;

// [ $2.attr, <str key>, <str val>  ]
$2.attr = ( k ) => ( val ) => ( ctx ) => {
  // prepare
  const isShadowed = ctx.node.hasAttribute( k );
  const shadowedValue = ctx.node[ k ];
  // change
  ctx.node[ k ] = val;
  ctx.layer.h_vals.push( 
    () => {
      if( isShadowed ) ctx.node[ k ] = shadowedValue; // remove and restore handler
      else ctx.node.removeAttribute( k );      // remove handler
    }
  )
};


// [ $$1.class, <str>+ ]
$$1.class = ( cl ) => ( ctx ) => {

  if( ctx.node.classList.contains( cl ) ) console.error( `Non-monotonic add of class '${ cl }''` );
  ctx.node.classList.add( cl );
  ctx.layer.h_vals.push(() => { ctx.node.classList.remove( cl ); });

};

// [ $$1.style, <str key>, <val> ]
$$1.style = ( k, v ) => $2. style( k )( v );

// [ $$1.style, <str key>, <val> ]
$2.style = ( k ) => ( v ) => ( ctx ) => {
  if( ctx.node.style.getPropertyValue( k ) !== '' ) console.error( `Non-monotonic add of $$1.style( '${ k }', '${ v }' )` );
  ctx.node.style[ k ] = v;
  ctx.layer.h_vals.push( () => { ctx.node.style.removeProperty( k ); } );
};


$0.select = () => ctx => { ctx.node.select(); }
$$1.log = msg => ctx => {
  console.log( "EMB ", msg, ctx );
  ctx.layer.h_vals.push( ()=>console.log( "DIS", msg, ctx ) );
  
};


// TAGS -- TIME

$2.after = ( delay ) => ( trans ) => ( ctx ) => {
  const timer_id = setTimeout( Send( ctx, trans ), delay );
  ctx.layer.h_vals.push( () => { clearTimeout( timer_id  ); } )
};

$2.every = ( delay ) => ( trans ) => ( ctx ) => {
  const timer_id = setInterval( Send( ctx, trans ), delay );
  ctx.layer.h_vals.push( () => { clearInterval( timer_id  ); } )
};


// TAGS -- BINDINGS

// [ $2.on( <str event> ), <fn local-transition> ] -- local anonymous transition
$2.on = ( eventName ) => ( trans ) => ( ctx ) => {
  const ground = ctx.layer;
  const handler = ( ev ) => {                         //   TRANSITION 
    // console.log( eventName, trans, ctx, ev )
    const vs = ground.getState();                     //   1. get value
    ground.doDisembody();                             //   2. disembody
    const vs_ = trans( ...vs );                       //   3. calculate new value
    EmbodyValues( project( { values: vs_ }, ctx ) );  //   4. embody
    Observe();
  }

  ctx.node.addEventListener( eventName, handler );
  ctx.layer.h_vals.push( () => ctx.node.removeEventListener( eventName, handler ) )
  Observe();
};

// [ $2.on( <str event> ), <fn local-transition> ] -- local anonymous transition
$2.state = ( entryEvent ) => ( fn ) => ( ctx ) => {
  const ground = ctx.layer;
  ground.inp = ( v ) => { ctx.node.value = v; }; // set @inp so init code can unify on upper embodiment
  const handler1 = ( ev ) => {
    const vs_ =  fn( ev );
    ground.doDisembody();
    EmbodyValues( project( { values: vs_ }, ctx) );
    Observe();
  }
  
  // INIT
  
  ground.trans[ 'INIT' ] = handler1( { target: ctx.node } );
  ctx.node.addEventListener( entryEvent, handler1 )
  ctx.layer.h_vals.push( () => ctx.node.removeEventListener( entryEvent, handler1 ) )
  Observe();
};

// TAGS -- VERTICAL

// [ $2.xlay, ( <val> → <itag> ) ]
// [ $2.xlay, { <val> : <itag> } ]
// $2.xlay = _name => xlay => ctx => ctx.layer.xlays.push( { node: ctx.node, xlay } ); // scoped xlays
$2.xlay = _name => xlay => ctx => ctx.layer.xlays.push( xlay ); // scoped xlays

// [ Fn, <str key>, <cafn> ]
$2.tran = k => v => ctx => ctx.layer.trans[ k ] = v;


// 4. EMBODIMENTATIION

// 5. LAYERS

$$.layer = {};

class Layer_ {
  constructor( ){
    this.h_env = {};
    this.h_vals = [];
/*     this.lower = ground;
    ground.upper = this; */
  }
  // used by $2.the( <str key> )
  lookup( k ){
    return Object.hasOwn( this.h_env, k )? this.h_env[ k ]: this.lower.lookup( k );
  }
}

$$.layer.zero = class extends Layer_ {
  constructor( ){
    super( );
  }
  getState( arr=[ ] ){ return arr; }
  doDisembody( ){ }
  doEmbody( ){ }
}

$$.layer.one_of = class extends Layer_ {
  constructor( ){
    super( );
    this.trans = { };
    this.xlays = [ ];         // embodiments
  }
  getState( arr=[ ] ){
    arr.push( this.val ); // should be `arr.push( ...this.val )` ?
    this.upper.getState( arr );
    return arr;
  }
  doDisembody(){ // disembody all layers above this ground
    this.upper.doDisembody();                 // disembody upper layers first
    this.upper.h_vals.reverse().forEach( Case  // disembody this layer, last-first
      ( isFunction , fn => fn()
      , isNode     , nd => nd.parentNode.removeChild( nd ) ) );
      this.upper.h_vals = [];                    // remove the exits preparing for next embodiment
      delete this.upper;                        // delete ref to upper layer
  }
  doEmbody( ctx ){ // embody all layers above this ground
    console.log( ctx.values, ctx.layer )
    const [ x, ...xs ] = ctx.values;
    return this.xlays.map( ({ node, xlay }) => Case
      ( isFunction      , fn  => itag2fn( fn( x, ...xs ) )( project( { node, values: [] }, ctx ) )
      , isObjectLiteral , obj => itag2fn( obj[ x ] )( project( { node, values: xs }, ctx ) )
      )( xlay ));
  }
}


$$.layer.pattern = $$.layer.one_of;


const mk_layer = ( ground ) => new $$.layer.one_of( ground );

// maybe_eval( <fn> | <value> )
const maybe_eval = x => isFunction( x )? x(): x;

const as_fn = Case
  ( isObjectLiteral   , obj => k => obj[ k ]
  , isFunction        , fn  => fn
  )
;


// SYNTAX

// well-behaved split; 
// + trims off leading and trailing white-space
// + empty input string returns empty array
const trimsplit = ( re, str ) => {
  // console.log(  re, str );
  str = str.trim();
  // console.log(  re, str );
  if( !str ) return [];
  const matches =  str.split( re );
  // console.log( 'matches: ', matches );
  return matches;
};

const match_types = ( str ) => {
  maybe_arr = str.match( /<[^>]*>/ );
  return maybe_arr? maybe_arr.map( s => s.slice(1,-1) ): []; // remove brackets
}
const normal_form = ( itg, ...args ) => {
  // console.log( `[ ${ itg } ${ args.join(' ') }, ... ]` );
  return $2[ itg]( ...args );
};

// the layer tag
// $2.layer = ( <str key-arity>, <str+ keys> ) 
$2.layer = ( key_arity, ...args ) => ( ...itags ) => ctx => {
  console.log( '$2.layer: ', key_arity, ...args   );
  const ground = $$.layer[ key_arity ]( ctx.layer ); // make new layer
  ctx.layer.upper = ground;                            // double-link new layer with parent layer
  ground.lower = ctx.layer;
  const ctx_ = project( { layer: ground }, ctx );      // project new layer into context
  for( let itag of itags ) itag2fn( itag )( ctx_ );       // create the layer itself 
  ground.embody( ctx_ );                               // embody the upper layers
};


// $$.layer.base( ) -> <layer aka0-layer>
$$.layer.base = () => {
  return  { h_type: 'DOM'
          , h_env: {}
          , h_vals: []
          , h_lookup( k ){
             return Object.hasOwn( this.h_env, k )
               ? this.h_env[ k ]
               : this.lower.h_lookup( k );
            }
          , disembody(){}
          , embody(){}
          , getState( arr=[ ] ){}
          }
  ;
};

// $$.layer.one_of( <layer ground g> ) -> <layer aka1-layer>
$$.layer.one_of = ( g ) => {
  return  { v_type: 'one_of'
          , v_env: {}
          , v_val: undefined
          , embos: []
          , v_lookup( k ){
             return Object.hasOwn( this.v_env, k )
               ? this.v_env[ k ]
               : this.lower.v_lookup( k );
            }
          , disembody(){
            this.upper.disembody();                 // disembody upper layers first
            this.upper.h_vals.reverse().forEach( Case  // disembody this layer, last-first
                ( isFunction , fn => fn()
                , isNode     , nd => nd.parentNode.removeChild( nd ) 
                ) 
              );
              delete this.upper;                        // delete ref to upper layer
            }
          , embody(){}
          , getState( arr=[ ] ){
            arr.push( this.v_val ); // should be `arr.push( ...this.val )` ?
            this.upper.getState( arr );
            return arr;
          }
          }
  ;
};







itag_head2fn = Match
  ( _Function         , ( fn )        => fn               // already in functional form
  // Bracket form 
   , /^<(\S+?)>/      , ( tag, rest ) => normal_form( 'mk', tag, ...trimsplit( /\s+/, rest ) )  // a named tag creation

  // $$1
  , /^html\s*$/       , ()            => $$1.html 

  // layer head
  , /^::$/            , ( )           => $2.layer( 'zero' )
  , /^::top$/        , ( )            => $2.layer( 'zero' )
  , /^::zero$/        , ( )           => $2.layer( 'zero' )
  , /^::([a-z]+) of/  , ( aka, rest ) => $2.layer( `${aka}_of`, ...trimsplit( /\s+/, rest ) )
  , /^::<(\w*?)>/    , ( type, types )  => $2.layer( 'pattern', type, ...match_types( types ) )


  // Word prefix form -- time  
  , /^(after|every) +([0-9.]+)s$/  , ( itg, ms )   => normal_form( itg, ( parseFloat( ms ) ) )
  , /^(after|every) +([0-9.]+)ms$/ , ( itg, ms )   => normal_form( itg, ( parseFloat( ms ) ) )

  // Word prefix form, general
  , /^([a-zA-Z]\S+)\s*/            , ( itg, rest ) => normal_form( itg , ...trimsplit( /\s+/, rest ) )  

  // Symbol prefix form
  , /^!(\S+)$/                     , ( n )         => $2.on   ( n )          // event binding
  , /^=(\S+)$/                     , ( n )         => $2.on   ( n )          // state binding
  , /^->(\S+)$/                    , ( tr )        => $2.tran ( tr )         // fn or named transition
  , /^\^(\S+)$/                    , ( name )      => $2.xlay ( name )       // a named xlayer
  , /^\/(\S+)$/                    , ( k )         => $2.slot( k )          // class
  , /^\.(\S+)$/                    , ( k )         => () => $$1.class( k )          // class
  )
;

const itag2fn = Case
  ( isFunction , fn => fn
  , isArray    , ([ head, ...args ]) => itag_head2fn( head )( ...args ) // let head decide syntax of tags
  , isString   , str => $$1.textnode( str )
  , isNumber   , num => $$1.textnode( num.toString() )
               , x   => { throw `non-exhausitve clauses in itags for input ${ x }`}  
  )
; 



// Demo / Test

const test_cond = Match
  ( 42                    , _ => `FortyTwo`
  , isObjectLiteral       , x => `Object` // första ordnignens pred-fn konverteras till CPS patterns
  , /^(\d+)..(\d+)$/      , ( a, b ) => `Range from ${a} to ${b}`
  , /^([a-z]+)..([A-Z]+)/ , ( a, b, rest ) => `Range from ${a} to ${b}, rest: ${rest}`
  
  , _Number    , num => `Number`
  , _Array     , arr => `Array`
  , _RegExp    , x => `RegExp`
  , _String    , str => `String`
  , _Symbol    , sym => `Symbol`
  , _Function  , fn => `Function` 
               , ( ...xs ) => { throw `No clause matching input >>>${ JSON.stringify( xs ) }<<<`; } 
  )
;

//console.assert( test_cond( { k: 451 } ) === `has value 451`, `{ k: 451 } ) === has value 451` )
console.assert( test_cond( "Hej" ) === "String", `test_cond( "Hej" ) === "String"` );
console.assert( test_cond( 42 ) === "FortyTwo",  `test_cond( 42 ) === "FortyTwo"` );
console.assert( test_cond( 43 ) === "Number", `test_cond( 43 )` );
console.assert( test_cond( [1,2,3] ) === "Array", `test_cond( [1,2,3] )` );
console.assert( test_cond( {a:5} ) === "Object", `test_cond( {a:5} ) === "Object"` );
console.assert( test_cond( /yo/ ) === "RegExp", `test_cond( /yo/ ) === "RegExp"` );
console.assert( test_cond( '10..42' ) === "Range from 10 to 42", `'10..42' ) === "Range from 10 to 42"` );
console.assert( test_cond( 'abc..DEF-ghi' ) === "Range from abc to DEF, rest: -ghi", `test_cond( 'abc..DEF-123456' ) === "Range from abc to DEF, rest: -123456` );
console.assert( test_cond( Symbol('MySymbol') ) === "Symbol", `Symbol('MySymbol') ) === "Symbol"` );



// ========== TOP-LEVEL ==========

// def

const $ = {};
Array.prototype.def = function(){ 
  Match
    ( /^\.([A-Z]\w+)/, ( tagname, rest ) => { $[ tagname ] = this }
    , /^block\s+([A-Z]\w+)/, ( tagname, rest ) => { $[ tagname ] = this }
    )( this[0] );
  return this;
};

let layer;
Array.prototype.main = function( ...state ){
  window.addEventListener( 'DOMContentLoaded', () => {
    const t0 = performance.now();
    layer = $$.layer.base();
    itag2fn( this )( { node: document.body, layer, values: state }  )
    const t1 = performance.now();
    console.log( (t1-t0).toFixed( 2 ),"ms" );
  } );
};

// main


  const Observe = () => {
  console.log( "= ", ...layer.upper.getState() )
  };
