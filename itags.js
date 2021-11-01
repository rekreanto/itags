// PRELUDE


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
const areMany    = ( ...xs ) => 1 < xs.length;
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

const pred2pat = ( p ) => ( ...xs ) => ( succ, fail ) => ( p( ...xs )? succ: fail )( ...xs );

const _Array    = pred2pat ( isArray ) ;
const _Boolean  = pred2pat ( isBoolean ) ;
const _Function = pred2pat ( isFunction ) ;
const _Number   = pred2pat ( isNumber ) ;
const _Object   = pred2pat ( isObject ) ;
const _RegExp   = pred2pat ( isRegExp ) ;
const _String   = pred2pat ( isString ) ;
const _Symbol   = pred2pat ( isSymbol ) ;
const _Node     = pred2pat ( isNode ) ;

const _isNaN    = pred2pat ( isNaN ) ;

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


const _re = re => str => ( succ, fail ) => {
  const md = re.exec( str );
  return md? succ( ...md.slice( 1 ) ): fail( str );
};

const as_pattern = Case
    ( isFunction , fn => fn
    , isString   , _eq
    , isNumber   , _eq
    , isRegExp   , _re
    , isArray    , _zip 
    )
  ;

// prelude -- patterns

// Match( ( <pattern>, <fn> )+ | <fn> )
const Match = ( ...pfs ) => ( ...xs ) => {
  if( pfs.length === 0 ) throw `Non-exhaustive clauses in Match for ${pfs}, ${xs}`;  // non-exhaustive clauses
  if( pfs.length === 1 ) return pfs[0]( ...xs );    // default clause
  if( pfs.length > 1 ){ 
    let [ p, f, ...rest ] = pfs;
    return as_pattern( p )( ...xs )( f, () => Match( ...rest )( ...xs ) );
  }; // recursive case
};


// SYNTAX

const TextNode = ( ...strs ) => ( ctx ) => {
  const el = document.createTextNode( strs.join( '' ) );
  ctx.node.appendChild( el );
  ctx.layer.exit.push( el );  // store exit
}; // entry 

itag_head2fn = Match
  ( _Function                           , ( fn )       => fn              // already in functional form
  , /^the +([a-z\-]+)$/                 , ( n )        => The( n )        // a tag reference
  , /^<([a-z0-9\-]+)>$/                 , ( tag )      => Mk( tag )       // an unnamed tag creation
  , /^<([a-z0-9\-]+)> +([a-z0-9\-]+)$/  , ( tag, key ) => Mk( tag, key )  // a named tag creation
  , /^on +([a-z\-]+)$/                  , ( n )        => On( n )         // a tag reference
  )
;

const itag2fn = Case
  ( isFunction , fn => fn
  , isArray    , ([ head, ...args ]) => itag_head2fn( head )( ...args ) // let head decide syntax of tags
  , isString   , str => TextNode( str )
  , isNumber   , num => TextNode( num.toString() )
               , x   => { throw `non-exhausitve clauses in itags for input ${ x }`}  
  )
; 


// TAGS -- HORIZONTAL

const project = ( ...ctxs ) =>  Object.assign( {}, ...ctxs.reverse() ); // inefficient

const as_xlayer = Case
    ( isFunction , fn  => fn
    , isObject   , obj => key => obj[ key ]
    )
;

const mk_layer = ( ground ) => {
  const lay = 
    { trans    : {}
    , exit     : []
    , env      : {}
    , xlayers  : []
    , lower    : ground
    }
  ;
  ground.upper = lay;
  return lay;
};

// [ Layer, <itag>* ]  
const Layer = ( ...itags ) => ( ctx ) => {
  for( let itag of itags ) itag2fn( itag )( ctx );      // process itag syntax
  // Embody xlayers
  const lay = mk_layer( ctx.layer );
  const ctx_ = project( { layer: lay }, ctx );
  for( xlay of ctx.layer.xlayers ){
    const itg = as_xlayer( xlay )( ctx.layer.value );
    itag2fn( itg )( ctx_ );   // embody in new layer
  }

}; // entry 


// tags -- h_ build
// [ BaseLayer( <name> ), <itag>* ]  
const BaseLayer = ( name ) => ( ...itags ) => ( ctx ) => {
  ctx.layer.base = name;
  Layer( ...itags )( ctx );
}; // entry


// [ Mk( <tag>, <role>? ), <itag>* ] 
const Mk = ( tag, key ) => ( ...itags ) => ( ctx ) => {
  const el = document.createElement( tag );      // create elem
  ctx.layer.exit.push( el );                     // store exit effect
  if( key ) ctx.layer.env[ key ] = el;           // make elem referable
  Layer( ...itags )( project( { node: el }, ctx ) );   // process child itags 
  ctx.node.appendChild( el );                    // mount element
}; // entry 


const lookup = ( k, lay ) => lay.env.hasOwnProperty( k )? lay.env[ k ]: lookup( k, lay.lower );

