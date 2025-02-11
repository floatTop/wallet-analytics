"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/eta.js
var require_eta = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/eta.js"(exports2, module2) {
    var ETA = class {
      constructor(length, initTime, initValue) {
        this.etaBufferLength = length || 100;
        this.valueBuffer = [initValue];
        this.timeBuffer = [initTime];
        this.eta = "0";
      }
      // add new values to calculation buffer
      update(time, value, total) {
        this.valueBuffer.push(value);
        this.timeBuffer.push(time);
        this.calculate(total - value);
      }
      // fetch estimated time
      getTime() {
        return this.eta;
      }
      // eta calculation - request number of remaining events
      calculate(remaining) {
        const currentBufferSize = this.valueBuffer.length;
        const buffer = Math.min(this.etaBufferLength, currentBufferSize);
        const v_diff = this.valueBuffer[currentBufferSize - 1] - this.valueBuffer[currentBufferSize - buffer];
        const t_diff = this.timeBuffer[currentBufferSize - 1] - this.timeBuffer[currentBufferSize - buffer];
        const vt_rate = v_diff / t_diff;
        this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
        this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);
        const eta = Math.ceil(remaining / vt_rate / 1e3);
        if (isNaN(eta)) {
          this.eta = "NULL";
        } else if (!isFinite(eta)) {
          this.eta = "INF";
        } else if (eta > 1e7) {
          this.eta = "INF";
        } else if (eta < 0) {
          this.eta = 0;
        } else {
          this.eta = eta;
        }
      }
    };
    module2.exports = ETA;
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/terminal.js
var require_terminal = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/terminal.js"(exports2, module2) {
    var _readline = require("readline");
    var Terminal = class {
      constructor(outputStream) {
        this.stream = outputStream;
        this.linewrap = true;
        this.dy = 0;
      }
      // save cursor position + settings
      cursorSave() {
        if (!this.stream.isTTY) {
          return;
        }
        this.stream.write("\x1B7");
      }
      // restore last cursor position + settings
      cursorRestore() {
        if (!this.stream.isTTY) {
          return;
        }
        this.stream.write("\x1B8");
      }
      // show/hide cursor
      cursor(enabled) {
        if (!this.stream.isTTY) {
          return;
        }
        if (enabled) {
          this.stream.write("\x1B[?25h");
        } else {
          this.stream.write("\x1B[?25l");
        }
      }
      // change cursor positionn
      cursorTo(x = null, y = null) {
        if (!this.stream.isTTY) {
          return;
        }
        _readline.cursorTo(this.stream, x, y);
      }
      // change relative cursor position
      cursorRelative(dx = null, dy = null) {
        if (!this.stream.isTTY) {
          return;
        }
        this.dy = this.dy + dy;
        _readline.moveCursor(this.stream, dx, dy);
      }
      // relative reset
      cursorRelativeReset() {
        if (!this.stream.isTTY) {
          return;
        }
        _readline.moveCursor(this.stream, 0, -this.dy);
        _readline.cursorTo(this.stream, 0, null);
        this.dy = 0;
      }
      // clear to the right from cursor
      clearRight() {
        if (!this.stream.isTTY) {
          return;
        }
        _readline.clearLine(this.stream, 1);
      }
      // clear the full line
      clearLine() {
        if (!this.stream.isTTY) {
          return;
        }
        _readline.clearLine(this.stream, 0);
      }
      // clear everyting beyond the current line
      clearBottom() {
        if (!this.stream.isTTY) {
          return;
        }
        _readline.clearScreenDown(this.stream);
      }
      // add new line; increment counter
      newline() {
        this.stream.write("\n");
        this.dy++;
      }
      // write content to output stream
      // @TODO use string-width to strip length
      write(s, rawWrite = false) {
        if (this.linewrap === true && rawWrite === false) {
          this.stream.write(s.substr(0, this.getWidth()));
        } else {
          this.stream.write(s);
        }
      }
      // control line wrapping
      lineWrapping(enabled) {
        if (!this.stream.isTTY) {
          return;
        }
        this.linewrap = enabled;
        if (enabled) {
          this.stream.write("\x1B[?7h");
        } else {
          this.stream.write("\x1B[?7l");
        }
      }
      // tty environment ?
      isTTY() {
        return this.stream.isTTY === true;
      }
      // get terminal width
      getWidth() {
        return this.stream.columns || (this.stream.isTTY ? 80 : 200);
      }
    };
    module2.exports = Terminal;
  }
});

// node_modules/.pnpm/ansi-regex@5.0.1/node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/.pnpm/ansi-regex@5.0.1/node_modules/ansi-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = ({ onlyFirst = false } = {}) => {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/.pnpm/strip-ansi@6.0.1/node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/.pnpm/strip-ansi@6.0.1/node_modules/strip-ansi/index.js"(exports2, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    module2.exports = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
  }
});

