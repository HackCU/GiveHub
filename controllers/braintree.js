var brain = function(req, res) {
  var braintree = require( 'braintree' );

  var gateway = braintree.connect( {
    environment: braintree.Environment.Sandbox,
    merchantId: "jqr8pbyt7prbsfhp",
    publicKey: "3hsvxq4d4mxvwppc",
    privateKey: "de2913aa208fa2e8e410d91587d36d42"
  } );

  gateway.clientToken.generate( {
    customerId: aCustomerId
  }, function( err, response ) {
    var clientToken = response.clientToken
  } );

  app.post( "/purchases", function( req, res ) {
    var nonce = req.body.payment_method_nonce;
    // Use payment method nonce here
  } );
  //
  //gateway.transaction.sale({
  //  amount: '10.00',
  //  paymentMethodNonce: 'nonce-from-the-client',
  //}, function (err, result) {
  //});
}

module.exports = brain;