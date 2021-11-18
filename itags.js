/** Table of Contents
 * 1. Namespaces
 * 2. Prelude
 * 3. Tags
 * 4. Embodimentation
 * 5. Syntax
 */


// 1. NAMESPACES

// namespaces for itags off different valence (number of applications)
const itag0 = {};
const itag1 = {};
const itag2 = {};


// 2. PRELUDE

// prelude -- predicates

const isArray    = x => Array.isArray(x);
const isBoolean  = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isNumber   = x => typeof x === 'number' && isFinite(x);
const isObject   = x => x && typeof x === 'object' && x.constructor === Object 
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
const _Object   = _pred2pat ( isObject ) ;
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

// [ itag1.layer, <itag>* ]  
itag1.layer = ( ...itags ) => ( ctx ) => {
  for( let itag of itags ) itag2fn( itag )( ctx );      // process itag syntax
}; // entry 


// [ itag2.block( <name> ), <itag>* ]  
itag2.block = ( ...names ) => ( ...itags ) => ( ctx ) => {
  for( let name of names ) itag1.class( name )( ctx );
  ctx.layer.block = names;
  itag1.layer( ...itags )( ctx );
}; // entry

itag1.html = str => ctx => {
  // if not empty => non-monotonic
  ctx.node.innerHTML = str;
}

itag1.textnode = ( ...strs ) => ( ctx ) => {
  const el = document.createTextNode( strs.join( '' ) );
  ctx.node.appendChild( el );
  ctx.layer.exits.push( el );  // store exit
}; // entry 

// [ itag2.mk( <tag>, <role>? ), <itag>* ] 
itag2.mk = ( tag, role ) => ( ...itags ) => ( ctx ) => {
  const [ tagName, type ] = tag.split('/');
  const el = document.createElement( tagName );          // create elem
  ctx.layer.exits.push( el );                         // store exit effect
  const ctx_ = project( { node: el }, ctx );         // project context
  if( type ) el.setAttribute( 'type', type );                    // set type if given
  if( role ) el.setAttribute( 'name', role );
  if( role ){
    ctx.layer.env[ role ] = el;                      // make elem referable
    const blocks = lookup2( ctx.layer, 'block' );
    for( let block of blocks ) itag1.class( `${ block }__${ role }` )( ctx_ ); // add BEM class, use for precise targeting in CSS
  };
  itag1.layer( ...itags )( ctx_ ); // process child itags 
  ctx.node.appendChild( el );      // mount element
}; // entry 

const lookup2 = ( lay, k ) => lay.hasOwnProperty( k )? lay[ k ]: lookup2( lay.lower, k );
const lookup3 = ( lay, k1, k2 ) => lay[k1].hasOwnProperty( k2 )? lay[ k1 ][ k2 ]: lookup3( lay.lower, k1, k2 );

