const S = require('./string'),
    fs = require('fs'),
    config = require('./config.json'),
    DEFAULT_HOOK_SETTINGS = { order: 1002, filter: { fake: null } },
    chattype = {
        0: 'say',
        1: 'party',
        2: 'guild',
        3: 'area',
        4: 'trade',
        9: 'greet',
        19: 'bargain',
        20: 'lfg',
        21: 'partynotice',
        24: 'system',
        25: 'raidnotice',
        26: 'emote',
        27: 'global',
        32: 'raid',
        212: 'greetings',
        213: 'megaphone',
        214: 'guildad'
    }

if (!fs.existsSync(config.path)) {
    fs.mkdirSync(config.path);
}

module.exports = function ChatLog(mod) {
    let pchat = {}

    mod.hook('S_CHAT', 3, DEFAULT_HOOK_SETTINGS, event => {
        let message = S.decodeHTMLEntities(S.stripTags(event.message));
        let channelno = chattype[event.channel];
        if (!channelno) channelno = event.channel.toString();
        for (let file of config.files) {
            if (file.channels.includes(channelno)) {
                log(formatMessage(message, channelno, event.name, config.format.chat), file.fileName)
            }
        }

    });

    mod.hook('S_PRIVATE_CHAT', 1, DEFAULT_HOOK_SETTINGS, event => {
        let message = S.decodeHTMLEntities(S.stripTags(event.message));
        let channelno = pchat[event.channel];
        if (!channelno) channelno = event.channel.toString();
        for (let file of config.files) {
            if (file.channels.includes('private')) {
                log(formatMessage(message, channelno, event.authorName, config.format.chat), file.fileName)
            }
        }
    });

    mod.hook('S_WHISPER', 3, DEFAULT_HOOK_SETTINGS, event => {
        let message = S.decodeHTMLEntities(S.stripTags(event.message));
        for (let file of config.files) {
            if (file.channels.includes('whisper')) {
                if (event.name != mod.game.me.name) {
                    log(formatMessage(message, '', event.name, config.format.whisper.from), file.fileName)
                } else {
                    log(formatMessage(message, '', event.recipient, config.format.whisper.to), file.fileName)
                }
            }
        }

    });

    mod.hook('S_JOIN_PRIVATE_CHANNEL', 2, event => {
        pchat[event.channelId] = event.name;
    });

    function formatMessage(msg, channel, author, format) {
        return format
            .replace(/%timestamp%/, getTimeStamp())
            .replace(/%channel%/, channel)
            .replace(/%author%/, author)
            .replace(/%msg%/, msg)

    }

    function getTimeStamp() {
        let now = new Date;
        return config.format.timestamp
            .replace(/%y%/, now.getFullYear().toString())
            .replace(/%m%/, (now.getMonth() + 1).toString().padStart(2, '0'))
            .replace(/%d%/, now.getDate().toString().padStart(2, '0'))
            .replace(/%h%/, now.getHours().toString().padStart(2, '0'))
            .replace(/%m%/, now.getMinutes().toString().padStart(2, '0'))
            .replace(/%s%/, now.getSeconds().toString().padStart(2, '0'))
    }

    function log(text, fileName) {
        fs.appendFile(config.path + fileName + '.txt', text + '\n', error => {
            if (error) {
                console.error("Ошибка записи файла", error);
            }
        });
    }
}