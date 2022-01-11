// namespaces for metatags
const $1 = {}; // valence 1
const $2 = {}; // valence 2

// namespace for other stuff
const $ = {};

// namespace for syntax utils
$.syntax = {};


// convenience methods
const stack = [];
const undo = () => {
  if( stack.length === 0 ){
    console.warn( "nothing more to undo" );
    return;
  }
// UNDO LAST on stack
  for( let exit of stack.pop() ) exit();
};

// === Convenience method for itag syntax ===
const itag_method = function( ...mctx ){
  const ctx = Context( ...mctx );
  $.syntax.itag( this )( ctx );
  stack.push( ctx.layer.exits  );
}
Function.prototype.itag = itag_method;
Array.prototype.itag = itag_method;
String.prototype.itag = itag_method;
Number.prototype.itag = itag_method;