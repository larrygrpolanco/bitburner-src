/**
 * CYBER OPERATIVE PROTOCOL v1.2 - ENHANCED HACKING SCRIPT
 * ------------------------------------------------------
 * Dynamically targets the most profitable server within your hacking level
 * Optimized grow/weaken/hack ratios for maximum profit
 * Real-time progress monitoring with immersive status reports
 */

/** @param {NS} ns */
export async function main(ns) {
  // PHASE 1: INITIALIZATION - SET UP YOUR CYBER TOOLS
  // ------------------------------------------------
  // Configurable parameters (adjust as you progress)
  const reservePercentage = 0.1; // Reserve 10% of server money for faster growth
  const securityThreshold = 2; // Acceptable security level above minimum

  // PHASE 2: TARGET SELECTION - FIND THE JUICIEST MARK
  // -------------------------------------------------
  // Find the most profitable server within your hacking capability
  const bestTarget = findOptimalTarget(ns);

  if (!bestTarget) {
    ns.tprint(
      '⚠️ NO SUITABLE TARGETS FOUND! Try gaining hacking levels or acquiring port-opening programs'
    );
    return;
  }

  ns.tprint(
    `🎯 LOCKED ONTO: ${bestTarget} | MAX MONEY: ${ns.formatNumber(
      ns.getServerMaxMoney(bestTarget)
    )}`
  );

  // PHASE 3: ACCESS OPERATION - CRACK THE DIGITAL LOCKS
  // --------------------------------------------------
  // Automated root access toolkit
  if (ns.fileExists('BruteSSH.exe', 'home')) ns.brutessh(bestTarget);
  // Add more port-opening programs here as you acquire them

  if (!ns.hasRootAccess(bestTarget)) {
    ns.nuke(bestTarget);
    ns.tprint(`🔓 ROOT ACCESS GRANTED: ${bestTarget}`);
  }

  // PHASE 4: MAIN HACKING LOOP - THE DIGITAL HEIST
  // ---------------------------------------------
  while (true) {
    // OPERATION STATUS REPORT
    const currentMoney = ns.getServerMoneyAvailable(bestTarget);
    const maxMoney = ns.getServerMaxMoney(bestTarget);
    const currentSecurity = ns.getServerSecurityLevel(bestTarget);
    const minSecurity = ns.getServerMinSecurityLevel(bestTarget);

    // Calculate progress percentages
    const moneyPercent = (currentMoney / maxMoney) * 100;
    const securityAboveMin = currentSecurity - minSecurity;

    // Display immersive status report
    ns.clearLog();
    ns.print(`🖥️  TARGET: ${bestTarget}`);
    ns.print(
      `💰 FUNDS: ${ns.formatNumber(currentMoney)}/${ns.formatNumber(
        maxMoney
      )} (${moneyPercent.toFixed(1)}%)`
    );
    ns.print(
      `🛡️  SECURITY: ${currentSecurity.toFixed(2)} (${
        securityAboveMin > 0 ? '+' : ''
      }${securityAboveMin.toFixed(2)} above min)`
    );
    ns.print(
      `⚡ ACTION: ${getCurrentAction(
        ns,
        bestTarget,
        currentMoney,
        maxMoney,
        currentSecurity,
        minSecurity
      )}`
    );

    // STRATEGIC DECISION MAKING
    if (currentSecurity > minSecurity + securityThreshold) {
      // Security is too high - weaken first
      await ns.weaken(bestTarget);
    } else if (currentMoney < maxMoney * (1 - reservePercentage)) {
      // Funds are below reserve threshold - grow the money pile
      await ns.grow(bestTarget);
    } else {
      // Perfect conditions - execute the hack
      await ns.hack(bestTarget);
    }
  }
}

/**
 * STRATEGIC TARGET ANALYSIS - FIND THE MOST LUCRATIVE MARK
 * @param {NS} ns
 * @returns {string} Best target hostname
 */
function findOptimalTarget(ns) {
  const knownServers = [
    'n00dles', // Easy target (req lvl 1)
    'foodnstuff', // Low security (req lvl 1)
    'sigma-cosmetics', // Better payout (req lvl 5)
    'joesguns', // Good early target (req lvl 10)
    'hong-fang-tea', // Mid-level (req lvl 30)
    'harakiri-sushi', // Higher reward (req lvl 40)
  ];

  let bestTarget = '';
  let bestValue = 0;
  const myHackingLevel = ns.getHackingLevel();

  for (const server of knownServers) {
    // Skip servers above our skill level
    if (ns.getServerRequiredHackingLevel(server) > myHackingLevel) continue;

    // Calculate target value (max money adjusted by difficulty)
    const maxMoney = ns.getServerMaxMoney(server);
    const difficulty = ns.getServerRequiredHackingLevel(server);
    const value = maxMoney * (myHackingLevel / difficulty);

    // Track best value target
    if (value > bestValue) {
      bestValue = value;
      bestTarget = server;
    }
  }

  return bestTarget;
}

/**
 * OPERATION STATUS REPORT - WHAT'S HAPPENING RIGHT NOW?
 */
function getCurrentAction(ns, target, money, maxMoney, security, minSecurity) {
  const securityDiff = security - minSecurity;
  const moneyRatio = money / maxMoney;

  if (securityDiff > 5)
    return `🚨 CRITICAL: Reducing security (${securityDiff.toFixed(
      1
    )} above safe)`;
  if (securityDiff > 2)
    return `🛡️  STABILIZING: Lowering security (+${securityDiff.toFixed(1)})`;
  if (moneyRatio < 0.5)
    return `📈 BOOSTING: Growing funds (${(moneyRatio * 100).toFixed(
      1
    )}% full)`;
  return `💸 HACKING: Draining ${ns.formatNumber(money)} credits`;
}
