; Types

(type (identifier) @type)
(type (struct_type (struct_type_fields (identifier) @variable.other.member)))

; Function and Method calls

(call (member key: (identifier) @function.method))

(call (identifier) @function)
(function (identifier) @function)
(extern_function (identifier) @function)

; Parameters

(parameters (identifier) @variable.parameter)

; Variables

(module_specifier (identifier) @namespace)

(member key: (identifier) @variable.other.member)
(identifier) @variable

; Literals

(int) @constant.numeric.integer
(float) @constant.numeric.float

(string) @string
(character) @constant.character

; Comments

(comment) @comment

; Keywords

"fn" @keyword.function

"while" @keyword.control.repeat

"return" @keyword.control.return

[
 "if"
 "else"
 "switch"
] @keyword.control.conditional

[
 "module"
 "import"
] @keyword.control.import

[
 (break)
 (continue)
 "defer"
] @keyword.control

"as" @keyword.operator

[
 "var"
 "type"
 "struct"
 "enum"
] @keyword.storage.type

[
 "extern"
 "export"
 "const"
] @keyword.storage.modifier

[
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
  "<<"
  ">>"
  "&"
  "^"
  "|"
  "<"
  ">"
  "=="
  "="
] @operator


; Punctuation

[
  ","
  "."
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