// [ The( <key> ), <itag>* ] 
const The = ( key ) => ( ...itags ) => ( ctx ) => {
  // process child itags in horizontally projected context
  const nd = lookup( key, ctx.layer );
  Layer( ...itags )( project( { node: nd }, ctx ) );
}; // entry

const Each__Arr = xs => x2itag => ctx => {
  for( let x of xs ) itag2fn( x2itag( x ) )( ctx );
};

const Each__NumNum = ( a, b ) => x2itag => ctx => {
  let N = Math.abs( b - a );
  let m = Math.min( a, b );
  let n = 0;
  while( n <= N ) itag2fn( x2itag( m + n++ ) )( ctx );
};
const Each = Case
  ( isArray  , Each__Arr
  , isNumber , Each__NumNum 
  )
;


// tags -- h_ modify
// [ Attr, <str key>, <str val>  ]
const Attr = ( attr, val ) => ( ctx ) => {
  // prepare
  const isShadowed = ctx.node.hasAttribute( attr );
  const shadowedValue = ctx.node[ attr ];
  // change
  ctx.node[ attr ] = val;
  ctx.layer.exit.push( 
    () => {
      if( isShadowed ) ctx.node[ attr ] = shadowedValue; // remove and restore handler
      else ctx.node.removeAttribute( attr );      // remove handler
    } 
  )
};

// [ Class, <str>+ ]
const Class = ( ...cls ) => ( ctx ) => {
  const added_classes = cls.filter( cl => !ctx.node.classList.contains( cl ) );
  for( let cl of added_classes ) ctx.node.classList.add( cl );
  ctx.layer.exit.push(
    () => {
      for( let cl of added_classes ) ctx.node.classList.remove( cl );
    }
  );
}; // entry 

// [ Style, <str key>, <val> ]
const Style = ( k, v ) => ( ctx ) => {
  const orig = ctx.node.style[ k ];
  ctx.node.style[ k ] = v;
  ctx.layer.exit.push(
    () => {
      ctx.node.style[ k ] = orig;
    }
  );
}


// TAGS -- BINDINGS

// tags -- hv bind
// [ On( <str event> ), <fn local-transition> ] -- local anonymous transition
let On = ( eventName ) => ( trans ) => ( ctx ) => {
  const ground = ctx.layer;
  const handler = ( ev ) => {
    // TRANSITION:
    //   1. get value
    const vs = [ ground.value ];
    //   2. disembody
    DisembodyHere( ground.upper );
    //   3. calculate new value
    const vs_ = trans( ...vs ) // assume local anonymous transition
    //   4. embody
    EmbodyHere( ctx, ...vs_ );
  }
  ctx.node.addEventListener( eventName, handler )
  ctx.layer.exit.push( () => ctx.node.removeEventListener( eventName, ( handler ) ) )
};


const DisembodyHere = lay => {
  lay.exit.reverse().forEach( Case
    ( isFunction , fn => fn()
    , isNode     , nd => nd.parentNode.removeChild( nd ) 
    ) 
  );
  lay.exit=[];
};


const EmbodyHere = ( ctx, v, ...vs ) => {
  const ground = ctx.layer;
  ground.value = v;                                     // set ground value
    // Embody xlayers
  const lay = mk_layer( ground );                       // make upper layer w linkning
  const ctx_ = project( { layer: lay }, ctx );          // make new context w layer one vertical step up
  for( xlay of ground.xlayers ){                        // calcualte & embody layers from the xlayer defs
    const itg = as_xlayer( xlay )( ctx.layer.value );
    itag2fn( itg )( ctx_ );
  }
};


// tags -- hv extend
let In;      // [ In( <str state> ), <arg>+ ]
             // [ In( <str ev entry>, <str ev exit> ), <arg>+  ]
// ex: [ In( focused ), ev => ev.target.name ]

// ex: [ In( mousemoved ), ev => [ ev.clientX, ev.clientY ] ]
// ex: [ In( mousemoved ), position ]

// ex: [ In( selected ), ev => ev.value ]
// ex: [ In( selected ), value ]

// ex: [ In( selected/multiple ), ev => { ev.target.name, ev.target.value ]
// ex: [ In( selected/multiple ), key_value ] -- selected/multiple set existence of key-value pair


// ex: [ In( checked ), ev => ev.value ]
// ex: [ In( checked ), value ]

// ex: [ In( checked ), ev => { ev.name: ev.value } ] 
// ex: [ In( checked ), key_value ] -- checkboxes set existence of key-value pair





// TAGS -- VERTICAL

// [ xLayer, ( <val> → <itag> ) ]
// [ xLayer, { <val> : <itag> } ]
const xLayer = xlay => ctx => ctx.layer.xlayers.push( xlay ); // todo: support lexical scoping of <node>

// [ Init, <val> ]     -- constructor (arity 0)
const Init = v => ctx => ctx.layer.value = v;

// [ Fn, <str key>, <cafn> ]
const Trans = ( k, v ) => ctx => ctx.layer.fn[ k ] = v;





// ---------- Run-time ----------

// transactions


