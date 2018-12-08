import request from "request-promise-native";

const AUTHY_API_KEY = process.env.AUTHY_API_KEY;

exports.handler = function(event, context, callback) {
  const requestBody = JSON.parse(event.body);
  const countryCode = requestBody.countryCode;
  const phoneNumber = requestBody.phoneNumber;

  request({
    method: "POST",
    uri: "https://api.authy.com/protected/json/phones/verification/start",
    headers: {
      "X-Authy-API-Key": AUTHY_API_KEY
    },
    body: {
      country_code: countryCode,
      phone_number: phoneNumber,
      via: "sms"
    },
    json: true
  })
    .then(() => {
      console.log("Verification Pending:", countryCode, phoneNumber);

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      });
    })
    .catch((error) => {
      console.log("Error:", error);

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ok: false })
      });
    });
};
