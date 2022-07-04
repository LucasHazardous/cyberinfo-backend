module.exports = {
    sendErrorStatusCode(err, res) {
        console.log(err);
        if (err == "Authorization failed") res.sendStatus(401);
        else res.sendStatus(500);
    }
}
