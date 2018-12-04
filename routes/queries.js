var express = require('express');
var router = express.Router();
const connection = require('../db');

router.get('/', (req, res, next) => {
  res.render('queries_home')  
})

router.get('/query1', (req, res, next) => {
  connection.query("SELECT airport_name FROM ( SELECT dept_airport, arrival_airport, COUNT(*) AS coun FROM flight GROUP BY dept_airport, arrival_airport ORDER BY coun DESC LIMIT 1 ) A INNER JOIN airport ON A.dept_airport = airport.airport_id", (err, results, fields) => {
    res.render('query_1', {data: results})
  })
})

router.get('/query2', (req, res, next) => {
  connection.query("SELECT a.airline_name, a.airline_id, SUM(a.temp) AS summation FROM ( SELECT airline.airline_name, airline.airline_id, IF( pessenger.passenger_id IS NOT NULL, 1, 0 ) AS temp FROM airline LEFT JOIN airplane ON airline.airline_id = airplane.airline_id LEFT JOIN flight ON airplane.airplane_id = flight.airplane_id LEFT JOIN pricing ON flight.flight_id = pricing.flight_id LEFT JOIN ticketing ON pricing.pricing_id = ticketing.pricing_id LEFT JOIN pessenger ON ticketing.passenger_id = pessenger.passenger_id ) a GROUP BY a.airline_id ORDER BY summation ASC LIMIT 1", (err, results, fields) => {
    res.render('query_2', {data: results})
  })
})

router.get('/query3', (req, res, next) => {
  connection.query("SELECT * FROM ((SELECT airline.airline_name FROM `airline` INNER JOIN airplane ON airline.airline_id=airplane.airline_id INNER JOIN flight ON airplane.airplane_id = flight.airplane_id INNER JOIN pricing ON flight.flight_id=pricing.flight_id INNER JOIN seating_type ON seating_type.seating_type_id = pricing.seating_type_id GROUP BY airline.airline_id ORDER BY COUNT(airline.airline_id) DESC LIMIT 1) AS a NATURAL JOIN (SELECT airline_name FROM `airline` INNER JOIN airplane ON airline.airline_id=airplane.airline_id INNER JOIN flight ON airplane.airplane_id = flight.airplane_id INNER JOIN pricing ON flight.flight_id=pricing.flight_id INNER JOIN seating_type ON seating_type.seating_type_id = pricing.seating_type_id WHERE pricing.seating_type_id = 2 ORDER BY pricing.cost DESC LIMIT 1) AS b)", (err, results, fields) => {
    res.render('query_3', {data: results})
  })
})

router.get('/query4', (req, res, next) => {
  connection.query("SELECT COUNT(*) cnt FROM ( SELECT DISTINCT cnic FROM ticketing t, seating_type st, pessenger pg, pricing p WHERE t.passenger_id = pg.passenger_id AND t.pricing_id = p.pricing_id AND p.seating_type_id = st.seating_type_id AND pg.cnic NOT IN( SELECT cnic FROM ticketing t2, seating_type st2, pessenger pg2, pricing p2 WHERE t2.passenger_id = pg2.passenger_id AND t2.pricing_id = p2.pricing_id AND p2.seating_type_id = st2.seating_type_id AND st2.seating_type_name != 'economy' ) ) AS a;", (err, results, fields) => {
    res.render('query_4', {data: results})
  })
})

router.get('/query5', (req, res, next) => {
  connection.query("SELECT COUNT(*) as cnt, ticketing.time_of_sale as bc_time from airline INNER JOIN airplane a ON a.airline_id = airline.airline_id INNER JOIN flight fli ON fli.airplane_id = a.id INNER JOIN pricing pri ON pri.flight_id = fli.flight_no INNER JOIN ticketing on ticketing.pricing_id = pri.id GROUP BY hour(ticketing.time_of_sale) ORDER BY cnt DESC LIMIT 1", (err, results) => {
    res.render("query_5", {data: results})
  })
})



router.get('/query6', (req, res, next) => {
  res.render('query_6_get');  
})

router.post('/query6', (req, res, next) => {
  connection.query("SELECT flight_id FROM flight f, airport a1, airport a2 WHERE a1.airport_name = ? AND a2.airport_name = ? AND f.dept_airport = a2.airport_id AND f.arrival_airport = a1.airport_id", [req.body.src_airport, req.body.dest_airport], (err, results) => {
console.log(results)
  res.render('query_6_post', {data: results})
})
})


router.get('/query7', (req, res, next) => {
  res.render('query_7_get');
})

router.post('/query7', (req, res, next) => {
  connection.query("SELECT f.flight_id, p.cost FROM airline a, airplane ap, flight f, pricing p WHERE a.airline_id = ap.airline_id AND ap.airplane_id = f.airplane_id AND f.flight_id = p.flight_id AND a.airline_name = ?", [req.body.airline_name], (err, results) => {
console.log(results)
  res.render('query_7_post', {data: results})
})
})

router.get('/query8', (req, res, next) => {
  res.render('query_8_get');
})

router.post('/query8', (req, res, next) => {
  connection.query("SELECT a.airline_id, a.airline_name, a.average FROM ( SELECT airline.airline_name, airline.airline_id, AVG(pri.cost) AS average FROM airline INNER JOIN airplane a ON a.airline_id = airline.airline_id INNER JOIN flight fli ON fli.airplane_id = a.airplane_id INNER JOIN pricing pri ON pri.flight_id = fli.flight_id GROUP BY airline.airline_id ) a WHERE a.average >= ? AND a.average <= ?", [req.body.range_start, req.body.range_end], (err, results) => {
console.log(results)
  res.render('query_8_post', {data: results})
})
})

router.get('/query9', (req, res, next) => {
  res.render('query_9_get');  
})

router.post('/query9', (req, res, next) => {
  connection.query("SELECT DISTINCT flight.flight_id, a1.airport_name, a2.airport_name, flight.dept_time FROM airline INNER JOIN airplane ON airline.airline_id = airplane.airline_id INNER JOIN flight ON airplane.airplane_id = flight.airplane_id INNER JOIN pricing ON flight.flight_id = pricing.flight_id INNER JOIN ticketing ON pricing.pricing_id = ticketing.pricing_id INNER JOIN pessenger ON ticketing.passenger_id = pessenger.passenger_id INNER JOIN airport AS a1 ON a1.airport_id = flight.arrival_airport INNER JOIN airport AS a2 ON a2.airport_id = flight.dept_airport WHERE pessenger.passenger_id = ?", [req.body.pessenger_id], (err, results) => {
console.log(results)
  res.render('query_9_post', {data: results})
})
})



router.get('/query10', (req, res, next) => {
  res.render('query_10_get');  
})


router.post('/query10', (req, res, next) => {
  connection.query("SELECT a1.airport_name AS dept_name, a2.airport_name AS arrival_name, flight.flight_id FROM flight INNER JOIN airport a1 ON a1.airport_id = flight.dept_airport INNER JOIN airport a2 ON a2.airport_id = flight.arrival_airport WHERE ( flight.arrival_airport = ? OR flight.dept_airport = ? ) AND flight.dept_time >= ? AND flight.dept_time < DATE_ADD(?, INTERVAL 1 DAY)", [req.body.airport_id,req.body.airport_id, req.body.date,req.body.date], (err, results) => {
console.log(results)
  res.render('query_10_post', {data: results})
})
})
module.exports = router;
