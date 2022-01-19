# XDM Object Manager

The XDM Object Manager (`Xom`) is a project that tends to create a object that contains methods associated to it and that helps the management of the XDM representation of the data.\

AEP Web SDK expect to pass an object that has the reference to different fields specified in the AEP Schema creation.\
However, there is no way to handle the object directly in the AEP Web SDK, as it is for the `s` object for the Adobe Analytics library.\
This project aims at creating such intermediary step that would simplify the implementation and management of object reference.

This object can be available on a global scale (window) and can be instanciated multiple time, so you can handle different instance of the `Xom`.

## Specifications

The following section will describe the specification that the `Xom` object should have for its usage.\
It will also describe the different methods that are thought to be useful for the usage of that.

### Instanciation

The library is referencing a class that can be instanciated multiple time per page.\
Each of the instance will possess their own attributes, and the instances can be merged.\
Ideally an existing XDM Object Manager object can be used as reference of the instanciation.

You can also pass directly the tenant reference in the schema directly during instanciation.

Such as:

```JS
xom1 = Xom()
xom2 = Xom(tenant="_tenant") /*will generate {"_tenant" : {}} from the start*/

xom3 = Xom(xom1) /* Using the xom1 as template - xom1 could contains some attributes*/
xom4 = Xom([xom1,xom2]) /* merging different object together - following the order of the arguments */
```

### Launch extension compatible

The library should be easily loadable in a Launch extension. It means being written in ES5. :(

Ideally, the instanciation of a XDM Object Manager can be done via Data Element setup, such as: 
```JS
xom1 = _satellite.getVar('DataElementXOMReference')
```

### Methods

Here are reference of the different possible methods that can be considered usefull for the management of an XDM reference.

#### Assigning value

You can assign value to the xom object by using the `assign` method.\
The method takes 2 arguments:
* path of the field
* value of the field

such as:
```JS
    xom.assign('_tenant.firstname','julien')
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
    xom.assign('_tenant',{'firstname':'julien'})
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
    xom.assign('_tenant',[{'firstname':'julien'},{'firstname':'jennifer'}])
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

#### Accessing data

Data can be access directly by the call of the `xom` instance or by the `get` method.\
Such as:
```JS
    xom()
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
   xom.get()
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
```

It would be possible to access a specific field of the object via the `get` method with dot notation.

```JS
    xom.get('_tenant.firstname')
    /*
    This will return 'julien'
    */
```

#### Handling path error

The `xom` instance should be robust enough so it doesn't break when a wrong path is used.\
If a wrong path is used, the `get` method will return undefined\
If a wrong path is used, the `assign` method will create the new path for the element proposed.

### Removing fields

The same way that for assigning value, you can delete a specific reference by specifying the path.\
Such as:
```JS
    xom.remove('_tenant.firstname')
    /*
    This will return the field from the object, so new XDM object is:
        {
            "_tenant" : {}
        }
    */
```