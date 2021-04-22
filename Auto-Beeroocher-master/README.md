# Auto-Beeroocher
Automatically uses beer and/or brooch when certain skills are activated.

Use skill.js to choose which abilities will proc the brooch+beer call.

# Skills

Two ways to find information for the needed skill:

First:

-Go to https://teralore.com/us/
-Search for the ability you want, ie. "Godsfall" and find it's ID.

-First 2 digits of that id is the "Group" variable.

-Jobs are put in the comment at the start of the file and here as well.


/*

*0  - Warrior

*1  - Lancer

*2  - Slayer

*3  - Berserker

*4  - Sorcerer

*5  - Archer

*6  - Priest

*7  - Mystic

*8  - Reaper

*9  - Gunner

*10 - Brawler

*11 - Ninja

*12 - Valkyrie

*/

Second:

-Start the game with module on.

-Write !getskillinfo

-Use the skill you want

-> In proxy console you will find information about the job/id.

# Commands

Commands:

->beer => enable/disable the module

->getskillinfo => get information about the next used skill

->lein:

  ->blank => current delay
  
  ->"delay {Value}" => set lein delay to {Value}
  
->brooch:

  ->blank => current delay
  
  ->"delay {Value}" => set brooch delay to {Value}
  

{Value} IS JUST A NUMBER WITHOUT BRACKETS

# Config

First time you run the game, config.json will be genrated.
(looks something like this, without comments)

{

    "enabled": true, // default module is enabled 
    
    "list": {
    
        "0": {
        
            "cdw": 3000 // beer delay
            
        },
        
        "1": {
        
            "cdw": 500 // brooch delay
            
        }
        
    }
    
}


After you start the game you can edit the delays ( See Command )
Or, out of the game you can edit config file yourself.
Just change numbers ( In this case 3000/500 ) to how long do you want beer/brooch to be delayed IN MILISECONDS.(seconds*1000)



# Supported

Supported abilities:

// Deadly Gamble

// Adrenaline Rush

// In Cold Blood

// Unleash

// Mana Boost

// Windsong

// Edict of Judgement

// Thrall of Wrath

// Shadow Reaping

// Bombardment

// Modular Weapon System

// Rythmic Blows

// Harmony

// Godsfall

// Ragnarok


# Credits

****************

*******************************

** Blasting Penis in the sky **

** Brawndria  *****************

** Ilya       *****************

** Kygas      **

****************

****************
