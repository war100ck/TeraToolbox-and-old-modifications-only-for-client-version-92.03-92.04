TERA-Message From Tera-Mod, ZC
======

# Function introduction

Convenient for Proxy output color text

------

# Examples of calling methods

const Message = require('../tera-message')

const MSG = new Message(mod)

var txt = "Hello"

# MSG.chat(txt)

- MSG.chat( MSG.BLU(txt) )    // /8 Proxy channel blue text

- MSG.chat( MSG.YEL(txt) )    // /8 Proxy channel yellow text

- MSG.chat( MSG.TIP(txt) )    // /8 Proxy channel cyan text

- MSG.chat( MSG.RED(txt) )    // /8 Proxy channel red text

- MSG.chat( MSG.GRY(txt) )    // /8 Proxy channel grey text

- MSG.chat( MSG.PIK(txt) )    // /8 Proxy channel pink text

- MSG.chat( MSG.clr(txt, 123456) )    // /8 Proxy channel #123456号颜色 文字

# MSG.party(txt) // (only visible to own client) Captain notice

# MSG.raids(txt) // (Visible only to own client) Head notice

# MSG.alert(txt, type) // (Only visible to own client) Warning on screen

type: Number parameters represent different styles

- 绿色 31 32 37 41 42 50 52 54 55 56 57 58 59 60 61 62 80 100	冒号68	旗子75

- 蓝色 43	冒号66 68 70 72	旗子76	瓶子101

- 红色 44 53 67 69 71 73	旗子77	瓶子102

- LEVEL UP 35
