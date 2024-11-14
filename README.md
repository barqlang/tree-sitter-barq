# tree-sitter-cerium

[![discord][discord]](https://discord.gg/w7nTvsVJhm)
[![matrix][matrix]](https://matrix.to/#/#tree-sitter-chat:matrix.org)

Cerium grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix

## Installation

### Helix

1 - Add this to your `languages.toml` file

```toml
[[language]]
name = "cerium"
scope = "scope.cerium"
injection-regex = "cerium"
file-types = ["cerm"]
comment-tokens = ["//"]
indent = { tab-width = 4, unit = " " }

[[grammar]]
name = "cerium"
source = { git = "https://github.com/yhyadev/tree-sitter-cerium", rev = "<PUT THE COMMIT REVISION HERE>" }
```

2 - Now, copy the queries from [queries/helix](queries/helix) to `runtime/queries/cerium` directory inside the root of local config

3 - And lastly run these commands to fetch and build the parser

```
hx -g fetch
hx -g build
```

### Neovim

1 - Add this to your init.lua file if you use nvim-treesitter

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()

parser_config.cerium = {
    install_info = {
        url = "https://github.com/yhyadev/tree-sitter-cerium",
        files = { "src/parser.c" },
        rev = "<PUT THE COMMIT REVISION HERE>",
    },

    filetype = "cerm"
}

vim.filetype.add({
    extension = {
        cerm = "cerium"
    }
})
```

2 - Now, copy the queries from [queries/nvim](queries/nvim) to `queries/cerium` directory inside the root of local config

3 - And lastly restart neovim and then run `:TSUpdate`
