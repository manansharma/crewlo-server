var Jwt = require('jsonwebtoken');

var validateFunc = function (decoded, request, callback) {
    // Just because we're not storing the token in our db doesn't mean we couldn't also query the user based on the token's properties, to verify the User
    // this is likely overkill so I've decided to save ourselves a db query and instead just make sure that 'passNumber' checks out.

    // the thought process here is, we assign a number to the token, if someone guessed this number it would be extremely impressive.
    // changing the number would of course invalidate all tokens. The number is assigned below in userObj.
    if (decoded.passNumber === 1337) {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};

var jwtSign = function(user) {
    var userObj = {
        user_id: user.user_id,
        username: user.username,
        passNumber: 1337 // number is assigned here. TODO:PASS THIS IN AS process.env variable!!
    };
    var token = Jwt.sign(userObj, 'NeverShareYourSecret'); // TODO:PASS THIS IN AS process.env variable!!
    return token;
};
exports.validateFunc = validateFunc;
exports.jwtSign = jwtSign;
