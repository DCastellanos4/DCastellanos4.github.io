#!/usr/bin/env node
/**
 * Master E2E Automated Test Runner
 * David Castellanos Portfolio Redesign Verification Harness
 * Dual-Tier Architecture: Foundation Tier (V1-V3) + Creative Engineering Tier (V4-V6) & Hub
 * Pure Node.js Standard Library - Zero External Dependencies
 *
 * Usage:
 *   node tests/e2e-runner.js                  # Run all tiers (Tiers 1-4, Foundation + Creative)
 *   node tests/e2e-runner.js --baseline       # Run only baseline Foundation tests (355 tests)
 *   node tests/e2e-runner.js --creative       # Run only Creative Engineering tests (140 tests)
 *   node tests/e2e-runner.js --strict         # Strict verification (fails on pending milestones)
 *   node tests/e2e-runner.js --tier 1         # Run only Tier 1
 *   node tests/e2e-runner.js --tier 2         # Run only Tier 2
 *   node tests/e2e-runner.js --tier 3         # Run only Tier 3
 *   node tests/e2e-runner.js --tier 4         # Run only Tier 4
 *   node tests/e2e-runner.js --verbose        # Show detailed test-by-test log
 *   node tests/e2e-runner.js --filter <regex> # Filter test descriptions
 *   node tests/e2e-runner.js --json           # Output JSON test report
 */

const path = require('path');
const os = require('os');
const { createTier1Suite } = require('./test-tier1-features');
const { createTier2Suite } = require('./test-tier2-boundaries');
const { createTier3Suite } = require('./test-tier3-combinations');
const { createTier4Suite } = require('./test-tier4-scenarios');

// Parse CLI arguments
const args = process.argv.slice(2);
let selectedTier = null;
let verbose = false;
let jsonOutput = false;
let filterPattern = null;
let baselineOnly = false;
let creativeOnly = false;
let strict = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--tier' && args[i + 1]) {
    selectedTier = parseInt(args[++i], 10);
  } else if (arg === '--verbose' || arg === '-v') {
    verbose = true;
  } else if (arg === '--json') {
    jsonOutput = true;
  } else if (arg === '--baseline') {
    baselineOnly = true;
  } else if (arg === '--creative') {
    creativeOnly = true;
  } else if (arg === '--strict') {
    strict = true;
    process.env.STRICT_ALL = '1';
  } else if (arg === '--filter' && args[i + 1]) {
    filterPattern = args[++i];
  }
}

async function main() {
  const startTime = Date.now();

  const suiteOpts = { baselineOnly, creativeOnly, strict };

  if (!jsonOutput) {
    console.log('='.repeat(88));
    console.log(' DAVID CASTELLANOS PORTFOLIO REDESIGN — E2E TEST SUITE RUNNER');
    console.log(' Dual-Tier Architecture: Foundation (V1-V3) + Creative Engineering (V4-V6) & Hub');
    console.log('='.repeat(88));
    console.log(` Node: ${process.version} | OS: ${os.type()} ${os.release()} | Date: ${new Date().toISOString()}`);
    console.log(` Filter: ${filterPattern || 'None'} | Tier: ${selectedTier ? `Tier ${selectedTier}` : 'All Tiers (1-4)'} | Mode: ${baselineOnly ? 'Baseline Only' : (creativeOnly ? 'Creative Only' : (strict ? 'Strict All' : 'Progressive Dual-Tier'))}`);
    console.log('='.repeat(88));
    console.log();
  }

  const suitesToRun = [];

  if (!selectedTier || selectedTier === 1) {
    const s1 = createTier1Suite(suiteOpts);
    suitesToRun.push({ tier: 1, name: s1.name, suite: s1 });
  }
  if (!selectedTier || selectedTier === 2) {
    const s2 = createTier2Suite(suiteOpts);
    suitesToRun.push({ tier: 2, name: s2.name, suite: s2 });
  }
  if (!selectedTier || selectedTier === 3) {
    const s3 = createTier3Suite(suiteOpts);
    suitesToRun.push({ tier: 3, name: s3.name, suite: s3 });
  }
  if (!selectedTier || selectedTier === 4) {
    const s4 = createTier4Suite(suiteOpts);
    suitesToRun.push({ tier: 4, name: s4.name, suite: s4 });
  }

  const results = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const item of suitesToRun) {
    if (!jsonOutput) {
      console.log(`>>> Executing [${item.name}]...`);
    }

    const res = await item.suite.run({
      verbose,
      filter: filterPattern
    });

    results.push(res);
    totalTests += res.total;
    totalPassed += res.passed;
    totalSkipped += (res.skipped || 0);
    totalFailed += res.failed;

    if (!jsonOutput) {
      const statusIcon = res.failed === 0 ? '✓ PASS' : '✗ FAIL';
      const skipStr = res.skipped > 0 ? ` (${res.skipped} skipped)` : '';
      console.log(`    Result: ${statusIcon} — ${res.passed}/${res.total} passed${skipStr} (${res.duration}ms)`);
      console.log();
    }
  }

  const totalDuration = Date.now() - startTime;

  if (jsonOutput) {
    const report = {
      timestamp: new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      duration: totalDuration,
      summary: {
        total: totalTests,
        passed: totalPassed,
        skipped: totalSkipped,
        failed: totalFailed,
        successRate: totalTests > 0 ? (totalPassed / (totalTests - totalSkipped)) * 100 : 0
      },
      tiers: results.map(r => ({
        name: r.name,
        total: r.total,
        passed: r.passed,
        skipped: r.skipped || 0,
        failed: r.failed,
        duration: r.duration,
        errors: r.errors.map(e => ({ description: e.description, message: e.error.message }))
      }))
    };
    console.log(JSON.stringify(report, null, 2));
    process.exit(totalFailed > 0 ? 1 : 0);
  }

  // Print Executive Summary Table
  console.log('='.repeat(88));
  console.log(' TEST SUITE EXECUTION SUMMARY');
  console.log('='.repeat(88));
  console.log(
    ' Tier'.padEnd(42) +
    'Passed'.padStart(9) +
    'Skipped'.padStart(9) +
    'Failed'.padStart(9) +
    'Total'.padStart(9) +
    'Time'.padStart(10)
  );
  console.log('-'.repeat(88));

  for (const r of results) {
    const timeStr = `${r.duration}ms`;
    console.log(
      ` ${r.name.slice(0, 40)}`.padEnd(42) +
      String(r.passed).padStart(9) +
      String(r.skipped || 0).padStart(9) +
      String(r.failed).padStart(9) +
      String(r.total).padStart(9) +
      timeStr.padStart(10)
    );
  }

  console.log('-'.repeat(88));
  console.log(
    ' TOTALS'.padEnd(42) +
    String(totalPassed).padStart(9) +
    String(totalSkipped).padStart(9) +
    String(totalFailed).padStart(9) +
    String(totalTests).padStart(9) +
    `${totalDuration}ms`.padStart(10)
  );
  console.log('='.repeat(88));

  if (totalFailed > 0) {
    console.log();
    console.log(`❌ TEST RUN FAILED: ${totalFailed} failing assertion(s) detected.`);
    process.exit(1);
  } else if (totalSkipped > 0) {
    console.log();
    console.log(`✅ TEST RUN PASSED: ${totalPassed} assertions passed (${totalSkipped} pending uncompleted milestones, 0 failures).`);
    process.exit(0);
  } else {
    console.log();
    console.log(`✅ TEST RUN PASSED: 100% of assertions passed (${totalPassed}/${totalTests}).`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
