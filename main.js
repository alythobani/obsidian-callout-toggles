/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/callouts/builtinCallouts.ts":
/*!*****************************************!*\
  !*** ./src/callouts/builtinCallouts.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BUILTIN_CALLOUT_IDS: () => (/* binding */ BUILTIN_CALLOUT_IDS)\n/* harmony export */ });\n/**\n * This file contains the built-in callouts that are available to be used in Obsidian.\n *\n * See Obsidian docs:\n * https://help.obsidian.md/Editing+and+formatting/Callouts#Supported%20types\n */\nconst BUILTIN_CALLOUT_IDS = [\n    \"note\",\n    \"abstract\",\n    \"info\",\n    \"todo\",\n    \"tip\",\n    \"success\",\n    \"question\",\n    \"warning\",\n    \"failure\",\n    \"danger\",\n    \"bug\",\n    \"example\",\n    \"quote\",\n];\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/callouts/builtinCallouts.ts?");

/***/ }),

/***/ "./src/commands/allCommands.ts":
/*!*************************************!*\
  !*** ./src/commands/allCommands.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAllCommands: () => (/* binding */ getAllCommands)\n/* harmony export */ });\n/* harmony import */ var _utils_editorCheckCallbackUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/editorCheckCallbackUtils */ \"./src/utils/editorCheckCallbackUtils.ts\");\n/* harmony import */ var _utils_stringUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/stringUtils */ \"./src/utils/stringUtils.ts\");\n/* harmony import */ var _removeCallout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./removeCallout */ \"./src/commands/removeCallout.ts\");\n/* harmony import */ var _wrapLinesInCallout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wrapLinesInCallout */ \"./src/commands/wrapLinesInCallout.ts\");\n\n\n\n\nconst removeCalloutFromSelectedLinesCommand = {\n    id: \"remove-callout-from-selected-lines\",\n    name: \"Remove Callout from Selected Lines\",\n    editorCheckCallback: (0,_utils_editorCheckCallbackUtils__WEBPACK_IMPORTED_MODULE_0__.makeCalloutSelectionCheckCallback)(_removeCallout__WEBPACK_IMPORTED_MODULE_2__.removeCalloutFromSelectedLines),\n};\nfunction makeWrapCalloutCommand() {\n    return (calloutID) => {\n        const capitalizedKeyword = (0,_utils_stringUtils__WEBPACK_IMPORTED_MODULE_1__.toTitleCaseWord)(calloutID);\n        return {\n            id: `wrap-current-line-or-selected-lines-in-${calloutID}-callout`,\n            name: `Wrap Current Line or Selected Lines in ${capitalizedKeyword} Callout`,\n            editorCallback: (0,_wrapLinesInCallout__WEBPACK_IMPORTED_MODULE_3__.makeWrapCurrentLineOrSelectedLinesInCalloutCommand)(calloutID),\n        };\n    };\n}\nfunction getAllCommands(calloutIDs) {\n    const wrapCommands = calloutIDs.map(makeWrapCalloutCommand());\n    return [...wrapCommands, removeCalloutFromSelectedLinesCommand];\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/commands/allCommands.ts?");

/***/ }),

