

// Helper functions.

function postWithFetch(url = '', key='', data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "x-api-key": key,
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

function getWithFetch(url = '', key='') {
  // Default options are marked with *
    return fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "x-api-key": key,
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
    .then(response => response.json()); // parses response to JSON
}



// Test workflow. Run each function call one at a time to give the previous one time to complete.
let apiURL = 'REDACTED'
let apiKey = 'REDACTED'
let myExecutionArn;
let myActivityArn;
let isApproved = true;

getWithFetch(`${apiURL}/start`, apiKey)
  .then(function(data) {
    myExecutionArn = data.executionArn;
    myActivityArn = data.activityArn;
    console.log(data)
  })
  .catch(error => console.error(error));

postWithFetch(`${apiURL}/complete`, apiKey, {approved: isApproved, executionArn: myExecutionArn, activityArn: myActivityArn } )
  .then(data => console.log(data))
  .catch(error => console.error(error));

postWithFetch(`${apiURL}/check`, apiKey, {executionArn: myExecutionArn})
  .then(data => console.log(data))
  .catch(error => console.error(error));


