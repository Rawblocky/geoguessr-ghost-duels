// ==UserScript==
// @name        Ghost Duels (GeoGuessr)
// @namespace   https://github.com/rawblocky/geoguessr-ghost-duels
// @match       *://*.geoguessr.com/*
// @version     2025.05.28.01
// @author      Rawblocky
// @description Play simulated Duel games aganist a player's past guesses in supported Ghost Duels maps
// @icon        https://www.geoguessr.com/images/resize:auto:48:48/gravity:ce/plain/avatarasseticon/153d31615ba2a48efffcb00e5186b9b1.webp
// @run-at      document-start
// @grant       unsafeWindow
// @require     https://miraclewhips.dev/geoguessr-event-framework/geoguessr-event-framework.min.js
// @require     https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL https://github.com/Rawblocky/geoguessr-ghost-duels/raw/master/main.user.js
// @updateURL   https://github.com/Rawblocky/geoguessr-ghost-duels/raw/master/main.meta.js
// ==/UserScript==

// ####################################
// CONFIG
// ####################################

// Volume: 0 - 1; Set to "0" to mute
let soundVolume = 0.5;
let musicVolume = 0;
// Music packs: Duels, DuelsOld, BattleRoyale
let musicPack = "Duels";

// Guess selection: random, best, worst, fastest, slowest
// Alters which guess it should use during matchups aganist Duels locations
// default: fastest
let duelsGuessSelection = "fastest";

let defaultHealthSelf = 6000;
let defaultHealthGhost = 6000;
let multiplierIncrease = 0.5;
let roundsWithoutMultiplier = 4;
let timeAfterGuess = 15;
let timeLimit = 600; // Maximum time the ghost can have until their guess is forcefully "locked"

// Default healing round is 5; set to 0 to disable
let healingRoundNumber = 0;
let healingMultiplier = 0.25;

// HUD visibility options
let displaySettings = {
	inGame: {
		showHealth: true,
		showRoundNumber: false,
		showOpponent: false,
		showGameMode: true,
		showMapName: true,
		showMultiplier: true,
		showTimer: true,
		// If "showTimerBeforeGuess" is set to "true",
		// the timer will show the length of the round
		// plus the additional timeAfterGuess (15s)
		// instead of only when the ghost guesses
		showTimerBeforeGuess: false,
	},
	results: {
		playAnimation: true,
		// If Animations are false, then it'll display multiple lines w/o animations
		// You can swap what's visible below:
		showOldHealth: true,
		showOldHealth: true,
		showScores: true,
		showDamage: true,
		showHealth: true,
		showMultiplier: false,
		showRoundNumber: true,
		showOpponent: true,
		showGameMode: true,
		showMapName: true,
		showBreakdownAndReplayLink: true,
	},
	useUppercaseText: false,
};

// You can replace the URLs with links to an audio file
// Make the URL blank in order to remove the sound, or change "soundVolume" to 0 to mute all sounds
let soundURLs = {
	// SFX
	panoReveal:
		"https://www.geoguessr.com/_next/static/audio/effect-pano-reveal-965aece7140f036523ba3653633735da.mp3",
	onGuessSelf:
		"https://www.geoguessr.com/_next/static/audio/new-interaction-guess-404c9297b29c4b0b68a8a629a6f1d1e0.mp3",
	onGuessGhost:
		"https://www.geoguessr.com/_next/static/audio/new-effect-opponent-guessed-b3b0cb1c83058234dd90b52ad7f43d3a.mp3",
	timerCountdown:
		"https://www.geoguessr.com/_next/static/audio/new-effect-timer-countdown-fe3ea689b086716604cb70946140f56d.mp3",
	scoreReveal:
		"https://www.geoguessr.com/_next/static/audio/round-score-slide-in-rows-402b592443b8b41f2fc68af3c8d2104e.mp3",
	damageCrash:
		"https://www.geoguessr.com/_next/static/audio/new-round-score-damage-crash-2be493e805f7d539397fd64a23839c41.mp3",
	damageUp:
		"https://www.geoguessr.com/_next/static/audio/round-score-damage-up-7cd9f21b3ccc9d3f087a1be69b75f20c.mp3",
	tieUp:
		"https://www.geoguessr.com/_next/static/audio/round-score-tie-up-8ec53e1d3b738d2e8516b7025e4936b5.mp3",
	scoreRevealHealing:
		"https://www.geoguessr.com/_next/static/audio/round-score-count-healing-c1608e04af6b92bd3bb0ee722c332c1d.mp3",
	healingUp:
		"https://www.geoguessr.com/_next/static/audio/round-score-healing-up-f8ce39a8cf1b3516d7b81ba3a98374e1.mp3",
	// MUSIC
	// Duels
	duelsRound1:
		"https://www.geoguessr.com/_next/static/audio/new-music-round-1-93d02fbe85efcfe7456d27c483b38a74.mp3",
	duelsRound2:
		"https://www.geoguessr.com/_next/static/audio/new-music-round-2-7edf044a8f577bfa2a4784cbd7986eeb.mp3",
	duelsRound3:
		"https://www.geoguessr.com/_next/static/audio/new-music-round-3-ce9e6e6f8db7a7809e21ecb54a725351.mp3",
	duelsRound4:
		"https://www.geoguessr.com/_next/static/audio/new-music-round-4-292b53cf38ebff723414dae578c29f8b.mp3",
	// Duels (old music)
	duelsOldRound1:
		"https://www.geoguessr.com/_next/static/audio/music-round1-fc2d21b3f08324700ff96b74a5352e12.mp3",
	duelsOldRound2:
		"https://www.geoguessr.com/_next/static/audio/music-round2-1e24f0ebdb1c798535311e0b50ed7d6e.mp3",
	duelsOldRound3:
		"https://www.geoguessr.com/_next/static/audio/music-round3-baf3ebf4ee5aeb971e604fd1064f3079.mp3",
	duelsOldRound4:
		"https://www.geoguessr.com/_next/static/audio/music-round4-ddad3930b26b57c93d37a4305f53a0a4.mp3",
	duelsOldHealing:
		"https://www.geoguessr.com/_next/static/audio/music-healinground-55356b94c3a223da93b59b02d4786832.mp3",
	duelsOldMultiplier:
		"https://www.geoguessr.com/_next/static/audio/music-multipledamage-8c7ed8841afad13ad9f059d86334a593.mp3",
	// Battle Royale
	brRound1:
		"https://www.geoguessr.com/_next/static/audio/new-music-br-round-1-e7679bc922ceca3bfd7105432158bdb9.mp3",
	brRound2:
		"https://www.geoguessr.com/_next/static/audio/new-music-br-round-2-06aa1b75323d172e1934df7bae4a05b6.mp3",
	brRound3:
		"https://www.geoguessr.com/_next/static/audio/new-music-br-round-3-c7bf3f09932f1788977c03fd9e9b532a.mp3",
	brRound4:
		"https://www.geoguessr.com/_next/static/audio/new-music-br-round-4-2def9009b558f270e4536b32033320f0.mp3",
};