/***/ "./src/commands/removeCallout.ts":
/*!***************************************!*\
  !*** ./src/commands/removeCallout.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   removeCalloutFromSelectedLines: () => (/* binding */ removeCalloutFromSelectedLines)\n/* harmony export */ });\n/* harmony import */ var _utils_arrayUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/arrayUtils */ \"./src/utils/arrayUtils.ts\");\n/* harmony import */ var _utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/calloutTitleUtils */ \"./src/utils/calloutTitleUtils.ts\");\n/* harmony import */ var _utils_selectionUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/selectionUtils */ \"./src/utils/selectionUtils.ts\");\n/* harmony import */ var _utils_stringUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/stringUtils */ \"./src/utils/stringUtils.ts\");\n\n\n\n\n/**\n * Removes the callout from the selected lines. Retains the title if it's not the default header for\n * the given callout, else removes the entire header line.\n */\nfunction removeCalloutFromSelectedLines(editor) {\n    const originalCursorPositions = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_2__.getCursorPositions)(editor);\n    const { range: selectedLinesRange, text } = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_2__.getSelectedLinesRangeAndText)(editor); // Full selected lines range and text\n    const textLines = (0,_utils_stringUtils__WEBPACK_IMPORTED_MODULE_3__.getTextLines)(text);\n    const [oldFirstLine, oldLastLine] = [textLines[0], (0,_utils_arrayUtils__WEBPACK_IMPORTED_MODULE_0__.getLastElement)(textLines)]; // Save now to compare with post-edit lines\n    const { calloutID, effectiveTitle } = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_1__.getCalloutIDAndEffectiveTitle)(text);\n    if ((0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_1__.isCustomTitle)({ calloutID, effectiveTitle })) {\n        removeCalloutWithCustomTitle({\n            oldFirstLine,\n            textLines,\n            editor,\n            originalCursorPositions,\n            selectedLinesRange,\n            oldLastLine,\n            customTitle: effectiveTitle,\n        });\n        return;\n    }\n    removeCalloutWithDefaultTitle({\n        textLines,\n        editor,\n        originalCursorPositions,\n        selectedLinesRange,\n        oldFirstLine,\n        oldLastLine,\n    });\n    return;\n}\n/**\n * Removes the callout from the selected lines, retaining the custom title if there is one.\n */\nfunction removeCalloutWithCustomTitle({ oldFirstLine, textLines, editor, originalCursorPositions, selectedLinesRange, oldLastLine, customTitle, }) {\n    const customTitleHeadingLine = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_1__.makeH6Line)(customTitle);\n    const unquotedLines = textLines.slice(1).map((line) => line.replace(/^> /, \"\"));\n    const adjustedTextLines = [customTitleHeadingLine, ...unquotedLines];\n    replaceCalloutLinesAndAdjustSelection({\n        editor,\n        adjustedTextLines,\n        didRemoveHeader: false,\n        originalCursorPositions,\n        selectedLinesRange,\n        oldFirstLine,\n        oldLastLine,\n    });\n}\nfunction removeCalloutWithDefaultTitle({ textLines, editor, originalCursorPositions, selectedLinesRange, oldFirstLine, oldLastLine, }) {\n    const linesWithoutHeader = textLines.slice(1);\n    const unquotedLines = linesWithoutHeader.map((line) => line.replace(/^> /, \"\"));\n    replaceCalloutLinesAndAdjustSelection({\n        editor,\n        adjustedTextLines: unquotedLines,\n        didRemoveHeader: true,\n        originalCursorPositions,\n        selectedLinesRange,\n        oldFirstLine,\n        oldLastLine,\n    });\n    return;\n}\n/**\n * Replaces the selected lines with the given text lines, adjusting the selection after to match the\n * original selection's relative position.\n */\nfunction replaceCalloutLinesAndAdjustSelection({ editor, adjustedTextLines, didRemoveHeader, originalCursorPositions, selectedLinesRange, oldFirstLine, oldLastLine, }) {\n    if (!(0,_utils_arrayUtils__WEBPACK_IMPORTED_MODULE_0__.isNonEmptyArray)(adjustedTextLines)) {\n        // Must have removed the header line completely (default title) and there are no other lines\n        editor.replaceRange(\"\", selectedLinesRange.from, selectedLinesRange.to);\n        editor.setSelection(selectedLinesRange.from, selectedLinesRange.from);\n        return;\n    }\n    const newText = adjustedTextLines.join(\"\\n\");\n    // Replace the selected lines with the unquoted text\n    editor.replaceRange(newText, selectedLinesRange.from, selectedLinesRange.to);\n    // Set the selection to the same relative position as before, but with the new text\n    adjustSelectionAfterReplacingCallout({\n        adjustedTextLines,\n        originalCursorPositions,\n        oldLastLine,\n        didRemoveHeader,\n        oldFirstLine,\n        editor,\n    });\n}\n/**\n * Sets the selection after removing the callout from the selected lines, back to the original\n * selection's relative position.\n */\nfunction adjustSelectionAfterReplacingCallout({ adjustedTextLines, originalCursorPositions, oldLastLine, didRemoveHeader, oldFirstLine, editor, }) {\n    const { from: originalFrom, to: originalTo } = originalCursorPositions;\n    const newFirstLine = adjustedTextLines[0];\n    const newLastLine = (0,_utils_arrayUtils__WEBPACK_IMPORTED_MODULE_0__.getLastElement)(adjustedTextLines);\n    const newToCh = Math.min(originalTo.ch - (oldLastLine.length - newLastLine.length), newLastLine.length);\n    const newTo = { line: originalTo.line - (didRemoveHeader ? 1 : 0), ch: newToCh };\n    const newFromCh = didRemoveHeader\n        ? 0\n        : originalFrom.ch - (oldFirstLine.length - newFirstLine.length);\n    const newFrom = { line: originalFrom.line, ch: newFromCh };\n    const newRange = { from: newFrom, to: newTo };\n    const { newAnchor, newHead } = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_2__.getNewAnchorAndHead)(originalCursorPositions, newRange);\n    editor.setSelection(newAnchor, newHead);\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/commands/removeCallout.ts?");

/***/ }),

