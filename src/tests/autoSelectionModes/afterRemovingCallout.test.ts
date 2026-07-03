import type { BeforeAndAfter, GetExpected } from "./testAutoSelectionMode";
import type { AutoSelectionAfterRemovingCalloutMode } from "../../settings/autoSelectionModes";
import type { CursorPositions, SelectedLinesDiff } from "../../utils/selectionUtils";

import { describe, expect, it, test } from "vitest";

import { getCursorOrSelectionActionAfterRemovingCallout } from "../../commands/removeCallout";

type AfterRemovingCalloutTest = (testParams: TestParams) => void;

type TestParams = {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  beforeAndAfter: BeforeAndAfter;
};

const selectedLinesDiff1: SelectedLinesDiff = {
  oldLines: [
    "> [!quote]+ Quote",
    "> This is a quote by Aristotle:",
    "> It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
  newLines: [
    "This is a quote by Aristotle:",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
};
const beforeAndAfter1: BeforeAndAfter = {
  before: {
    start: { line: 2, ch: 0 }, // ">" in "> [!quote]"
    end: { line: 4, ch: 92 }, // After "." in "it."
    from: { line: 2, ch: 12 }, // "Q" in "Quote"
    to: { line: 4, ch: 13 }, // After "m" in "mark"
  },
  after: {
    start: { line: 2, ch: 0 }, // "T" in "This"
    end: { line: 3, ch: 90 }, // After "." in "it."
    from: { line: 2, ch: 0 }, // "T" in "This" (clamped here since header is gone)
    to: { line: 3, ch: 11 }, // After "m" in "mark"
    titleStart: { line: 2, ch: 0 }, // No title
    titleEnd: { line: 2, ch: 0 }, // No title
  },
};
const originalCursorPositions1 = {
  anchor: beforeAndAfter1.before.from,
  head: beforeAndAfter1.before.to,
  from: beforeAndAfter1.before.from,
  to: beforeAndAfter1.before.to,
};
const testParams1: TestParams = {
  selectedLinesDiff: selectedLinesDiff1,
  originalCursorPositions: originalCursorPositions1,
  beforeAndAfter: beforeAndAfter1,
};

const selectedLinesDiff2: SelectedLinesDiff = {
  oldLines: [
    "> [!quote]+ Custom title",
    "> This is a quote by Aristotle:",
    "> It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
  newLines: [
    "### Custom title",
    "This is a quote by Aristotle:",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
  ],
};
const beforeAndAfter2: BeforeAndAfter = {
  before: {
    start: { line: 2, ch: 0 }, // ">" in header
    end: { line: 4, ch: 92 }, // After "." in "it."
    from: { line: 2, ch: 12 }, // "C" in "Custom title"
    to: { line: 4, ch: 13 }, // After "m" in "mark"
  },
  after: {
    start: { line: 2, ch: 0 }, // First "#" in heading
    end: { line: 4, ch: 90 }, // After "." in "it."
    from: { line: 2, ch: 4 }, // "C" in "Custom title"
    to: { line: 4, ch: 11 }, // After "m" in "mark"
    titleStart: { line: 2, ch: 4 }, // "C" in "Custom title"
    titleEnd: { line: 2, ch: 16 }, // After "e" in "title"
  },
};
const originalCursorPositions2 = {
  anchor: beforeAndAfter2.before.from,
  head: beforeAndAfter2.before.to,
  from: beforeAndAfter2.before.from,
  to: beforeAndAfter2.before.to,
};
const testParams2: TestParams = {
  selectedLinesDiff: selectedLinesDiff2,
  originalCursorPositions: originalCursorPositions2,
  beforeAndAfter: beforeAndAfter2,
};

describe("afterRemovingCallout", () => {
  describe("originalSelection", () => {
    const testOriginalSelection: AfterRemovingCalloutTest = (testParams) =>
      testAfterRemovingCallout({
        afterRemovingCallout: "originalSelection",
        testParams,
        getExpected: ({ after, originalCursorPositions }) => ({
          type: "setSelectionInCorrectDirection",
          newRange: { from: after.from, to: after.to },
          originalCursorPositions,
        }),
      });
    it("should select from the start of the header to the cursor (inclusive)", () => {
      testOriginalSelection(testParams1);
    });
    test("with custom title", () => {
      testOriginalSelection(testParams2);
    });
  });

  describe("selectFull", () => {
    const testSelectFull: AfterRemovingCalloutTest = (testParams) =>
      testAfterRemovingCallout({
        afterRemovingCallout: "selectFull",
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

  describe("clearSelectionCursorTo", () => {
    const testClearSelectionCursorTo: AfterRemovingCalloutTest = (testParams) =>
      testAfterRemovingCallout({
        afterRemovingCallout: "clearSelectionCursorTo",
        testParams,
        getExpected: ({ after }) => ({
          type: "clearSelection",
          newCursor: { line: after.to.line, ch: after.to.ch - 1 },
        }),
      });
    it("should select the title", () => {
      testClearSelectionCursorTo(testParams1);
    });
    test("with custom title", () => {
      testClearSelectionCursorTo(testParams2);
    });
  });

  describe("clearSelectionCursorStart", () => {
    const testClearSelectionCursorStart: AfterRemovingCalloutTest = (testParams) =>
      testAfterRemovingCallout({
        afterRemovingCallout: "clearSelectionCursorStart",
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
    const testClearSelectionCursorEnd: AfterRemovingCalloutTest = (testParams) =>
      testAfterRemovingCallout({
        afterRemovingCallout: "clearSelectionCursorEnd",
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

function testAfterRemovingCallout({
  afterRemovingCallout,
  testParams: { selectedLinesDiff, originalCursorPositions, beforeAndAfter },
  getExpected,
}: {
  afterRemovingCallout: AutoSelectionAfterRemovingCalloutMode;
  testParams: TestParams;
  getExpected: GetExpected;
}): void {
  const result = getCursorOrSelectionActionAfterRemovingCallout({
    afterRemovingCallout,
    selectedLinesDiff,
    originalCursorPositions,
  });
  const { after } = beforeAndAfter;
  const expectedResult = getExpected({ after, originalCursorPositions });
  expect(result).toEqual(expectedResult);
}
