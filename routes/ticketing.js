var express = require('express');
var router = express.Router();
const connection = require('../db');

const getTicketing = (id, cb) => {
    let query = "SELECT ticketing.booking_id, ticketing.pricing_id, ticketing.passenger_id FROM ticketing"

    if(id)
        query += " WHERE ticketing.booking_id = " + id.toString()
    connection.query(query, cb)
}

router.get('/', function(req, res, next) {
    getTicketing(null, (err, results, fields) => {
    	console.log(results)
    	console.log("here")
    	console.log(err)
        res.render("ticketing", {data: results})
    })
});



//DELETE


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.booking_id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM ticketing WHERE booking_id = ?", [req.body.booking_id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

//UPDATE

router.get('/update', (req, res, next) => {
    if(!req.query.booking_id) {
        res.render("error", {errors: "booking_id is required"})
        return;
    }

    getTicketing(req.query.booking_id, (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Seat not found"
            res.render("error", {errors: err})
            return
        }

        res.render("ticketing_update", {data: data[0]})
    })


    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE ticketing SET booking_id=?, pricing_id=?, passenger_id=? WHERE booking_id = ?", [req.body.booking_id, req.body.pricing_id, req.body.passenger_id. req.body.oldbooking_id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})

//ADD

router.get('/add', (req, res, next) => {
    res.render("ticketing_add", {})
});

router.post('/add', (req, res, next) => {
  connection.query("INSERT INTO ticketing (booking_id, pricing_id, passenger_id) VALUES (?,?,?)", [req.body.booking_id, req.body.pricing_id, req.body.passenger_id], (err, results, fields) => {
    if(!err)
      err = "Added succesfully"
    
    res.render("error", {errors: err})
  })
})

module.exports = router;