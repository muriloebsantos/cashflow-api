var jwt = require('jwt-simple');

exports.handler =  function(event, context, callback) {
  var token = event.authorizationToken;

  if(!token) {
    callback("Unauthorized");
    return;
  }

  const key = "b7TxMbAWrGskAEHkjTuFFhs7KCQB5XvXCVX58q6vN8HQBMDZEfTs6KXG8snRKfUdDsC3QMqmdevFqZQMpW6TyGxpwxh7NYKfnSfLvBL54ZTgsRpeTjT2Kx5JYB3KCRaT";
  const decoded = jwt.decode(token, key, false, 'HS512');

  callback(null, generatePolicy('user', 'Allow', event.methodArn, decoded));
};

var generatePolicy = function(principalId, effect, resource, decoded) {
  var authResponse = {};
  
  authResponse.principalId = principalId;
  if (effect && resource) {
      var policyDocument = {};
      policyDocument.Version = '2012-10-17'; 
      policyDocument.Statement = [];
      var statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; 
      statementOne.Effect = effect;
      statementOne.Resource = "*";
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }
  
  authResponse.context = {
      "userId": decoded.userId
  };

  return authResponse;
}