/***/ "./src/commands/wrapLinesInCallout.ts":
/*!********************************************!*\
  !*** ./src/commands/wrapLinesInCallout.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   makeWrapCurrentLineOrSelectedLinesInCalloutCommand: () => (/* binding */ makeWrapCurrentLineOrSelectedLinesInCalloutCommand)\n/* harmony export */ });\n/* harmony import */ var _utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/calloutTitleUtils */ \"./src/utils/calloutTitleUtils.ts\");\n/* harmony import */ var _utils_selectionUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/selectionUtils */ \"./src/utils/selectionUtils.ts\");\n/* harmony import */ var _utils_stringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/stringUtils */ \"./src/utils/stringUtils.ts\");\n\n\n\nfunction makeWrapCurrentLineOrSelectedLinesInCalloutCommand(calloutID) {\n    return (editor) => {\n        wrapCurrentLineOrSelectedLinesInCallout(editor, calloutID);\n    };\n}\nfunction wrapCurrentLineOrSelectedLinesInCallout(editor, calloutID) {\n    if (editor.somethingSelected()) {\n        wrapSelectedLinesInCallout(editor, calloutID);\n        return;\n    }\n    wrapCurrentLineInCallout(editor, calloutID);\n}\n/**\n * Wraps the selected lines in a callout.\n */\nfunction wrapSelectedLinesInCallout(editor, calloutID) {\n    const originalCursorPositions = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_1__.getCursorPositions)(editor); // Save cursor positions before editing\n    const { range: selectedLinesRange, text: selectedText } = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_1__.getSelectedLinesRangeAndText)(editor);\n    const selectedLines = (0,_utils_stringUtils__WEBPACK_IMPORTED_MODULE_2__.getTextLines)(selectedText);\n    const { title, rawBodyLines } = getCalloutTitleAndRawBodyLines(selectedLines, calloutID);\n    wrapLinesInCallout({\n        editor,\n        calloutID,\n        originalCursorPositions,\n        selectedLines,\n        selectedLinesRange,\n        title,\n        rawBodyLines,\n    });\n}\n/**\n * Gets the callout title and raw (not yet prepended) body lines from the selected text lines. If\n * the first line is a heading, it is used as the callout title, and the rest of the lines are used\n * as the body. Otherwise, the default callout title is used, and all the selected lines are used as\n * the body.\n */\nfunction getCalloutTitleAndRawBodyLines(selectedLines, calloutID) {\n    const [firstSelectedLine, ...restSelectedLines] = selectedLines;\n    const maybeHeadingTitle = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_0__.getCustomHeadingTitleIfExists)({ firstSelectedLine });\n    if (maybeHeadingTitle === undefined) {\n        const defaultCalloutTitle = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_0__.getDefaultCalloutTitle)(calloutID);\n        return { title: defaultCalloutTitle, rawBodyLines: selectedLines };\n    }\n    return { title: maybeHeadingTitle, rawBodyLines: restSelectedLines };\n}\n/**\n * Wraps the selected lines in a callout.\n */\nfunction wrapLinesInCallout({ editor, calloutID, originalCursorPositions, selectedLines, selectedLinesRange, title, rawBodyLines, }) {\n    const calloutBodyLines = rawBodyLines.map((line) => `> ${line}`);\n    const calloutBody = calloutBodyLines.join(\"\\n\");\n    const calloutHeader = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_0__.makeCalloutHeader)({ calloutID, title });\n    const newText = `${calloutHeader}\\n${calloutBody}`;\n    editor.replaceRange(newText, selectedLinesRange.from, selectedLinesRange.to);\n    setSelectionAfterWrappingLinesInCallout({\n        editor,\n        originalCursorPositions,\n        originalSelectedLines: selectedLines,\n        calloutHeader,\n        calloutBodyLines,\n    });\n}\n/**\n * Sets the selection after wrapping the selected lines in a callout.\n */\nfunction setSelectionAfterWrappingLinesInCallout({ editor, originalCursorPositions, originalSelectedLines, calloutHeader, calloutBodyLines, }) {\n    const newRange = getNewSelectionRangeAfterWrappingLinesInCallout({\n        originalCursorPositions,\n        originalSelectedLines,\n        calloutHeader,\n        calloutBodyLines,\n    });\n    setSelectionInCorrectDirection(editor, originalCursorPositions, newRange);\n}\nfunction getNewSelectionRangeAfterWrappingLinesInCallout({ originalCursorPositions, originalSelectedLines, calloutHeader, calloutBodyLines, }) {\n    const { from: originalFrom, to: originalTo } = originalCursorPositions;\n    // Add 2 characters for the \"> \" prefix\n    const lastBodyLineLength = calloutBodyLines[calloutBodyLines.length - 1]?.length ?? 0;\n    const newToCh = Math.min(originalTo.ch + 2, lastBodyLineLength - 1);\n    const didAddHeaderLine = originalSelectedLines.length === calloutBodyLines.length;\n    if (didAddHeaderLine) {\n        const newFrom = { line: originalFrom.line, ch: 0 };\n        const newTo = { line: originalTo.line + 1, ch: newToCh };\n        return { from: newFrom, to: newTo };\n    }\n    // We turned the existing first line from a heading into a callout header\n    const originalFirstLine = originalSelectedLines[0];\n    const rawNewFromCh = originalFrom.ch - (originalFirstLine.length - calloutHeader.length);\n    const newFromCh = Math.clamp(rawNewFromCh, 0, calloutHeader.length);\n    const newFrom = { line: originalFrom.line, ch: newFromCh };\n    const newTo = { line: originalTo.line, ch: newToCh };\n    return { from: newFrom, to: newTo };\n}\nfunction setSelectionInCorrectDirection(editor, originalCursorPositions, newRange) {\n    const { newAnchor, newHead } = (0,_utils_selectionUtils__WEBPACK_IMPORTED_MODULE_1__.getNewAnchorAndHead)(originalCursorPositions, newRange);\n    editor.setSelection(newAnchor, newHead);\n}\n/**\n * Wraps the cursor's current line in a callout.\n */\nfunction wrapCurrentLineInCallout(editor, calloutID) {\n    const { line, ch } = editor.getCursor();\n    const lineText = editor.getLine(line);\n    const calloutHeader = (0,_utils_calloutTitleUtils__WEBPACK_IMPORTED_MODULE_0__.makeDefaultCalloutHeader)(calloutID);\n    const prependedLine = `> ${lineText}`;\n    const newText = `${calloutHeader}\\n${prependedLine}`;\n    editor.replaceRange(newText, { line, ch: 0 }, { line, ch: lineText.length });\n    const newFrom = { line, ch: 0 };\n    const newToCh = Math.min(ch + 3, lineText.length + 2);\n    const newTo = { line: line + 1, ch: newToCh };\n    editor.setSelection(newFrom, newTo);\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/commands/wrapLinesInCallout.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CalloutToggleCommandsPlugin)\n/* harmony export */ });\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! obsidian */ \"obsidian\");\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(obsidian__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var obsidian_callout_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! obsidian-callout-manager */ \"./node_modules/obsidian-callout-manager/dist/api-esm.mjs\");\n/* harmony import */ var _callouts_builtinCallouts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./callouts/builtinCallouts */ \"./src/callouts/builtinCallouts.ts\");\n/* harmony import */ var _commands_allCommands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands/allCommands */ \"./src/commands/allCommands.ts\");\n/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/logger */ \"./src/utils/logger.ts\");\n\n\n\n\n\nclass CalloutToggleCommandsPlugin extends obsidian__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n    onload() {\n        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.logInfo)(\"Plugin loaded.\");\n        this.app.workspace.onLayoutReady(async () => {\n            await this.maybeLoadCalloutManager();\n            this.addAllCommands();\n        });\n    }\n    async maybeLoadCalloutManager() {\n        if ((0,obsidian_callout_manager__WEBPACK_IMPORTED_MODULE_1__.isInstalled)(this.app)) {\n            const calloutManager = await (0,obsidian_callout_manager__WEBPACK_IMPORTED_MODULE_1__.getApi)(this);\n            if (calloutManager === undefined) {\n                (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.logError)(\"Failed to get Callout Manager API handle.\");\n                return;\n            }\n            this.calloutManager = calloutManager;\n        }\n    }\n    addAllCommands() {\n        const allCalloutIDs = this.getAllCalloutIDs();\n        const allCommands = (0,_commands_allCommands__WEBPACK_IMPORTED_MODULE_3__.getAllCommands)(allCalloutIDs);\n        for (const command of allCommands) {\n            this.addCommand(command);\n        }\n    }\n    getAllCalloutIDs() {\n        if (this.calloutManager === undefined) {\n            (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.logInfo)(\"Callout Manager not available; using hardcoded list of callout IDs instead\");\n            return this.getBuiltinCalloutIDs();\n        }\n        return this.getAllCalloutIDsFromCalloutManager(this.calloutManager);\n    }\n    getAllCalloutIDsFromCalloutManager(calloutManager) {\n        const allCallouts = calloutManager.getCallouts();\n        const allCalloutIDs = allCallouts.map((callout) => callout.id);\n        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.logInfo)(`Got callout IDs from Callout Manager: ${allCalloutIDs.join(\", \")}`);\n        return allCalloutIDs;\n    }\n    getBuiltinCalloutIDs() {\n        return _callouts_builtinCallouts__WEBPACK_IMPORTED_MODULE_2__.BUILTIN_CALLOUT_IDS;\n    }\n    onunload() {\n        (0,_utils_logger__WEBPACK_IMPORTED_MODULE_4__.logInfo)(\"Plugin unloaded.\");\n    }\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/main.ts?");