let musicPacks = {
	Duels: {
		damage: ["duelsRound1", "duelsRound2", "duelsRound3", "duelsRound4"],
		healing: ["duelsOldHealing"],
	},
	DuelsOld: {
		damage: [
			"duelsOldRound1",
			"duelsOldRound2",
			"duelsOldRound3",
			"duelsOldRound4",
		],
		healing: ["duelsOldHealing"],
		multiplier: ["duelsOldMultiplier"],
		startFromBeginning: true,
	},
	BattleRoyale: {
		damage: ["brRound1", "brRound2", "brRound3", "brRound4"],
		healing: ["duelsOldHealing"],
	},
};

// Default at game start
let ghostDuel_healthSelf = defaultHealthSelf;
let ghostDuel_healthGhost = defaultHealthGhost;
let ghostDuel_multiplier = 1;
let ghostDuel_roundNumber = 1;

// ########################################################################
// MAIN CODE
// ########################################################################

// ####################################
// FETCH GAME DATA
// ####################################

let cache = [];

function decodePanoId(encoded) {
	const len = Math.floor(encoded.length / 2);
	let panoId = [];
	for (let i = 0; i < len; i++) {
		const code = parseInt(encoded.slice(i * 2, i * 2 + 2), 16);
		const char = String.fromCharCode(code);
		panoId = [...panoId, char];
	}
	return panoId.join("");
}

function getScoreFromDistance(metres, maxErrorDistance) {
	let boundSize = maxErrorDistance || 18700000;
	let points = 5000;
	let perfectTolerance = 185; // Math.max(25, boundSize * 0.00001);

	if (metres > perfectTolerance) {
		points = Math.round(Math.pow(1 - metres / boundSize, 10) * 5000);
	}

	return points;
}

async function fetchDuelsData(id) {
	let cacheIndex = `duel_${id}`;
	if (cache[cacheIndex]) {
		return JSON.parse(cache[cacheIndex]);
	}
	let api_url = `https://game-server.geoguessr.com/api/duels/${id}`;
	let res = await fetch(api_url, { method: "GET", credentials: "include" });

	if (res.ok) {
		let data = await res.json();
		cache[cacheIndex] = JSON.stringify(data);
		return data;
	} else {
		throw new Error("Failed to fetch data from API");
	}
}

async function fetchGameData(id, cacheId) {
	let cacheIndex = `classic_${id}` + (cacheId || "");
	if (cache[cacheIndex]) {
		return JSON.parse(cache[cacheIndex]);
	}
	let api_url = `https://www.geoguessr.com/api/v3/games/${id}`;
	let res = await fetch(api_url, { method: "GET", credentials: "include" });

	if (res.ok) {
		let data = await res.json();
		cache[cacheIndex] = JSON.stringify(data);
		return data;
	} else {
		throw new Error("Failed to fetch data from API");
	}
}

