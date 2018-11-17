var express = require('express');
var router = express.Router();
const connection = require('../db');

/* GET home page. */
const getEmployees = (id, cb) => {
    let query = "SELECT employee.id, employee.joining_year, employee.dept_no, employee.grade, employee.cnic FROM `employee` "

    if(id)
        query += " WHERE employee.id = " + id.toString()
    console.log(query)
    connection.query(query, cb)
}


router.get('/', function(req, res, next) {
    getEmployees(null, (err, results, fields) => {
        console.log(results)
        res.render("employees", {data: results})
    })
});

router.get('/add', (req, res, next) => {
    res.render("employees_add", {})
});


router.post('/add', (req, res, next) => { 
    connection.query("INSERT INTO employee (cnic, joining_year, dept_no, grade) VALUES (?, ?, ?, ?)", [req.body.cnic, req.body.joining_year, req.body.dept_no, req.body.grade], (err, results, fields) => {
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

    connection.query("DELETE FROM employee WHERE id = ?", [req.body.id], (err, results, fields) => {
        if(!err)
            err = "Deleted successfully"
        res.render("error", {errors: err})
    })
})

router.get('/update', (req, res, next) => {
    if(!req.query.id) {
        res.render("error", {errors: "cnic is required"})
        return;
    }

    getEmployees(req.query.id , (err, data, fields) => {
        if(err || !data || !data.length) {
            if(!err)
                err = "Employee not found"
            res.render("error", {errors: err})
            return
        }

        console.log(data)
        res.render("employees_update", {data: data[0], id: req.query.id})
    })


    //connection.query("SELECT *
})

router.post('/update', (req, res, next) => {
    connection.query("UPDATE employee SET id =?, joining_year=?, dept_no=?, cnic=?, grade=? WHERE id= ?", [req.body.id, req.body.joining_year, req.body.dept_no, req.body.cnic, req.body.grade, req.body.old_id], (err, fields, data) => {
        if(!err)
            err = "Updated successfully"
        res.render("error", {errors: err})
    })
})
module.exports = router;