/***/ }),

/***/ "./src/utils/arrayUtils.ts":
/*!*********************************!*\
  !*** ./src/utils/arrayUtils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getLastElement: () => (/* binding */ getLastElement),\n/* harmony export */   isNonEmptyArray: () => (/* binding */ isNonEmptyArray)\n/* harmony export */ });\nfunction getLastElement(arr) {\n    return arr[arr.length - 1]; // eslint-disable-line @typescript-eslint/no-non-null-assertion\n}\nfunction isNonEmptyArray(arr) {\n    return arr.length > 0;\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/arrayUtils.ts?");

/***/ }),

/***/ "./src/utils/calloutTitleUtils.ts":
/*!****************************************!*\
  !*** ./src/utils/calloutTitleUtils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCalloutIDAndEffectiveTitle: () => (/* binding */ getCalloutIDAndEffectiveTitle),\n/* harmony export */   getCustomHeadingTitleIfExists: () => (/* binding */ getCustomHeadingTitleIfExists),\n/* harmony export */   getDefaultCalloutTitle: () => (/* binding */ getDefaultCalloutTitle),\n/* harmony export */   isCustomTitle: () => (/* binding */ isCustomTitle),\n/* harmony export */   makeCalloutHeader: () => (/* binding */ makeCalloutHeader),\n/* harmony export */   makeDefaultCalloutHeader: () => (/* binding */ makeDefaultCalloutHeader),\n/* harmony export */   makeH6Line: () => (/* binding */ makeH6Line)\n/* harmony export */ });\n/* harmony import */ var _regexUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regexUtils */ \"./src/utils/regexUtils.ts\");\n/* harmony import */ var _stringUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringUtils */ \"./src/utils/stringUtils.ts\");\n\n\nconst CALLOUT_ID_REGEX = /^> \\[!(\\w+)\\]/;\nconst CALLOUT_TITLE_REGEX = /^> \\[!\\w+\\] (.+)/;\nconst HEADING_TITLE_REGEX = /^#+ (.+)/;\nfunction makeCalloutHeader({ calloutID, title, }) {\n    const baseCalloutHeader = makeBaseCalloutHeader(calloutID);\n    return `${baseCalloutHeader} ${title}`;\n}\nfunction makeBaseCalloutHeader(calloutID) {\n    return `> [!${calloutID}]`;\n}\nfunction getDefaultCalloutTitle(calloutID) {\n    return (0,_stringUtils__WEBPACK_IMPORTED_MODULE_1__.toTitleCaseWord)(calloutID);\n}\nfunction makeDefaultCalloutHeader(calloutID) {\n    const defaultTitle = getDefaultCalloutTitle(calloutID);\n    return makeCalloutHeader({ calloutID, title: defaultTitle });\n}\nfunction makeH6Line(title) {\n    return `###### ${title}`;\n}\n/**\n * Parses the callout ID and effective title from the full text of a callout.\n *\n * @param fullCalloutText The full text of the callout (both the header and the body).\n */\nfunction getCalloutIDAndEffectiveTitle(fullCalloutText) {\n    const calloutID = getCalloutID(fullCalloutText);\n    const effectiveTitle = getCalloutEffectiveTitle(calloutID, fullCalloutText);\n    return { calloutID, effectiveTitle };\n}\nfunction getCalloutID(fullCalloutText) {\n    const maybeCalloutID = getTrimmedCalloutIDIfExists(fullCalloutText);\n    if (maybeCalloutID === undefined) {\n        throw new Error(\"Callout ID not found in callout text.\");\n    }\n    return maybeCalloutID;\n}\nfunction getTrimmedCalloutIDIfExists(fullCalloutText) {\n    return (0,_regexUtils__WEBPACK_IMPORTED_MODULE_0__.getTrimmedFirstCapturingGroupIfExists)(CALLOUT_ID_REGEX, fullCalloutText);\n}\n/**\n * Gets the effective title of a callout, which may either be an explicitly set non-empty (and not\n * only whitespace) title, or otherwise inferred as the default title.\n */\nfunction getCalloutEffectiveTitle(calloutID, fullCalloutText) {\n    const maybeExplicitTitle = getTrimmedCalloutTitleIfExists(fullCalloutText);\n    if (maybeExplicitTitle === \"\" || maybeExplicitTitle === undefined) {\n        return getDefaultCalloutTitle(calloutID);\n    }\n    return maybeExplicitTitle;\n}\n/**\n * Gets the explicit title (trimmed of surrounding whitespace) of a callout, if one is present.\n *\n * @param fullCalloutText The full text of the callout (both the header and the body).\n */\nfunction getTrimmedCalloutTitleIfExists(fullCalloutText) {\n    return (0,_regexUtils__WEBPACK_IMPORTED_MODULE_0__.getTrimmedFirstCapturingGroupIfExists)(CALLOUT_TITLE_REGEX, fullCalloutText);\n}\n/**\n * Gets the heading title text (trimmed of surrounding whitespace) from the first line of selected\n * text to be wrapped in a callout, if such a heading text exists. If none is found or the trimmed\n * string is empty, returns undefined.\n *\n * @param firstSelectedLine The first line of the text to be wrapped in a callout.\n * @returns The trimmed heading text if it exists and is non-empty, otherwise undefined.\n */\nfunction getCustomHeadingTitleIfExists({ firstSelectedLine, }) {\n    const maybeHeadingTitle = getTrimmedHeadingTitleIfExists(firstSelectedLine);\n    if (maybeHeadingTitle === \"\" || maybeHeadingTitle === undefined) {\n        return undefined;\n    }\n    return maybeHeadingTitle;\n}\nfunction getTrimmedHeadingTitleIfExists(firstSelectedLine) {\n    return (0,_regexUtils__WEBPACK_IMPORTED_MODULE_0__.getTrimmedFirstCapturingGroupIfExists)(HEADING_TITLE_REGEX, firstSelectedLine);\n}\n/**\n * Determines whether the effective title of a callout is a custom title or the default title.\n *\n * @param effectiveTitle The effective title of the callout.\n */\nfunction isCustomTitle({ calloutID, effectiveTitle, }) {\n    const defaultTitle = getDefaultCalloutTitle(calloutID);\n    return effectiveTitle !== defaultTitle;\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/calloutTitleUtils.ts?");

