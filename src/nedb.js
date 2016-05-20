var Datastore = require('nedb')
    , db = new Datastore({filename: 'db/player.db', autoload: true});

db.insert([{a: 6}, {a: 142}, {a: 143}, {a: 144}, {a: 145}, {a: 146}, {a: 147}, {a: 148}], function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
});
// db.find({'$or': [{a: 6}, {a: 142}]}, function (err, docs) {
//     // docs is an array containing documents Mars, Earth, Jupiter
//     // If no document is found, docs is equal to []
//     console.log("docs", docs.length);
// });
// db.remove({a: 6});