async function fetchMapData(id) {
	let cacheIndex = `map_${id}`;
	if (cache[cacheIndex]) {
		return JSON.parse(cache[cacheIndex]);
	}
	let api_url = `https://www.geoguessr.com/api/maps/${id}`;
	let res = await fetch(api_url, { method: "GET", credentials: "include" });

	if (res.ok) {
		let data = await res.json();
		cache[cacheIndex] = JSON.stringify(data);
		return data;
	} else {
		throw new Error("Failed to fetch data from API");
	}
}

async function fetchPlayerData(playerId) {
	let cacheIndex = `player_info_${playerId}`;
	if (cache[cacheIndex]) {
		return JSON.parse(cache[cacheIndex]);
	}

	let api_url = `https://www.geoguessr.com/api/v3/users/${playerId}`;
	try {
		let res = await fetch(api_url, { method: "GET", credentials: "include" });
		let json = await res.json();

		cache[cacheIndex] = JSON.stringify(json);
		return json;
	} catch (error) {
		console.log(error);
		return {
			nick: playerId,
		};
	}
}

// ####################################
// FETCH GHOST DUELS DATABASE
// ####################################

let mapDatabaseURL =
	"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGf-yDZXxRfJ__-l55as7-BErQjRwoP5tJ99-ugKDAZUhcmnwW6lai1W6ZIYtMxMLty1OFriH3b9Sm/pub?output=csv";

function parseCSV(data) {
	const rows = data.split("\r\n");
	return rows.map((row) => row.split(","));
}

let SV_Map;

let ghostGamesFromMapId = [];
let mapDatabase;
let guessSelectionCache = [];
async function fetchGhostData(mapId) {
	if (!mapDatabase) {
		const response = await fetch(mapDatabaseURL);
		const csvDataText = await response.text();
		const csvData = parseCSV(csvDataText);
		mapDatabase = {};
		for (const data of csvData) {
			let dataString = data.toString();
			let dataSplit = dataString.split(" ");
			mapDatabase[dataSplit[0]] = dataSplit[1];
		}
	}
	if (ghostGamesFromMapId[mapId]) {
		return ghostGamesFromMapId[mapId];
	}
	let sheetURL = mapDatabase[mapId];
	if (!sheetURL) {
		return;
	}
	const response = await fetch(sheetURL);
	const csvDataText = await response.text();
	const csvData = parseCSV(csvDataText);
	let gameData = {};
	for (const data of csvData) {
		let dataString = data.toString();
		let dataSplit = dataString.split("/");
		let panoId = dataSplit[0];
		let value = {
			["gameType"]: dataSplit[1],
			["gameMode"]: dataSplit[2],
			["gameId"]: dataSplit[3],
			["roundNumber"]: dataSplit[4],
		};
		gameData[panoId] = value;
	}
	ghostGamesFromMapId[mapId] = gameData;
	return gameData;
}

const CUSTOM_WINDOW = unsafeWindow ?? window;

let oldImageOverlay;
async function removeOldImageOverlay() {
	if (!oldImageOverlay) {
		return;
	}
	oldImageOverlay.setMap(null);
}

let maxErrorDistance = 18500000;