/***/ }),

/***/ "./src/utils/editorCheckCallbackUtils.ts":
/*!***********************************************!*\
  !*** ./src/utils/editorCheckCallbackUtils.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   makeCalloutSelectionCheckCallback: () => (/* binding */ makeCalloutSelectionCheckCallback),\n/* harmony export */   makeCurrentLineCheckCallback: () => (/* binding */ makeCurrentLineCheckCallback),\n/* harmony export */   makeSelectionCheckCallback: () => (/* binding */ makeSelectionCheckCallback)\n/* harmony export */ });\n/* harmony import */ var _selectionUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectionUtils */ \"./src/utils/selectionUtils.ts\");\n\nconst CALLOUT_HEADER_REGEX = /^> \\[!\\w+\\]/;\n/**\n * Creates an editor check callback for a command that should only be available when text is\n * currently selected in the editor.\n */\nfunction makeSelectionCheckCallback(editorAction) {\n    return (checking, editor, _ctx) => {\n        if (!editor.somethingSelected())\n            return false; // Only show the command if text is selected\n        return showOrRunCommand(editorAction, editor, checking);\n    };\n}\n/**\n * Creates an editor check callback for a command that should only be available when the currently\n * selected lines begin with a callout.\n */\nfunction makeCalloutSelectionCheckCallback(editorAction) {\n    return (checking, editor, _ctx) => {\n        if (!editor.somethingSelected())\n            return false; // Only show the command if text is selected\n        const { text: selectedLinesText } = (0,_selectionUtils__WEBPACK_IMPORTED_MODULE_0__.getSelectedLinesRangeAndText)(editor);\n        if (!CALLOUT_HEADER_REGEX.test(selectedLinesText))\n            return false; // Only show the command if the selected text is a callout\n        return showOrRunCommand(editorAction, editor, checking);\n    };\n}\n/**\n * Creates an editor check callback for a command that that runs on the current line of the cursor.\n * There should be no text currently selected in the editor, to avoid ambiguity in what will happen.\n */\nfunction makeCurrentLineCheckCallback(editorAction) {\n    return (checking, editor, _ctx) => {\n        if (editor.somethingSelected())\n            return false; // Don't show the command if text is selected\n        return showOrRunCommand(editorAction, editor, checking);\n    };\n}\nfunction showOrRunCommand(editorAction, editor, checking) {\n    if (checking)\n        return true;\n    editorAction(editor);\n    return true;\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/editorCheckCallbackUtils.ts?");

