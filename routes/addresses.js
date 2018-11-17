var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getFlights = (id, cb) => {
    let query = "SELECT address.id, address.city, address.postal_code, address.country, address.street FROM `address`"

    if(id)
        query += " WHERE airport.id = " + id.toString()
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {

	console.log("I was here 2")

    getFlights(null, (err, results, fields) => {
        console.log(results)
        console.log("errors below")
        console.log(err)
        res.render("addresses", {data: results})
    })
});


router.post('/delete', (req, res, next) => {
	 
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM address WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})


router.get('/add', (req, res, next) => {

    console.log("I was here 3")
	res.render("addresses_add")

 
});

router.post('/add', (req, res, next) => {
        console.log("POST came")
        console.log(req.body)
        connection.query("INSERT INTO address (id, city, postal_code, country, street) VALUES (?, ?, ?, ?, ?)", [req.body.id, req.body.city, req.body.postal_code, req.body.country, req.body.street], (err, results, fields) => {
        if(!err)
            err = "Added succesfully"
        res.render("error", {errors: err})
   })
})

 

router.get('/update', (req, res, next) => {
   
    // i dont know why key is id instead of flight_no

    console.log("update called")
    console.log(req.query.id)
    if(!req.query.id) {
        res.render("error", {errors: "flight_no is required"})
        return;
    }

    console.log("reach here")


    let query = "SELECT  address.id, address.city, address.postal_code, address.country, address.street FROM `address`"
    query += " WHERE address.id = " + req.query.id.toString()
    connection.query(query,(err, data, fields)=>{
        if(err || !data || !data.length) {
            if(!err)
                err = "Person not found"
            res.render("error", {errors: err})
            return
        }



        console.log(data)
        console.log(data[0])
        console.log({data: data[0]})
        res.render("addresses_update", {data: data[0]})


    })


})


router.post('/update', (req, res, next) => {
     console.log("update called  post wala ")
     console.log(req.body)
    connection.query("UPDATE address SET id=?, city=?, postal_code=?, country=?, street=? WHERE id = ?", [req.body.id, req.body.city, req.body.postal_code, req.body.country, req.body.street, req.body.old_id], (err, fields, data) => {
        console.log(fields)
    console.log("see above")
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})


module.exports = router;
