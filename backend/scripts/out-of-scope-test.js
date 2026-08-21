// OUT-OF-SCOPE TEST (intentional) — verifies CodeRabbit flags unrelated / out-of-scope changes.
console.log("OOS debug: this log is intentionally left in and out of sprint scope");

const HARDCODED_API_KEY = "FAKE-KEY-for-test-only-0000"; // hardcoded credential (test only)

function unusedOutOfScopeHelper() {
  return "this helper is not referenced anywhere in the codebase";
}

module.exports = { unusedOutOfScopeHelper };