async function getGhostDataFromDetail(detail) {
	const allGhostGames = await fetchGhostData(detail.map.id);
	if (!allGhostGames) {
		return;
	}
	let panoId;

	let currentRound = detail.current_round;
	let roundInfo = detail.rounds[currentRound - 1];

	if (roundInfo) {
		panoId = roundInfo.location.panoId;
	} else {
		let gameId = detail.current_game_id;
		let gameInfo = await fetchGameData(gameId, currentRound);
		roundInfo = gameInfo.rounds[currentRound - 1];
		let encodedPanoId = roundInfo.panoId;
		panoId = decodePanoId(encodedPanoId);
	}
	let ghostGameStats = allGhostGames[panoId.toString()];

	let ghostNick = "";
	let ghostPlayerId;
	let pinUrl = "";
	let ghostCoords;
	let ghostDistance;
	let mapName;
	let mapId;
	let gameMode = ghostGameStats.gameMode;
	let timeToGuess = 60;
	let breakdownText = "";

	if (ghostGameStats.gameType == "Classic") {
		let ghostGameInfo = await fetchGameData(ghostGameStats.gameId);
		ghostNick = ghostGameInfo.player.nick;
		ghostPlayerId = ghostGameInfo.player.id;
		pinUrl = `https://www.geoguessr.com/images/resize:auto:48:48/gravity:ce/plain/${ghostGameInfo.player.pin.url}`;

		let ghostGuess = ghostGameInfo.player.guesses[ghostGameStats.roundNumber];
		ghostCoords = {
			lat: ghostGuess.lat,
			lng: ghostGuess.lng,
		};
		ghostDistance = ghostGuess.distanceInMeters;
		mapName = ghostGameInfo.mapName;
		mapId = ghostGameInfo.map;
		timeToGuess = ghostGuess.time;
		breakdownText = `<a href="https://www.geoguessr.com/game/${
			ghostGameStats.gameId
		}" target="_blank">Breakdown URL</a> (round ${
			Number(ghostGameStats.roundNumber) + 1
		})`;
	} else if (ghostGameStats.gameType == "Duel") {
		let ghostGameInfo = await fetchDuelsData(ghostGameStats.gameId);
		mapName = ghostGameInfo.options.map.name;
		mapId = ghostGameInfo.options.map.slug;
		let actualRoundNumber = Number(ghostGameStats.roundNumber) + 1;
		let roundStartTime = getTimeFromEpoch(
			ghostGameInfo.rounds[ghostGameStats.roundNumber].startTime
		);
		let guessType = guessSelectionCache[panoId] || duelsGuessSelection;
		if (guessType == "random") {
			(Math.random() <= 0.5 && "best") || "worst";
		}
		guessSelectionCache[panoId] = guessType;
		for (const team of Object.values(ghostGameInfo.teams)) {
			for (const ghostPlayer of Object.values(team.players)) {
				for (const ghostGuess of Object.values(ghostPlayer.guesses)) {
					if (
						Number(ghostGuess.roundNumber) != actualRoundNumber ||
						!ghostGuess.lat ||
						!ghostGuess.isTeamsBestGuessOnRound
					) {
						continue;
					}
					let distance = ghostGuess.distance;
					let newTimeToGuess =
						getTimeFromEpoch(ghostGuess.created) - roundStartTime;
					if (
						ghostDistance &&
						((guessType == "best" && distance > ghostDistance) ||
							(guessType == "worst" && ghostDistance > distance) ||
							(guessType == "fastest" && newTimeToGuess > timeToGuess) ||
							(guessType == "slowest" && newTimeToGuess < timeToGuess))
					) {
						continue;
					}
					ghostCoords = {
						lat: ghostGuess.lat,
						lng: ghostGuess.lng,
					};
					ghostDistance = distance;
					ghostPlayerId = ghostPlayer.playerId;
					ghostNick = ghostPlayer.playerId;
					timeToGuess = newTimeToGuess;
				}
			}
		}
		breakdownText = `<a href="https://www.geoguessr.com/duels/${
			ghostGameStats.gameId
		}/replay?player=${ghostPlayerId}&round=${
			Number(ghostGameStats.roundNumber) + 1
		}" target="_blank">Replay URL</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.geoguessr.com/duels/${
			ghostGameStats.gameId
		}/summary" target="_blank">Breakdown URL</a> (round ${
			Number(ghostGameStats.roundNumber) + 1
		})`;
	}

	if (ghostPlayerId && ghostNick == ghostPlayerId) {
		let playerInfo = await fetchPlayerData(ghostPlayerId);
		pinUrl = `https://www.geoguessr.com/images/resize:auto:48:48/gravity:ce/plain/${playerInfo.pin.url}`;
		ghostNick = playerInfo.nick;
	}

	let scoreGhost = getScoreFromDistance(ghostDistance, maxErrorDistance);
	return {
		ghostNick: ghostNick,
		ghostPlayerId: ghostPlayerId,
		ghostCoords: ghostCoords,
		pinUrl: pinUrl,
		scoreGhost: scoreGhost,
		mapName: mapName,
		mapId: mapId,
		roundInfo: roundInfo,
		gameMode: gameMode,
		timeToGuess: timeToGuess || 60,
		breakdownText: `${breakdownText}`,
	};
}

// ####################################
// HANDLE GAME
// ####################################

let trackedRoundStarts = {};
let trackedRoundEnds = {};

function checkIfDetailHandled(detail, array) {
	let id = `${detail.current_round}/${detail.current_game_id}`;
	if (array[id]) {
		return true;
	}
	array[id] = true;
	return false;
}

// reset cache on URL change to allow repeat rounds
function onUrlChange() {
	trackedRoundStarts = {};
	trackedRoundEnds = {};
	stopMusic();
}

const observer = new MutationObserver((mutations) => {
	for (let mutation of mutations) {
		if (mutation.type === "childList") {
			if (window.location.href !== previousUrl) {
				previousUrl = window.location.href;
				onUrlChange();
			}
		}
	}
});

observer.observe(document.body, { childList: true, subtree: true });

let previousUrl = window.location.href;

