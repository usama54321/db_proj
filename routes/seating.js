var express = require('express');
var router = express.Router();
const connection = require('../db');

const getSeating = (id, cb) => {
    let query = "SELECT seating.id, seating.airplane_id, seating.seating_type_id, seating.number_of_seats FROM seating"

    if(id)
        query += " WHERE seating.id = " + id.toString()
    connection.query(query, cb)
}

router.get('/', function(req, res, next) {
    getSeating(null, (err, results, fields) => {
    	console.log(results)
    	console.log("here")
    	console.log(err)
        res.render("seating", {data: results})
    })
});



//DELETE


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM seating WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

//UPDATE

router.get('/update', (req, res, next) => {
    if(!req.query.id) {
        res.render("error", {errors: "id is required"})
        return;
    }
    connection.query("SELECT * FROM airplane_id WHERE 1", (err, airplanes, fields) => {
        connection.query("SELECT * FROM seating_type_id WHERE 1", (err, seatingtypes, fields) => {
             connection.query("SELECT * FROM number_of_seats WHERE 1", (err, seatnumbers, fields) => {
                getSeating(req.query.id, (err, results, fields) => {
                    res.render("seating_update", {airplanes: airplanes, seatingtypes: seatingtypes, seatnumbers: seatnumbers, id: req.query.id});
                })
            //res.render("locations_add", {cities: cities, countries: countries, errors: err})
            })
        })
    })
    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    console.log(req.body)
    connection.query("UPDATE seating SET seating_type_id=?, WHERE id = ?", [req.body.seating_type_id, req.body.id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})

//ADD

router.get('/add', (req, res, next) => {
  connection.query("SELECT * FROM airplane_id WHERE 1", (err, airplanes, fields) => {
    connection.query("SELECT * FROM seating_type_id WHERE 1", (err, seatingtypes, fields) => {
        connection.query("SELECT * FROM number_of_seats WHERE 1", (err, seatnumbers, fields) => {

            res.render("seating_add", {airplanes:airplanes, seatingtypes:seatingtypes, seatnumbers:seatnumbers, errors: err})
        })
    })
  })

  //res.render("error")
});

router.post('/add', (req, res, next) => {
  connection.query("INSERT INTO seating (id, airplane_id, seating_type_id, number_of_seats) VALUES (?,?,?)", [req.body.id, req.body.airplane_id, req.body.seating_type_id, req.body.number_of_seats], (err, results, fields) => {
    if(!err)
      err = "Added succesfully"
    
    res.render("error", {errors: err})
  })
})

module.exports = router;