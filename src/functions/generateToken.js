import request from "request-promise-native";
import jwt from "jsonwebtoken";

const AUTHY_API_KEY = process.env.AUTHY_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = function(event, context, callback) {
  const requestBody = JSON.parse(event.body);
  const countryCode = requestBody.countryCode;
  const phoneNumber = requestBody.phoneNumber;
  const verificationCode = requestBody.verificationCode;

  request({
    method: "GET",
    uri: "https://api.authy.com/protected/json/phones/verification/check",
    headers: {
      "X-Authy-API-Key": AUTHY_API_KEY
    },
    qs: {
      country_code: countryCode,
      phone_number: phoneNumber,
      verification_code: verificationCode
    },
    json: true
  })
    .then(() => {
      console.log("Verification Complete:", countryCode, phoneNumber);

      const sessionToken = jwt.sign(
        { countryCode: countryCode, phoneNumber: phoneNumber },
        JWT_SECRET,
        { expiresIn: "30d" }
      );

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ok: true, sessionToken: sessionToken })
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