GeoGuessrEventFramework.init().then(async (GEF) => {
	let eventsFired = 0;
	let eventsFired_URL;
	const handleStartEvent = async (event) => {
		let detail = event.detail;
		if (checkIfDetailHandled(detail, trackedRoundStarts)) {
			return;
		}
		let ghostGameData = await getGhostDataFromDetail(detail);
		if (!ghostGameData) {
			stopSound("timerCountdown");
			stopMusic();
			eventsFired += 1;
			clearStatusText();
			return;
		}
		stopSound("timerCountdown");
		stopMusic();
		let mapId = detail.map.id;
		let mapInfo = await fetchMapData(mapId);
		maxErrorDistance = mapInfo.maxErrorDistance;
		await delay(100);

		const checkElement = () =>
			document.querySelector('[data-qa="result-view-top"]') === null;

		const waitForElementToDisappear = async () => {
			while (!checkElement()) {
				await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
			}
		};

		if (!checkElement()) {
			await waitForElementToDisappear();
		}

		let currentEventsFired = eventsFired + 1;
		let currentURL = window.location.href;
		eventsFired = currentEventsFired;
		eventsFired_URL = currentURL;

		function getIsConnected() {
			return (
				eventsFired == currentEventsFired &&
				eventsFired_URL == window.location.href
			);
		}

		let isHealingRound = ghostDuel_roundNumber == healingRoundNumber;

		removeOldImageOverlay();
		playSound("panoReveal");
		playMusic(
			(isHealingRound && "healing") ||
				(ghostDuel_multiplier > 1 && "multiplier") ||
				"damage",
			ghostDuel_roundNumber - 1
		);

		let textTable = [
			// Health
			displaySettings.inGame.showHealth &&
				`<span style="font-size: 2.5rem">${ghostDuel_healthSelf}&nbsp;&nbsp;&nbsp;&nbsp;${ghostDuel_healthGhost}</span>`,
			// Opponent
			displaySettings.inGame.showOpponent &&
				`<span style="opacity: 0.5; font-size: 1rem"><a href="https://www.geoguessr.com/user/${ghostGameData.ghostPlayerId}" target="_blank">${ghostGameData.ghostNick}</a></span>`,
			// Round number
			displaySettings.inGame.showRoundNumber &&
				`<span style="opacity: 0.5; font-size: 1rem">Round ${ghostDuel_roundNumber}</span>`,
			// GameMode
			displaySettings.inGame.showGameMode &&
				`<span style="opacity: 0.5; font-size: 1rem">${formatTextWithSpaces(
					ghostGameData.gameMode
				)}</span>`,
			// Map name
			displaySettings.inGame.showMapName &&
				`<span style="opacity: 0.5; font-size: 1rem"><a href="https://www.geoguessr.com/maps/${ghostGameData.mapId}" target="_blank">${ghostGameData.mapName}</a></span>`,
			// Multiplier
			(displaySettings.inGame.showMultiplier &&
				ghostDuel_multiplier != 1 &&
				!isHealingRound &&
				`<br><span style="text-transform: none; font-size: 1.5rem; ${blueTextShadow}">x${ghostDuel_multiplier}</span>`) ||
				(displaySettings.inGame.showMultiplier &&
					isHealingRound &&
					`<span style="text-transform: none; font-size: 1.5rem; ${greenTextShadow}">x${healingMultiplier}</span>`),
			// Timer
			"",
		];

		setStatusText(textTable);

		let timeLeft =
			Math.min(ghostGameData.timeToGuess, timeLimit) + timeAfterGuess;
		let playedSound = false;
		while (timeLeft > 0) {
			if (!getIsConnected()) {
				console.log("Disconnected");
				return;
			}
			let canShowTimer =
				displaySettings.inGame.showTimer &&
				(timeLeft <= timeAfterGuess ||
					displaySettings.inGame.showTimerBeforeGuess);
			if (canShowTimer) {
				textTable[
					textTable.length - 1
				] = `<span style="font-size: 3rem">${Math.ceil(timeLeft)}</span>`;
				if (!playedSound && timeLeft <= timeAfterGuess) {
					playedSound = true;
					playSound("onGuessGhost");
					playSound("timerCountdown");
				}
				setStatusText(textTable);
			}
			let rawDelay = await delay(100);
			timeLeft -= rawDelay / 1000;
		}
		if (!getIsConnected()) {
			return;
		}
		textTable[
			textTable.length - 1
		] = `<span style="font-size: 4rem; ${orangeTextShadow}">Time's up!</span>`;
		setStatusText(textTable);
	};
	GEF.events.addEventListener("game_start", handleStartEvent);
	GEF.events.addEventListener("round_start", handleStartEvent);

	GEF.events.addEventListener("round_end", async (event) => {
		let detail = event.detail;

		if (checkIfDetailHandled(detail, trackedRoundEnds)) {
			return;
		}

		let currentEventsFired = eventsFired + 1;
		eventsFired = currentEventsFired;

		let currentRound = detail.current_round;
		let roundInfo = detail.rounds[currentRound - 1];

		stopSound("timerCountdown");
		stopMusic();

		let ghostGameData = await getGhostDataFromDetail(detail);
		if (!ghostGameData) {
			eventsFired += 1;
			clearStatusText();
			return;
		}

		let ghostCoords = ghostGameData.ghostCoords;
		let scoreGhost = ghostGameData.scoreGhost;
		let pinUrl = ghostGameData.pinUrl;

		placeImageOnMap(SV_Map, pinUrl, ghostCoords.lat, ghostCoords.lng);

		playSound("onGuessSelf");

		let scoreSelf = roundInfo.score.amount;
		let rawDamage = Math.abs(scoreSelf - scoreGhost);
		let multiplierDamage = Math.floor(rawDamage * ghostDuel_multiplier);
		let damageMultipliedText = multiplierDamage;
		let bigTabs =
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		let smallTabs = "&nbsp;&nbsp;&nbsp;&nbsp;";
		let scoreShowcaseText = `${scoreSelf}${smallTabs}${scoreGhost}`;
		let scoreShowcaseTextMini = `${scoreSelf}${smallTabs}${scoreGhost}`;
		let oldHealthText = `${ghostDuel_healthSelf}${smallTabs}${ghostDuel_healthGhost}`;
		let newHealthText = `${ghostDuel_healthSelf}${smallTabs}${ghostDuel_healthGhost}`;

		let isHealingRound = ghostDuel_roundNumber == healingRoundNumber;

		if (!isHealingRound) {
			if (scoreSelf > scoreGhost) {
				ghostDuel_healthGhost = ghostDuel_healthGhost - multiplierDamage;
				damageMultipliedText = bigTabs + damageMultipliedText;
				scoreShowcaseText = `<span style="${winningScoreStyle}">${scoreSelf}</span><span style="font-size: 2rem">${smallTabs}${scoreGhost}</span>`;
				newHealthText = `<span style="font-size: 2.5rem">${ghostDuel_healthSelf}</span>${smallTabs}<span style="${damagedTextShadow}">${ghostDuel_healthGhost}</span>`;
			} else {
				ghostDuel_healthSelf = ghostDuel_healthSelf - multiplierDamage;
				damageMultipliedText = damageMultipliedText + bigTabs;
				scoreShowcaseText = `${scoreSelf}${smallTabs}<span style="${winningScoreStyle}">${scoreGhost}</span>`;
				newHealthText = `<span style="font-size: 2.5rem"><span style="${damagedTextShadow}">${ghostDuel_healthSelf}</span>${smallTabs}${ghostDuel_healthGhost}</span>`;
			}
		} else {
			let addedScoreSelf = Math.floor(scoreSelf * healingMultiplier);
			let addedScoreGhost = Math.floor(scoreGhost * healingMultiplier);
			ghostDuel_healthSelf = Math.min(
				ghostDuel_healthSelf + addedScoreSelf,
				defaultHealthSelf
			);
			ghostDuel_healthGhost = Math.min(
				ghostDuel_healthGhost + addedScoreGhost,
				defaultHealthGhost
			);
			newHealthText = `${ghostDuel_healthSelf}${smallTabs}${ghostDuel_healthGhost}`;
			damageMultipliedText = `${addedScoreSelf}${smallTabs}${addedScoreGhost}`;
		}

		let allText = {
			oldHealth: `<span style="font-size: 1.5rem; opacity: 0.5">${oldHealthText}</span>`,
			scores: `<span style="font-size: 1.5rem; opacity: 1">${scoreShowcaseText}</span>`,
			multiplier:
				(ghostDuel_multiplier != 1 &&
					!isHealingRound &&
					`<br><span style="text-transform: none; font-size: 1.5rem; ${blueTextShadow}">x${ghostDuel_multiplier}</span>`) ||
				(displaySettings.results.showMultiplier &&
					isHealingRound &&
					`<span style="text-transform: none; font-size: 1.5rem; ${greenTextShadow}">x${healingMultiplier}</span>`),
			damage: `<span style="font-size: 2.5rem; ${
				(isHealingRound && greenTextShadow) || orangeTextShadow
			}">${damageMultipliedText}</span>`,
			health: `<span style="font-size: 2.5rem">${newHealthText}</span>`,
		};

		let statusText = [
			// Old health
			displaySettings.results.showOldHealth && allText.oldHealth,
			// Scores
			displaySettings.results.showScores && allText.scores,
			,
			// Multiplier
			displaySettings.results.showMultiplier && allText.multiplier,
			// Damage
			displaySettings.results.showDamage && allText.damage,
			// Line break
			(displaySettings.results.showScores ||
				displaySettings.results.showMultiplier ||
				displaySettings.results.showDamage) &&
				"",
			// Health
			displaySettings.results.showHealth && allText.health,
		];
		let bottomText = [
			// Opponent
			displaySettings.results.showOpponent &&
				`<span style="opacity: 0.5; font-size: 1rem">${
					ghostGameData.ghostNick
				} (${Math.floor(ghostGameData.timeToGuess * 1000) / 1000} s)</span>`,
			// Round number
			displaySettings.results.showRoundNumber &&
				`<span style="opacity: 0.5; font-size: 1rem">Round ${ghostDuel_roundNumber}</span>`,
			// GameMode
			displaySettings.results.showGameMode &&
				`<span style="opacity: 0.5; font-size: 1rem">${formatTextWithSpaces(
					ghostGameData.gameMode
				)}</span>`,
			// Map name
			displaySettings.results.showMapName &&
				`<span style="opacity: 0.5; font-size: 1rem"><a href="https://www.geoguessr.com/maps/${ghostGameData.mapId}" target="_blank">${ghostGameData.mapName}</a></span>`,
			// Breakdown / Replays
			displaySettings.results.showBreakdownAndReplayLink &&
				`<span style="opacity: 0.5; font-size: 1rem">${ghostGameData.breakdownText}</span>`,
		];
		for (const text of Object.values(bottomText)) {
			statusText[statusText.length] = text;
		}
		ghostDuel_roundNumber += 1;
		if (ghostDuel_roundNumber > roundsWithoutMultiplier && !isHealingRound) {
			ghostDuel_multiplier += multiplierIncrease;
		}
		if (!displaySettings.results.playAnimation) {
			setStatusText(statusText);
			return;
		}

		// ANIMATION
		let newText = ["Placeholder", "Placeholder 2"];
		for (const text of Object.values(bottomText)) {
			newText[newText.length] = text;
		}
		if (!isHealingRound) {
			newText[0] = `<span style="font-size: 2.5rem">${oldHealthText}</span>`;
			newText[1] = `<span style="font-size: 2rem; opacity: 1">${scoreShowcaseTextMini}</span>`;
			setStatusText(newText);
			playSound("scoreReveal");
			await delay(0.5 * 1000);
			if (currentEventsFired != eventsFired) {
				return;
			}
			newText[1] = allText.scores;
			setStatusText(newText);
			await delay(1 * 1000);
			if (currentEventsFired != eventsFired) {
				return;
			}
			newText[1] = allText.damage;
			setStatusText(newText);
			playSound("damageCrash");
			await delay(1 * 1000);
			if (currentEventsFired != eventsFired) {
				return;
			}
			playSound("damageUp");
		} else {
			newText[0] = `<span style="font-size: 2.5rem">${oldHealthText}</span>`;
			newText[1] = allText.damage;
			setStatusText(newText);
			playSound("scoreRevealHealing");
			await delay(2 * 1000);
			if (currentEventsFired != eventsFired) {
				return;
			}
			playSound("healingUp");
		}
		newText[0] = allText.health;
		newText[1] = `<span style="font-size: 2rem; opacity: 0.25">${scoreShowcaseTextMini}</span>`;
		setStatusText(newText);
	});
});

