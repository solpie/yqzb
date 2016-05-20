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

var Datastore = require('nedb')
    , nedb = new Datastore({filename: 'db/player.db', autoload: true});

var savePlayerToFile = function () {
    // Find all documents in the collection
    nedb.find({}, function (err, docs) {
        console.log(docs.length);
        for (var i = 0; i < docs.length; i++) {
            var obj = docs[i];
            console.log(obj);
            // nedb.insert(obj);
            // writeFile('db/playerInfo/' + obj.id + '.player', obj);
        }
    });
};
savePlayerToFile();
