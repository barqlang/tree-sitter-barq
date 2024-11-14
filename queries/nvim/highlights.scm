
; Variables

(identifier) @variable
(member key: (identifier) @variable.member)

; Parameters

(parameters (identifier) @variable.parameter)

; Types

(type (identifier) @type)
(type (struct_type (identifier) @variable.member))
(type_alias (identifier) @type.definition)

; Function and Method calls

(function (identifier) @function)
(extern_function (identifier) @function)

(call (identifier) @function.call)
(call (member key: (identifier) @function.method.call))

; Literals

(int) @number
(float) @number.float

(string) @string
(character) @character

; Comments

(comment) @comment

; Keywords

"fn" @keyword.function

"return" @keyword.return

[
 "while"
 (break)
 (continue)
] @keyword.repeat

[
 "if"
 "else"
] @keyword.conditional

[
 "struct"
 "enum"
] @keyword.type

"const" @keyword.modifier

"as" @keyword.operator

[
 "extern"
 "var"
 "type"
 "asm"
] @keyword

; Operators

[
  "&"
  "~"
  "+"
  "-"
  "/"
  "*"
  "%"
  "<"
  ">"
  "=="
  "="
] @operator


; Punctuation

[
  "."
  ","
  ";"
] @punctuation.delimiter

[
 "("
 ")"
 "["
 "]"
 "{"
 "}"
] @punctuation.bracket
