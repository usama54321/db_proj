var express = require('express');
var router = express.Router();
const connection = require('../db');

const getSeatingType = (id, cb) => {
    let query = "SELECT seating_type.id, seating_type.name FROM seating_type"

    if(id)
        query += " WHERE seating_type.id = " + id.toString()
    connection.query(query, cb)
}

router.get('/', function(req, res, next) {
    getSeatingType(null, (err, results, fields) => {
    	console.log(results)
    	console.log("here")
    	console.log(err)
        res.render("seatingtype", {data: results})
    })
});



//DELETE


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM seating_type WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

// //UPDATE

router.get('/update', (req, res, next) => {
    if(!req.query.id) {
        res.render("error", {errors: "id is required"})
        return;
    }
    connection.query("SELECT * FROM name WHERE 1", (err, typename, fields) => {
                getSeatingType(req.query.id, (err, results, fields) => {
                    res.render("seating_update", {typename: typename, id: req.query.id});
                })
            //res.render("locations_add", {cities: cities, countries: countries, errors: err})

    })
    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    console.log(req.body)
    connection.query("UPDATE seatingtype SET name=?, WHERE id = ?", [req.body.name, req.body.id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})

// //ADD

router.get('/add', (req, res, next) => {
  connection.query("SELECT * FROM name WHERE 1", (err, typename, fields) => {
            res.render("seatingtype_add", {typename: typename, errors: err})
        })
  //res.render("error")
});

router.post('/add', (req, res, next) => {
  connection.query("INSERT INTO seatingtype (id, name) VALUES (?,?,?)", [req.body.id, req.body.name], (err, results, fields) => {
    if(!err)
      err = "Added succesfully"
    
    res.render("error", {errors: err})
  })
})

module.exports = router;