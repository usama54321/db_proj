var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getAirports = (id, cb) => {
    let query = "SELECT airport.id, airport.name, airport.location_id, city.name AS city, country.name AS country FROM `airport` INNER JOIN location ON location.id = airport.location_id INNER JOIN `city` ON city.id = location.city INNER JOIN country ON country.id = location.country"

    if(id)
        query += " WHERE airport.id = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getAirports(null, (err, results, fields) => {
        console.log(results)
        console.log(err)
        res.render("airports", {data: results})
    })
});

router.get('/add', (req, res, next) => {
  connection.query("SELECT * FROM city WHERE 1", (err, cities, fields) => {
    connection.query("SELECT * FROM country WHERE 1", (err, countries, fields) => {
      res.render("airports_add", {cities: cities, countries: countries, errors: err})
    })
  })

  //res.render("error")
});

router.post('/add', (req, res, next) => {
    connection.query("INSERT INTO airport (name, location_id) VALUES (?,?)", [req.body.name, req.body.location_id], (err, results, fields) => {
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

    connection.query("DELETE FROM airport WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

router.get('/update', (req, res, next) => {
    if(!req.query.id) {
        res.render("error", {errors: "id is required"})
        return;
    }
    getAirports(req.query.id, (err, results, fields) => {
        console.log(results)
        res.render("airports_update", {id: req.query.id, data: results[0]});
    })
})

router.post('/update', (req, res, next) => {
    console.log(req.body)
    connection.query("UPDATE airport SET id=?, name=?, location_id=? WHERE id = ?", [req.body.id, req.body.name, req.body.location_id, req.body.old_id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
