import type { BeforeAndAfter, GetExpected } from "./testAutoSelectionMode";
import type { AutoSelectionWhenTextSelectedMode } from "../../settings/autoSelectionModes";
import type { CalloutHeaderParts } from "../../utils/calloutTitleUtils";
import type { CursorPositions, SelectedLinesDiff } from "../../utils/selectionUtils";

import { describe, expect, it, test } from "vitest";

import { getCursorOrSelectionActionAfterWrappingSelectedLines } from "../../lib/wrapLinesInCallout/wrapSelectedLinesInCallout";

export type AutoSelectionModeTestFn = (testParams: TestParams) => void;

export type TestParams = {
  calloutHeaderParts: CalloutHeaderParts;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  beforeAndAfter: BeforeAndAfter;
};

const calloutHeaderParts1: CalloutHeaderParts = {
  baseCalloutHeader: "> [!quote]",
  foldableSuffix: "+",
  maybeTitle: "Quote",
};
const selectedLinesDiff1: SelectedLinesDiff = {
  oldLines: [
    "This is a quote by Aristotle:",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
  newLines: [
    "> [!quote]+ Quote",
    "> This is a quote by Aristotle:",
    "> It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
};
const beforeAndAfter1: BeforeAndAfter = {
  before: {
    start: { line: 2, ch: 0 }, // "T" in "This"
    end: { line: 3, ch: 90 }, // After "." in "it."
    from: { line: 2, ch: 19 }, // "A" in "Aristotle"
    to: { line: 3, ch: 11 }, // After "m" in "mark"
  },
  after: {
    start: { line: 2, ch: 0 }, // ">" in "> [!quote]"
    end: { line: 4, ch: 92 }, // After "." in "it."
    from: { line: 3, ch: 21 }, // "A" in "Aristotle"
    to: { line: 4, ch: 13 }, // After "m" in "mark"
    titleStart: { line: 2, ch: 12 }, // "Q" in "Quote"
    titleEnd: { line: 2, ch: 17 }, // After "e" in "Quote
  },
};
const originalCursorPositions1 = {
  anchor: beforeAndAfter1.before.from,
  head: beforeAndAfter1.before.to,
  from: beforeAndAfter1.before.from,
  to: beforeAndAfter1.before.to,
};
const testParams1: TestParams = {
  calloutHeaderParts: calloutHeaderParts1,
  selectedLinesDiff: selectedLinesDiff1,
  originalCursorPositions: originalCursorPositions1,
  beforeAndAfter: beforeAndAfter1,
};

const calloutHeaderParts2: CalloutHeaderParts = {
  baseCalloutHeader: "> [!quote]",
  foldableSuffix: "+",
  maybeTitle: "Custom title",
};
const selectedLinesDiff2: SelectedLinesDiff = {
  oldLines: [
    "### Custom title",
    "This is a quote by Aristotle:",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
  newLines: [
    "> [!quote]+ Custom title",
    "> This is a quote by Aristotle:",
    "> It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
};
const beforeAndAfter2: BeforeAndAfter = {
  before: {
    start: { line: 2, ch: 0 }, // First "#" in heading
    end: { line: 4, ch: 90 }, // After "." in "it."
    from: { line: 2, ch: 4 }, // "C" in "Custom title"
    to: { line: 4, ch: 11 }, // After "m" in "mark"
  },
  after: {
    start: { line: 2, ch: 0 }, // ">" in header
    end: { line: 4, ch: 92 }, // After "." in "it."
    from: { line: 2, ch: 12 }, // "C" in "Custom title"
    to: { line: 4, ch: 13 }, // After "m" in "mark"
    titleStart: { line: 2, ch: 12 }, // "C" in "Custom title"
    titleEnd: { line: 2, ch: 24 }, // After "e" in "title"
  },
};
const originalCursorPositions2 = {
  anchor: beforeAndAfter2.before.from,
  head: beforeAndAfter2.before.to,
  from: beforeAndAfter2.before.from,
  to: beforeAndAfter2.before.to,
};
const testParams2: TestParams = {
  calloutHeaderParts: calloutHeaderParts2,
  selectedLinesDiff: selectedLinesDiff2,
  originalCursorPositions: originalCursorPositions2,
  beforeAndAfter: beforeAndAfter2,
};

describe("whenTextSelected", () => {
  describe("selectHeaderToCursor", () => {
    const testHeaderToCursor = (testParams: TestParams, getExpected: GetExpected): void =>
      testWhenTextSelected({
        whenTextSelected: "selectHeaderToCursor",
        testParams,
        getExpected,
      });
    it("header line added", () => {
      testHeaderToCursor(testParams1, ({ after, originalCursorPositions }) => ({
        type: "setSelectionInCorrectDirection",
        newRange: { from: after.start, to: after.to },
        originalCursorPositions,
      }));
    });
    test("with custom title", () => {
      testHeaderToCursor(testParams2, ({ after, originalCursorPositions }) => ({
        type: "setSelectionInCorrectDirection",
        newRange: { from: after.from, to: after.to },
        originalCursorPositions,
      }));
    });
  });

  describe("selectFull", () => {
    const testSelectFull: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "selectFull",
        testParams,
        getExpected: ({ after, originalCursorPositions }) => ({
          type: "setSelectionInCorrectDirection",
          newRange: { from: after.start, to: after.end },
          originalCursorPositions,
        }),
      });
    it("should select the full callout", () => {
      testSelectFull(testParams1);
    });
    test("with custom title", () => {
      testSelectFull(testParams2);
    });
  });

  describe("selectTitle", () => {
    const testSelectTitle: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "selectTitle",
        testParams,
        getExpected: ({ after }) => ({
          type: "setSelection",
          newRange: { from: after.titleStart, to: after.titleEnd },
        }),
      });
    it("should select the title", () => {
      testSelectTitle(testParams1);
    });
    test("with custom title", () => {
      testSelectTitle(testParams2);
    });
  });

  describe("originalSelection", () => {
    const testOriginalSelection: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "originalSelection",
        testParams,
        getExpected: ({ after, originalCursorPositions }) => ({
          type: "setSelectionInCorrectDirection",
          newRange: { from: after.from, to: after.to },
          originalCursorPositions,
        }),
      });
    it("should select the original selection", () => {
      testOriginalSelection(testParams1);
    });
    test("with custom title", () => {
      testOriginalSelection(testParams2);
    });
  });

  describe("clearSelectionCursorTo", () => {
    const testClearSelectionCursorTo: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "clearSelectionCursorTo",
        testParams,
        getExpected: ({ after }) => ({
          type: "clearSelection",
          newCursor: { line: after.to.line, ch: after.to.ch - 1 },
        }),
      });
    it("should clear the selection and move the cursor to the end of the callout", () => {
      testClearSelectionCursorTo(testParams1);
    });
    test("with custom title", () => {
      testClearSelectionCursorTo(testParams2);
    });
  });

  describe("clearSelectionCursorStart", () => {
    const testClearSelectionCursorStart: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "clearSelectionCursorStart",
        testParams,
        getExpected: ({ after }) => ({
          type: "clearSelection",
          newCursor: after.start,
        }),
      });
    it("should select the original selection", () => {
      testClearSelectionCursorStart(testParams1);
    });
    test("with custom title", () => {
      testClearSelectionCursorStart(testParams2);
    });
  });

  describe("clearSelectionCursorEnd", () => {
    const testClearSelectionCursorEnd: AutoSelectionModeTestFn = (testParams) =>
      testWhenTextSelected({
        whenTextSelected: "clearSelectionCursorEnd",
        testParams,
        getExpected: ({ after }) => ({
          type: "clearSelection",
          newCursor: after.end,
        }),
      });
    it("should clear the selection and move the cursor to the end of the callout", () => {
      testClearSelectionCursorEnd(testParams1);
    });
    test("with custom title", () => {
      testClearSelectionCursorEnd(testParams2);
    });
  });
});

function testWhenTextSelected({
  whenTextSelected,
  testParams: { calloutHeaderParts, selectedLinesDiff, originalCursorPositions, beforeAndAfter },
  getExpected,
}: {
  whenTextSelected: AutoSelectionWhenTextSelectedMode;
  testParams: TestParams;
  getExpected: GetExpected;
}): void {
  const result = getCursorOrSelectionActionAfterWrappingSelectedLines({
    whenTextSelected,
    selectedLinesDiff,
    originalCursorPositions,
    calloutHeaderParts,
  });
  const { after } = beforeAndAfter;
  const expectedResult = getExpected({ after, originalCursorPositions });
  expect(result).toEqual(expectedResult);
}
