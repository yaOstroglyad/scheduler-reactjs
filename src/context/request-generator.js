// TODO finish requestGenerator
function requestGenerator(protocol="http", url="localhost") {
    return function (requestBody, method, apiName, token) {
        return (`${protocol}://${url}/${apiName}`, {
            method: `${method}`,
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": "application/json"
            }
        })
    }
}


