/* Test Steambot */
/* Logs on, can send messages and possibly send trade-offers/requests in future */

//logOn details
var logOnDetails = {
  accountName: '',
  password: ''
};

if (require('fs').existsSync('sentry'))
  logOnDetails.shaSentryfile = require('fs').readFileSync('sentry');

// logOnDetails.authCode = ''; // code received by email

var admin = ''; // put your steamid here to say 'give' to the bot and receive all non-scrap items


var Steam = require('steam');
var SteamTrade = require('./'); // change to 'steam-trade' if not running from the same directory

var steam = new Steam.SteamClient();
var steamTrade = new SteamTrade();

steam.logOn(logOnDetails);

steam.on('debug', console.log);

steam.on('loggedOn', function(result) {
  console.log('Logged in!');
  steam.setPersonaState(Steam.EPersonaState.Online);
});

steam.on('webSessionID', function(sessionID) {
  console.log('got a new session ID:', sessionID);
  steamTrade.sessionID = sessionID;
  steam.webLogOn(function(cookies) {
    console.log('got a new cookie:', cookies);
    cookies.forEach(function(cookie) {
        steamTrade.setCookie(cookie);
    });
  });
});

//basic chat response thing
steamFriends.on('message', function(source, message, type, chatter) {
// respond to both chat room and private messages
    console.log('MSG: ' + message + 'SRC: ' + source);
    if (message == 'ping') {
        steamFriends.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg); // ChatMsg by default
    }
});

var myInv;
var theirInv;
var scrap;
var weapons;
var addedScrap;
var client;
var theirAdds = [];

//if trade proposed
steam.on('tradeProposed', function(tradeID, otherClient) {
    console.log('tradeProposed by ' + otherClient + ', with tradeID of: ' + tradeID);
    steam.respondToTrade(tradeID, true);
});

steam.on('sessionStart', function(otherClient){
    myInv = [];
    theirInv = [];
    scrap = [];
    weapons = 0;
    addedScrap = [];
    theirAdds = [];
    client = otherClient;

      console.log('trading ' + steam.users[client].playerName);
      steamTrade.open(otherClient);
        steamTrade.loadInventory(440, 2, function(inv) {
        inventory = inv;
        scrap = inv.filter(function(item) { return item.name == 'Scrap Metal';});
     // console.log(scrap);
    });
});

steamTrade.on('offerChanged', function(added, item) {
  console.log(item);
  console.log('they ' + (added ? 'added ' : 'removed ') + item.name);
  console.log(item);
  if (item.tags && item.tags.some(function(tag) {

    return ~['primary', 'secondary', 'melee', 'pda2'].indexOf(tag.internal_name);
  }) && (item.descriptions === '' || !item.descriptions.some(function(desc) {
    return desc.value == '( Not Usable in Crafting )';
  }))) {
    
      }
    }
  }
});
