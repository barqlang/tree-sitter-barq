package tree_sitter_cerium_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-cerium"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cerium.Language())
	if language == nil {
		t.Errorf("Error loading Cerium grammar")
	}
}
