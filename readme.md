# trafie
---

## API

### 1) Errors

#### a) 400 Bad Request

Returned when the request was malformed (invalid format of the request or invalid type of the values).

Example:

```javascript
{
    "message": "Problems parsing JSON"
}
```

#### b) 404 Resource not found

Returned when the request is understood but the requested resource was not found.

Example:

```javascript
{
	"message": "Resource not found",
	"errors": [
		{
			"resource": "profile",
			"code": "not_found"
		}
	]
}
```

#### c) 422 Unprocessable Entity

Returned when the request is understood but the data entered are not accepted by the server (for example due to invalid characters in the username).

Example:

```javascript
{
	"message": "Validation Failed",
	"errors": [
		{
			"resource": "profile",
			"field": "username",
			"code": "already_exists"
		}
	]
}
```
The possible error codes are:

* missing: This means a resource does not exist.
* missing_field: This means a required field on a resource has not been set.
* invalid: This means the formatting of a field is invalid. The documentation for that resource should be able to give you more specific information.
* already_exists: This means another resource has the same value as this field. This can happen in resources that must have some unique key (such as Label names).
* already_processed: This means that the value has changed previously and can not be changed again (e.g. account validation)

#### d) 500 Server Error

Returned when there was an error in the server.

Example:

```javascript
{
    "message": "Server error"
}
```