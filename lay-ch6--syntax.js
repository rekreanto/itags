// well-behaved split; 
// + trims off leading and trailing white-space
// + empty input string returns empty array
const trimsplit = 
  str => {
// FIX the bad edge case  ''.split(' ') ~> ['']
  if( !str ) return [];
// SPLIT on whitespace
  const re = /\s+/;
// TRIM
  str = str.trim();
// RETURN the actual splitting
  return str.split( re );
};

// Metatag Syntax
$.syntax.head = Match
  ( _Function        , fn => fn
// GENERAL metatag syntax
  , /^([a-z]\S*)/    , ( metatagname, argstr )  => $2[ metatagname ]( ...trimsplit( argstr ) )
// SPECIAL metatag syntaxes
  , /^<([^>]+?)>$/   , argstr    => $2.tag( ...trimsplit( argstr ) )
  , /^<([^>]+?)>$/   , tagname   => $2.tag( tagname )
  , /^<>(\S+)$ /     , blockname => $2.block( blockname )  
  , /^~(\S+)$/       , propname  => $2.style( propname )  
  )
;
// Itag Syntax
$.syntax.itag = Match
  ( _Function , fn => fn
  , _String   , str => $1.textnode( str )
  , _Number   , n   => $1.textnode( n.toString() )
  , _Array    , ([ head, ...args ]) =>
                  $.syntax.head( head )( ...args )
  )
;