/***/ }),

/***/ "./src/utils/logger.ts":
/*!*****************************!*\
  !*** ./src/utils/logger.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logError: () => (/* binding */ logError),\n/* harmony export */   logInfo: () => (/* binding */ logInfo)\n/* harmony export */ });\nconst PLUGIN_NAME = \"Callout Toggle Commands\";\nfunction logInfo(message) {\n    console.log(`${PLUGIN_NAME}: ${message}`);\n}\nfunction logError(message) {\n    console.error(`${PLUGIN_NAME}: ${message}`);\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/logger.ts?");

/***/ }),

/***/ "./src/utils/regexUtils.ts":
/*!*********************************!*\
  !*** ./src/utils/regexUtils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getFirstCapturingGroupIfExists: () => (/* binding */ getFirstCapturingGroupIfExists),\n/* harmony export */   getTrimmedFirstCapturingGroupIfExists: () => (/* binding */ getTrimmedFirstCapturingGroupIfExists)\n/* harmony export */ });\n/**\n * Returns the first capturing group match of the regex if it exists, otherwise returns undefined.\n * @param regex The regex to use, with at least one capturing group\n * @param text The text to search\n * @returns The first capturing group match if it exists, otherwise undefined\n */\nfunction getFirstCapturingGroupIfExists(regex, text) {\n    const match = regex.exec(text);\n    return match?.[1];\n}\n/**\n * Returns the first capturing group match (trimmed of surrounding whitespace) of the regex executed\n * on the text, if found. If the match is not found, returns undefined.\n * @param regex The regex to use, with at least one capturing group\n * @param text The text to search\n * @returns The first capturing group match (trimmed) if it exists, otherwise undefined\n */\nfunction getTrimmedFirstCapturingGroupIfExists(regex, text) {\n    const maybeRawMatch = getFirstCapturingGroupIfExists(regex, text);\n    return maybeRawMatch?.trim();\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/regexUtils.ts?");

/***/ }),

