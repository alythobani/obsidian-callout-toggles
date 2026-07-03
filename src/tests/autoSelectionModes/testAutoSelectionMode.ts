import type { CursorOrSelectionAction, CursorPositions } from "../../utils/selectionUtils";
import type { EditorPosition } from "obsidian";

export type BeforeAndAfter = {
  before: BeforePositions;
  after: AfterPositions;
};

export type BeforePositions = {
  start: EditorPosition;
  end: EditorPosition;
  from: EditorPosition;
  to: EditorPosition;
};

export type GetExpected = ({
  after,
  originalCursorPositions,
}: {
  after: AfterPositions;
  originalCursorPositions: CursorPositions;
}) => CursorOrSelectionAction;

export type AfterPositions = {
  start: EditorPosition;
  end: EditorPosition;
  from: EditorPosition;
  to: EditorPosition;
  titleStart: EditorPosition;
  titleEnd: EditorPosition;
};
