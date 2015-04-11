var _ = require('lodash');

var bitcoin = {
    sendTxn: function(req, res){
        var from = req.params.from;
        var to = req.params.to;

        var users = require('../data/users.json');
        var orgs = require('../data/orgs.json');

        var matchingUser = _.where(users, {'email': from});
        if(!matchingUser){
            res.send({'error':'No matching user'})
        }

        var matchingOrg = _.where(orgs, {'email': to});
        if(!matchingOrg){
            res.send({'error':'No matching org'})
        }


        res.send("success");


        function sendTransaction(sender_privateKey, sender_publicKey, receiver_publicKey, amount, callback) {
    chain.getAddressUnspents(sender_publicKey, function(err, resp) {
        if(err != null) callback(err, null)
        var key = new bitcoin.ECKey.fromWIF(sender_privateKey);
        var txn = new bitcoin.Transaction();
        var totalInputAmount = 0;
        var indexMax = 0;
        for(var i = 0; i < resp.length; i++)
        {
            indexMax++;
            totalInputAmount += resp[i].value;
            console.log(i + ": " + resp[i].value);
            txn.addInput(resp[i].transaction_hash, resp[i].output_index);
            if((totalInputAmount - transactionFee) >= amount)
                break;
        }
        if((totalInputAmount - transactionFee) < amount)
            callback({message: "Insufficient funds!"}, null);
        var returnAmount = totalInputAmount - amount;
        console.log("totalInputAmount: "+ totalInputAmount)
        console.log("returnAmount: "+ returnAmount)
        txn.addOutput(receiver_publicKey, totalInputAmount-returnAmount);
        txn.addOutput(sender_publicKey, returnAmount);
        for(var i = 0; i < indexMax; i++)
        {
            console.log(i);
            txn.sign(i, key);
        }
        chain.sendTransaction(txn.toHex(), function(err, resp) {
          console.log('Error: ' + err);
          console.log('Resp: ' + JSON.stringify(resp));
          callback(null, resp);
        });
    })

    }



}

module.exports = bitcoin;
