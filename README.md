# Ghost Duels (beta)

Play simulated GeoGuessr Duel games aganist a random player's past guesses

# <b><p align=center>[Install script](https://github.com/Rawblocky/BadGuessr/raw/master/main.user.js) • [Maps](https://github.com/rawblocky/geoguessr-ghost-duels?tab=readme-ov-file#maps)</p></b>

https://github.com/user-attachments/assets/99cc5e3b-ed41-4488-8b5e-5be4ce1c5284

# Notes

The game doesn't end once someone reaches 0 health; If you want to reset the scores, refresh the page

When the ghost opponent guesses and the timer expires, your guess will not auto-lock; you need to manually place the guess

# Maps

Currently, there is only one map, but I'll add more maps based on elo ranges and gamemode in the future

- <b>[All locations](https://www.geoguessr.com/maps/682f9c642e0faf21e0cb31a9)</b>

## Coverage

### Duel guesses

All Duel games, besides ones placed in "The World" or "World", are tracked

### Classic game guesses

Only maps that are either verified by GeoGuessr, made by certain map creators, or is personally added to the database by me are allowed to show up. Note that some maps are banned (ex. Maps by GeoGuessr, maps that have a lot of unofficial coverage, etc.)

# Contribute guesses

All past guesses are collected from the "Friend Activity" page in GeoGuessr who have "Share my activity with friends" turned on

[Help contribute your guesses by adding me on GeoGuessr](https://www.geoguessr.com/user/67a2f967034dd50f2b2e43c3)

# Documentation

## Settings

You can adjust different variables at the top of the script.

### Main Settings

<table>
  <tr>
    <th>Setting</th>
    <th>Accepted values</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>soundVolume</td>
    <td>number from 0 to 1; Default: <b>0.5</b></td>
    <td>Changes the sound volume during gameplay</td>
  </tr>
  <tr>
    <td>musicVolume</td>
    <td>number from 0 to 1; Default: <b>0</b></td>
    <td>Changes the music volume during gameplay</td>
  </tr>
  <tr>
    <td>musicPack</td>
    <td><b>Duels</b>, DuelsOld, BattleRoyale</td>
    <td>Changes the music used during gameplay; set musicVolume to 0 to mute</td>
  </tr>
  <tr>
    <td>duelsGuessSelection</td>
    <td>random, best, worst, <b>fastest</b>, slowest</td>
    <td>If the guess you're playing aganist is from a Duels game, it'll use this type of guess</td>
  </tr>
  <tr>
    <td>defaultHealth</td>
    <td>number, Default: <b>6000</b></td>
    <td>Changes the starting health for yourself</td>
  </tr>
  <tr>
    <td>defaultHealthGhost</td>
    <td>number, Default: <b>6000</b></td>
    <td>Changes the starting health for the ghost opponent</td>
  </tr>
  <tr>
    <td>multiplierIncrease</td>
    <td>number, Default: <b>0.5</b></td>
    <td>The increment of how much the multiplier after increases every round</td>
  </tr>
  <tr>
    <td>roundsWithoutMultiplier</td>
    <td>number, Default: <b>4</b></td>
    <td>Amount of rounds without multiplier</td>
  </tr>
  <tr>
    <td>timeAfterGuess</td>
    <td>number, Default: <b>15</b></td>
    <td>The amount of extra time you'll have after the ghost player locks a guess</td>
  </tr>
  <tr>
    <td>timeLimit</td>
    <td>number, Default: <b>600</b></td>
    <td>Amount of seconds before the ghost player gets their guess forcefully locked</td>
  </tr>
  <tr>
    <td>healingRoundNumber</td>
    <td>number, Default: <b>0</b></td>
    <td>The round Healing should be; set to 0 to disable</td>
  </tr>
  <tr>
    <td>healingMultiplier</td>
    <td>number, Default: <b>0.25</b></td>
    <td>Score multiplier for healing rounds</td>
  </tr>
  <tr>
    <th>Display settings</th>
	<th></th>
	<th></th>
  </tr>
  <tr>
    <td>inGame > showTimerBeforeGuess</td>
    <td>boolean: true, <b>false</b></td>
    <td>Displays the timer before the ghost has placed their guess.<br><br>Example: If the ghost player were to place a guess 30 seconds in, then the timer would say there's 45 seconds left immediately, rather than showing the 15s guess timer only 30 seconds in.</td>
  </tr>
</table>

## Database

Past ghost data is gathered through downloading a CSV file.

The CSV file is just multiple lines only uses first cell, and is in this format:

`<MapId> <LinkToCSVFileForMap>`

It'll then grab that map's CSV file, which is also just multiple lines only using the first cell in this format:

`<PanoId>/<GameType>/<GameMode>/<GameId>/<RoundNumber>`

# Plans

- Offer maps based on elo range, gamemode, and if it's rural/urban
- Keybinding to reset score
- Option to automatically have health reset after someone reaches 0 HP

# Known bugs

-

# 💖 Thanks

i'm someone who isn't too experienced with JS / web development, so thanks to these people for making life easier:

- [miraclewhips](https://miraclewhips.dev) for [geoguessr-event-framework](https://github.com/miraclewhips/geoguessr-event-framework), [World Score Reference](https://miraclewhips.dev/#world-score-reference), and a lot of open source scripts I could look at and learn/take from
- tyow for [Guess retriever](https://greasyfork.org/en/scripts/482055-guess-retriever) (using a modified version for the database)
- [LearnableMeta](https://learnablemeta.com/) for it initially being used to display only scores (and got me to start playing GeoGuessr)

and everyone who added me on GeoGuessr for helping with this project
