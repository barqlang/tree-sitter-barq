/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//

/**
 * @param {Rule} rule
 *
 * @return {Rule}
 */
function commaSeparated(rule) {
    return seq(rule, repeat(seq(",", rule)));
}

module.exports = grammar({
    name: "barq",

    extras: ($) => [$.comment, /\s/],

    precedences: (_) => [
        [
            "subscript",
            "call",
            "prefix",
            "cast",
            "shift",
            "bit_and",
            "bit_xor",
            "bit_or",
            "product",
            "sum",
            "comparison",
            "assign",
        ],
    ],

    word: ($) => $.identifier,

    rules: {
        module: ($) => repeat($._top_level),

        _top_level: ($) =>
            choice(
                seq($.module_specifier, ";"),
                seq($.import, ";"),
                $.global_assembly,
                $.public,
                seq($.constant, ";"),
                $.variable,
                seq($.extern_variable, ";"),
                $.function,
                seq($.extern_function, ";"),
                seq($.type_alias, ";"),
            ),

        _statement: ($) =>
            choice(
                seq($.constant, ";"),
                $.variable,
                $.switch,
                $.if,
                $.while,
                seq($.break, ";"),
                seq($.continue, ";"),
                $.defer,
                $.return,
                seq($._expression, ";"),
            ),

        module_specifier: ($) => seq("module", $.identifier),

        public: ($) =>
            seq(
                "pub",
                choice(
                    seq($.constant, ";"),
                    $.variable,
                    seq($.extern_variable, ";"),
                    $.function,
                    seq($.extern_function, ";"),
                    seq($.type_alias, ";"),
                ),
            ),

        import: ($) => seq("import", $.string),

        constant: ($) => seq("const", $.identifier, "=", $._expression),

        variable: ($) =>
            seq(
                optional("export"),
                "var",
                $.identifier,
                optional($.type),
                choice(";", seq("=", $._expression, ";")),
            ),

        extern_variable: ($) => seq("extern", $.identifier, $.type),

        type_alias: ($) => seq("type", $.identifier, "=", $.type),

        function: ($) =>
            seq(
                optional("export"),
                "fn",
                $.identifier,
                $.parameters,
                optional(field("return_type", $.type)),
                $.body,
            ),

        extern_function: ($) =>
            seq(
                "extern",
                "fn",
                $.identifier,
                $.parameters,
                optional(field("return_type", $.type)),
            ),

        parameters: ($) =>
            seq(
                "(",
                optional(commaSeparated(seq($.identifier, $.type))),
                optional(","),
                optional("..."),
                ")",
            ),

        body: ($) => seq("{", repeat($._statement), "}"),

        switch: ($) => seq("switch", "(", $._expression, ")", $.switch_cases),

        switch_cases: ($) =>
            seq(
                "{",
                commaSeparated(
                    seq(
                        choice(
                            "else",
                            seq(commaSeparated($._expression), optional(",")),
                        ),
                        "=>",
                        choice($.body, $._statement),
                    ),
                ),
                optional(","),
                "}",
            ),

        if: ($) =>
            seq(
                "if",
                $._expression,
                $.body,
                field("fallback", optional(seq("else", choice($.if, $.body)))),
            ),

        while: ($) => seq("while", $._expression, $.body),
        break: (_) => "break",
        continue: (_) => "continue",

        defer: ($) => seq("defer", choice(seq($._statement, ";"), $.body)),

        return: ($) => seq("return", choice(seq($._expression, ";"), ";")),

        _expression: ($) => choice($._unary_expression, $._binary_expression),

        _unary_expression: ($) =>
            choice(
                $.identifier,
                $.string,
                $.character,
                $.int,
                $.float,
                $.inline_assembly,
                $.parentheses_expression,
                $.unary_operation,
            ),

        identifier: (_) => token(/[_a-zA-Z][:_a-zA-Z0-9]*/),

        type: ($) =>
            choice(
                $.identifier,
                $.struct_type,
                $.enum_type,
                $.array_type,
                $.pointer_type,
            ),

        struct_type: ($) => seq("struct", $.struct_type_fields),

        struct_type_fields: ($) =>
            seq(
                "{",
                optional(
                    commaSeparated(seq(field("key", $.identifier), $.type)),
                ),
                optional(","),
                "}",
            ),

        enum_type: ($) => seq("enum", optional($.type), $.enum_type_fields),

        enum_type_fields: ($) =>
            seq(
                "{",
                optional(
                    commaSeparated(
                        seq(
                            field("key", $.identifier),
                            optional(seq("=", $.int)),
                        ),
                    ),
                ),
                optional(","),
                "}",
            ),

        array_type: ($) => seq("[", $.int, "]", $.type),

        pointer_type: ($) => seq(choice("*", "[*]"), optional("const"), $.type),

        string: (_) =>
            seq('"', field("content", /[^"\\]*(?:\\.[^"\\]*)*/), '"'),

        character: (_) =>
            seq("'", field("content", /[^'\\]*(?:\\.[^'\\]*)*/), "'"),

        int: (_) => token(/[0-9][_a-zA-Z0-9]*/),

        float: (_) => token(/[0-9]\.[0-9]*/),

        global_assembly: ($) => seq("asm", $.global_assembly_body),

        global_assembly_body: ($) => seq("{", repeat($.string), "}"),

        inline_assembly: ($) => seq("asm", $.inline_assembly_body),

        inline_assembly_body: ($) =>
            seq(
                "{",
                repeat($.string),
                optional(
                    seq(
                        ":",
                        optional(seq($.string, "(", $.type, ")")),
                        optional(
                            seq(
                                ":",
                                optional(
                                    commaSeparated(
                                        seq($.string, "(", $._expression, ")"),
                                    ),
                                ),
                                optional(","),
                            ),
                        ),
                        optional(
                            seq(
                                ":",
                                optional(commaSeparated($.string)),
                                optional(","),
                            ),
                        ),
                    ),
                ),
                "}",
            ),

        parentheses_expression: ($) => seq("(", $._expression, ")"),

        unary_operation: ($) =>
            prec.left(
                "prefix",
                seq(
                    field("operator", choice("-", "!", "~", "&")),
                    field("lhs", $._expression),
                ),
            ),

        _binary_expression: ($) =>
            choice(
                $.call,
                $.assign,
                $.subscript,
                $.member,
                $.cast,
                $.binary_operation,
            ),

        call: ($) => prec.left("call", seq($._expression, $.arguments)),

        arguments: ($) =>
            seq(
                "(",
                optional(commaSeparated($._expression)),
                optional(","),
                ")",
            ),

        assign: ($) =>
            prec.left(
                "assign",
                seq(
                    field("target", $._expression),
                    field(
                        "operator",
                        choice(
                            "+=",
                            "-=",
                            "*=",
                            "/=",
                            "%=",
                            "<<=",
                            ">>=",
                            "&=",
                            "^=",
                            "|=",
                            "=",
                        ),
                    ),
                    field("value", $._expression),
                ),
            ),

        subscript: ($) =>
            prec.left(
                "subscript",
                seq(
                    field("target", $._expression),
                    "[",
                    field("index", $._expression),
                    "]",
                ),
            ),

        member: ($) =>
            prec.left(
                "subscript",
                seq(
                    field("target", $._expression),
                    ".",
                    field("key", choice($.identifier, "*")),
                ),
            ),

        cast: ($) => prec.left("cast", seq($._expression, "as", $.type)),

        binary_operation: ($) =>
            choice(
                ...[
                    ["+", "sum"],
                    ["-", "sum"],
                    ["*", "product"],
                    ["/", "product"],
                    ["%", "product"],
                    ["<<", "shift"],
                    [">>", "shift"],
                    ["&", "bit_and"],
                    ["^", "bit_xor"],
                    ["|", "bit_or"],
                    ["<", "comparison"],
                    [">", "comparison"],
                    ["<=", "comparison"],
                    [">=", "comparison"],
                    ["==", "comparison"],
                    ["!=", "comparison"],
                ].map(([operator, precedence, associativity]) =>
                    (associativity === "right" ? prec.right : prec.left)(
                        precedence,
                        seq(
                            field("lhs", $._expression),
                            field("operator", operator),
                            field("rhs", $._expression),
                        ),
                    ),
                ),
            ),

        comment: (_) => token(seq("//", field("content", /[^\n]*/))),
    },
});
