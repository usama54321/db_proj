var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getPersons = (id, cb) => {
    let query = "SELECT  person.age, person.first_name, person.last_name, person.cnic, person.phone_number, person.miles, person.passport_number, person.address_id FROM `person`"

    if(id)
        query += " WHERE person.cnic = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getPersons(null, (err, results, fields) => {
        console.log(err)
        res.render("persons", {data: results})
    })
});

router.get('/add', (req, res, next) => {
    res.render("persons_add", {})
});


router.post('/add', (req, res, next) => { 
    connection.query("INSERT INTO person (cnic, age, first_name, last_name, phone_number, miles, passport_number, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.body.cnic, req.body.age, req.body.first_name, req.body.last_name, req.body.phone_number, req.body.miles, req.body.passport_number, req.body.address_id], (err, results, fields) => {
        if(!err)
            err = "Added succesfully"
        res.render("error", {errors: err})
    })
})


router.post('/delete', (req, res, next) => {
    if(!req.body || !req.body.cnic) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM person WHERE cnic = ?", [req.body.cnic], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

router.get('/update', (req, res, next) => {
    if(!req.query.cnic) {
        res.render("error", {errors: "cnic is required"})
        return;
    }

    getPersons(req.query.cnic, (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Person not found"
            res.render("error", {errors: err})
            return
        }

        res.render("persons_update", {data: data[0]})
    })


    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE person SET first_name=?, last_name=?, age=?, cnic=?, phone_number=?, miles=?, passport_number=?, address_id=? WHERE cnic = ?", [req.body.first_name, req.body.last_name, req.body.age, req.body.cnic, req.body.phone_number, req.body.miles, req.body.passport_number, req.body.address_id, req.body.old_cnic], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
