// Require statements.
const aws = require("aws-sdk");
let stepfunctions;
let params;
let body;

let sfMachineArn;
let sfActivityArn;
      
// Lambda handler.
exports.handler = (event, context, callback) => {
  try {
    if (event.requestContext.stage === 'prod') {
      sfMachineArn =  ''; //event.stageVariables.sfMachineArn
      sfActivityArn = ''; //event.stageVariables.sfActivityArn
    } else if (event.requestContext.stage === 'test') {
      sfMachineArn = 'REDACTED'; //event.stageVariables.sfMachineArn
      sfActivityArn = 'READACTED'; //event.stageVariables.sfActivityArn
    } else {
      // This is useful for testing from Web Console where tests run witout stage.
      sfMachineArn = 'REDACTED'; //event.stageVariables.sfMachineArn
      sfActivityArn = 'REDACTED'; //event.stageVariables.sfActivityArn
    }
    //
    switch (event.path) {
      case '/start':
        try{
          // Create a Step Functions object.
          stepfunctions = new aws.StepFunctions();
          // Set parameters based on environment and event data.
          params = {
            stateMachineArn: sfMachineArn,
            //input: "string", // Input must be stringified!
            //name: "string",
          };
          // Start Step Functions execution.
          stepfunctions.startExecution(params, function (err, data) {
            if (err) {
              let res = {
                statusCode: 590,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({result: 'startExecutionError', error: err, event: event}),
                isBase64Encoded: false,
              };
              callback(null, res);
              return;
            }
            else {
              let res = {
                statusCode: 200,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({executionArn: data.executionArn, activityArn: sfActivityArn}), //  executionStartDate: data.startDate,
                isBase64Encoded: false,
              };
              callback(null, res);
              return;
            }
          });
        }
        catch (error) {
          let res = {
            statusCode: 590,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({result: 'Start error.', error: error, event: event}),
            isBase64Encoded: false,
          };
          callback(null, res);
          return;
        }
        break;
      case '/complete':
        try{
          // Create a Step Functions object.
          stepfunctions = new aws.StepFunctions();
          // Decode body.
          body = JSON.parse(event.body);
          // Set parameters based on environment and event data.
          params = {
            activityArn: body.activityArn,
          };
          // Handle activity task.
          stepfunctions.getActivityTask(params, function (err, data) {
            if (err) {
              let res = {
                statusCode: 590,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({result: 'getActivityTaskError', error: err, event: event}, null, '  '),
                isBase64Encoded: false,
              };
              callback(null, res);
              return;
            }
            else {
              let paramsSuccessApproved = {
                taskToken: data.taskToken,
                output: JSON.stringify({message: 'Request approved.'}),
              };
              let paramsSuccessDenied = {
                taskToken: data.taskToken,
                output: JSON.stringify({message: 'Request denied.'}),
              };
              let paramsFailure = {
                taskToken: data.taskToken,
                cause: 'Task failure.',
              };
              if ( body.approved === true ) {
                stepfunctions.sendTaskSuccess(paramsSuccessApproved, function(err, data){
                  if (err) {
                    let res = {
                      statusCode: 590,
                      headers: {'Access-Control-Allow-Origin': '*'},
                      body: JSON.stringify({result: 'sendTaskSuccessError', error: err, event: event}, null, '  '),
                      isBase64Encoded: false,
                    };
                    callback(null, res);
                    return;
                  } else {
                    let res = {
                      statusCode: 200,
                      //statusCode: 204, // 204: No Content.
                      headers: {'Access-Control-Allow-Origin': '*'},
                      //body: JSON.stringify({result: 'action - approve', event: event,parsedBody: body}, null, '  '),
                      body: JSON.stringify({}),
                      isBase64Encoded: false,
                    };
                    callback(null, res);
                    return;
                  }
                });
              } else {
                stepfunctions.sendTaskSuccess(paramsSuccessDenied, function(err, data){
                  if (err) {
                    let res = {
                      statusCode: 590,
                      headers: {'Access-Control-Allow-Origin': '*'},
                      body: JSON.stringify({result: 'sendTaskSuccessError', error: err, event: event}, null, '  '),
                      isBase64Encoded: false,
                    };
                    callback(null, res);
                    return;
                  } else {
                    let res = {
                      statusCode: 200,
                      //statusCode: 204, // 204: No Content.
                      headers: {'Access-Control-Allow-Origin': '*'},
                      //body: JSON.stringify({result: 'action - approve', event: event, parsedBody: body}, null, '  '),
                      body: JSON.stringify({}),
                      isBase64Encoded: false,
                    };
                    callback(null, res);
                    return;
                  }
                });
                //stepfunctions.sendTaskFailure(paramsFailure, function(err, data){
                //  if (err) {
                //    let res = {
                //      statusCode: 590,
                //      headers: {'Access-Control-Allow-Origin': '*'},
                //      body: JSON.stringify({result: 'sendTaskFailureError', error: err, event: event}, null, '  '),
                //      isBase64Encoded: false,
                //    };
                //    callback(null, res);
                //    return;
                //  } else {
                //    let res = {
                //      statusCode: 200,
                //      headers: {'Access-Control-Allow-Origin': '*'},
                //      body: JSON.stringify({result: 'action - deny', event: event, parsedBody: body}, null, '  '),
                //      isBase64Encoded: false,
                //    };
                //    callback(null, res);
                //    return;
                //  }
                //});
              }
            }
          });
        }
        catch (error) {
          let res = {
            statusCode: 590,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({result: 'Complete error.', error: error, event: event}),
            isBase64Encoded: false,
          };
          callback(null, res);
          return;
        }
        break;
      case '/check':
        try {
          // Create a Step Functions object.
          stepfunctions = new aws.StepFunctions();
          // Decode body.
          body = JSON.parse(event.body);
          // Set parameters based on environment and event data.
          params = {
            executionArn: body.executionArn,
          };
          // Return status.
          stepfunctions.describeExecution(params, function (err, data) {
            if (err) {
              let res = {
                statusCode: 590,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({result: 'describeExecutionError', error: err, event: event}),
                isBase64Encoded: false,
              };
              callback(null, res);
              return;
            }
            else {
              let res = {
                statusCode: 200,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({status: data.status, output: data.output}),
                isBase64Encoded: false,
              };
              callback(null, res);
              return;
            }
          });
        }
        catch (error) {
          let res = {
            statusCode: 590,
            headers: {'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({result: 'Check error.', error: error, event: event}),
            isBase64Encoded: false,
          };
          callback(null, res);
          return;
        }
        break;
      default:
        let res = {
          statusCode: 590,
          headers: {'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({result: 'No method match.', event: event}),
          isBase64Encoded: false,
        };
        callback(null, res);
        return;
    }
  }
  catch (error) {
    let res = {
      statusCode: 590,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({result: 'Error in main try block.', error: error, event: event}),
      isBase64Encoded: false,
    };
    callback(null, res);
    return;
  }
};

