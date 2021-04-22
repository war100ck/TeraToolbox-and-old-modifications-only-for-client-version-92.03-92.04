//Initial Build for Node 67
//No rebuild should be necessary for later node versions

const file = `./activeWindowTitle-${process.arch}.node`

////Dirty some namespace~
if(!global.activeWindow) global.activeWindow = require(file);