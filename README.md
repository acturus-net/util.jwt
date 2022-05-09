# JWT Utilities

## Overview

A small set of utilities for generating JWT tokens for authentication.

### Prepare an Environment File

The token generation process consumes values configured in a `.env` file using the [dotenv-safe](https://github.com/rolodato/dotenv-safe) module.

See the `.env.example` file for the required variables.

### Generate a JWT Token

Uses ansible to manage access the private key (from HashiVault), and generates a token using the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) module.

```ansible-playbook generate.yaml```

NOTE:
 - The generated token will be printed by ansible to stdout.
 - Tokens are sensitive and should be handled like any other password or secret

## Prerequisites

The following steps were fillowed to prepare to generate tokens.

### Create an RSA Key Pair

```ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key -q -N ""```

### Convert Public Key to PEM Format

```openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub```

### Generate JWK from Public Key

```pem-jwk jwtRS256.key.pub > jwk.json```

### Create JWKs Containing the JWK

A `kid` is used to uniquely identify a specific key in an array of supported keys. This value will be used in the header of a JWK as part of the authentication proces.

Create a `jwks.json` file as follows.

```
{
  "keys": [
    {
      "kid": "intdev"
      // fields from generated JWK
    }
  ]
}
```
This JWKS file can be published to a public URL accessible by an API Gateway such as Citrix ADC.

## JWT Details

A JWT has 3 parts in the format of `xxxxx.yyyyy.zzzzz`.

First, the header:

* `typ`: "JWT" "(optional)
* `kty`: "RSA" (optional)
* `alg`: "RSA256"
* `kid`: "uid for key in keyset"

Second, the payload:

* `iss`: The principal that issued this JWT
* `sub`: The principal that is the subject of the JWT
* `aud`: The recipients that the JWT is intended for
* `iat`: The time at which the JWT was issued
* `exp`: The time on/after which the JWT MUST NOT be accepted (unix epoc in seconds)

... other public claims

* `name`: Descriptive name of the subject in `sub`

Third, the signature:

* NOTE: this is managed by the key generation process

For more details, see:

* [JWT.io Introduction](https://jwt.io/introduction)
* [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)
