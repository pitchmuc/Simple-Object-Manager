# Simple Object Manager Methods

This page will present you with the method available from the Simple Object Manager.\
Overall, all of the methods provided are wrapper around existing methods or helper functions that handle wished behavior.

Once the 0.1.0 release version is live, the methods described here will be maintained and any new version of the library will contain backward compatibility change.

## Instantiation

The library is referencing a class that can be instanciated multiple time per page.\
Each of the instance will possess their own attributes, and the instances can be merged.\
Ideally an existing XDM Object Manager object can be used as reference of the instanciation.

You can also pass directly the tenant reference in the schema directly during instanciation.

Such as:

```JS
som1 = new Som()
som2 = new Som(tenant="_tenant") /*will generate {"_tenant" : {}} from the start*/

som3 = new Som(som1) /* Using the som1 as template - som1 could contains some attributes*/
som4 = new Som([som1,som2]) /* merging different object together - following the order of the arguments */
```


## Methods

Here are reference of the different possible methods that can be considered usefull for the management of an XDM reference.

### Assigning value(s)

You can assign value to the som object by using the `assign` method.\
The method takes 2 arguments:
* path of the field
* value of the field

such as:
```JS
    som.assign('_tenant.firstname','julien')
    /*
    This will result in adding this element:
    {
        "_tenant":{
            "firstname" : "julien"
        }
    }
    
    */
```

You can also directly pass object in the value such as:
```JS
    som.assign('_tenant',{'firstname':'julien'})
    /*
    This will result in adding this element:
    {
        "_tenant":{
            "firstname" : "julien"
        }
    }
    
    */
```

or array:
```JS
    som.assign('_tenant',[{'firstname':'julien'},{'firstname':'jennifer'}])
    /*
    This will result in adding this element:
    {
        "_tenant":[
            {
            "firstname" : "julien"
            },
            {
            "firstname" : "julien"
            }
        ]
    }
    */
```

The `som` object accepts the dot notation for path, even for arrays.
In case, you want to assign only a specific key value to an array. You can directly do so:
```JS
    som.assign('_tenant.myArray.1.firstname','julien')
    /*
    This will result in adding this element:
    {
        "_tenant":{
            [
                {"firstname" : "julien"},
            ]
        }    
    }
    */
```
As you may have understood, if the element of the array is not present, the `som` automatically push the element to a new element of your array.

In case, you do not assign any value, the `som` will create an empty object instead.
```JS
    som.assign('_tenant.myArray.1.firstname',)
    /*
    This will result in adding this element:
    {
        "_tenant":{
            [
                {},
            ]
        }    
    }
    */
```


### Merging object

You can merge an existing object with the data contain in your `som` object.\
The method uses the the `Object.assign` method from JavaScript.
In order to do that, you can call the `merge` function that will apply the merge at the level pass through the additional `path` parameter.\
Example:

```JS
var myObject = {"foo":"bar","foo":"baz"}
som.data // returns
/* 
* {
*   "test" : "value"
* }
*/ 

som.merge(object=myObject) 
// returns
{
    "foo":"bar",
    "foo":"baz",
    "test":"value"
}

```

Another example:

```JS
var myObject = {"foo":"bar","foo":"baz"}
som.data // returns
/* 
* {
   "test" : {
       "a":"b"
    }
 }
*/ 

som.merge(object=myObject,'test') 
// returns
{
    "test":{
        "a":"b",
        "foo":"bar",
        "foo":"baz",
    }
}

```

For array manipulation, in case you are passing an array to an array structure. The behavior is to push each element of the array to the current array.\
Example:
```JS
som.data // returns
/*
{
    family_members : [
        {"firstname":"julien"}
        ]
}
*/
var newMembers = [{"firstname":"jennifer"},{"firstname":"gabriella"}] 

som.merge(newMembers,'family_members')
// will result in 
{
    family_members : [
        {"firstname":"julien"},
        {"firstname":"jennifer"},
        {"firstname":"gabriella"}
        ]
}

```

### Accessing data

Data can be access directly by the call of the `som` instance or by the `get` method.\
Such as:
```JS
    som()
    /*
    This will returned
    {
        "_tenant":[
            {
            "firstname" : "julien"
            }
        ]
    } 
    */
   //*********       OR           *****************// 
   som.get()
    /*
    This will returned
    {
        "_tenant":{
            "firstname" : "julien"
            }
    } 
    */
```

It would be possible to access a specific field of the object via the `get` method with dot notation.

```JS
    som.get('_tenant.firstname')
    /*
    This will return 'julien'
    */
```

in case you have an array and wants to look at a specific element of that array, you can use integer in the path.

```JS
    /* for som.data that returns
    {
        "family_members":[{
            "firstname" : "julien"
            },
            {"firstname" : "jennifer"}
            ]
    } 
    
    */

    som.get('family_member.0.firstname')
    /*
    This will return 'julien'
    */
```




### Handling path error

The `som` instance should be robust enough so it doesn't break when a wrong path is used.\
If a wrong path is used, the `get` method will return undefined\
If a wrong path is used, the `assign` method will create the new path for the element proposed.

### Removing fields

The same way that for assigning value, you can delete a specific reference by specifying the path.\
Such as:
```JS
    som.remove('_tenant.firstname')
    /*
    This will return the field from the object, so new XDM object is:
        {
            "_tenant" : {}
        }
    */
```


## Launch extension compatible

The library should be easily loadable in a Launch extension. It means being written in ES5. :(

Ideally, the instanciation of a XDM Object Manager can be done via Data Element setup, such as: 
```JS
som1 = _satellite.getVar('DataElementsomReference')
```