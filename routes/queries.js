var express = require('express');
var router = express.Router();
const connection = require('../db');

router.get('/', (req, res, next) => {
  res.render('queries_home')  
})

router.get('/query1', (req, res, next) => {
  connection.query("SELECT airport.name FROM (SELECT dept_airport, arrival_airport, COUNT(*) as coun FROM flight GROUP BY dept_airport, arrival_airport ORDER BY coun DESC LIMIT 1 ) A INNER JOIN airport ON A.dept_airport = airport.id", (err, results, fields) => {
    res.render('query_1', {data: results})
  })
})

router.get('/query2', (req, res, next) => {
  connection.query("SELECT a.name, a.airline_id, SUM(a.temp) as summation FROM (SELECT airline.name, airline.airline_id,if(pessenger.id is not null, 1, 0) as temp FROM `airline` LEFT JOIN airplane ON airline.airline_id=airplane.airline_id LEFT JOIN flight ON airplane.id = flight.airplane_id LEFT JOIN pricing ON flight.flight_no=pricing.flight_id LEFT JOIN ticketing ON pricing.id=ticketing.pricing_id LEFT JOIN pessenger on ticketing.passenger_id=pessenger.id) a group by a.airline_id ORDER BY summation ASC LIMIT 1", (err, results, fields) => {
    res.render('query_2', {data: results})
  })
})

router.get('/query5', (req, res, next) => {
  connection.query("SELECT COUNT(*) as cnt, ticketing.time_of_sale as bc_time from airline INNER JOIN airplane a ON a.airline_id = airline.airline_id INNER JOIN flight fli ON fli.airplane_id = a.id INNER JOIN pricing pri ON pri.flight_id = fli.flight_no INNER JOIN ticketing on ticketing.pricing_id = pri.id GROUP BY hour(ticketing.time_of_sale) ORDER BY cnt DESC LIMIT 1", (err, results) => {
    res.render("query_3", {data: results})
  })
})

router.get('/query8', (req, res, next) => {
  res.render('query_8_get');  
})

router.post('/query8', (req, res, next) => {
  connection.query("SELECT a.airline_id, a.name, a.average FROM (SELECT airline.name, airline.airline_id, AVG(pri.cost) as average from airline INNER JOIN airplane a ON a.airline_id = airline.airline_id INNER JOIN flight fli ON fli.airplane_id = a.id INNER JOIN pricing pri ON pri.flight_id = fli.flight_no GROUP BY airline.airline_id) a WHERE a.average >= ? AND a.average <= ?", [req.body.range_start, req.body.range_end], (err, results) => {
console.log(results)
  res.render('query_8_post', {data: results})
})
})

router.get('/query9', (req, res, next) => {
  res.render('query_9_get');  
})

router.post('/query9', (req, res, next) => {
  connection.query("SELECT flight.flight_no, a1.name, a2.name, flight.dept_time FROM `airline` INNER JOIN airplane ON airline.airline_id=airplane.airline_id INNER JOIN flight ON airplane.id = flight.airplane_id INNER JOIN pricing ON flight.flight_no=pricing.flight_id INNER JOIN ticketing ON pricing.id=ticketing.pricing_id INNER JOIN pessenger on ticketing.passenger_id=pessenger.id INNER JOIN airport AS a1 ON a1.id=flight.arrival_airport INNER JOIN airport AS a2 ON a2.id=flight.dept_airport WHERE pessenger.id=?", [req.body.pessenger_id], (err, results) => {
console.log(results)
  res.render('query_9_post', {data: results})
})
})



router.get('/query10', (req, res, next) => {
  res.render('query_10_get');  
})


router.post('/query10', (req, res, next) => {
  connection.query("SELECT a1.name as dept_name, a2.name as arrival_name, flight.flight_no FROM flight INNER JOIN airport a1 ON a1.id = flight.dept_airport INNER JOIN airport a2 ON a2.id = flight.arrival_airport WHERE (flight.arrival_airport=? or flight.dept_airport=?) AND flight.dept_time>= ? AND flight.dept_time < DATE_ADD(?, INTERVAL 1 DAY) ", [req.body.airport_id,req.body.airport_id, req.body.date,req.body.date], (err, results) => {
console.log(results)
  res.render('query_10_post', {data: results})
})
})
module.exports = router;
