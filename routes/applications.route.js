let express = require('express'),
    db = require("../database/database.js"),
    applicationsRoute = express.Router();

/**
 * @typedef Application
 * @property {string} aid
 * @property {string} label
 * @property {string} tacOnline
 * @property {string} tacDenial
 * @property {string} tacDefault
 * @property {boolean} skipSecondGenAc
 * @property {string} appVersion
 * @property {string} defaultDDOL
 * @property {string} defaultTDOL
 * @property {string} supportedInterfaces
 * @property {string} contactlessProfile
 * @property {string} contactlessKernel
 * @property {boolean} msLegacyMode
 * @property {string} keySet
 * @property {string} connection
 */

// Standard CRUD operations

/**
 * Get all applications
 * @route GET /api-fts-online/applications/
 * @group Applications routes - Active routes
 * @returns {object} 200 - List of applications
 * @returns {Error}  default - Unexpected error
 */
applicationsRoute.route('/').get((req, res, next) => {
    var sql = "select * from Applications";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

/**
 * Get a application from its id
 * @route GET /api-fts-online/applications/{id}
 * @group Applications routes - Active routes
 * @param {string} id.path.required - Database application id from SQLite database
 * @returns {object} 200 - List of applications
 * @returns {Error}  default - Unexpected error
 */
applicationsRoute.route('/:id').get((req, res, next) => {
    var sql = "select * from Applications where id = ?";
    var params = [req.params.id];
    db.get(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: result
        });
    });
});

/**
 * Create a new application
 * @route POST /api-fts-online/applications/
 * @group Applications routes - Active routes
 * @consumes application/json
 * @param {Application.model} req.body
 * @returns {object} 200 - New application created in database
 * @returns {Error}  default - Unexpected error
 */
applicationsRoute.route('/').post((req, res, next) => {
    // Checks can be performed here for data format and completeness
    // var errors=[]
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    console.log(req.body);
    var data = {
        aid: req.body.aid,
        label: req.body.label,
        tacOnline: req.body.tacOnline,
        tacDenial: req.body.tacDenial,
        tacDefault: req.body.tacDefault,
        skipSecondGenAc: req.body.skipSecondGenAc,
        appVersion: req.body.appVersion,
        defaultDDOL: req.body.defaultDDOL,
        defaultTDOL: req.body.defaultTDOL,
        supportedInterfaces: req.body.supportedInterfaces,
        contactlessProfile: req.body.contactlessProfile,
        contactlessKernel: req.body.contactlessKernel,
        msLegacyMode: req.body.msLegacyMode,
        keySet: req.body.keySet,
        connection: req.body.connection,
    };
    var sql = 'INSERT INTO Applications (aid,label,tacOnline,tacDenial,tacDefault,skipSecondGenAc,appVersion,defaultDDOL,defaultTDOL,supportedInterfaces,contactlessProfile,contactlessKernel,msLegacyMode,keySet,connection) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var params = [data.aid,data.label,data.tacOnline,data.tacDenial,data.tacDefault,data.skipSecondGenAc,data.appVersion,data.defaultDDOL,data.defaultTDOL,data.supportedInterfaces,data.contactlessProfile,data.contactlessKernel,data.msLegacyMode,data.keySet,data.connection];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: data,
            id: this.lastID
        });
    });
});

/**
 * Update a application from its id
 * @route PATCH /api-fts-online/applications/{id}
 * @group Applications routes - Active routes
 * @param {string} id.path.required - Database application id to update
 * @param {Application.model} req.body
 * @returns {object} 200 - Updated applications
 * @returns {Error}  default - Unexpected error
 */
applicationsRoute.route('/:id').patch((req, res, next) => {
    var data = {
        aid: req.body.aid,
        label: req.body.label,
        tacOnline: req.body.tacOnline,
        tacDenial: req.body.tacDenial,
        tacDefault: req.body.tacDefault,
        skipSecondGenAc: req.body.skipSecondGenAc,
        appVersion: req.body.appVersion,
        defaultDDOL: req.body.defaultDDOL,
        defaultTDOL: req.body.defaultTDOL,
        supportedInterfaces: req.body.supportedInterfaces,
        contactlessProfile: req.body.contactlessProfile,
        contactlessKernel: req.body.contactlessKernel,
        msLegacyMode: req.body.msLegacyMode,
        keySet: req.body.keySet,
        connection: req.body.connection,
    };
    db.run(
        `UPDATE Applications SET 
            aid = COALESCE(?,aid),
            label = COALESCE(?,label),
            tacOnline = COALESCE(?,tacOnline),
            tacDenial = COALESCE(?,tacDenial),
            tacDefault = COALESCE(?,tacDefault),
            skipSecondGenAc = COALESCE(?,skipSecondGenAc),
            appVersion = COALESCE(?,appVersion),
            defaultDDOL = COALESCE(?,defaultDDOL),
            defaultTDOL = COALESCE(?,defaultTDOL),
            supportedInterfaces = COALESCE(?,supportedInterfaces),
            contactlessProfile = COALESCE(?,contactlessProfile),
            contactlessKernel = COALESCE(?,contactlessKernel),
            msLegacyMode = COALESCE(?,msLegacyMode),
            keySet = COALESCE(?,keySet),
            connection = COALESCE(?,connection)
        WHERE id = ?`, 
        [data.aid,data.label,data.tacOnline,data.tacDenial,data.tacDefault,data.skipSecondGenAc,data.appVersion,data.defaultDDOL,data.defaultTDOL,data.supportedInterfaces,data.contactlessProfile,data.contactlessKernel,data.msLegacyMode,data.keySet,data.connection,req.params.id],
        function(err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            });
        });
});

/**
 * Delete an application from its id
 * @route DELETE /api-fts-online/applications/{id}
 * @group Applications routes - Active routes
 * @param {string} id.path.required - Database application id to delete
 * @returns {object} 200 - List of changes on application
 * @returns {Error}  default - Unexpected error
 */
applicationsRoute.route('/:id').delete((req, res, next) => {
    db.run(
        'DELETE FROM Applications WHERE id = ?',
        req.params.id,
        function(err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            });
        });
});

module.exports = applicationsRoute;