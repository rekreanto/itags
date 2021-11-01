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
let Block;      // [ Block, <itag>* ]
let Mk;         // [ Mk( <tag>, <role>? ), <itag>* ] 
let The;        // [ The( <role> ), <itag>* ] 

// tags -- h_ modify
let Attr;       // [ Attr, <str key>, <str val>  ]
let Class;      // [ Class, <str>+ ]
let Style;      // [ Style, <str key>, <val> ]

// tags -- hv bind
// ... alt 
let On;         // [ Bind( <str event> ), <transition>, <arg>* ]

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