/***/ "./src/utils/selectionUtils.ts":
/*!*************************************!*\
  !*** ./src/utils/selectionUtils.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAnchorAndHead: () => (/* binding */ getAnchorAndHead),\n/* harmony export */   getCursorPositions: () => (/* binding */ getCursorPositions),\n/* harmony export */   getNewAnchorAndHead: () => (/* binding */ getNewAnchorAndHead),\n/* harmony export */   getSelectedLinesRangeAndText: () => (/* binding */ getSelectedLinesRangeAndText),\n/* harmony export */   getSelectionRange: () => (/* binding */ getSelectionRange),\n/* harmony export */   isHeadBeforeAnchor: () => (/* binding */ isHeadBeforeAnchor)\n/* harmony export */ });\n/**\n * Returns the range and text of the selected lines, from the start of the first\n * selected line to the end of the last selected line (regardless of where in\n * the line each selection boundary is).\n */\nfunction getSelectedLinesRangeAndText(editor) {\n    const { from, to } = getSelectedLinesRange(editor);\n    const text = editor.getRange(from, to);\n    return { range: { from, to }, text };\n}\nfunction getSelectedLinesRange(editor) {\n    const { from, to } = getSelectionRange(editor);\n    const startOfFirstSelectedLine = { line: from.line, ch: 0 };\n    const endOfLastSelectedLine = { line: to.line, ch: editor.getLine(to.line).length };\n    return { from: startOfFirstSelectedLine, to: endOfLastSelectedLine };\n}\nfunction getSelectionRange(editor) {\n    const from = editor.getCursor(\"from\");\n    const to = editor.getCursor(\"to\");\n    return { from, to };\n}\nfunction getAnchorAndHead(editor) {\n    const anchor = editor.getCursor(\"anchor\");\n    const head = editor.getCursor(\"head\");\n    return { anchor, head };\n}\nfunction getCursorPositions(editor) {\n    const { anchor, head } = getAnchorAndHead(editor);\n    const { from, to } = getSelectionRange(editor);\n    return { anchor, head, from, to };\n}\nfunction isHeadBeforeAnchor({ anchor, head, }) {\n    return head.line < anchor.line || (head.line === anchor.line && head.ch < anchor.ch);\n}\nfunction getNewAnchorAndHead(originalCursorPositions, newRange) {\n    const { from: newFrom, to: newTo } = newRange;\n    return isHeadBeforeAnchor(originalCursorPositions)\n        ? { newAnchor: newTo, newHead: newFrom }\n        : { newAnchor: newFrom, newHead: newTo };\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/selectionUtils.ts?");

/***/ }),

/***/ "./src/utils/stringUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/stringUtils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getTextLines: () => (/* binding */ getTextLines),\n/* harmony export */   toTitleCaseWord: () => (/* binding */ toTitleCaseWord)\n/* harmony export */ });\n/**\n * Better-typed version of `text.split(\"\\n\")` where we know the result will always have at least one\n * element, since `String.prototype.split` only returns an empty array when the input string and\n * separator are both empty strings, and in this case the separator is \"\\n\" which is not empty.\n */\nfunction getTextLines(text) {\n    return text.split(\"\\n\");\n}\nfunction toTitleCaseWord(word) {\n    const firstLetter = word.charAt(0).toUpperCase();\n    const rest = word.slice(1).toLowerCase();\n    return `${firstLetter}${rest}`;\n}\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./src/utils/stringUtils.ts?");

