const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'math',
    password: '4248SQLxyz'
});

connection.connect(function (err) {
    if (err) {
        return console.log(`There is an error ${err.message}`);
    }
    else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
})

let dataArray = []
let dataArrayN = []
let dataArrayX = []
let dataArrayY = []

app.get('/get-sells', async function (request, response) {

    async function getData(id) {
        let answer = ''
        let result = new Promise(function (resolve, reject) {
            connection.query(`select * from Sheet1 where N = ${id};`, function (err, results, fields) {
                resolve(results);
            })
        })

        result.then(result => {
            let value = Object.values(result)[0]
            dataArrayN.push(id)
            dataArrayX.push(value.X)
            dataArrayY.push(value.Y)
            answer = value
        })

        return answer;
    }

    idUsed = new Set()
    function makeRequest() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        id = getRandomInt(500)
        idUsed.add(id)
    }

    while (idUsed.size != 200) {
        try {
            makeRequest()
        }
        catch{
            pass
        }
    }

    let idUsedArray = Array.from(idUsed)
    idUsedArray.forEach(el => {
        getData(el)
    })
});

app.get('/write-data', function (request, response) {
    fs.truncateSync('data-x.txt')
    fs.truncateSync('data-y.txt')
    fs.truncateSync('data-n.txt')

    resultN = ''
    dataArrayN.forEach(el => {
        resultN += el + '\n'
    })
    fs.writeFileSync('data-n.txt', resultN);

    resultX = ''
    dataArrayX.forEach(el => {
        resultX += el + '\n'
    })
    fs.writeFileSync('data-x.txt', resultX);

    resultY = ''
    dataArrayY.forEach(el => {
        resultY += el + '\n'
    })
    fs.writeFileSync('data-y.txt', resultY);
})

app.listen(3000);

