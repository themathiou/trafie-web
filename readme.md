# trafie API
#### API Documentation

## Authenticate
---
##### 1. Authorize
**URL**
  `/authorize`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**

    **Required:**
   `username=[String]`
   
    **Required:**
   `password=[String]`
   
    **Required:**
   `grant_type=[String]` "password"
    
    **Required:**
   `client_id=[String]` "iphone" or "android"
   
   **Required:**
   `client_secret="secret"` 

* **Sample Calls:**

  ```javascript
    url: /authorize
    data: {
      "username": "mathiou@icloud.com",
      "password": "123123",
      "grant_type": "password",
      "client_id": "iPhone",
      "client_secret": "secret"
    }
  ```
##### 2. Authorize with refresh token
**URL**
  `/authorize`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**

    **Required:**
   `refresh_token=[String]`
   
    **Required:**
   `grant_type=[String]` "refresh_token"
    
    **Required:**
   `client_id=[String]` "iphone" or "android"
   
   **Required:**
   `client_secret="secret"` 

* **Sample Calls:**

  ```javascript
    url: /authorize
    data: {
      "refresh_token": "1b88ee37911b8555758c8cdf677b9f59886ee5c647473f58042abf6b1aa198a6ea8115693b841b3ce92d80ff1f7f16f69ce31cbc6d9ce7373f1b8542ceb8e9b3",
      "grant_type": "refresh_token",
      "client_id": "iPhone",
      "client_secret": "secret"
    }
  ```

## Register
---
**URL**
  `/register`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**

    **Required:**
   `firstName=[String]`
   
    **Required:**
   `lastName=[String]`
    
    **Required:**
   `email=[String]`
   
   **Required:**
   `password=[String]` 

* **Sample Calls:**

  ```javascript
    url: /authorize
    data: {
      "firstName": "Theodore",
      "lastName": "Mathioudakis",
      "email": "mathiou@icloud.com",
      "password": "123123"
    }
  ```

## Reset Password Request
---
**URL**
  `/reset-password-request`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**

    **Required:**
   `email=[String]`

* **Sample Calls:**

  ```javascript
    url: /reset-password-request
    data: {
      "email": "some@one.com",
    }
  ```
## Logout
---
**URL**
  `/logout`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**
    None

* **Sample Calls:**

  ```javascript
    url: /logout
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
  ```

## User Profile Data
---
##### 1. Returns the user by id OR returns users based on search critiria. Only public users will be returned unless a logged in user tries to access themselves.
  
**URL**
  `/api/users/:userId?`

* **Method:**
  `GET`
  
* **URL Params**

   **Optional:**
   `userId=[String]`

* **Data Params**

    **Optional:**
   `firstName=[String]`
   
    **Optional:**
   `lastName=[String]`
   
    **Optional:**
   `country=[String]`
    
    **Optional:**
   `keywords=[String]`

* **Sample Calls:**

  ```javascript
    url: /api/users/
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
    data: {
      "firstName": "george",
      "country": "en"
    }
  ```
  ```
    url: /api/users/5745d1d482d4602947b66478
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
  ```
  
* **Success Response:**

  * **Code:** `200`
  * **Content:** 
  ```javascript
    {
        "_id" = 5733764a0a0b600300659b7c;
        "about" = "";
        "birthday" = "1985-05-23";
        "country" = "gr";
        "dateFormat" = "D-M-YYYY";
        "discipline" = "high_jump";
        "email" = "sam@one.com";
        "firstName" = John;
        "isMale" = 1;
        "isPrivate" = 1;
        "isVerified" = 1;
        "language" = en;
        "lastName" = Doe;
        "picture" = "TODO";
        "units" =     {
            distance = meters;
        };
        "username" = "";
        "usernameChangesCount" = 0;
    }
    ```
 
##### 2. Update logged in user profile data.

**URL**
  `/api/users/:userId?`

* **Method:**
  `POST`
  
* **URL Params**

   **Required:**
   `userId=[String]`

