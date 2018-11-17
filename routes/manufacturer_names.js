var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getFlights = (id, cb) => {
    let query = "SELECT manufacturer_name.license_no, manufacturer_name.name FROM `manufacturer_name`"

    if(id)
        query += " WHERE manufacturer_name.licence_no = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {

	console.log("I was here 2")

    getFlights(null, (err, results, fields) => {
        console.log(results)
        console.log("errors below")
        console.log(err)
        res.render("manufacturer_names", {data: results})
    })
});


router.post('/delete', (req, res, next) => {
	   console.log("I came in delete")
    if(!req.body || !req.body.license_no) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM manufacturer_name WHERE license_no = ?", [req.body.license_no], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})


router.get('/add', (req, res, next) => {

    console.log("I was here 3")
	res.render("manufacturer_names_add")

 
});


router.post('/add', (req, res, next) => {
        console.log("POST came")
        console.log(req.body)
        connection.query("INSERT INTO manufacturer_name (license_no, name) VALUES (?, ?)", [req.body.license_no, req.body.name], (err, results, fields) => {
        if(!err)
            err = "Added succesfully"
        res.render("error", {errors: err})
   })
})

 

router.get('/update', (req, res, next) => {
   
    // i dont know why key is id instead of flight_no

    console.log("update called")
    console.log(req.query.license_no)
    if(!req.query.license_no) {
        res.render("error", {errors: "flight_no is required"})
        return;
    }

    console.log("reach here")


    let query = "SELECT  manufacturer_name.license_no, manufacturer_name.name FROM `manufacturer_name`"
    query += " WHERE manufacturer_name.license_no = " + req.query.license_no.toString()
    connection.query(query,(err, data, fields)=>{
        if(err || !data || !data.length) {
            if(!err)
                err = "manufacturer_name not found"
            res.render("error", {errors: err})
            return
        }



        console.log(data)
        console.log(data[0])
        console.log({data: data[0]})
        res.render("manufacturer_names_update", {data: data[0]})


    })


})


router.post('/update', (req, res, next) => {
     console.log("update called  post wala ")
     console.log(req.body)
    connection.query("UPDATE manufacturer_name SET license_no=?, name=? WHERE license_no = ?", [req.body.license_no, req.body.name, req.body.old_license_no], (err, fields, data) => {
        console.log(fields)
    console.log("see above")
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})

module.exports = router;
