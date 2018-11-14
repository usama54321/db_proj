var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getAirports = (id, cb) => {
    let query = "SELECT airport.id, airport.name, city.name AS city, country.name AS country FROM `airport` INNER JOIN location ON location.id = airport.location_id INNER JOIN `city` ON city.id = location.city INNER JOIN country ON country.id = location.country"

    if(id)
        query += " WHERE airport.id = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getAirports(null, (err, results, fields) => {
        console.log(results)
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
  connection.query("INSERT INTO location (country, city) VALUES (?, ?)", [req.body.city, req.body.country], (err, results, fields) => {
    connection.query("INSERT INTO airport (id, name, location_id) VALUES (?,?,?)", [req.body.id, req.body.country, req.body.city], (err, results, fields) => {
      if(!err)
        err = "Added succesfully"
      res.render("error", {errors: err})
    })
  })
  
})


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM location WHERE id = ?", [req.body.id], (err, results, fields) => {
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
    connection.query("SELECT * FROM city WHERE 1", (err, cities, fields) => {
        connection.query("SELECT * FROM country WHERE 1", (err, countries, fields) => {
            getAirports(req.query.id, (err, results, fields) => {
                res.render("locations_update", {cities: cities, countries: countries, id: req.query.id});
            })
            //res.render("locations_add", {cities: cities, countries: countries, errors: err})
        })
    })
    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    console.log(req.body)
    connection.query("UPDATE location SET country=?, city=? WHERE id = ?", [req.body.country, req.body.city, req.body.id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
