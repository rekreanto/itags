$$.layer = {};

class Layer_ {
  constructor( ){
    this.h_env = {};
    this.h_vals = [];
/*     this.lower = ground;
    ground.upper = this; */
  }
  // used by $$2.the( <str key> )
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
