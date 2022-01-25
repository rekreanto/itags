// Eval
const Eval = 
  ( texp, state, ctx ) => 
{ 
// RUN the tags
  $.syntax.itag( texp )( ctx );
// CO-RECUR with State
  State( ...state )( ctx.layer );
};

// ground actions

// Trans( <fn>|<str> )
const Trans = Match
    ( '..', ( _, ...xs ) => ground => Trans( ...xs )( ground.lower )
    , _Function , fn  => ground => ground.transition( fn )
    , _String   , key => ground => 
      ground.trans[ key ]
        ? Trans( ground.trans[ key ] )( ground )
        : Trans( key )( ground.lower )
    ) 
;
const State = Match
  ( '..', ( _, ...xs ) => ground => State( ...xs )( ground.lower )
        , ( ...vals ) => ground => ground.embodyState( vals )
  );
// the lookup method
function lookup( key ){
  if( Object.hasOwn( this.env, key ) ) return this.env[ key ]; // SUCCESS
  if( !this.lower ) throw `No entry for the key ${ key }'}`; // DETECT FAILURE
  return this.lower.lookup( key ); // RECUR DOWNWARDS
}


// Layer constructor
const Layer = ( lower ) => {
  const lay = 
    { lower         // ref to lower layer
    , env: {}       // mapping from keys to nodes; used to let the layer stack behave as one object statically; the layered nature is used only for change
    , exits: []     // representation of the current embodiment
    , trans: {}
    , lookup        // the lookup method
    , getState( arr=[] ){ /* BASE CASE */ return arr; }
    , embodyState( ){ /* BASE CASE */ }
    , disembodyState( ){ /* DISEMBODY BASE CASE */ }
    }
  ;
  if( lower ) lower.upper = lay;
  return lay;
};


// Mixin methods
// namespaces
$.mixin       = {};
$.mixin.args  = {};
$.mixin.oneof = {};
$.mixin.allof = {};



// args

$.mixin.args.getState = function( arr=[] ){
  arr.push( ...this.val )
// RECUR UPWARDS
  if( this.upper ) this.upper.getState( arr );
// RETURN result for convenience
  return arr;
};

$.mixin.args.disembodyState = function(){
  if( this.upper ) {
    this.upper.disembodyState();
    for( let exit of this.upper.exits ) exit();    
  };
}

$.mixin.args.embodyState = function( arr ){
  this.val = arr;
// DISEMBODY 
  this.disembodyState();
  if( arr.length === 0 ) return arr = this.trans['INIT']()( this );
// MAKE new layer
  const layer = Layer( this )
// EMBODY
  for( let { ctx, embo } of this.embos ){
    const syntexp = embo( ...this.val );
    const texp = $.syntax.itag( syntexp );
    Eval( texp, [], Context({ layer }, ctx ) );
  };  
};

$.mixin.args.transition = function( trans ){
  const state = this.getState();
  // console.log( "state",state );
  const gact = trans( ...state );
  gact( this );
};



// oneof

$.mixin.oneof.getState = function( arr=[] ){
  arr.push( this.val )
// RECUR UPWARDS
  if( this.upper ) this.upper.getState( arr );
// RETURN result for convenience
  return arr;
};

// unchanged
$.mixin.oneof.disembodyState = function(){
  if( this.upper ) {
    this.upper.disembodyState();
    console.log( "EXITING",...this.upper.exits)
    for( let exit of this.upper.exits ) exit();    
  };
}

$.mixin.oneof.embodyState = function( arr ){
// DISEMBODY 
  this.disembodyState();
  console.log( 'state', ...arr );
  // INIT
  if( arr.length === 0 ) return this.trans['INIT']()(this);
  const [ x, ...xs ] = arr;
  this.val = x;
// MAKE new layer
  const layer = Layer( this )
// EMBODY
  for( let { ctx, embo } of this.embos ){
    const syntexp = embo[ this.val ];
    if( syntexp !== undefined ){
      const texp = $.syntax.itag( syntexp );
      Eval( texp, xs, Context({ layer }, ctx ) );
    }
  };  
};

$.mixin.oneof.transition = function( trans ){
  const state = this.getState();
  // console.log( "state",state );
  // this.disembodyState();
  const groundaction = trans( ...state );
  groundaction( this );
};




// allof

$.mixin.allof.getState = function( arr=[] ){
  const s = {};
  arr.push( s );
// RECUR UPWARDS
  for( let [k,lay] of Object.entries( this.uppers )){
    s[k] = lay.getState();
  }
// RETURN result for convenience
  return arr;
};

// unchanged
$.mixin.allof.disembodyState = function(){
  h
  if( this.upper ) {
    this.upper.disembodyState();
    console.log( "EXITING",...this.upper.exits)
    for( let exit of this.upper.exits ) exit();    
  };
}

$.mixin.allof.embodyState = function( [ obj ] ){
// DISEMBODY 
console.log("ALLOF-----", obj )
// INIT
// MAKE new layer
// EMBODY
  for( let { ctx, embo } of this.embos ){
    const syntexp = embo[ this.val ];
    if( syntexp !== undefined ){
      const texp = $.syntax.itag( syntexp );
      Eval( texp, xs, Context({ layer }, ctx ) );
    }
  };  
};

$.mixin.oneof.transition = function( trans ){
  const state = this.getState();
  // console.log( "state",state );
  // this.disembodyState();
  const groundaction = trans( ...state );
  groundaction( this );
};

