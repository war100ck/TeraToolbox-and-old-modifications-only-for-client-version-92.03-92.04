const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ProcessListener = require("./process-listener");

module.exports = function XigncodeBypass(mod) {
    if (['eu', 'na', 'ru'].includes(mod.region)) {
        mod.warn(`Not required for region ${mod.region.toUpperCase()}!`);
        return;
    }
    
    let PatchedProcesses = {};
    
    function HandleAddedProcess(process) {
        try {
            let XigncodeFolder = path.join(path.dirname(process.path), "XIGNCODE");
            PatchedProcesses[process.pid] = XigncodeFolder;
            // console.log(`[bypass] Game client (PID ${process.pid}) detected, bypass installed.`);
        } catch(e) {
            // Ignore errors...
        }
    }
    
    function HandleRemovedProcess(pid) {
        try {
            let XigncodeFolder = PatchedProcesses[pid];
                fs.copyFileSync(path.join(__dirname, "bak/x3.xem"), path.join(XigncodeFolder, "x3.xem"));
                fs.copyFileSync(path.join(__dirname, "bak/xcorona.xem"), path.join(XigncodeFolder, "xcorona.xem"));
            delete PatchedProcesses[pid];
            console.log(`[bypass] Game client (PID ${pid}) closed, bypass reverted.`);
        } catch(e) {
            // Ignore errors...
        }
    }
    // Remove vulnerable driver from system
    try {
        fs.unlinkSync('C:\\Windows\\xhunter1.sys');
        mod.log('Traces of a previous xigncode installation have been located and removed from your system!');
        mod.log('Note that some registry keys might still remain on your system.');
        mod.log(`Check out ${global.TeraProxy.SupportUrl} for instructions on manual removal.`);
    } catch(e) {
        // Ignore errors...
    }
    
    // Inject bypass DLL
    try {
        execFileSync(path.join(path.dirname(require.resolve('tera-client-interface')), 'injector.exe'), [mod.clientInterface.info.pid, path.join(__dirname, 'xigncode-bypass.dll')]);
        
        ProcessListener("TERA.exe", HandleAddedProcess, HandleRemovedProcess, 500);
        // console.log("[bypass] Ready, waiting for game client to be started!");
    } catch(e) {
        mod.error(`Unable to install bypass (PID ${mod.clientInterface.info.pid})!`);
        switch (e.code) {
            case 'ENOENT': {
                mod.error('injector.exe does not exist. It has likely been deleted by your anti-virus.');
                mod.error('Disable/uninstall your anti-virus or whitelist TERA Toolbox and injector.exe!');
                break;
            }
            case 'EPERM': {
                mod.error('Permission to launch injector.exe denied. It has likely been blocked by your anti-virus.');
                mod.error('Disable/uninstall your anti-virus or whitelist TERA Toolbox and injector.exe!');
                break;
            }
            default: {
                switch (e.status) {
                    case 1: {
                        mod.error('Bypass DLL injection unsuccessful. It has likely been blocked by your anti-virus.');
                        mod.error('> Make sure that TERA Toolbox is running with Administrator privileges!');
                        mod.error('> Disable/uninstall your anti-virus or whitelist TERA Toolbox and injector.exe!');
                        break;
                    }
                    default: {
                        mod.error('This is likely caused by your anti-virus interfering. Disable/uninstall it or whitelist TERA Toolbox.');
                        mod.error('Full error message:');
                        mod.error(e);
                        break;
                    }
                }
                break;
            }
        }
    }
}
