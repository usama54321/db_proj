var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getPessengers = (id, cb) => {
    let query = "SELECT person.age, person.first_name, person.last_name, person.cnic, person.phone_number, person.miles, person.passport_number, person.address_id, pessenger.id, pessenger.discount FROM `person` INNER JOIN pessenger ON person.cnic = pessenger.cnic"

    if(id)
        query += " WHERE pessenger.id = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getPessengers(null, (err, results, fields) => {
        res.render("pessengers", {data: results})
    })
});

router.get('/add', (req, res, next) => {
    res.render("pessengers_add", {})
});


router.post('/add', (req, res, next) => { 
    connection.query("INSERT INTO pessenger (discount, cnic) VALUES (?, ?)", [req.body.discount, req.body.cnic], (err, results, fields) => {
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

    connection.query("DELETE FROM pessenger WHERE id = ?", [req.body.id], (err, results, fields) => {
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

    getPessengers(req.query.id , (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Pessenger not found"
            res.render("error", {errors: err})
            return
        }

        res.render("pessengers_update", {data: data[0]})
    })
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE pessenger SET cnic=?, discount=? WHERE id = ?", [req.body.cnic, req.body.discount, req.body.id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
