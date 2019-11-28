let express = require('express'),
    db = require("../database/database.js"),
    parametersRoute = express.Router();

/**
 * @typedef Parameter
 * @property {string} protocol
 * @property {string} IP
 * @property {string} port
 * @property {string} timeout
 * @property {string} pinKey
 * @property {string} macKey
 * @property {string} transactionType
 * @property {string} usedInterface
 * @property {string} transactionAmount
 * @property {string} transactionAmountOther
 */

// Standard CRUD operations

/**
 * Get all parameters
 * @route GET /api-fts-online/parameters/
 * @group Parameters routes - Active routes
 * @returns {object} 200 - List of parameters
 * @returns {Error}  default - Unexpected error
 */
parametersRoute.route('/').get((req, res, next) => {
    var sql = "select * from Parameters";
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
 * Get a parameter from its id
 * @route GET /api-fts-online/parameters/{id}
 * @group Parameters routes - Active routes
 * @param {string} id.path.required - Database parameter id from SQLite database
 * @returns {object} 200 - List of parameters
 * @returns {Error}  default - Unexpected error
 */
parametersRoute.route('/:id').get((req, res, next) => {
    var sql = "select * from Parameters where id = ?";
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
 * Create a new parameter
 * @route POST /api-fts-online/parameters/
 * @group Parameters routes - Active routes
 * @consumes application/json
 * @param {Parameter.model} req.body
 * @returns {object} 200 - New parameter created in database
 * @returns {Error}  default - Unexpected error
 */
parametersRoute.route('/').post((req, res, next) => {
    // Checks can be performed here for data format and completeness
    // var errors=[]
    // if (errors.length){
    //     res.status(400).json({"error":errors.join(",")});
    //     return;
    // }
    console.log(req.body);
    var data = {
        protocol: req.body.protocol,
        IP: req.body.IP,
        port: req.body.port,
        timeout: req.body.timeout,
        pinKey: req.body.pinKey,
        macKey: req.body.macKey,
        transactionType: req.body.transactionType,
        usedInterface: req.body.usedInterface,
        transactionAmount: req.body.transactionAmount,
        transactionAmountOther: req.body.transactionAmountOther,
    };
    var sql = 'INSERT INTO Parameters (protocol, IP, port, timeout, pinKey, macKey, transactionType, usedInterface, transactionAmount, transactionAmountOther) VALUES (?,?,?,?,?,?,?,?,?,?)';
    var params = [data.protocol, data.IP, data.port, data.timeout, data.pinKey, data.macKey, data.transactionType, data.usedInterface, data.transactionAmount, data.transactionAmountOther];
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
 * Update a parameter from its id
 * @route PATCH /api-fts-online/parameters/{id}
 * @group Parameters routes - Active routes
 * @param {string} id.path.required - Database parameter id to update
 * @param {Parameter.model} req.body
 * @returns {object} 200 - Update parameter
 * @returns {Error}  default - Unexpected error
 */
parametersRoute.route('/:id').patch((req, res, next) => {
    var data = {
        protocol: req.body.protocol,
        IP: req.body.IP,
        port: req.body.port,
        timeout: req.body.timeout,
        pinKey: req.body.pinKey,
        macKey: req.body.macKey,
        transactionType: req.body.transactionType,
        usedInterface: req.body.usedInterface,
        transactionAmount: req.body.transactionAmount,
        transactionAmountOther: req.body.transactionAmountOther,
    };
    db.run(
        `UPDATE Parameters set 
           protocol = COALESCE(?,protocol), 
           IP = COALESCE(?,IP), 
           port = COALESCE(?,port),
           timeout = COALESCE(?,timeout),
           pinKey = COALESCE(?,pinKey),
           macKey = COALESCE(?,macKey),
           transactionType = COALESCE(?,transactionType),
           usedInterface = COALESCE(?,usedInterface),
           transactionAmount = COALESCE(?,transactionAmount),
           transactionAmountOther = COALESCE(?,transactionAmountOther)
        WHERE id = ?`, 
        [data.protocol,data.IP,data.port,data.timeout,data.pinKey,data.macKey,data.transactionType,data.usedInterface,data.transactionAmount,data.transactionAmountOther,req.params.id],
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
 * Delete a parameter from its id
 * @route DELETE /api-fts-online/parameters/{id}
 * @group Parameters routes - Active routes
 * @param {string} id.path.required - Database parameter id to delete
 * @returns {object} 200 - List of changes on parameter
 * @returns {Error}  default - Unexpected error
 */
parametersRoute.route('/:id').delete((req, res, next) => {
    db.run(
        'DELETE FROM Parameters WHERE id = ?',
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

module.exports = parametersRoute;