# FPS-UTILS

  **To support development of this mod**:
    Buy me a [covfefe](https://ko-fi.com/codeagon) (I can't actually drink coffee but I will eat your money)
    
   Throw money [here](https://www.patreon.com/saegusa) to show support for Saegusa, the original developer of this mod.
  ****
- [FPS-UTILS](#fps-utils)
  - [BIG Note](#big-note)
  - [Installation](#installation)
  - [Commands](#commands)
    - [Additional command info](#additional-command-info)
  - [Update Log](#update-log)
  - [Work In Progress:](#work-in-progress)
  - [Suggestions](#suggestions)
  - [Credits](#credits)


## BIG Note
FPS-Utils now comes with [badGUI support](https://github.com/codeagon/badGui), I highly recommend downloading it for additional functionality and ease of use. This update also adds a few new commands as well as fixing a couple of bugs.

## Installation 
***Note***: *If you're using [Caali's proxy](https://discord.gg/maqBmJV) fps-utils will be automatically updated and already installed so you will not need to do the following.*
* put the script folder "fps-utils" into bin/node_modules
* Log the game using the proxy.

## Commands
***Note:*** *When inputting commands directly from the **proxy channel**  the prefix `!` should be ignored.*

Command | Argument(s) | Example | Description
---|---|---|---
**!fps gui** |  | !fps gui| Opens up the GUI. granting access to all of these commands.
**!fps party** |  | !fps party| Hides all other players except those in your party
**!fps gui npcsearch** |  | !fps npcsearch vergos| Opens up a list of NPCs with names matching your search query 
**!fps mode** | 1, 2, 3, off | !fps mode 1| Sets the current fps-utils optimization state. 0 disables, 1 hides particles, 2 hides skill animations, 3 hides all players. All modes toggle`fps hit on`
**!fps hit** | me, damage, other | !fps hit other | Enables/Disables hiding of hit effects for the player.`Damage`toggles damage numbers off.`Me` turns hit effects off for **you** (disables damage numbers also unfortunately), other disables effects for other users (recommended).
**!fps hide** | playername, dps, healers, tanks, ranged, classname | !fps hide Spacecats, !fps hide valkyrie |hides dps, healers, tanks or ranged classes, any username or a class, class names can be found in`config.json`.
**!fps show** | playername, dps, healers, tanks, ranged, classname| !fps show Memeboy | Takes the same arguments as above and instead unhides them.
**!fps list** |  | !fps list |  Prints a list of characters/classes/roles currently hidden by *hide* command to chat.
**!fps fireworks** | None | !fps fireworks | Enables/Disables hiding of firework entities in open world.
**!fps servants** | None | !fps servants | Enables/Disables hiding of Pets and Partners.
**!fps summons** | empty, mine | !fps summons | Enables/Disables hiding of  summoned entities(gunner turrets, mystic thralls, etc) fps summons mine hides your own summons
**!fps skill** | blacklist, class <classname>  | !fps skill class lancer | `black` toggles the skill blacklist feature, `class <classname>`toggles displaying of ALL skills for that class
**!fps npc** | None | !fps npc | Enables/Disables hiding of ALL NPCs within the npc blacklist
**!fps effects** | all, blacklist | !fps effects blacklist | Toggles showing of either blacklisted abnormality effects or all abnormality effects (your own ones still display normally in all mode, however not in blacklist mode).
**!fps style** | None | !fps style | Enables/Disables showing of all spawned players as wearing the same outfit. Requires leaving and re-entering the area or re-logging to take effect.
**!fps proj** | all, blacklist | !fps proj all| Enables/Disables showing of all projectiles, or blacklisted one. By default hailstorm is included.

### Additional command info
*  A full list of skill IDs can be found [here.](https://github.com/pinkipi/skill-prediction/blob/master/config/skills.js)
*  A full list of NPCs and Abnormalities will be posted later.
*  To get projectile skill IDs you will have to log them yourself, I will add something that does this for you in a later update
  
## Update Log
* Moved to BigInt
* Fixed some other stuff idklol
## Work In Progress:
Various GUI improvements, fix for mount stuff, projectile and effect lists, fix formatting.

## Suggestions
* If you have suggestions, need help, or want to comment on my shitty coding, leave an issue report or message me (Hugedong69 in pinkies/caali's discord)

## Credits
The following people have helped in making FPS-Utils:
- [Saegusae](https://github.com/Saegusae/) - Original developer
- [Bernkastel](https://github.com/Bernkastel-0/) - Whos code I stole and then rewrote because it was also broken
- [SerenTera](https://github.com/SerenTera) - God coder who added a lot of features and cleaned a lot of things up
- [Caali](https://github.com/hackerman-caali/) - Provided update functionality to proxy so that I can yell at less users
- [Kasea](https://github.com/Kaseaa/) - Let me steal code (I hope :eyes: )
- [Kyoukaya](https://github.com/kyoukaya) - Fixed my grabo code
- [SaltyMonkey](https://github.com/SaltyMonkey) - Yelled at me a bunch
- [Pinkie](https://github.com/pinkipi/) - Told me dumb js things that I should know but don't because I'm dumb
