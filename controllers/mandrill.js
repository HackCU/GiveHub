var email = function(req, res){
    var toEmail = "canadianidiot27@gmail.com";
    var toName = "Brian Newsom";


    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill('hquHAd89JAE4rzHbtuMtxg');

    var html = "<h5> Please confirm your donation to _ on _</h5>" +
    "<p> Scan the QR code below to confirm. </p>" +
    "<br/> <br/> " +
    "<p> Thanks for using _. </p>"

    var message = {
        "html": html,
        "subject": "Confirm your donation on _",
        "from_email": "brian.newsom@colorado.edu",
        "from_name": "Brian Newsom",
        "to": [{
                "email": toEmail,
                "name": toName,
                "type": "to"
            }]
    };
    var async = false;
    var ip_pool = "Main Pool";

    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        console.log(result);
        /*
        [{
                "email": "recipient.email@example.com",
                "status": "sent",
                "reject_reason": "hard-bounce",
                "_id": "abc123abc123abc123abc123abc123"
            }]
        */
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}

module.exports = email;
