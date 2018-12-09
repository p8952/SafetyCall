import jwt from "jsonwebtoken";
import twilio from "twilio";

const JWT_SECRET = process.env.JWT_SECRET;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function getRecordingUrl(callSid) {
  return new Promise((resolve, reject) => {
    let recordingUrl;

    twilioClient.recordings.each(
      {
        callSid: callSid,
        limit: 1,
        done: (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(recordingUrl);
          }
        }
      },
      (recording) => {
        recordingUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Recordings/${
          recording.sid
        }`;
      }
    );
  });
}

function getCalls(phoneNumber) {
  return new Promise((resolve, reject) => {
    let calls = [];

    twilioClient.calls.each(
      {
        status: "completed",
        to: "441273036065",
        from: phoneNumber,
        limit: 5,
        done: (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(calls);
          }
        }
      },
      (call) => {
        calls.push({ sid: call.sid, startTime: call.startTime });
      }
    );
  });
}

exports.handler = function(event, context, callback) {
  const requestBody = JSON.parse(event.body);
  const sessionToken = requestBody.sessionToken;

  jwt.verify(sessionToken, JWT_SECRET, (error, sessionToken) => {
    if (error) {
      console.log("Error:", error);

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ok: false })
      });
    } else {
      let calls;

      getCalls(`${sessionToken.countryCode}${sessionToken.phoneNumber}`)
        .then((_calls) => {
          calls = _calls;

          return Promise.all(
            calls.map((call) => {
              return getRecordingUrl(call.sid);
            })
          );
        })
        .then((recordingUrls) => {
          calls.forEach((call, index) => {
            call.recordingUrl = recordingUrls[index];
          });

          callback(null, {
            statusCode: 200,
            body: JSON.stringify({ ok: true, calls: calls })
          });
        })
        .catch((error) => {
          console.log("Error: ", error);

          callback(null, {
            statusCode: 200,
            body: JSON.stringify({ ok: false })
          });
        });
    }
  });
};
