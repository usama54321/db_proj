var express = require('express');
var router = express.Router();
const connection = require('../db');

const getPricing = (id, cb) => {
    let query = "SELECT pricing.id, pricing.flight_id, pricing.seating_type_id, pricing.cost, pricing.baggage_limit FROM pricing"

    if(id)
        query += " WHERE pricing.id = " + id.toString()

    connection.query(query, cb)
}

router.get('/', function(req, res, next) {
    
    getPricing(null, (err, results, fields) => {
        res.render("pricing", {data: results})
    })
});



router.get('/add', (req, res, next) => {
    res.render("pricing_add", {})
});


router.post('/add', (req, res, next) => { 
    console.log(req.body)
    connection.query("INSERT INTO pricing (flight_id, seating_type_id, cost, baggage_limit) VALUES (?, ?, ?,?)", [req.body.flight, req.body.seating_type, req.body.cost, req.body.baggage], (err, results, fields) => {
        if(!err)
            err = "Added succesfully"
        res.render("error", {errors: err})
    })
})


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM pricing WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

router.get('/update', (req, res, next) => {
    if(!req.query.id) {
        res.render("error", {errors: "ID is required"})
        return;
    }

    getPricing(req.query.id, (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Pricing not found"
            res.render("error", {errors: err})
            return
        }

        res.render("pricing_update", {data: data[0]})
    })


    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE pricing SET flight_id=?, seating_type_id=?, cost=?, baggage_limit=? WHERE id = ?", [req.body.flight_id, req.body.seating_type_id, req.body.cost, req.body.baggage_limit], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
