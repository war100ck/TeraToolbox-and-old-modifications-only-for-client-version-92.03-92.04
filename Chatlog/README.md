# Chatlog

Модуль снятия логов с чата для Toolbox

### config file
По умолчанию чат записывается в 4 файла, измените конфигурацию в соответствии с вашими потребностями.
- `fileName` может быть что угодно
- `channels` представляет собой строковый массив каналов, которые вы хотите зарегистрировать в этом файле
  - действующие каналы:
    - `say`, `party`, `guild`, `area`, `trade`, `greet`, `bargain`, `lfg`, `partynotice`, `system`, `raidnotice`, `emote`, `global`, `raid`, `greetings`, `megaphone`, `guildad`, `whisper`, `private`

Возможность изменить формат сообщений

Путь по умолчанию для логов: `Toolbox/LogChat/log`