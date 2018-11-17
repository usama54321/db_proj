var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getAirplanes = (id, cb) => {
    let query = "SELECT  airplane.id, airplane.name, airplane.manufacture_year, airplane.license_no FROM `airplane`"

    if(id)
        query += " WHERE airplane.id = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getAirplanes(null, (err, results, fields) => {
        console.log(err)
        res.render("airplane", {data: results})
    })
});

router.get('/add', (req, res, next) => {
    res.render("airplane_add", {})
});


router.post('/add', (req, res, next) => { 
    connection.query("INSERT INTO airplane (name, manufacture_year, license_no) VALUES (?, ?, ?)", [req.body.airplane_type, req.body.manufacture_year, req.body.license_no], (err, results, fields) => {
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

    connection.query("DELETE FROM airplane WHERE id = ?", [req.body.id], (err, results, fields) => {
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

    getAirplanes(req.query.id, (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Airplane not found"
            res.render("error", {errors: err})
            return
        }

        res.render("airplane_update", {data: data[0]})
    })


    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE airplane SET name=?, manufacture_year=?, license_no=? WHERE id = ?", [req.body.airplane_type, req.body.manufacture_year, req.body.license_no, req.body.id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
