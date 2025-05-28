# Ghost Duels (beta)

Play simulated GeoGuessr Duel games aganist a random player's past guesses

<b>[Install script](https://github.com/Rawblocky/BadGuessr/raw/master/main.user.js)</b>

If you want to reset the scores, refresh the page

When the ghost opponent guesses and the timer expires, your guess will not auto-lock; you need to manually place the guess

## Maps

Currently, there is only one map, but I'll add more maps based on elo ranges and gamemode in the future

- <b>[All locations](https://www.geoguessr.com/maps/682f9c642e0faf21e0cb31a9)</b>

## Contribute guesses

All past guesses are collected from the "Friend Activity" page in GeoGuessr who have "Share my activity with friends" turned on

[Help contribute your guesses by adding me on GeoGuessr](https://www.geoguessr.com/user/67a2f967034dd50f2b2e43c3)

## Coverage

### Duel guesses

All Duel games, besides ones placed in "The World" or "World", are tracked

### Classic game guesses

Only maps that are either verified by GeoGuessr, made by certain map creators, or is personally added to the database by me are allowed to show up. Note that some maps are banned (ex. Maps by GeoGuessr, maps that have a lot of unofficial coverage, etc.)

# Plans

- Offer maps based on elo range and gamemode
- Keybinding to reset score
- Option to automatically have health reset after someone reaches 0 HP

# Known bugs

- Music / guess timer will still go off if you exit the map (WORKAROUND: Refreshing page or playing a different map)

# 💖 Thanks

i'm someone who isn't too experienced with JS / web development, so thanks to these people for making life easier:

- miraclewhips for [geoguessr-event-framework](https://github.com/miraclewhips/geoguessr-event-framework) and a lot of open source scripts I could look at and learn from
- tyow for [Guess retriever](https://greasyfork.org/en/scripts/482055-guess-retriever) (using a modified version for the database)
- [LearnableMeta](https://learnablemeta.com/) for it initially being used to display only scores (and got me to start playing GeoGuessr)

and everyone who added me on GeoGuessr for helping with this project
