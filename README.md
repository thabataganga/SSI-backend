# idook-backend

Repository for the IDOOK Backend

## Project Stack

- Database: MongoDB
- Backend: Node
- REST API: Mongoose
- Front-end: REACT JS
- Receives a JSON from Users
- Sensitive data is not stored in the Database
- Documentation: [POSTMAN](https://documenter.getpostman.com/view/15333139/UyxgK8AH)

### Technical Requirements

- mongodb
- node
- npm

## Instructions to Run the Project

1. `git pull` -> to update the project
2. `npm install` -> to install dependencies

### Developer

| Resource                                      | URL                                                                                                        | Description             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------- |
| [Base URL](https://idook-test.herokuapp.com/) | https://idook-test.herokuapp.com/                                                                          | Base URL of the project |
| MongoDB                                       | mongodb+srv://apimusica:MzeWdJERQi1P6K3A@cluster0.mt9gn.mongodb.net/idook-test?retryWrites=true&w=majority | Project database        |
| [SwaggerUI](http://localhost:8080/api-docs)   | http://localhost:8080/api-docs                                                                             | Project documentation   |

3. `npm run dev` -> runs the project in dev mode - with access to external resources

### Local

| Resource                                    | URL                                   | Description             |
| ------------------------------------------- | ------------------------------------- | ----------------------- |
| [Base URL](http://localhost:8080/)          | http://localhost:8080/                | Base URL of the project |
| MongoDB                                     | mongodb://localhost:27017/idook-local | Project database        |
| [SwaggerUI](http://localhost:8080/api-docs) | http://localhost:8080/api-docs        | Project documentation   |

3. `npm run local` -> recommended for coding - without access to external resources

### Developer - Scripts

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `npm run rsa:gerador` | to generate a new RSA pair of private and public keys |
| `npm run doc`         | to update the documentation in swagger                |

## Documentation by Context

| URL                                  | Description              |
| ------------------------------------ | ------------------------ |
| [Invitation](./tech-docs/CONVITE.md) | Invitation documentation |

## FAQ

### To edit an institution, you need to be logged in as an institution

### To edit a user of an institution, you need to be logged in as an administrator or master in the institution and pass the user ID as per the Swagger

### To edit a user, you need to be logged in as a user or as an institution administrator

#### Standard Error Payload

```json
{
  "message": "Please check the data",
  "details": "Institutions validation failed: privacy.terms_of_use: Path `privacy.terms_of_use` is required., type: Path `type` is required., email: Path `email` is required., cnpj: Path `cnpj` is required., institution: Path `institution` is required.",
  "code": 400
}
```

#### Error Codes

- `status 400` \- user request error\, e\.g\.\, wrong ID
- `status 404` \- resource not found
- `status 500` \- server error
- `status 401` \- Unauthorized to access the resource\, e\.g\.\, normal user trying to access admin resource
- `status 403` \- Not Authenticated\, e\.g\.\, trying to access without a token\.

#### Docker Image:

```
docker build -t sindpd-backend .
docker run --name sindpd-backend sindpd-backend
```
