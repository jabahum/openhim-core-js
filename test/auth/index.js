// openhim-api.js

const crypto = require('crypto')
const request = require('request')

// authenticate the username is valid
const authenticate = async () => {
    return new Promise((resolve, reject) => {
        // authenticate the username
        let reqOptions = {
            url: "https:localhost:8081/authenticate/root@openhim.org",
            rejectUnauthorized: false
        }

        request.get(reqOptions, (err, resp, body) => {
            if (err) {
                return reject(err)
            }
            // if user isn't found
            if (resp.statusCode !== 200) {
                return reject(new Error(`User root@openhim not found when authenticating with core API`))
            }
            try {
                body = JSON.parse(body)
                console.log("Body", body)
                resolve(body)
            } catch (err) {
                console.log("Error", err)
                reject(err)
            }
        })
    })
}

// Generate the relevant auth headers
const genAuthHeaders = async () => {
    const authDetails = await authenticate()

    const salt = authDetails.salt
    const now = new Date()

    // create passhash
    let shasum = crypto.createHash('sha512')
    shasum.update(salt + "password")
    const passhash = shasum.digest('hex')

    // create token
    shasum = crypto.createHash('sha512')
    shasum.update(passhash + salt + now)
    const token = shasum.digest('hex')

    // define request headers with auth credentials

    let object = {
        'auth-username': "root@openhim.org",
        'auth-ts': now,
        'auth-salt': salt,
        'auth-token': token
    }


    console.log("request headers", JSON.stringify(object, null, 2))

    return object
}