// [ itag2.the( <key> ), <itag>* ] 
itag2.the = ( role ) => ( ...itags ) => ( ctx ) => {
  // process child itags in horizontally projected context
  const nd = lookup3( ctx.layer, 'env', role );
  itag1.layer( ...itags )( project( { node: nd }, ctx ) );
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
itag2.Each = Case
  ( isArray  , Each__Arr
  , isNumber , Each__NumNum 
  )
;

// [ itag2.attr, <str key>, <str val>  ]
itag2.attr = ( k ) => ( val ) => ( ctx ) => {
  // prepare
  const isShadowed = ctx.node.hasAttribute( k );
  const shadowedValue = ctx.node[ k ];
  // change
  ctx.node[ k ] = val;
  ctx.layer.exits.push( 
    () => {
      if( isShadowed ) ctx.node[ k ] = shadowedValue; // remove and restore handler
      else ctx.node.removeAttribute( k );      // remove handler
    }
  )
};


// [ itag1.class, <str>+ ]
itag1.class = ( cl ) => ( ctx ) => {

  if( ctx.node.classList.contains( cl ) ) console.error( `Non-monotonic add of class '${ cl }''` );
  ctx.node.classList.add( cl );
  ctx.layer.exits.push(() => { ctx.node.classList.remove( cl ); });

};

// [ itag1.style, <str key>, <val> ]
itag1.style = ( k, v ) => itag2. style( k )( v );

// [ itag1.style, <str key>, <val> ]
itag2.style = ( k ) => ( v ) => ( ctx ) => {
  if( ctx.node.style.getPropertyValue( k ) !== '' ) console.error( `Non-monotonic add of itag1.style( '${ k }', '${ v }' )` );
  ctx.node.style[ k ] = v;
  ctx.layer.exits.push( () => { ctx.node.style.removeProperty( k ); } );
};


itag0.select = () => ctx => { ctx.node.select(); }
itag1.log = msg => ctx => { console.log( msg, ctx ); };


// TAGS -- TIME

itag2.after = ( delay ) => ( trans ) => ( ctx ) => {
  const timer_id = setTimeout( Send( ctx, trans ), delay );
  ctx.layer.exits.push( () => { clearTimeout( timer_id  ); } )
};

itag2.every = ( delay ) => ( trans ) => ( ctx ) => {
  const timer_id = setInterval( Send( ctx, trans ), delay );
  ctx.layer.exits.push( () => { clearInterval( timer_id  ); } )
};


// TAGS -- BINDINGS

// [ itag2.on( <str event> ), <fn local-transition> ] -- local anonymous transition
itag2.on = ( eventName ) => ( trans ) => ( ctx ) => {
  const ground = ctx.layer;
  const handler = ( ev ) => {                         //   TRANSITION 
    // console.log( eventName, trans, ctx, ev )
    const vs = GetValues( ground );                   //   1. get value
    DisembodyHere( ground );                          //   2. disembody
    const vs_ = trans( ...vs );                       //   3. calculate new value
    EmbodyValues( project( { values: vs_ }, ctx ) );  //   4. embody
    Observe();
  }

  ctx.node.addEventListener( eventName, handler );
  ctx.layer.exits.push( () => ctx.node.removeEventListener( eventName, handler ) )
  Observe();
};

// [ itag2.on( <str event> ), <fn local-transition> ] -- local anonymous transition
itag2.state = ( entryEvent ) => ( fn ) => ( ctx ) => {
  const ground = ctx.layer;
  ground.inp = ( v ) => { ctx.node.value = v; }; // set @inp so init code can unify on upper embodiment
  const handler1 = ( ev ) => {
    const vs_ =  fn( ev );
    DisembodyHere( ground );
    EmbodyValues( project( { values: vs_ }, ctx) );
    Observe();
  }
  
  // INIT
  
  ground.trans[ 'INIT' ] = handler1( { target: ctx.node } );
  ctx.node.addEventListener( entryEvent, handler1 )
  ctx.layer.exits.push( () => ctx.node.removeEventListener( entryEvent, handler1 ) )
  Observe();
};

// TAGS -- VERTICAL

// [ itag2.xlay, ( <val> → <itag> ) ]
// [ itag2.xlay, { <val> : <itag> } ]
itag2.xlay = _name => xlay => ctx => ctx.layer.xlays.push( xlay ); // todo: support lexical scoping of <node>

// [ Fn, <str key>, <cafn> ]
itag2.tran = k => v => ctx => ctx.layer.trans[ k ] = v;


// 4. EMBODIMENTATIION

const GetValues = ground => ground && Object.hasOwn( ground, 'val' )? [ ground.val, ...GetValues( ground.upper ) ]: [ ];
const DisembodyHere = ground => {
  
  if( !isObject( ground ) ) return; // nothing to disembody
  // disembody upper layers
  if( ground.upper ){
    DisembodyHere( ground.upper );
    ground.upper.exits.reverse().forEach( Case
      ( isFunction , fn => fn()
      , isNode     , nd => nd.parentNode.removeChild( nd ) 
      )
    );
    ground.upper.exits=[];
  }
  // disembody branchings
  if( isObject( ground.value ) ) for( let [ _k, v ] of Object.entries( ground.value ) ) Disembody( v ) ;

};

const mk_layer = ( ground ) => {
  const lay = 
    { env   : {}
    , exits : []
    , trans : {}
    , xlays : []
    , lower : ground
    , val: undefined
    }
  ;
  ground.upper = lay;
  return lay;
}

// maybe_eval( <fn> | <value> )
const maybe_eval = x => isFunction( x )? x(): x;

const as_fn = Case
  ( isObject   , obj => k => obj[ k ]
  , isFunction , fn  => fn
  )
;

const EmbodyValues = ( ctx ) => {
  // console.log('EmbodyValues',ctx)
  const ground = ctx.layer;
  let [ v, ...vs ] = ctx.values;
  v = v !== undefined? v : maybe_eval( ground.trans.INIT ); // default value
  ground.val = v; // här borde märkas ifall @val unifierats

  if( Object.hasOwn( ground, 'inp' ) ) ground.inp( v );
  const ctx_ = project( { values: vs }, ctx );
  const lays = ground.xlays.map( xlay => as_fn( xlay )( v ) );
  for( let block of lookup2( ground, 'block') ) lays.push([ itag1.class, `${ block }--${ ctx.values.join( '--' ) }` ]);
  EmbodyLayers( ...lays )( ctx_ );
};

const EmbodyLayers = ( ...lays ) => ( ctx ) => {
  // console.log('EmbodyLayers',ctx)
  const ground = ctx.layer;
  const upper = mk_layer( ground );
  const ctx_ = project({ layer: upper }, ctx ); // project new layer
  for( let lay of lays ) itag2fn( lay )( ctx_ );
  if(  ctx_.values.length >= 1 || upper.trans[ 'INIT' ] !== undefined  ) EmbodyValues( ctx_ );
  return upper;
};


// SYNTAX

// well-behaved split; 
// + trims off leading and trailing white-space
// + empty input string returns empty array
const trimsplit = ( re, str ) => {
  // console.log(  re, str )
  str = str.trim();
  if( !str ) return [];
  return str.split( re );
};

const normal_form = ( itg, ...args ) => {
  // console.log( `[ ${ itg } ${ args.join(' ') }, ... ]` );
  return itag2[ itg]( ...args );
};

itag_head2fn = Match
  ( _Function                      , ( fn )        => fn               // already in functional form
  // Bracket form 
   , /^<(\S+?)>/                   , ( tag, rest ) => normal_form( 'mk', tag, ...trimsplit( /\s+/, rest ) )  // a named tag creation

  // itag1
  , /^html\s*$/                    , ()            => itag1.html 

  // Word prefix form -- time  
  , /^(after|every) +([0-9.]+)s$/  , ( itg, ms )   => normal_form( itg, ( parseFloat( ms ) ) )
  , /^(after|every) +([0-9.]+)ms$/ , ( itg, ms )   => normal_form( itg, ( parseFloat( ms ) ) )

  // Word prefix form, general
  , /^([a-zA-Z]\S+)\s*/            , ( itg, rest ) => normal_form( itg , ...trimsplit( /\s+/, rest ) )  

  // Symbol prefix form
  , /^!(\S+)$/                     , ( n )         => itag2.on   ( n )          // event binding
  , /^=(\S+)$/                     , ( n )         => itag2.on   ( n )          // state binding
  , /^->(\S+)$/                    , ( tr )        => itag2.tran ( tr )         // fn or named transition
  , /^\^(\S+)$/                    , ( name )      => itag2.xlay ( name )       // a named xlayer
  , /^\/(\S+)$/                    , ( k )         => itag2.slot( k )          // class
  , /^\.(\S+)$/                    , ( k )         => () => itag1.class( k )          // class
  )
;

const itag2fn = Case
  ( isFunction , fn => fn
  , isArray    , ([ head, ...args ]) => itag_head2fn( head )( ...args ) // let head decide syntax of tags
  , isString   , str => itag1.textnode( str )
  , isNumber   , num => itag1.textnode( num.toString() )
               , x   => { throw `non-exhausitve clauses in itags for input ${ x }`}  
  )
; 



// Demo / Test

const test_cond = Match
  ( 42             , _ => `FortyTwo`
  , isObject    , x => `Object` // första ordnignens pred-fn konverteras till CPS patterns
  , /^(\d+)..(\d+)$/ , ( a, b ) => `Range from ${a} to ${b}`
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