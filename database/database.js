const sqlite3 = require('sqlite3').verbose(),
    conf = require("../conf/conf.json"),
    DBSOURCE = 'database/' + conf.dbName + '.sqlite',
    db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message);
            throw err;
        } else {
            console.log('Connected to the SQLite database.');
            db.run(`CREATE TABLE Parameters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            protocol text, 
            IP text, 
            port text, 
            timeout text, 
            pinKey text, 
            macKey text, 
            transactionType text, 
            usedInterface text, 
            transactionAmount text, 
            transactionAmountOther text, 
            CONSTRAINT protocol_unique UNIQUE (protocol)
            ); ` +
                `CREATE TABLE ApplicationIdentifier (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                label text, 
                tacOnline text, 
                tacDenial text, 
                tacDefault text, 
                appVersion text, 
                defaultDDOL text, 
                defaultTDOL text, 
                interfaceSupported text, 
                contactlessProfile text, 
                contactlessKernel text, 
                msLegacyModeApplicability text, 
                keySet text, 
                connection text
            )`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log('Tables already created. Use of existing data.');
                    } else {
                        // Table just created, creating some
                        console.log('Tables created. Empty tables built.');
                    }
                });
        }
    });


module.exports = db;