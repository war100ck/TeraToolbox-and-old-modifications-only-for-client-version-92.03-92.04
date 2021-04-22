class Bugfix {
    constructor(mod) {
        const fs = require('fs'),
              path = require('path'),
              submoduleRoot = path.join(mod.rootFolder, 'lib');

        this.submodules = fs.readdirSync(submoduleRoot).map(submodule => {
            const submoduleConstructor = require(path.join(submoduleRoot, submodule));
            return new submoduleConstructor(mod);
        });
    }

    destructor() {
        this.submodules.forEach(submodule => {
            if (typeof submodule.destructor === 'function')
                submodule.destructor();
        });

        delete this.submodules;
    }
}

module.exports = Bugfix;