* **Data Params**
    **Optional:**
   `isMale=[Boolean]`
   
    **Optional:**
   `country=[language-iso-code]`
   
    **Optional:**
   `discipline=[String]` value from disciplinesArray*
    
    **Optional:**
   `lastName=[String]`

    **Optional:**
   `firstName=[String]`
 
    **Optional:**
   `birthday=[String]`
        
    **Optional:**
   `units=[String]`
   
    **Optional:**
    `username=[String]`
    
    **Optional:**
    `about=[String]`

* **Sample Call:**

  ```javascript
    url: /api/users/5745d1d482d4602947b66478
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
    data: {
        "isMale": 0, 
            "country": en, 
        "discipline": triple_jump, 
        "lastName": Does, 
        "birthday": 1985-05-22, 
        "isPrivate": 1,
        "about" = "Some text about the user";
        "firstName": Johnny,
        "username": johnny.does
                "units": {
                        distance = feet;
                }
    }
  ```
  
* **Success Response:**

  * **Code:** `200`
  * **Content:** 
  ```javascript
    {
        "_id" = 5745d1d482d4602947b66478;
        "about" = "";
        "birthday" = "1985-05-22";
        "country" = gr;
        "dateFormat" = "D-M-YYYY";
        "discipline" = "high_jump";
        "email" = "sam@one.com";
        "firstName" = John;
        "isMale" = 1;
        "isPrivate" = 1;
        "isVerified" = 1;
        "language" = en;
        "lastName" = Doe;
        "picture" = "/images/ui/profile_pic.svg";
        "units" =     {
            distance = meters;
        };
        "username" = "";
        "usernameChangesCount" = 0;
    }
    ```

##### 3. Change User Password
**URL**
  `api/users/:userId`

* **Method:**
  `POST`
  
* **URL Params**
    None

* **Data Params**
    **Required:**
   `oldPassword=[String]`
   
    **Required:**
   `password=[String]`

* **Sample Calls:**

  ```javascript
    url: api/users/5733764a0a0b600300659b7c/
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
    {
        "oldPassword" = "123123",
        "password" = "12341234"
    }
  ```
  
##### 4. Resend Email Verification
**URL**
  `/api/resend-verification-email`

* **Method:**
  `GET`
  
* **URL Params**
    None

* **Data Params**
    None
* **Sample Calls:**

  ```javascript
    url: /api/resend-verification-email
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
  ```
  
## Activity Data
---
##### 1. Returns the activity based on activityId.
**URL**
  `/api/users/:userId/activities/:activityId`

* **Method:**
  `GET`
  
* **URL Params**

   **Required:**
   `userId=[String]`

   **Required:**
   `activity=[String]`

* **Data Params**

    None

* **Sample Calls:**

  ```javascript
    url: /api/users/5733764a0a0b600300659b7c/activities/574b0f7fff232a03001e43c6
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
  ```
  
* **Success Response:**

  * **Code:** `200`
  * **Content:** 
  ```javascript
    {
        "__v" = 0;
        "_id" = 574b0f7fff232a03001e43c6;
        "competition" = "Papaflessia 2016";
        "date" = 1464536946;
        "dateCreated" = "2016-05-29T15:49:19.567Z";
        "dateUpdated" = "2016-06-01T18:06:01.137Z";
        "discipline" = "high_jump";
        "isDeleted" = 0;
        "isOutdoor" = 1;
        "isPrivate" = 0;
        "location" = "";
        "notes" = "";
        "performance" = 213000;
        "rank" = "<null>";
        "type" = competition;
        "userId" = 5733764a0a0b600300659b7c;
    }
    ```
##### TODO: 2. Update an activity based on activityId
##### TODO: 3. Deletes an activity based on activityId
**URL**
  `/api/users/:userId/activities/:activityId`

* **Method:**
  `DELETE`
  
* **URL Params**
    None
* **Data Params**
    None

* **Sample Calls:**

  ```javascript
    url: /api/users/5733764a0a0b600300659b7c/activities/574b0f7fff232a03001e43c6
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
  ```
  
