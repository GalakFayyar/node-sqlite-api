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
            db.run(
            `CREATE TABLE Parameters (
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
            ); `,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log('Parameters table already created. Use of existing Parameters table.');
                    } else {
                        // Table just created, creating some
                        console.log('Parameters table created.');
                    }
                }
            );
            db.run(
                `CREATE TABLE Applications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    aid text,
                    label text,
                    tacOnline text,
                    tacDenial text,
                    tacDefault text,
                    skipSecondGenAc boolean,
                    appVersion text,
                    defaultDDOL text,
                    defaultTDOL text,
                    supportedInterfaces text,
                    contactlessProfile text,
                    contactlessKernel text,
                    msLegacyMode boolean,
                    keySet text,
                    connection text,
                CONSTRAINT aid_unique UNIQUE (aid)
                );`,
                    (err) => {
                        if (err) {
                            // Table already created
                            console.log('Applications table already created. Use of existing Applications table.');
                        } else {
                            // Table just created, creating some
                            console.log('Applications table created.');
                        }
                    }
                );
        }
    });

module.exports = db;