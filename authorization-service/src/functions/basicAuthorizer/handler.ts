import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

enum EFFECTS {
  ALLOW = "Allow",
  DENY = "Deny",
}

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const { authorizationToken, methodArn } = event;

  if (event.type !== "TOKEN") {
    return generatePolicy(authorizationToken, methodArn, EFFECTS.DENY);
  }

  try {
    const userCreds = getUserCredentialsFromToken(authorizationToken);
    const password = process.env[userCreds.username];
    const effect =
      password && password === userCreds.password
        ? EFFECTS.ALLOW
        : EFFECTS.DENY;

    return generatePolicy(authorizationToken, methodArn, effect);
  } catch (error) {
    return generatePolicy(authorizationToken, methodArn, EFFECTS.DENY);
  }
};

function getUserCredentialsFromToken(authorizationToken: string) {
  const token = authorizationToken.split(" ")[1];
  const [username, password] = Buffer.from(token, "base64")
    .toString("utf-8")
    .split(":");

  return {
    username,
    password,
  };
}

function generatePolicy(
  principalId,
  resource,
  effect = EFFECTS.ALLOW
): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export const main = basicAuthorizer;