// ####################################
// UTILITY
// ####################################
const delay = async (ms) => {
	const startTime = Date.now(); // Capture the start time
	await new Promise((resolve) => setTimeout(resolve, ms)); // Wait for the timeout
	const endTime = Date.now(); // Capture the end time
	return endTime - startTime; // Return the elapsed time
};
function getTimeFromEpoch(epoch) {
	return Date.parse(epoch) / 1000;
}

// ####################################
// SFX / MUSIC
// ####################################
let music;
let sounds = {};

function tweenVolume(targetVolume, duration) {
	const startVolume = music.volume;
	const volumeChange = targetVolume - startVolume;
	const startTime = performance.now();

	function animateVolume(currentTime) {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1);
		music.volume = startVolume + volumeChange * progress;

		if (progress < 1) {
			requestAnimationFrame(animateVolume);
		}
	}

	requestAnimationFrame(animateVolume);
}
function playMusic(musicType, index, pitch = 1) {
	if (musicVolume <= 0) {
		return;
	}
	let musicTable = musicPacks[musicPack];
	if (!music) {
		music = document.createElement("audio");
		music.volume = 0;
		music.loop = true;
	}
	if (!musicTable[musicType]) {
		musicType = "damage";
	}
	let currentTime = music.currentTime;
	let musicId =
		musicTable[musicType][Math.min(index, musicTable[musicType].length - 1)];
	let url = soundURLs[musicId];
	let oldSrc = music.src;
	music.src = url;
	music.volume = musicVolume;
	music.loop = true;
	music.play();
	// just start from beginning; it sounded bad in between rounds
	// if (oldSrc == url || !musicTable.startFromBeginning) {
	// 	music.currentTime = currentTime;
	// } else {
	// 	music.currentTime = 0;
	// }
	music.playbackRate = pitch;
	music.volume = musicVolume;
}
function stopMusic() {
	if (!music) {
		return;
	}
	music.loop = false;
	music.volume = 0;
}

