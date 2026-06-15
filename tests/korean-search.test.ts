import assert from "node:assert/strict";
import test from "node:test";

import { getHangulInitials, searchTextMatches } from "../lib/search/korean-search";

test("getHangulInitials extracts leading consonants from Hangul syllables", () => {
  assert.equal(getHangulInitials("강철"), "ㄱㅊ");
  assert.equal(getHangulInitials("명일방주"), "ㅁㅇㅂㅈ");
});

test("getHangulInitials lowercases and preserves non-Hangul characters", () => {
  assert.equal(getHangulInitials("AB강"), "abㄱ");
  assert.equal(getHangulInitials(null), "");
});

test("searchTextMatches treats an empty keyword as a match-all", () => {
  assert.equal(searchTextMatches("", "강철"), true);
  assert.equal(searchTextMatches("   ", "강철"), true);
});

test("searchTextMatches ignores case and whitespace when matching substrings", () => {
  assert.equal(searchTextMatches("  RE bar ", "Rebar Steel"), true);
  assert.equal(searchTextMatches("steel", "Rebar Steel"), true);
});

test("searchTextMatches matches Hangul initials against the keyword", () => {
  assert.equal(searchTextMatches("ㄱㅊ", "강철"), true);
  assert.equal(searchTextMatches("강철", "ㄱㅊ 단조"), true);
});

test("searchTextMatches scans every provided target", () => {
  assert.equal(searchTextMatches("steel", "강철", "Steel Rebar"), true);
});

test("searchTextMatches returns false when no target matches", () => {
  assert.equal(searchTextMatches("xyz", "강철", "Rebar"), false);
  assert.equal(searchTextMatches("keyword", ""), false);
});
