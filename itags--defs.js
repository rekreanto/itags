// PRELUDE

// prelude -- predicates

// prelude -- patterns

// prelude -- adapters
let Case;  // Case( ( <pred>, <fn> )+ | <fn> )
let Match; // Match( ( <pattern>, <fn> )+ | <fn> )


// SYNTAX

// syntax -- itags2fn
let itagFromSyntax;
let itagFromHeadSyntax;


// TAGS

// tags -- h_ build
let itag2.block;      // [ itag2.block, <itag>* ]
let itag2.mk;         // [ itag2.mk( <tag>, <role>? ), <itag>* ] 
let itag2.the;        // [ itag2.the( <role> ), <itag>* ] 

// tags -- h_ modify
let itag2.attr;       // [ itag2.attr, <str key>, <str val>  ]
let itag1.Class;      // [ itag1.Class, <str>+ ]
let itag1.Style;      // [ itag1.Style, <str key>, <val> ]

// tags -- hv bind
// ... alt 
let itag2.on;         // [ Bind( <str event> ), <transition>, <arg>* ]

// tags -- hv extend
let In;      // [ In( <str state> ), <arg>+ ]
             // [ In( <str ev entry>, <str ev exit> ), <arg>+  ]
// ex: [ In( focused ), ev => ev.target.name ]

// ex: [ In( mousemoved ), ev => [ ev.clientX, ev.clientY ] ]
// ex: [ In( mousemoved ), position ]

// ex: [ In( selected ), ev => ev.value ]
// ex: [ In( selected ), value ]

// ex: [ In( selected/multiple ), ev => { ev.target.name, ev.target.value ]
// ex: [ In( selected/multiple ), key_value ] -- selected/multiple set existence of key-value pair


// ex: [ In( checked ), ev => ev.value ]
// ex: [ In( checked ), value ]

// ex: [ In( checked ), ev => { ev.name: ev.value } ] 
// ex: [ In( checked ), key_value ] -- checkboxes set existence of key-value pair






// ...

// -- how to extend existing html states??? same signature as layer? 

// tags -- _v build
let Layer;      // [ Layer, ( <val> → <itag> ) ]     -- can have multiple features?
                // [ Layer, { <val> : <itag> } ]


// tags -- _v modify
let Val;        // [ Val, <atom> | <> → <atom> ]     -- constructor (arity 0)
                // [ <cand> → <bool> ]               -- typechecker (arity 1)

let Fn;         // [ Fn, ( <str key>, <cafn> )+  ]
                // [ Fn, { <str key>: <cafn> }  ]


// tags -- _v split
let Slot;       // [ Slot( <str key> ), <itag>* ]    -- selects on instr of ctx







