// Eval
const Eval = 
  ( texp, vals, ctx ) => 
{ 
// RUN the tags
  $.syntax.itag( texp )( ctx );
// CO-RECUR with State
  // console.log( 'ground', ctx.layer );
  State( ...vals )( ctx.layer );
};

// ground actions
const Trans = fn => ground => ground.transition( fn );

const State = ( ...vals ) => ground => ground.embodyState( vals );

// the lookup method
function lookup( noun )
{
// SUCCESSFUL lookup
  if( Object.hasOwn( this.env, noun ) ){
    return this.env[ noun ];
  }
// DETECT FAILURE
  if( !this.lower ) throw `No entry for the noun ${ noun }'}`
// LOOKUP in lower layer
  return this.lower.lookup( noun );
}


// Layer constructor
const Layer = ( lower ) => {
  const lay = 
    { lower         // ref to lower layer
    , env: {}       // mapping from keys to nodes; used to let the layer stack behave as one object statically; the layered nature is used only for change
    , exits: []     // representation of the current embodiment
    , lookup        // the lookup method
    , getState( arr=[] ){ /* BASE CASE */ return arr; }
    , embodyState( ){ /* BASE CASE */ }
    }
  ;
  return lay;
};


// Mixin methods
const args_getState = function( arr=[] ){
  arr.push( ...this.val )
// RECUR UPWARDS
  if( this.upper ) this.upper.getState( arr );
// RETURN result for convenience
  return arr;
};

const args_embodyState = function( arr ){
  this.val = arr;
// MAKE new layer
  const layer = Layer( this )
  layer.hej= this  
// EMBODY
  for( let { node, embo } of this.embos ){
    const syntexp = embo( ...this.val );
    const texp = $.syntax.itag( syntexp );
    Eval( texp, [], { node, layer } );
  };  
};

const args_transition = function( trans ){

}