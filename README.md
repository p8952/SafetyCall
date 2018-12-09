# SafetyCall

## Development

### Lambda Emulator

Command: `npm run lambda`

URL: `http://localhost:9000/`

### React Styleguidist

Command: `npm run components`

URL: `http://localhost:6060/`

### Webpack Dev Server

Command: `npm run webpack`

URL: `http://localhost:8080/`

## API

### Verify Number

```
$ curl -X POST -H 'Content-Type: application/json' http://localhost:9000/verifyNumber -d '{"countryCode":"44","phoneNumber":"7123456789"}'

{"ok":true}
```

### Generate Token

```
$ curl -X POST -H 'Content-Type: application/json' http://localhost:9000/generateToken -d '{"countryCode":"44","phoneNumber":"7123456789","verificationCode":"1234"}'

{"ok":true,"sessionToken":"12345.abcde.12345"}
```

### List Calls

```
$ curl -X POST -H 'Content-Type: application/json' http://localhost:9000/listCalls -d '{"sessionToken": "12345.abcde.12345"}'

{"ok":true,"calls":[{"sid":"CA12345","startTime":"2018-01-91T00:00:00.000Z","recordingUrl":"https://api.twilio.com/.../RE12345"}]}
```