function playSound(soundId) {
	if (soundVolume <= 0 || !soundURLs[soundId] || soundURLs[soundId] == "") {
		return;
	}
	let sound = sounds[soundId];
	if (!sound) {
		sound = document.createElement("audio");
		sound.src = soundURLs[soundId];
		sound.volume = soundVolume;
		sounds[soundId] = sound;
	}
	sound.currentTime = 0;
	sound.play();
}

function stopSound(soundId) {
	let sound = sounds[soundId];
	if (!sound) {
		return;
	}
	sound.pause();
	sound.currentTime = 0;
}

// ####################################
// TEXT
// ####################################

let orangeTextShadow =
	"text-shadow: 0 .25rem 0 var(--ds-color-orange-80),.125rem .125rem .5rem var(--ds-color-red-50),0 -.25rem .5rem #ffa43d,-.25rem .5rem .5rem var(--ds-color-yellow-50),0 .375rem 2rem var(--ds-color-red-50),0 0 0 var(--ds-color-red-50),0 0 1.5rem var(--ds-color-red-50),.25rem .25rem 1rem var(--ds-color-yellow-50);";
let winningScoreStyle = `font-size: 2.5rem`;
let blueTextShadow =
	"text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-blue-50),0 -.25rem .5rem var(--ds-color-brand-50),-.25rem .5rem .5rem #3ae8bd,0 .375rem 2rem var(--ds-color-brand-50),0 0 0 var(--ds-color-purple-10),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-purple-20)";
