// Metatag Syntax
$.syntax.head = Match
  ( _Function        , fn => fn
    , /^after\s+([0-9.]+)s$/ , str => $2.after( parseFloat( str )*1000 )
    , /^after\s+([0-9.]+)ms$/ , str => $2.after( parseFloat( str ) )
    // GENERAL metatag valence-2 syntax
  , /^([a-z]\S*)$/    , ( metatagname )  => $1[ metatagname ]    
// GENERAL metatag valence-2 syntax
  , /^([a-z]\S*)\s+/    , ( metatagname, argstr )  => $2[ metatagname ]( ...trimsplit( argstr ) )
// SPECIAL metatag syntaxes

, /^<([^>]+?)>$/   , argstr    => $2.tag( ...trimsplit( argstr ) )
  , /^<([^>]+?)>$/   , tagname   => $2.tag( tagname )
  , /^<>(\S+)$/      , blockname => $2.block( blockname )  
  , /^~(\S+)$/       , propname  => $2.style( propname )  
  , /^@(\S+)$/       , propname  => $2.attr( propname )  
  , /^:/             , valuesyntax => $2.value( valuesyntax )
  , /^!/             , eventsyntax => $2.bind_event( eventsyntax )  
  , /^=/             , eventsyntax => $2.bind_state( eventsyntax )  
  , /^_/             , layersyntax => $2.layer( layersyntax ) 
 
  // TRANSITION definition
  , /^([A-Z_]+)$/    , transname => $2.trans( transname )
  , /^\/$/           , () => $1.embo
  , /^\/(\S+)$/      , ( key ) => $2.embo( key )
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