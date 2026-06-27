import type { CalloutHeaderParts } from "../../utils/calloutTitleUtils";
import type { SetCursorAction, SetSelectionAction } from "../../utils/selectionUtils";

import { describe, expect, it, test } from "vitest";

import { getCursorOrSelectionActionAfterWrappingCurrentLine } from "../../lib/wrapLinesInCallout/wrapCurrentLineInCallout";

describe("whenNothingSelected", () => {
  const calloutHeaderParts: CalloutHeaderParts = {
    baseCalloutHeader: "> [!quote]",
    foldableSuffix: "+",
    maybeTitle: "Quote",
  };
  const aristotleQuote = "This is a quote by Aristotle.";
  describe("selectHeaderToCursor", () => {
    it("should select from the start of the header to the cursor (inclusive)", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 2, ch: 5 },
        oldLineText: aristotleQuote,
        whenNothingSelected: "selectHeaderToCursor",
        calloutHeaderParts,
      });
      const expectedResult: SetSelectionAction = {
        type: "setSelection",
        newRange: { from: { line: 2, ch: 0 }, to: { line: 3, ch: 8 } },
      };
      expect(result).toEqual(expectedResult);
    });
  });
  describe("selectFull", () => {
    it("should select the full callout", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 2, ch: 5 },
        oldLineText: aristotleQuote,
        whenNothingSelected: "selectFull",
        calloutHeaderParts,
      });
      const expectedResult: SetSelectionAction = {
        type: "setSelection",
        newRange: { from: { line: 2, ch: 0 }, to: { line: 3, ch: aristotleQuote.length + 2 } },
      };
      expect(result).toEqual(expectedResult);
    });
    test("even if the current line is empty", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 4, ch: 0 },
        oldLineText: "",
        whenNothingSelected: "selectFull",
        calloutHeaderParts,
      });
      const expectedResult: SetSelectionAction = {
        type: "setSelection",
        newRange: { from: { line: 4, ch: 0 }, to: { line: 5, ch: 2 } },
      };
      expect(result).toEqual(expectedResult);
    });
  });
  describe("selectTitle", () => {
    it("should select the title", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 2, ch: 5 },
        oldLineText: aristotleQuote,
        whenNothingSelected: "selectTitle",
        calloutHeaderParts,
      });
      const expectedResult: SetSelectionAction = {
        type: "setSelection",
        newRange: { from: { line: 2, ch: 12 }, to: { line: 2, ch: 17 } },
      };
      expect(result).toEqual(expectedResult);
    });
    test("even if the current line is empty", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 4, ch: 0 },
        oldLineText: "",
        whenNothingSelected: "selectTitle",
        calloutHeaderParts,
      });
      const expectedResult: SetSelectionAction = {
        type: "setSelection",
        newRange: { from: { line: 4, ch: 12 }, to: { line: 4, ch: 17 } },
      };
      expect(result).toEqual(expectedResult);
    });
  });
  describe("originalCursor", () => {
    it("should keep the cursor at the same relative position", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 2, ch: 5 },
        oldLineText: aristotleQuote,
        whenNothingSelected: "originalCursor",
        calloutHeaderParts,
      });
      const expectedResult: SetCursorAction = {
        type: "setCursor",
        newPosition: { line: 3, ch: 7 },
      };
      expect(result).toEqual(expectedResult);
    });
    test("even if the current line is empty", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 4, ch: 0 },
        oldLineText: "",
        whenNothingSelected: "originalCursor",
        calloutHeaderParts,
      });
      const expectedResult: SetCursorAction = {
        type: "setCursor",
        newPosition: { line: 5, ch: 2 },
      };
      expect(result).toEqual(expectedResult);
    });
  });
  describe("cursorEnd", () => {
    it("should move the cursor to the end of the callout", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 2, ch: 5 },
        oldLineText: aristotleQuote,
        whenNothingSelected: "cursorEnd",
        calloutHeaderParts,
      });
      const expectedResult: SetCursorAction = {
        type: "setCursor",
        newPosition: { line: 3, ch: aristotleQuote.length + 2 },
      };
      expect(result).toEqual(expectedResult);
    });
    test("even if the current line is empty", () => {
      const result = getCursorOrSelectionActionAfterWrappingCurrentLine({
        oldCursor: { line: 4, ch: 0 },
        oldLineText: "",
        whenNothingSelected: "cursorEnd",
        calloutHeaderParts,
      });
      const expectedResult: SetCursorAction = {
        type: "setCursor",
        newPosition: { line: 5, ch: 2 },
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