// node_modules/.pnpm/is-fullwidth-code-point@3.0.0/node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS({
  "node_modules/.pnpm/is-fullwidth-code-point@3.0.0/node_modules/is-fullwidth-code-point/index.js"(exports2, module2) {
    "use strict";
    var isFullwidthCodePoint = (codePoint) => {
      if (Number.isNaN(codePoint)) {
        return false;
      }
      if (codePoint >= 4352 && (codePoint <= 4447 || // Hangul Jamo
      codePoint === 9001 || // LEFT-POINTING ANGLE BRACKET
      codePoint === 9002 || // RIGHT-POINTING ANGLE BRACKET
      // CJK Radicals Supplement .. Enclosed CJK Letters and Months
      11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
      12880 <= codePoint && codePoint <= 19903 || // CJK Unified Ideographs .. Yi Radicals
      19968 <= codePoint && codePoint <= 42182 || // Hangul Jamo Extended-A
      43360 <= codePoint && codePoint <= 43388 || // Hangul Syllables
      44032 <= codePoint && codePoint <= 55203 || // CJK Compatibility Ideographs
      63744 <= codePoint && codePoint <= 64255 || // Vertical Forms
      65040 <= codePoint && codePoint <= 65049 || // CJK Compatibility Forms .. Small Form Variants
      65072 <= codePoint && codePoint <= 65131 || // Halfwidth and Fullwidth Forms
      65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || // Kana Supplement
      110592 <= codePoint && codePoint <= 110593 || // Enclosed Ideographic Supplement
      127488 <= codePoint && codePoint <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
      131072 <= codePoint && codePoint <= 262141)) {
        return true;
      }
      return false;
    };
    module2.exports = isFullwidthCodePoint;
    module2.exports.default = isFullwidthCodePoint;
  }
});

// node_modules/.pnpm/emoji-regex@8.0.0/node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS({
  "node_modules/.pnpm/emoji-regex@8.0.0/node_modules/emoji-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
  }
});

