# Global





* * *

## Class: Connection



## Class: Connection


**cur_headers**:  , Copy defult headers
**cookie**:  , Get cookie of current request
**config**:  , Config getter
### Connection.send(sel, sel.status, sel.headers, data) 

Send data as respones

**Parameters**

**sel**: `String | Object`, Type of data or headers to set.

**sel.status**: `Number`, HTTP code

**sel.headers**: `Object`, Headers of response

**data**: `String | Object`, Data to send

**Returns**: `Connection`, Return self

### Connection.jump() 

Assign to `redirect`


### Connection.redirect(loc) 

Send response to redirect

**Parameters**

**loc**: `String`, Location to redirect

**Returns**: `Connection`, Return self

### Connection.error(str, code) 

Send a res as error

**Parameters**

**str**: `String`, String descripting error

**code**: `Number`, Http code of the error

**Returns**: `Connection`, Return self

### Connection.setCookie(cookie_data) 

Set cookies

**Parameters**

**cookie_data**: `Object`, data of cookies

**Returns**: `Connection`, Return self

### Connection.getBody(max_size) 

Get request body

**Parameters**

**max_size**: `Number`, The max size of data.Kill connection if overflow.

**Returns**: `Promise`, Promise of http body's data



* * *