let greenTextShadow =
	"text-shadow: 0 .0625rem 0 rgba(16,16,28,.6),.125rem .125rem .5rem #6cb928,0 -.125rem .25rem #3ae8bd,-.125rem .125rem .25rem #3ae8bd,0 .125rem 1rem #97e851,.125rem .25rem .5rem #97e851";
let damagedTextShadow = "color:#fff0f0";

function clearStatusText() {
	const existingElement = document.getElementById("ghostDuelsStatusText");
	if (existingElement) {
		existingElement.innerHTML = "";
	}
}

function setStatusText(textOrArray) {
	let text = textOrArray;
	if (Array.isArray(textOrArray)) {
		text = "";
		for (const line of Object.values(textOrArray)) {
			if (!line) {
				continue;
			}
			text = `${text}<br>${line}`;
		}
	}
	let id = "ghostDuelsStatusText";
	const hudRoot = document.querySelector('[class*="in-game_layout__"]');
	if (!hudRoot) {
		return;
	}
	const existingElement = document.getElementById("ghostDuelsStatusText");
	if (existingElement) {
		existingElement.innerHTML = text;
		return;
	}

	const div = document.createElement("div");
	div.id = id;
	div.style.cssText = `
	  padding: 10px 20px;
	  font-size: 1rem;
	  font-weight: bold;
	  color: white;
	  background: none;
	  border-radius: 5px;
	  text-align: center;
	  margin: 5px;
	  position: absolute;
	  top: 3.5rem; /* Changed from 20px to 3.5rem */
	  left: 50%;
	  transform: translateX(-50%); /* Center the text horizontally */
	  z-index: 1000;
	  text-shadow: 0 0.0625rem 0.125rem var(--ds-color-purple-100);
	  user-select: none;
	  text-transform: ${(displaySettings.useUppercaseText && "uppercase") || "none"}
	`;
	div.innerHTML = text;

	hudRoot.appendChild(div);
}

// FORMATTING
function formatTextWithSpaces(input) {
	return input
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase
		.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"); // Add space between consecutive uppercase and the next lowercase
}

// SHOW PIN ON GOOGLE MAPS

function placeImageOnMap(mapInstance, imageUrl, lat, lng) {
	removeOldImageOverlay();

	class ImageOverlay extends google.maps.OverlayView {
		constructor(imageUrl, lat, lng) {
			super();
			this.imageUrl = imageUrl;
			this.lat = lat;
			this.lng = lng;
			this.div = null;
		}

		onAdd() {
			this.div = document.createElement("div");
			this.div.style.border = "0.25rem solid red"; // Set a 2px white border
			this.div.style.borderRadius = "100%"; // Make the image circular
			this.div.style.position = "absolute";
			this.div.style.backgroundImage = `url(${this.imageUrl})`;
			this.div.style.backgroundSize = "contain"; // Adjust as needed
			this.div.style.width = "40px"; // Set the width of the image
			this.div.style.height = "40px"; // Set the height of the image
			this.div.style.borderRadius = "50%"; // Make the image circular
			this.getPanes().overlayLayer.appendChild(this.div);
		}

		draw() {
			const overlayProjection = this.getProjection();
			const position = overlayProjection.fromLatLngToDivPixel(
				new google.maps.LatLng(this.lat, this.lng)
			);

			const width = 40;
			const height = 40;

			// Center the image by adjusting the left and top properties
			this.div.style.left = `${position.x - width / 2}px`; // Center the image horizontally
			this.div.style.top = `${position.y - height / 2}px`; // Center the image vertically
		}

		onRemove() {
			if (this.div) {
				this.div.parentNode.removeChild(this.div);
				this.div = null;
			}
		}
	}

	const imageOverlay = new ImageOverlay(imageUrl, lat, lng);
	imageOverlay.setMap(mapInstance);
	oldImageOverlay = imageOverlay;

	return imageOverlay;
}

function overrideOnLoad(googleScript, observer, overrider) {
	const oldOnload = googleScript.onload;
	googleScript.onload = (event) => {
		const google = CUSTOM_WINDOW["google"];
		if (google) {
			observer.disconnect();
			overrider(google);
		}
		if (oldOnload) {
			oldOnload.call(googleScript, event);
		}
	};
}

function grabGoogleScript(mutations) {
	for (const mutation of mutations) {
		for (const newNode of mutation.addedNodes) {
			const asScript = newNode;
			if (
				asScript &&
				asScript.src &&
				asScript.src.startsWith("https://maps.googleapis.com/")
			) {
				return asScript;
			}
		}
	}
	return null;
}

function injecter(overrider) {
	new MutationObserver((mutations, observer) => {
		const googleScript = grabGoogleScript(mutations);
		if (googleScript) {
			overrideOnLoad(googleScript, observer, overrider);
		}
	}).observe(document.documentElement, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
	injecter(() => {
		if (!CUSTOM_WINDOW["google"]) return reject();

		CUSTOM_WINDOW["google"].maps.Map = class extends (
			CUSTOM_WINDOW["google"].maps.Map
		) {
			constructor(...args) {
				super(...args);
				SV_Map = this;
			}
		};
	});
});
