/**
 * OPERATION DEPLOYMENT PROTOCOL v1.0 - AUTOMATED SCRIPT DISTRIBUTION
 * -----------------------------------------------------------------
 * Distributes hacking scripts across your network of compromised servers
 * Calculates optimal thread counts based on available RAM
 * Provides real-time deployment reports
 */

/** @param {NS} ns */
export async function main(ns) {
    // CONFIGURATION - ADJUST AS YOUR NETWORK GROWS
    // Use full relative path to script directory
    const scriptName = "user-scripts/enhanced-hack.js";
    const reserveRAM = 0.1; // Reserve 10% of server RAM for system processes
    
    // OPERATION: SERVER DISCOVERY
    const compromisedServers = discoverHackableServers(ns);
    ns.tprint(`🌐 DISCOVERED ${compromisedServers.length} POTENTIAL HOSTS`);
    
    // OPERATION: SCRIPT DEPLOYMENT
    let deploymentReport = "📡 DEPLOYMENT REPORT:\n";
    for (const server of compromisedServers) {
        const success = deployToServer(ns, server, scriptName, reserveRAM);
        
        if (success) {
            const threads = Math.floor(
                (ns.getServerMaxRam(server) * (1 - reserveRAM)) / 
                ns.getScriptRam(scriptName)
            );
            
            deploymentReport += `✅ ${server.padEnd(15)} | THREADS: ${threads}\n`;
        } else {
            deploymentReport += `❌ ${server.padEnd(15)} | DEPLOYMENT FAILED\n`;
        }
    }
    
    // OPERATION: FINAL BRIEFING
    ns.tprint("\n" + deploymentReport);
    ns.tprint("🔥 DEPLOYMENT COMPLETE | ALL SYSTEMS OPERATIONAL");
}

/**
 * NETWORK RECONNAISSANCE - FIND COMPROMISED SERVERS
 * @param {NS} ns 
 * @returns {string[]} List of hackable servers
 */
function discoverHackableServers(ns) {
    const servers = ["home"]; // Always include home server
    const scanned = new Set(["home"]); // Track scanned servers
    
    // Recursive scanning function
    function scanServer(host) {
        const connected = ns.scan(host);
        for (const server of connected) {
            if (!scanned.has(server)) {
                scanned.add(server);
                if (ns.hasRootAccess(server)) {
                    servers.push(server);
                }
                scanServer(server);
            }
        }
    }
    
    scanServer("home");
    return servers;
}

/**
 * SERVER DEPLOYMENT PROCEDURE
 * @param {NS} ns 
 * @param {string} server Target server
 * @param {string} script Script filename
 * @param {number} reserveRAM Fraction of RAM to reserve
 * @returns {boolean} Deployment success
 */
function deployToServer(ns, server, script, reserveRAM) {
    try {
        // Clean server before deployment
        ns.killall(server);
        
        // Calculate thread count using HOME's script RAM (script exists on home)
        const scriptRAM = ns.getScriptRam(script, "home");
        
        // Skip if script doesn't exist
        if (scriptRAM === 0) {
            ns.tprint(`⚠️ SCRIPT NOT FOUND: ${script} not found on home`);
            return false;
        }
        
        // Copy script to target server
        ns.scp(script, server, "home");
        
        // Calculate thread count
        const serverRAM = ns.getServerMaxRam(server);
        const availableRAM = serverRAM * (1 - reserveRAM);
        const threads = Math.floor(availableRAM / scriptRAM);
        
        // Start script if resources available
        if (threads > 0) {
            // Use relative path (Bitburner requires no leading slash)
            ns.exec(script, server, threads);
            return true;
        } else if (threads === 0) {
            ns.tprint(`⚠️ INSUFFICIENT RAM: ${server} has ${ns.formatRam(availableRAM)} available but needs ${ns.formatRam(scriptRAM)} per thread`);
        }
        return false;
    } catch (error) {
        ns.tprint(`⚠️ ERROR ON ${server}: ${error}`);
        return false;
    }
}
