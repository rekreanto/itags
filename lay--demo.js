// highlight all
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
});

// reflect code listings into the document
document.addEventListener('DOMContentLoaded', ( ev ) => {
  hljs.configure({ ignoreUnescapedHTML: true });
  // find all <script> tags
  document.querySelectorAll('script.demo-here').forEach(
    ( el ) => {
      const listing = document.createElement( 'pre' );
      const code = document.createElement( 'code' );
      listing.classList.add('demo-here');
      listing.appendChild( code );
      const txt = el.textContent;
      // normalize trailing whitespace
      code.textContent = `${ txt.trimEnd() }\n\n`; 
      code.classList.add('language-js');
      el.parentNode.insertBefore(listing, el);
      hljs.highlightElement( listing );
  });
});


document.addEventListener('DOMContentLoaded', (event) => {
  hljs.configure({ ignoreUnescapedHTML: true });
  // find all <script> tags
  document.querySelectorAll('script.listing-here').forEach((el) => {
    const listing = document.createElement( 'pre' );
    const code = document.createElement( 'code' );
    listing.appendChild( code );
    const txt = el.textContent;
    // normalize trailing whitespace
    code.textContent = `${ txt.trimEnd() }\n\n`; 
    listing.classList.add
      ( 'language-js'
      , 'listing-here'
      )
    ;
    el.parentNode.insertBefore(listing, el);
    hljs.highlightElement( listing );
  });
});



// show and render demo code
document.addEventListener('DOMContentLoaded', ( ev ) => {
  // find all <script> tags
  document.querySelectorAll('script.demo-here.active').forEach(
    ( el ) => {
    // create and mount demo output element
      const output = document.createElement( 'div' );
      output.classList.add('demo-output-here');
      el.after( output );
    // get code
      const txt = el.text;
    // eval code
      const raw = eval( txt );
    // interpret result as itag
      const fn = raw.itag( output ); // as_itag( raw_result );
    // make context
      const ctx = { node: output };
    // give context to itag

  });
});



// convenience methods
const stack = [];
const undo = () => {
// BASE case
  if( stack.length === 0 ){
    console.warn( "nothing more to undo" );
    return;
  }
// UNDO LAST on stack
  stack.pop().disembodyState();
};

// === Convenience method for itag syntax ===
const itag_method = function( ...mctx ){
  const ctx = Context( ...mctx );
  // console.log( "ctx", ctx );
  // $.syntax.itag( this )( ctx );
  Eval( this, [ ], ctx );
  stack.push( ctx.layer  );
}
Function.prototype.itag = itag_method;
Array.prototype.itag  = itag_method;
String.prototype.itag = itag_method;
Number.prototype.itag = itag_method;