var fs = require('fs');
function writeFile(file, obj, options, callback) {
    if (callback == null) {
        callback = options;
        options = {}
    }

    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
        ? options.spaces : this.spaces
        : this.spaces;

    var str = '';
    try {
        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
    } catch (err) {
        if (callback) return callback(err, null)
    }

    fs.writeFile(file, str, options, callback)
}
//
var Engine = require('tingodb')().Db,
    assert = require('assert');
var db = new Engine('db/tingodb', {});
// Fetch a collection to insert document into
this.db = db;
this.playerInfoCollection = db.collection("player_info");
// this.playerInfoCollection.remove({playerId: 11});
this.playerInfoCollection.findOne({id: 11}, function (err, playerInfo) {
    assert.equal(null, err);
    assert.equal('wade', playerInfo.name);
});

this.playerInfoCollection.find({},{}).toArray(function (err, playerInfo) {
    assert.equal(null, err);
    console.log("find arr", playerInfo.length)
});

//update value
// this.playerInfoCollection.update({id: 18}, {$set: {pos: 0}});

//delete key
// this.playerInfoCollection.update({id: 18}, {$unset: {'pos': true}});

var savePlayerToFile = function () {
    var col = db.collection("player_info");
    col.find().toArray(function (err, docs) {
        assert.equal(null, err);
        for (var i = 0; i < docs.length; i++) {
            var obj = docs[i];
            writeFile('db/playerInfo/' + obj.id + '.player', obj);
        }
    });
};
// savePlayerToFile();
