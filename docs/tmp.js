itag_head2fn = Match
/* tag creation */  ( /^<\S+?>/      , ( tag_name   , rest ) => itag[ 'mk'        ]( tag_name, ...trimsplit( /\s+/ )( rest ) ) 
/* word   itag  */  , /^([a-z]\S+)$/ , ( itag_name  , rest ) => itag[ itag_name   ]( ...trimsplit( /\s+/ )( rest ) )             
/* prefix itag  */  , /^(_|[^\w\s])/ , ( itag_symbol, rest ) => itag[ itag_symbol ]( ...trimsplit( /\s+/ )( removeEventListener ) )
                    )
;