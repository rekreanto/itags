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
  document.querySelectorAll('script.listing-here-new').forEach(
    ( el ) => {
      const listing = document.createElement( 'pre' );
      const code = document.createElement( 'code' );
      listing.classList.add('listing-here-new');
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
  hljs.configure({ ignoreUnescapedHTML: true });
  // find all <script> tags
  document.querySelectorAll('script.listing-here-old').forEach(
    ( el ) => {
      const listing = document.createElement( 'pre' );
      const code = document.createElement( 'code' );
      listing.classList.add('listing-here-old');
      listing.appendChild( code );
      const txt = el.textContent;
      // normalize trailing whitespace
      code.textContent = `${ txt.trimEnd() }\n\n`; 
      code.classList.add('language-js');
      el.parentNode.insertBefore(listing, el);
      hljs.highlightElement( listing );
  });
});

// common navigation elements for the document
document.addEventListener('DOMContentLoaded', ( ) => {
  const el = document.querySelector( '#docnav' )
  el.innerHTML = `
  Itags impl ch 
  <nav class="LitProgEssay__ch-nav "><a class="LitProgEssay__ch-link" href="ch1.html">1</a>
  <a class="LitProgEssay__ch-link" href="ch2.html">2</a>
  <a class="LitProgEssay__ch-link" href="ch3.html">3</a>
  <a class="LitProgEssay__ch-link" href="ch4.html">4</a>
  
  </nav>`

});