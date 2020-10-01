const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.listen(3000, () => {
    console.log('Server is up and running on port 3000');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let totalCount = 0;
let lastId;

function hasNumber(str) {
    return /\d/.test(str);
}

function containsSpecialCharacters(str){
    var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?]/g;
    return regex.test(str);
}

app.post("/count", (req, res) => {
    console.log('totalCount', totalCount);
    const msg = req.body;
    console.log('msg', msg);
    // Ensure that we have a string to work with
    if (typeof msg.message !== 'string') {
        res.status(400).json({
            status: 400,
            message: 'The message you sent is not a string. Please try again.'
        });
        return;
    }

    // Make sure we do not have a string of numbers, because those are still not words
    if (hasNumber(msg && msg.message)) {
        res.status(400).json({
            status: 400,
            message: 'Ahhh ahh ahh, this string contains numbers and those are not words.'
        });
        return;
    }

    // Make sure the string does not have special charcters
    if (containsSpecialCharacters(msg && msg.message)) {
        res.status(400).json({
            status: 400,
            message: 'WHOA! Those are funky looking words. Please do not use any special charcters'
        });
        return;
    }

    // Make sure that the same message is not being sent.
    if (msg && msg.id === lastId) {
        res.status(400).json({
            status: 400,
            message: 'You can not send the same message twice'
        });
        return;
    }

    // Cache the id for the next message
    lastId = msg.id;

    // Clean up input in case of multiple spaces between words to get correct count
    const trimMessage = msg && msg.message && msg.message.replace(/ +(?= )/g, '').trim();
    totalCount = trimMessage.split(' ').length + totalCount;

    if (msg.message.length) {
        res.status(200).json({ count: totalCount });
    } else {
        res.statusCode = 400;
        res.send = 'Something happened......not totally sure what. Find admin.';
    }
});
