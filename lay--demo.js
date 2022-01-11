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



// reflect code listings into the document
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