##### 4. Get all activities of user, based on userId.
**URL**
  `/api/users/:userId/activities/`

* **Method:**
  `GET`
  
* **URL Params**

   **Required:**
   `userId=[String]`

* **Data Params**

    **Optional:**
   `from=[Double]` unix timestamp
   
    **Optional:**
    `to=[Double]` unix timestamp
    
    **Optional:**
    `updatedFrom=[Double]` unix timestamp
    
    **Optional:**
    `updatedTo=[Double]` unix timestamp
    
    **Optional:**
    `discipline=[String]` value from disciplinesArray
    
    **Optional:**
    `isDeleted=[Boolean]`

* **Sample Calls:**

  ```javascript
    url: /api/users/5733764a0a0b600300659b7c/activities
    headers: {
      "Authorization": "Bearer theAccessTokenHere"
    }
    data: {
        "updatedFrom": 1464804913.0,
        "updatedTo": 1464804913.0
        }
  ```
  
* **Success Response:**

  * **Code:** `200`
  * **Content:** 
  ```javascript
    [{
        "_id" = 574b2651ff232a03001e43c7;
        "competition" = "National Indoor Junior Championships";
        "date" = 1464542787;
        "discipline" = "high_jump";
        "isDeleted" = 0;
        "isOutdoor" = 1;
        "isPrivate" = 0;
        "location" = "Athens, Greece";
        “notes” = “The battles that count aren`t the ones gold medals”;
        “performance” = 211455;
        “rank” = 5;
        “type” = competition;
        “userId” = 5733764a0a0b600300659b7c;
    }
    …
    ,{
        “_id” = 574b0f7fff232a03001e43c6;
        “competition” = “Papaflessia 2016”;
        “date” = 1464536946;
        “discipline” = “high_jump”;
        “isDeleted” = 0;
        “isOutdoor” = 1;
        “isPrivate” = 0;
        “location” = “”;
        “notes” = “”;
        “performance” = 213000;
        “rank” = “<null>”;
        “type” = competition;
        “userId” = 5733764a0a0b600300659b7c;
    }]
    ```





—
—

## Error Responses
#### a) 400 Bad Request
Returned when the request was malformed (invalid format of the request or invalid type of the values).
Example:

```javascript
{
    “message”: “Problems parsing JSON”
}
```

#### b) 404 Resource not found

Returned when the request is understood but the requested resource was not found.

Example:

```javascript
{
        “message”: “Resource not found”,
        “errors”: [
                {
                        “resource”: “profile”,
                        “code”: “not_found”
                }
        ]
}
```

#### c) 422 Unprocessable Entity

Returned when the request is understood but the data entered are not accepted by the server (for example due to invalid characters in the username).

Example:

```javascript
{
        “message”: “Invalid data”,
        “errors”: [
                {
                        “resource”: “profile”,
                        “field”: “username”,
                        “code”: “already_exists”
                }
        ]
}
```
The possible error codes are:

* missing: This means a required field on a resource has not been set.
* invalid: This means the formatting of a field is invalid. The documentation for that resource should be able to give you more specific information.
* already_exists: This means another resource has the same value as this field. This can happen in resources that must have some unique key (such as Label names).
* already_processed: This means that the value has changed previously and can not be changed again (e.g. account validation)

#### d) 500 Server Error

Returned when there was an error in the server.

Example:

```javascript
{
    “message”: “Server error”
}
```

## Requests



——
## Variables
* disciplinesArray: [“60m”, “100m”, “200m”, “400m”, “800m”, “1500m”, “3000m”, “5000m”, “10000m”, “60m_hurdles”, “100m_hurdles”, “110m_hurdles”, “400m_hurdles”, “3000m_steeplechase”, “4x100m_relay”, “4x400m_relay”, “half_marathon”, “marathon”, “20km_race_walk”, “50km_race_walk”, “cross_country_running”, “high_jump”, “long_jump”, “triple_jump”, “pole_vault”, “shot_put”, “discus”, “hammer”, “javelin”, “pentathlon”, “heptathlon”, “decathlon”]