// node_modules/.pnpm/string-width@4.2.3/node_modules/string-width/index.js
var require_string_width = __commonJS({
  "node_modules/.pnpm/string-width@4.2.3/node_modules/string-width/index.js"(exports2, module2) {
    "use strict";
    var stripAnsi = require_strip_ansi();
    var isFullwidthCodePoint = require_is_fullwidth_code_point();
    var emojiRegex = require_emoji_regex();
    var stringWidth = (string) => {
      if (typeof string !== "string" || string.length === 0) {
        return 0;
      }
      string = stripAnsi(string);
      if (string.length === 0) {
        return 0;
      }
      string = string.replace(emojiRegex(), "  ");
      let width = 0;
      for (let i = 0; i < string.length; i++) {
        const code = string.codePointAt(i);
        if (code <= 31 || code >= 127 && code <= 159) {
          continue;
        }
        if (code >= 768 && code <= 879) {
          continue;
        }
        if (code > 65535) {
          i++;
        }
        width += isFullwidthCodePoint(code) ? 2 : 1;
      }
      return width;
    };
    module2.exports = stringWidth;
    module2.exports.default = stringWidth;
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-value.js
var require_format_value = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-value.js"(exports2, module2) {
    module2.exports = function formatValue(v, options, type) {
      if (options.autopadding !== true) {
        return v;
      }
      function autopadding(value, length) {
        return (options.autopaddingChar + value).slice(-length);
      }
      switch (type) {
        case "percentage":
          return autopadding(v, 3);
        default:
          return v;
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-bar.js
var require_format_bar = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-bar.js"(exports2, module2) {
    module2.exports = function formatBar(progress, options) {
      const completeSize = Math.round(progress * options.barsize);
      const incompleteSize = options.barsize - completeSize;
      return options.barCompleteString.substr(0, completeSize) + options.barGlue + options.barIncompleteString.substr(0, incompleteSize);
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-time.js
var require_format_time = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/format-time.js"(exports2, module2) {
    module2.exports = function formatTime(t, options, roundToMultipleOf) {
      function round(input) {
        if (roundToMultipleOf) {
          return roundToMultipleOf * Math.round(input / roundToMultipleOf);
        } else {
          return input;
        }
      }
      function autopadding(v) {
        return (options.autopaddingChar + v).slice(-2);
      }
      if (t > 3600) {
        return autopadding(Math.floor(t / 3600)) + "h" + autopadding(round(t % 3600 / 60)) + "m";
      } else if (t > 60) {
        return autopadding(Math.floor(t / 60)) + "m" + autopadding(round(t % 60)) + "s";
      } else if (t > 10) {
        return autopadding(round(t)) + "s";
      } else {
        return autopadding(t) + "s";
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/formatter.js
var require_formatter = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/formatter.js"(exports2, module2) {
    var _stringWidth = require_string_width();
    var _defaultFormatValue = require_format_value();
    var _defaultFormatBar = require_format_bar();
    var _defaultFormatTime = require_format_time();
    module2.exports = function defaultFormatter(options, params, payload) {
      let s = options.format;
      const formatTime = options.formatTime || _defaultFormatTime;
      const formatValue = options.formatValue || _defaultFormatValue;
      const formatBar = options.formatBar || _defaultFormatBar;
      const percentage = Math.floor(params.progress * 100) + "";
      const stopTime = params.stopTime || Date.now();
      const elapsedTime = Math.round((stopTime - params.startTime) / 1e3);
      const context = Object.assign({}, payload, {
        bar: formatBar(params.progress, options),
        percentage: formatValue(percentage, options, "percentage"),
        total: formatValue(params.total, options, "total"),
        value: formatValue(params.value, options, "value"),
        eta: formatValue(params.eta, options, "eta"),
        eta_formatted: formatTime(params.eta, options, 5),
        duration: formatValue(elapsedTime, options, "duration"),
        duration_formatted: formatTime(elapsedTime, options, 1)
      });
      s = s.replace(/\{(\w+)\}/g, function(match, key) {
        if (typeof context[key] !== "undefined") {
          return context[key];
        }
        return match;
      });
      const fullMargin = Math.max(0, params.maxWidth - _stringWidth(s) - 2);
      const halfMargin = Math.floor(fullMargin / 2);
      switch (options.align) {
        // fill start-of-line with whitespaces
        case "right":
          s = fullMargin > 0 ? " ".repeat(fullMargin) + s : s;
          break;
        // distribute whitespaces to left+right
        case "center":
          s = halfMargin > 0 ? " ".repeat(halfMargin) + s : s;
          break;
        // default: left align, no additional whitespaces
        case "left":
        default:
          break;
      }
      return s;
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/options.js
var require_options = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/options.js"(exports2, module2) {
    function mergeOption(v, defaultValue) {
      if (typeof v === "undefined" || v === null) {
        return defaultValue;
      } else {
        return v;
      }
    }
    module2.exports = {
      // set global options
      parse: function parse(rawOptions, preset) {
        const options = {};
        const opt = Object.assign({}, preset, rawOptions);
        options.throttleTime = 1e3 / mergeOption(opt.fps, 10);
        options.stream = mergeOption(opt.stream, process.stderr);
        options.terminal = mergeOption(opt.terminal, null);
        options.clearOnComplete = mergeOption(opt.clearOnComplete, false);
        options.stopOnComplete = mergeOption(opt.stopOnComplete, false);
        options.barsize = mergeOption(opt.barsize, 40);
        options.align = mergeOption(opt.align, "left");
        options.hideCursor = mergeOption(opt.hideCursor, false);
        options.linewrap = mergeOption(opt.linewrap, false);
        options.barGlue = mergeOption(opt.barGlue, "");
        options.barCompleteChar = mergeOption(opt.barCompleteChar, "=");
        options.barIncompleteChar = mergeOption(opt.barIncompleteChar, "-");
        options.format = mergeOption(opt.format, "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}");
        options.formatTime = mergeOption(opt.formatTime, null);
        options.formatValue = mergeOption(opt.formatValue, null);
        options.formatBar = mergeOption(opt.formatBar, null);
        options.etaBufferLength = mergeOption(opt.etaBuffer, 10);
        options.etaAsynchronousUpdate = mergeOption(opt.etaAsynchronousUpdate, false);
        options.progressCalculationRelative = mergeOption(opt.progressCalculationRelative, false);
        options.synchronousUpdate = mergeOption(opt.synchronousUpdate, true);
        options.noTTYOutput = mergeOption(opt.noTTYOutput, false);
        options.notTTYSchedule = mergeOption(opt.notTTYSchedule, 2e3);
        options.emptyOnZero = mergeOption(opt.emptyOnZero, false);
        options.forceRedraw = mergeOption(opt.forceRedraw, false);
        options.autopadding = mergeOption(opt.autopadding, false);
        options.gracefulExit = mergeOption(opt.gracefulExit, false);
        return options;
      },
      // derived options: instance specific, has to be created for every bar element
      assignDerivedOptions: function assignDerivedOptions(options) {
        options.barCompleteString = options.barCompleteChar.repeat(options.barsize + 1);
        options.barIncompleteString = options.barIncompleteChar.repeat(options.barsize + 1);
        options.autopaddingChar = options.autopadding ? mergeOption(options.autopaddingChar, "   ") : "";
        return options;
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/generic-bar.js
var require_generic_bar = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/generic-bar.js"(exports2, module2) {
    var _ETA = require_eta();
    var _Terminal = require_terminal();
    var _formatter = require_formatter();
    var _options = require_options();
    var _EventEmitter = require("events");
    module2.exports = class GenericBar extends _EventEmitter {
      constructor(options) {
        super();
        this.options = _options.assignDerivedOptions(options);
        this.terminal = this.options.terminal ? this.options.terminal : new _Terminal(this.options.stream);
        this.value = 0;
        this.startValue = 0;
        this.total = 100;
        this.lastDrawnString = null;
        this.startTime = null;
        this.stopTime = null;
        this.lastRedraw = Date.now();
        this.eta = new _ETA(this.options.etaBufferLength, 0, 0);
        this.payload = {};
        this.isActive = false;
        this.formatter = typeof this.options.format === "function" ? this.options.format : _formatter;
      }
      // internal render function
      render(forceRendering = false) {
        const params = {
          progress: this.getProgress(),
          eta: this.eta.getTime(),
          startTime: this.startTime,
          stopTime: this.stopTime,
          total: this.total,
          value: this.value,
          maxWidth: this.terminal.getWidth()
        };
        if (this.options.etaAsynchronousUpdate) {
          this.updateETA();
        }
        const s = this.formatter(this.options, params, this.payload);
        const forceRedraw = forceRendering || this.options.forceRedraw || this.options.noTTYOutput && !this.terminal.isTTY();
        if (forceRedraw || this.lastDrawnString != s) {
          this.emit("redraw-pre");
          this.terminal.cursorTo(0, null);
          this.terminal.write(s);
          this.terminal.clearRight();
          this.lastDrawnString = s;
          this.lastRedraw = Date.now();
          this.emit("redraw-post");
        }
      }
      // start the progress bar
      start(total, startValue, payload) {
        this.value = startValue || 0;
        this.total = typeof total !== "undefined" && total >= 0 ? total : 100;
        this.startValue = startValue || 0;
        this.payload = payload || {};
        this.startTime = Date.now();
        this.stopTime = null;
        this.lastDrawnString = "";
        this.eta = new _ETA(this.options.etaBufferLength, this.startTime, this.value);
        this.isActive = true;
        this.emit("start", total, startValue);
      }
      // stop the bar
      stop() {
        this.isActive = false;
        this.stopTime = Date.now();
        this.emit("stop", this.total, this.value);
      }
      // update the bar value
      // update(value, payload)
      // update(payload)
      update(arg0, arg1 = {}) {
        if (typeof arg0 === "number") {
          this.value = arg0;
          this.eta.update(Date.now(), arg0, this.total);
        }
        const payloadData = (typeof arg0 === "object" ? arg0 : arg1) || {};
        this.emit("update", this.total, this.value);
        for (const key in payloadData) {
          this.payload[key] = payloadData[key];
        }
        if (this.value >= this.getTotal() && this.options.stopOnComplete) {
          this.stop();
        }
      }
      // calculate the actual progress value
      getProgress() {
        let progress = this.value / this.total;
        if (this.options.progressCalculationRelative) {
          progress = (this.value - this.startValue) / (this.total - this.startValue);
        }
        if (isNaN(progress)) {
          progress = this.options && this.options.emptyOnZero ? 0 : 1;
        }
        progress = Math.min(Math.max(progress, 0), 1);
        return progress;
      }
      // update the bar value
      // increment(delta, payload)
      // increment(payload)
      increment(arg0 = 1, arg1 = {}) {
        if (typeof arg0 === "object") {
          this.update(this.value + 1, arg0);
        } else {
          this.update(this.value + arg0, arg1);
        }
      }
      // get the total (limit) value
      getTotal() {
        return this.total;
      }
      // set the total (limit) value
      setTotal(total) {
        if (typeof total !== "undefined" && total >= 0) {
          this.total = total;
        }
      }
      // force eta calculation update (long running processes)
      updateETA() {
        this.eta.update(Date.now(), this.value, this.total);
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/single-bar.js
var require_single_bar = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/single-bar.js"(exports2, module2) {
    var _GenericBar = require_generic_bar();
    var _options = require_options();
    module2.exports = class SingleBar extends _GenericBar {
      constructor(options, preset) {
        super(_options.parse(options, preset));
        this.timer = null;
        if (this.options.noTTYOutput && this.terminal.isTTY() === false) {
          this.options.synchronousUpdate = false;
        }
        this.schedulingRate = this.terminal.isTTY() ? this.options.throttleTime : this.options.notTTYSchedule;
        this.sigintCallback = null;
      }
      // internal render function
      render() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        super.render();
        if (this.options.noTTYOutput && this.terminal.isTTY() === false) {
          this.terminal.newline();
        }
        this.timer = setTimeout(this.render.bind(this), this.schedulingRate);
      }
      update(current, payload) {
        if (!this.timer) {
          return;
        }
        super.update(current, payload);
        if (this.options.synchronousUpdate && this.lastRedraw + this.options.throttleTime * 2 < Date.now()) {
          this.render();
        }
      }
      // start the progress bar
      start(total, startValue, payload) {
        if (this.options.noTTYOutput === false && this.terminal.isTTY() === false) {
          return;
        }
        if (this.sigintCallback === null && this.options.gracefulExit) {
          this.sigintCallback = this.stop.bind(this);
          process.once("SIGINT", this.sigintCallback);
          process.once("SIGTERM", this.sigintCallback);
        }
        this.terminal.cursorSave();
        if (this.options.hideCursor === true) {
          this.terminal.cursor(false);
        }
        if (this.options.linewrap === false) {
          this.terminal.lineWrapping(false);
        }
        super.start(total, startValue, payload);
        this.render();
      }
      // stop the bar
      stop() {
        if (!this.timer) {
          return;
        }
        if (this.sigintCallback) {
          process.removeListener("SIGINT", this.sigintCallback);
          process.removeListener("SIGTERM", this.sigintCallback);
          this.sigintCallback = null;
        }
        this.render();
        super.stop();
        clearTimeout(this.timer);
        this.timer = null;
        if (this.options.hideCursor === true) {
          this.terminal.cursor(true);
        }
        if (this.options.linewrap === false) {
          this.terminal.lineWrapping(true);
        }
        this.terminal.cursorRestore();
        if (this.options.clearOnComplete) {
          this.terminal.cursorTo(0, null);
          this.terminal.clearLine();
        } else {
          this.terminal.newline();
        }
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/multi-bar.js
var require_multi_bar = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/lib/multi-bar.js"(exports2, module2) {
    var _Terminal = require_terminal();
    var _BarElement = require_generic_bar();
    var _options = require_options();
    var _EventEmitter = require("events");
    module2.exports = class MultiBar extends _EventEmitter {
      constructor(options, preset) {
        super();
        this.bars = [];
        this.options = _options.parse(options, preset);
        this.options.synchronousUpdate = false;
        this.terminal = this.options.terminal ? this.options.terminal : new _Terminal(this.options.stream);
        this.timer = null;
        this.isActive = false;
        this.schedulingRate = this.terminal.isTTY() ? this.options.throttleTime : this.options.notTTYSchedule;
        this.loggingBuffer = [];
        this.sigintCallback = null;
      }
      // add a new bar to the stack
      create(total, startValue, payload, barOptions = {}) {
        const bar = new _BarElement(Object.assign(
          {},
          // global options
          this.options,
          // terminal instance
          {
            terminal: this.terminal
          },
          // overrides
          barOptions
        ));
        this.bars.push(bar);
        if (this.options.noTTYOutput === false && this.terminal.isTTY() === false) {
          return bar;
        }
        if (this.sigintCallback === null && this.options.gracefulExit) {
          this.sigintCallback = this.stop.bind(this);
          process.once("SIGINT", this.sigintCallback);
          process.once("SIGTERM", this.sigintCallback);
        }
        if (!this.isActive) {
          if (this.options.hideCursor === true) {
            this.terminal.cursor(false);
          }
          if (this.options.linewrap === false) {
            this.terminal.lineWrapping(false);
          }
          this.timer = setTimeout(this.update.bind(this), this.schedulingRate);
        }
        this.isActive = true;
        bar.start(total, startValue, payload);
        this.emit("start");
        return bar;
      }
      // remove a bar from the stack
      remove(bar) {
        const index = this.bars.indexOf(bar);
        if (index < 0) {
          return false;
        }
        this.bars.splice(index, 1);
        this.update();
        this.terminal.newline();
        this.terminal.clearBottom();
        return true;
      }
      // internal update routine
      update() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.emit("update-pre");
        this.terminal.cursorRelativeReset();
        this.emit("redraw-pre");
        if (this.loggingBuffer.length > 0) {
          this.terminal.clearLine();
          while (this.loggingBuffer.length > 0) {
            this.terminal.write(this.loggingBuffer.shift(), true);
          }
        }
        for (let i = 0; i < this.bars.length; i++) {
          if (i > 0) {
            this.terminal.newline();
          }
          this.bars[i].render();
        }
        this.emit("redraw-post");
        if (this.options.noTTYOutput && this.terminal.isTTY() === false) {
          this.terminal.newline();
          this.terminal.newline();
        }
        this.timer = setTimeout(this.update.bind(this), this.schedulingRate);
        this.emit("update-post");
        if (this.options.stopOnComplete && !this.bars.find((bar) => bar.isActive)) {
          this.stop();
        }
      }
      stop() {
        clearTimeout(this.timer);
        this.timer = null;
        if (this.sigintCallback) {
          process.removeListener("SIGINT", this.sigintCallback);
          process.removeListener("SIGTERM", this.sigintCallback);
          this.sigintCallback = null;
        }
        this.isActive = false;
        if (this.options.hideCursor === true) {
          this.terminal.cursor(true);
        }
        if (this.options.linewrap === false) {
          this.terminal.lineWrapping(true);
        }
        this.terminal.cursorRelativeReset();
        this.emit("stop-pre-clear");
        if (this.options.clearOnComplete) {
          this.terminal.clearBottom();
        } else {
          for (let i = 0; i < this.bars.length; i++) {
            if (i > 0) {
              this.terminal.newline();
            }
            this.bars[i].render();
            this.bars[i].stop();
          }
          this.terminal.newline();
        }
        this.emit("stop");
      }
      log(s) {
        this.loggingBuffer.push(s);
      }
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/legacy.js
var require_legacy = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/legacy.js"(exports2, module2) {
    module2.exports = {
      format: "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
      barCompleteChar: "=",
      barIncompleteChar: "-"
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/shades-classic.js
var require_shades_classic = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/shades-classic.js"(exports2, module2) {
    module2.exports = {
      format: " {bar} {percentage}% | ETA: {eta}s | {value}/{total}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/shades-grey.js
var require_shades_grey = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/shades-grey.js"(exports2, module2) {
    module2.exports = {
      format: " \x1B[90m{bar}\x1B[0m {percentage}% | ETA: {eta}s | {value}/{total}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/rect.js
var require_rect = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/rect.js"(exports2, module2) {
    module2.exports = {
      format: " {bar}\u25A0 {percentage}% | ETA: {eta}s | {value}/{total}",
      barCompleteChar: "\u25A0",
      barIncompleteChar: " "
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/index.js
var require_presets = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/presets/index.js"(exports2, module2) {
    var _legacy = require_legacy();
    var _shades_classic = require_shades_classic();
    var _shades_grey = require_shades_grey();
    var _rect = require_rect();
    module2.exports = {
      legacy: _legacy,
      shades_classic: _shades_classic,
      shades_grey: _shades_grey,
      rect: _rect
    };
  }
});

// node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/cli-progress.js
var require_cli_progress = __commonJS({
  "node_modules/.pnpm/cli-progress@3.12.0/node_modules/cli-progress/cli-progress.js"(exports2, module2) {
    var _SingleBar = require_single_bar();
    var _MultiBar = require_multi_bar();
    var _Presets = require_presets();
    var _Formatter = require_formatter();
    var _defaultFormatValue = require_format_value();
    var _defaultFormatBar = require_format_bar();
    var _defaultFormatTime = require_format_time();
    module2.exports = {
      Bar: _SingleBar,
      SingleBar: _SingleBar,
      MultiBar: _MultiBar,
      Presets: _Presets,
      Format: {
        Formatter: _Formatter,
        BarFormat: _defaultFormatBar,
        ValueFormat: _defaultFormatValue,
        TimeFormat: _defaultFormatTime
      }
    };
  }
});

// src/wallet-analytics.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/cookie.ts
var cookie = "_ga=GA1.1.530881546.1734424574; _ga_8RYMEEL63P=GS1.1.1735447149.1.1.1735447151.0.0.0; beegosessionID=d6862a0c801366f1dd69ddcc2c33e8a9; cf_clearance=H4eUrhic1oszRwDbblMU1xdZon_2mqiV8norM1hd6fQ-1737736092-1.2.1.1-a1qs999txezz5OJ9dF.jybvFKbCJh05KJA_46wlMFiLYguoNk5dQ4dGf25VX_DaLEJz3vT5nTqTd1DXPOG1.0pKZ4nWIVPDSt9qjAM9Hfbt0wNK__RYoKBrYtzv6LkjPrtkk8hn1VSXonm2868E7mUPvgZp_heYpCBbd7tcAVv5tvs5OzbGltiI83IOUS0Wz59EeAZ9d6.zjkKDhwLlROqtdgPyJyqWWtUXAxYQ7OfuvR49XpWKTu_b0i.HYvMzNelwSsECuOdAkHt.5QDtWmNM0GVf4.xZM_80RJRmauZw; frill-sdk={%22identity%22:{%22frillToken%22:%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJRaFpYeGZEeDJYU284clJrIiwiaXNzIjoiZGVib3RhaS5mcmlsbC5jbyIsImF1ZCI6ImRlYm90YWkuZnJpbGwuY28iLCJzdWIiOiJ1c2VyXzhvbHd3cWQ4IiwiY29tIjowLCJhZG1pblZpZXdpbmdBc1VzZXIiOmZhbHNlLCJzY29wZSI6ImZ1bGwiLCJleHAiOjE3Mzc3NDAzNDcuMTYzMDk0fQ.1NzsXLrTA3Ah3moNbr5DGc90BKgMT3PUTAxYYiRZ7dw%22%2C%22frillRefreshToken%22:%22km4li5bBjZq5WNwcCNpBEsjhoZmvnYUP%22%2C%22email%22:%22%22}}; version=66; _ga_7QSW3N3LVZ=GS1.1.1737774140.265.1.1737774292.0.0.0; __cf_bm=YBgC1xcirrPH7CjsSLoL9QOhm5sh69Rq5IZUpls5Mw4-1737774814-1.0.1.1-uisMlrWvbFWO0KfdfDgZAb_l25FytsJFQJNJihcTb.OivjpcdE2bjIu2Q_JWr5mDm6OJJMl3o8zM4xEEBhPeLQ";

// src/util/getCookie.ts
function getCookie() {
  return cookie;
}

// src/api/request.ts
var cache = /* @__PURE__ */ new Map();
function request(url, init) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const promise = fetch(url, {
    ...init,
    headers: {
      Cookie: getCookie(),
      ...init?.headers
    }
  }).then((res) => res.json());
  cache.set(url, promise);
  return promise;
}

// src/api/getBalanace.ts
var getBalance = async (wallet) => {
  const data = await request("https://docs-demo.solana-mainnet.quiknode.pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [wallet]
    })
  });
  const balanceLamports = data?.result?.value || 0;
  const balanceSol = balanceLamports / 1e9;
  return balanceSol;
};

// src/api/getHolding.ts
var getHolding = async ({
  chain,
  wallet,
  next
}) => {
  return request(
    `https://debot.ai/api/dashboard/wallet/holding_tokens?chain=${chain}&wallet=${wallet}&next=${next}&sort_field=last_active_timestamp&sort_order=desc`
  );
};

// src/util/cliProgress.ts
var import_cli_progress = __toESM(require_cli_progress());
function cliProgress(name) {
  return new import_cli_progress.SingleBar(
    {
      format: `${name} |{bar}| {percentage}% || {value}/{total} Chunks`,
      barCompleteChar: "=",
      barIncompleteChar: "-",
      hideCursor: true,
      linewrap: false
    }
  );
}

// src/api/getSignalList.ts
async function getSignalList() {
  const progress = cliProgress("Fetching Signal List");
  const fetchData = async (next2) => {
    return await fetch(
      `https://debot.ai/api/official/signal/channel/list?page_size=50&next=${next2}`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          // 注意：浏览器环境下无法直接设置cookie等敏感header
          origin: "https://localhost:3000",
          priority: "u=1, i",
          referer: "https://localhost:3000/",
          "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        }
      }
    ).then((res) => res.json());
  };
  const data = {
    meta: {
      tokens: {},
      signals: {},
      metrics: {},
      safe_info: {},
      social_info: {},
      token_tags: {}
    },
    results: [],
    next: "",
    total: 0
  };
  let next = "";
  progress.start(10, 0);
  do {
    const response = await fetchData(next);
    progress.setTotal(Math.ceil(response.data.total / 50));
    progress.increment();
    data.results.push(...response.data.results);
    data.meta.tokens = { ...data.meta.tokens, ...response.data.meta.tokens };
    data.meta.signals = { ...data.meta.signals, ...response.data.meta.signals };
    data.meta.metrics = { ...data.meta.metrics, ...response.data.meta.metrics };
    data.meta.safe_info = {
      ...data.meta.safe_info,
      ...response.data.meta.safe_info
    };
    data.meta.social_info = {
      ...data.meta.social_info,
      ...response.data.meta.social_info
    };
    data.meta.token_tags = {
      ...data.meta.token_tags,
      ...response.data.meta.token_tags
    };
    next = response.data.next;
  } while (next);
  progress.stop();
  return data;
}

// src/api/getWallet.ts
async function getWallet(wallet) {
  const url = `https://debot.ai/api/dashboard/wallet/market/stats?chain=solana&wallet=${wallet}&duration=7D`;
  return request(url);
}

// src/api/getWalletByGroup.ts
async function getWalletByGroup(groupId) {
  return request(
    `https://debot.ai/api/wallet/group/get?id=${groupId}&sort_field=pnl_percent_24h&sort_order=desc`
  );
}

// src/api/getWalletGroup.ts
async function getWalletGroup() {
  return request("https://debot.ai/api/wallet/group/list");
}

// src/api/getWalletList.ts
var getWalletList = async (token, chain, sortField = "last_trade_time", sortOrder = "desc") => {
  return request(
    `https://debot.ai/api/wallet/group/hot_token_wallets/details?token=${token}&chain=${chain}&sort_field=${sortField}&sort_order=${sortOrder}`
  );
};

// src/fun/analytics.ts
async function analytics() {
  const progress = cliProgress("Analyzing Wallet");
  const signalList = await getSignalList();
  progress.start(Object.keys(signalList.meta.tokens).length, 0, {
    speed: "N/A"
  });
  const walletMap = {};
  const tokens = Object.keys(signalList.meta.tokens);
  const signalListBatchSize = 10;
  for (let i = 0; i < tokens.length; i += signalListBatchSize) {
    const batch = tokens.slice(i, i + signalListBatchSize);
    const promises = batch.map(async (token) => {
      const element = signalList.meta.tokens[token];
      const signal = signalList.meta.signals[token];
      const chain = element.chain;
      let walletList;
      let retries = 3;
      while (retries > 0) {
        try {
          walletList = await getWalletList(token, chain);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      }
      walletList?.data.forEach((wallet) => {
        if (!walletMap[wallet.wallet]) {
          walletMap[wallet.wallet] = {
            gold: 0,
            silver: 0,
            bronze: 0,
            double: 0,
            stupid: 0
          };
        }
        if (signal.token_level === "gold") {
          walletMap[wallet.wallet].gold++;
        }
        if (signal.token_level === "silver") {
          walletMap[wallet.wallet].silver++;
        }
        if (signal.token_level === "bronze") {
          walletMap[wallet.wallet].bronze++;
        }
        if (signal.max_price_gain > 1) {
          walletMap[wallet.wallet].double++;
        }
        if (signal.max_price_gain < 1) {
          const matCup = signal.first_price * element.total_supply / 10 ** element.decimals;
          if (matCup < 1e7) {
            walletMap[wallet.wallet].stupid++;
          }
        }
      });
      progress.increment();
    });
    await Promise.all(promises);
  }
  const sortedWallets = Object.keys(walletMap).map((wallet) => ({
    wallet,
    ...walletMap[wallet],
    stupidDoubleRatio: walletMap[wallet].double + walletMap[wallet].stupid === 0 ? 0 : walletMap[wallet].stupid / (walletMap[wallet].double + walletMap[wallet].stupid)
  })).sort((a, b) => b.stupidDoubleRatio - a.stupidDoubleRatio).reduce((acc, curr) => {
    acc[curr.wallet] = {
      gold: curr.gold,
      silver: curr.silver,
      bronze: curr.bronze,
      double: curr.double,
      stupid: curr.stupid,
      stupidDoubleRatio: curr.stupidDoubleRatio
    };
    return acc;
  }, {});
  const stupidWallet = Object.keys(sortedWallets).filter(
    (wallet) => sortedWallets[wallet].stupidDoubleRatio === 1
  );
  progress.stop();
  const walletSet = /* @__PURE__ */ new Map();
  const stupidProgress = cliProgress("Stupid Wallet Analysis");
  stupidProgress.start(stupidWallet.length, 0);
  const batchSize = 20;
  for (let i = 0; i < stupidWallet.length; i += batchSize) {
    const batch = stupidWallet.slice(i, i + batchSize);
    const promises = batch.map(async (wallet) => {
      const { data: walletStats } = await getWallet(wallet);
      if (walletStats.last_active_timestamp && Date.now() / 1e3 - walletStats.last_active_timestamp > 3 * 24 * 60 * 60) {
        walletSet.set(
          wallet,
          `\u6D3B\u8DC3\u65F6\u95F4\u5C0F\u4E8E3\u5929 ${new Date(
            walletStats.last_active_timestamp * 1e3
          ).toLocaleString()}`
        );
      } else if (walletStats.token_winrate_7d < 0.4) {
        walletSet.set(wallet, "7\u5929token\u80DC\u7387\u5C0F\u4E8E40%");
      } else if (walletStats.token_num < 3) {
        walletSet.set(wallet, "token\u6570\u91CF\u5C0F\u4E8E3");
      } else {
        let balance;
        for (let i2 = 0; i2 < 5; i2++) {
          try {
            balance = await getBalance(wallet);
            break;
          } catch (error) {
            if (i2 === 4) throw error;
          }
        }
        if (balance !== void 0 && balance < 2) {
          let holding;
          for (let i2 = 0; i2 < 5; i2++) {
            try {
              holding = await getHolding({
                chain: "solana",
                wallet
              });
              break;
            } catch (error) {
              if (i2 === 4) throw error;
            }
          }
          if (holding) {
            const solBalance = holding.data.holding_tokens.reduce(
              (acc, token) => {
                if (token.token.symbol === "SOL") {
                  acc += token.balance;
                }
                return acc;
              },
              0
            );
            if (balance + solBalance < 2) {
              walletSet.set(wallet, "\u4F59\u989D\u5C0F\u4E8E2SOL");
            }
          }
        }
      }
      stupidProgress.increment();
    });
    await Promise.all(promises);
  }
  stupidProgress.stop();
  const allWalletProgress = cliProgress("Get All Wallets");
  const { data: groupGroupList } = await getWalletGroup();
  allWalletProgress.start(groupGroupList.length, 0);
  const wallets = {};
  for (const group of groupGroupList) {
    const { data: walletList } = await getWalletByGroup(group.id);
    walletList?.items.forEach((item) => {
      wallets[group.id] = [...wallets[group.id] || [], item.wallet_address];
    });
    allWalletProgress.increment();
  }
  allWalletProgress.stop();
  await getLowWinLowPnl(wallets);
  const fileProgress = cliProgress("Writing Files");
  fileProgress.start(3, 0);
  const lowWinLowPnlWallets = await getLowWinLowPnl(wallets);
  for (const wallet of lowWinLowPnlWallets) {
    walletSet.set(wallet, "token\u80DC\u7387\u5C0F\u4E8E40%\u4E147\u5929\u6536\u76CA\u5C0F\u4E8E20%");
  }
  const groupedWallets = {};
  for (const [wallet, reason] of walletSet) {
    for (const [groupId, walletList] of Object.entries(wallets)) {
      if (walletList.includes(wallet)) {
        if (!groupedWallets[groupId]) {
          groupedWallets[groupId] = [];
        }
        groupedWallets[groupId].push(wallet);
        break;
      }
    }
  }
  fileProgress.increment();
  fileProgress.stop();
  console.log(
    `Done! wallet count: ${Object.keys(walletMap).length} token count: ${Object.keys(signalList.meta.tokens).length}`
  );
  return {
    groupedWallets,
    walletSet,
    sortedWallets,
    lowWinLowPnlWallets
  };
}
async function getLowWinLowPnl(wallets) {
  console.log("\u5F00\u59CB\u5206\u6790\u4F4E\u80DC\u7387\u4F4E\u76C8\u5229\u94B1\u5305");
  const lowWinLowPnlWallets = /* @__PURE__ */ new Set();
  const walletsArray = Object.values(wallets).flat();
  const batchSize = 100;
  const analysisProgress = cliProgress("Low Win Low Pnl Wallets Analysis");
  analysisProgress.start(walletsArray.length, 0);
  for (let i = 0; i < walletsArray.length; i += batchSize) {
    const batch = walletsArray.slice(i, i + batchSize);
    const promises = batch.map(async (wallet) => {
      let walletStats;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const { data } = await getWallet(wallet);
          walletStats = data;
          break;
        } catch (error) {
          if (attempt === 4) throw error;
        }
      }
      if (walletStats && walletStats.token_winrate_7d < 0.4 && walletStats.pnl_7d < 0.2) {
        lowWinLowPnlWallets.add(wallet);
      }
      if (walletStats && walletStats.buy_times_7d + walletStats.sell_times_7d > 1400) {
        lowWinLowPnlWallets.add(wallet);
      }
      analysisProgress.increment();
    });
    await Promise.all(promises);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
  }
  analysisProgress.stop();
  return lowWinLowPnlWallets;
}

// src/wallet-analytics.ts
analytics().then((result) => {
  if (!import_fs.default.existsSync("output")) {
    import_fs.default.mkdirSync("output");
  }
  import_fs.default.writeFileSync("output/wallet-analytics.json", JSON.stringify(result.groupedWallets, null, 2));
  console.log(
    "\u94B1\u5305\u5206\u6790\u7ED3\u679C",
    import_path.default.resolve(
      `output/wallet-analytics-${(/* @__PURE__ */ new Date()).toLocaleDateString()}.json`
    )
  );
});
