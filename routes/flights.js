var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getFlights = (id, cb) => {
    let query = "SELECT flight.flight_no, airport1.name AS name1, airport2.name AS name2, flight.dept_time, flight.airplane_id FROM `flight` INNER JOIN airport airport1 ON flight.arrival_airport = airport1.id INNER JOIN airport airport2 ON flight.dept_airport = airport2.id "

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
        res.render("flights", {data: results})
    })
});


router.post('/delete', (req, res, next) => {
	 
    if(!req.body || !req.body.id) {
        res.render("error", {errors: "No id provided"})
        return;
    }

    connection.query("DELETE FROM flight WHERE flight_no = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})


router.get('/add', (req, res, next) => {

    console.log("I was here 3")
	res.render("flights_add")

 
});

router.post('/add', (req, res, next) => {
        console.log("POST came")
        console.log(req.body)
        connection.query("INSERT INTO flight (flight_no, arrival_airport, dept_airport, airplane_id, dept_time) VALUES (?, ?, ?, ?, ?)", [req.body.flight_no, req.body.arrival_airport, req.body.dept_airport, req.body.airplane_id, req.body.dept_time], (err, results, fields) => {
        if(!err)
            err = "Added succesfully"
        res.render("error", {errors: err})
   })
})



router.get('/update', (req, res, next) => {
   
    // i dont know why key is id instead of flight_no
    if(!req.query.flight_no) {
        res.render("error", {errors: "flight_no is required"})
        return;
    }
    let query = "SELECT  flight.flight_no, flight.arrival_airport, flight.dept_airport, flight.airplane_id, flight.dept_time FROM `flight`"
    query += " WHERE flight.flight_no = " + req.query.flight_no.toString()
    connection.query(query,(err, data, fields)=>{
        if(err || !data || !data.length) {
            if(!err)
                err = "flight not found"
            res.render("error", {errors: err})
            return
        }

        console.log(data)
        console.log(data[0])
        console.log({data: data[0]})
        res.render("flights_update", {data: data[0]})


    })


})


router.post('/update', (req, res, next) => {
     console.log("update called  post wala ")
     console.log(req.body)
    connection.query("UPDATE flight SET flight_no=?, arrival_airport=?, dept_airport=?, airplane_id=?, dept_time=? WHERE flight_no = ?", [req.body.flight_no, req.body.arrival_airport, req.body.dept_airport, req.body.airplane_id, req.body.dept_time, req.body.old_flight_no], (err, fields, data) => {
        console.log(fields)
    console.log("see above")
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})


module.exports = router;