/***/ }),

/***/ "obsidian":
/*!***************************!*\
  !*** external "obsidian" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("obsidian");

/***/ }),

/***/ "./node_modules/obsidian-callout-manager/dist/api-esm.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/obsidian-callout-manager/dist/api-esm.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PLUGIN_API_VERSION: () => (/* binding */ PLUGIN_API_VERSION),\n/* harmony export */   PLUGIN_ID: () => (/* binding */ PLUGIN_ID),\n/* harmony export */   getApi: () => (/* binding */ getApi),\n/* harmony export */   isInstalled: () => (/* binding */ isInstalled)\n/* harmony export */ });\n/******************************************************************************\nCopyright (c) Microsoft Corporation.\n\nPermission to use, copy, modify, and/or distribute this software for any\npurpose with or without fee is hereby granted.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH\nREGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY\nAND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,\nINDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM\nLOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR\nOTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR\nPERFORMANCE OF THIS SOFTWARE.\n***************************************************************************** */\n\nfunction __awaiter(thisArg, _arguments, P, generator) {\n\tfunction adopt(value) {\n\t\treturn value instanceof P\n\t\t\t? value\n\t\t\t: new P(function (resolve) {\n\t\t\t\t\tresolve(value);\n\t\t\t  });\n\t}\n\treturn new (P || (P = Promise))(function (resolve, reject) {\n\t\tfunction fulfilled(value) {\n\t\t\ttry {\n\t\t\t\tstep(generator.next(value));\n\t\t\t} catch (e) {\n\t\t\t\treject(e);\n\t\t\t}\n\t\t}\n\t\tfunction rejected(value) {\n\t\t\ttry {\n\t\t\t\tstep(generator['throw'](value));\n\t\t\t} catch (e) {\n\t\t\t\treject(e);\n\t\t\t}\n\t\t}\n\t\tfunction step(result) {\n\t\t\tresult.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n\t\t}\n\t\tstep((generator = generator.apply(thisArg, _arguments || [])).next());\n\t});\n}\n\nconst PLUGIN_ID = 'callout-manager';\nconst PLUGIN_API_VERSION = 'v1';\n/**\n * @internal\n */\nfunction getApi(plugin) {\n\tvar _a;\n\treturn __awaiter(this, void 0, void 0, function* () {\n\t\t// Check if the plugin is available and loaded.\n\t\tconst app =\n\t\t\t(_a = plugin === null || plugin === void 0 ? void 0 : plugin.app) !== null && _a !== void 0\n\t\t\t\t? _a\n\t\t\t\t: globalThis.app;\n\t\tconst { plugins } = app;\n\t\tif (!plugins.enabledPlugins.has(PLUGIN_ID)) {\n\t\t\treturn undefined;\n\t\t}\n\t\t// Get the plugin instance.\n\t\t// We may need to wait until it's loaded.\n\t\tconst calloutManagerInstance = yield new Promise((resolve, reject) => {\n\t\t\tconst instance = plugins.plugins[PLUGIN_ID];\n\t\t\tif (instance !== undefined) {\n\t\t\t\treturn resolve(instance);\n\t\t\t}\n\t\t\tconst interval = setInterval(() => {\n\t\t\t\tconst instance = plugins.plugins[PLUGIN_ID];\n\t\t\t\tif (instance !== undefined) {\n\t\t\t\t\tclearInterval(interval);\n\t\t\t\t\tresolve(instance);\n\t\t\t\t}\n\t\t\t}, 10);\n\t\t});\n\t\t// Create a new API handle.\n\t\treturn calloutManagerInstance.newApiHandle(PLUGIN_API_VERSION, plugin, () => {\n\t\t\tcalloutManagerInstance.destroyApiHandle(PLUGIN_API_VERSION, plugin);\n\t\t});\n\t});\n}\n/**\n * Checks if Callout Manager is installed.\n */\nfunction isInstalled(app) {\n\t// Check if the plugin is available and loaded.\n\tconst appWithPlugins = app !== null && app !== void 0 ? app : globalThis.app;\n\treturn appWithPlugins.plugins.enabledPlugins.has(PLUGIN_ID);\n}\n\n\n\n\n//# sourceURL=webpack://obsidian-callout-toggle-commands/./node_modules/obsidian-callout-manager/dist/api-esm.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;