# Simple Object Manager Methods

This page will present you with the method available from the Simple Object Manager.\
Overall, all of the methods provided are wrapper around existing methods or helper functions that handle wished behavior.

Once the 0.1.0 release version is live, the methods described here will be maintained and any new version of the library will contain backward compatibility change.

- [Instantiation](#Instantiation)
- [Methods](#Methods)
    - [Assigning value(s)](##assigning-values)
    - [Merging objects](#merging-object)
        - [merge method](#merge)
        - [mergedeep method](#mergedeep)
    - [Accessing data](#accessing-data)
    - [Pushing elements into array](#pushing-elements)
    - [Replacing the values at scale](#replace)
    - [Removing fields](#removing-fields)
    - [Clear method](#clear)
    - [SearchValue](#searchvalue)
    - [subSom](#subsom)
    - [Modify](#modify)
    - [get Sub Nodes](#getsubnodes)
- [Handling path error](#handling-path-error)
- [SOM Stack](#the-stack)

## Instantiation

The library is referencing a class that can be instanciated multiple time per page.\
Each of the instance will possess their own attributes, and the instances can be merged.\
Ideally an existing XDM Object Manager object can be used as reference of the instanciation.

You can also pass directly a JSON / JS reference in the schema directly during instanciation.
It can takes 3 arguments:
* orignalObject: The original object you want to feed your Som object with
* defaultValue: the default value to return when the getter do not find any value. `undefined` is the default value.
* deepcopy: Default is set to true, so we have a deep copy of the element and do not modify the data source.

Such as:

```JS
som1 = new Som()
som2 = new Som({'foo':'bar'})
som3 = new Som(som1) /* Using the som1 as template - som1 could contains some attributes*/
som4 = new Som([som1,som2]) /* merging different object together - following the order of the arguments */
let myObj= {'foo':'bar'}
som4 = new Som(myObj,options={'dv':undefined,'deepcopy':false}) /* copying the object but not deepcopying it as last argument is set to false */
som5 = new Som(myObj,options={'stack':true,'context':()=>{'myContext'}}) /* copying the object and instantiating a stack*/

```

The data located in the Som instance are accessible via a `.get()` method (see [Accessing data](./Simple_Object_Manager_Methods.md#Accessing_data]) part) or via the `data` attribute.\
Looking at som2 in the example below:

```JS
som2.data
// will return
{
    "foo": "bar"
}

```

## Methods

Here are reference of the different possible methods that can be considered usefull for the management of an XDM reference.

### Assigning value(s)

You can assign value to the som object by using the `assign` method.\
Method description:

* assign
  Assign a value to a specific path provided.
  Arguments:
  * path : REQUIRED : path using the dot notation to specify where to place the value.
  * value : REQUIRED : Value to be assigned

In case the value is `undefined`, the `undefined` value has been added to the key.\

#### Examples
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

or array directly in the value:
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
            "firstname" : "jennifer"
            }
        ]
    }
    */
```
via dot notation:



The `som` object accepts the dot notation for path, and arrays needs to pass the index within the `[]`.
In case, you want to assign only a specific key value to an array. You can directly do so:
*note* : if you pass an array index that is greater than the amount of elements, SOM will automatically assign the element to the next available slot, not respecting your index.
```JS
    som.assign('_tenant.myArray.[1].firstname','julien')
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
or passing an object
```JS
    som.assign('_tenant.[0]',{'firstname':'julien'})
    /*
    This will result in adding this element:
    {
        "_tenant":[
            {
            "firstname" : "julien"
            }
        ]
    }
    */
```

As you may have understood, if the element of the array is not present, the `som` automatically push the element to a new element of your array.
In case, you do not assign any value, the `som` will set an `undefined` value instead.
```JS
    som.assign('_tenant.myArray.[1].firstname',)
    /*
    This will result in adding this element:
    {
        "_tenant":{
            myArray: 
                [
                    {firstname : undefined},
                ]
        }    
    }
    */
```
see above how the element is on position 0, even though you pushed position 1, because no position 0 existed.

### Merging object

#### Merge
You can merge an existing object with the data contain in your `som` object.\
The method uses the the `Object.assign` method from JavaScript.
In order to do that, you can call the `merge` function that will apply the merge at the level pass through the additional `path` parameter.\
Method description:

* merge
  Merge an object to your existing Som object. It uses JSON.stringify method to deep copy it.
  Arguments:
  * path : OPTIONAL : path using the dot notation to specify where to place the value.
  * object : REQUIRED : The object to merge



#### Examples

```JS
let myObject = {"foo":"bar","foo":"baz"}
let som = new Som({"test":"value"})
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

som.merge('test', object=myObject) 
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

#### mergeDeep

It is possible that you want to merge more complex object with your current Som object.\
The `merge` method allows you to specify if you want to merge your new object at a specific location of your current som object, by providing the `path` arguments.\
However, you may, sometimes, have complex object that change different layer of your object.\
In that case, the `mergeDeep` method will allow you to realize granular change on all nested elements of your object.\

NOTE: In case of array, the `mergeDeep` method will push the new element in the array. Extending its number of elements.

* mergeDeep:
  Deep merge the object provided with the existing Som object
  Arguments:
  * path : OPTIONAL : if a path is provided in the original object to identify where to do the merge.
                    The path can only reference an object.
  * object : REQUIRED : the object you want to deep merge with the existing Som object 

```JS
let object1 = {
    "key1":"example",
    "array1":['value1','value2'],
    "object1":{
        "nested1":"value3"
    },
    "array2":[
        {"key1":"value4"}
    ]
    }

mySom = new Som(object1);

let object2 = {
    "key2": "example",
    "array1":['value5'],
    "object1":{
        "nested2":"value6"
    },
    "array2":[
        {"key2":"value7"},
        {"key3":"value8"},
    ]
}
mySom.mergeDeep(object2);
mySom.data // will show
/*
{
    "key1": "example",
    "key2": "example",
    "array1": [
        "value1",
        "value2",
        "value5"
    ],
    "object1": {
        "nested1": "value3",
        "nested2": "value6"
    },
    "array2": [
        {
            "key1": "value4",
            "key2": "value7"
        },
        {
            "key3": "value8"
        }
    ]
}


*/

```


### Accessing data

Data can be access directly by the call of the `som` instance or by the `get` method.\
Method description:

* get
  Return the value present at the path selected.
  Arguments:
  * path : OPTIONAL : path with dot notation such as `tenant.array.0.firstname` or an array of paths such as `['tenant.array.0.firstname','tenant.array.0.firstName']`
  * fallback : OPTIONAL : a value to return in case the selected path returns `undefined`

#### Examples

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

In case you want to return something different than the default value set in your class, you can pass a second parameter.


### Pushing elements

The Som object can push some elements to a specific path. The `push` method can take 3 arguments.
* push
  Push the value present at the path selected. Can behave differently dependant one parameter
  Arguments:
  * path : REQUIRED : path with dot notation such as `tenant.array.0.firstname`
  * value : REQUIRED : a value to push into an array.
  * override : OPTIONAL : If set to `true`, replace the existing element with an array the value you pushed.
                        Default is `false`, therefore keeping any value previously set. If the previous element is not an array, it keeps it and place it at index 0 of the array, pushing the new value afterwards.

#### Examples
```JS
    let som = new Som({"test":"value"})
    som.data // returns
    /* 
    * {
    *   "test" : "value"
    * }
    */ 
   som.push('foo','bar');
   som.data // returns
   /* 
    * {
    *   "test" : "value",
    *   "foo": ['bar']
    * }
    */ 
   som.push('foo','baz');
   som.data // returns
   /* 
    * {
    *   "test" : "value",
    *   "foo": ['bar','baz']
    * }
    */ 
   som.push('test','something else');
   som.data // returns
   /* 
    * {
    *   "test" : ["value","something else"],
    *   "foo": ['bar','baz']
    * }
    */ 
   som.push('test','new state',true);
   som.data // returns
   /* 
    * {
    *   "test" : ['new state'],
    *   "foo": ['bar','baz']
    * }
    */ 

```

### replace

The `replace` method will allow you to replace one value in your object by another one.\
It doesn't return anything but change the Som object itself.
It takes 2 arguments, the old and the new value.
* replace
  replace the value provided by a new value provided in your object
  Arguments:
  * old_value : REQUIRED : the value you want to replace
  * new_value : REQUIRED : the new value you want to set

Example

```JS

let object1 = {
    "key1":"example",
    "array1":['value1','value2'],
    "object1":{
        "nested1":"value3"
    },
    "array2":[
        {"key1":"value4"}
    ]
    }

mySom = new Som(object1);

// Normal value replacement
mySom.replace('example','replace1');
mySom.data //will show
/**
 {
    "key1":"replace1",
    "array1":['value1','value2'],
    "object1":{
        "nested1":"value3"
    },
    "array2":[
        {"key1":"value4"}
    ]
  }
 * 
 * 
*/

// in array value replacement
mySom.replace('value2','replace2');
mySom.data //will show
/**
 {
    "key1":"replace1",
    "array1":['value1','replace2'],
    "object1":{
        "nested1":"value3"
    },
    "array2":[
        {"key1":"value4"}
    ]
  }
 * 
 * 
*/

// in nested object value replacement
mySom.replace('value3','replace3');
mySom.data //will show
/**
 {
    "key1":"replace1",
    "array1":['value1','replace2'],
    "object1":{
        "nested1":"replace3"
    },
    "array2":[
        {"key1":"value4"}
    ]
  }
 * 
 * 
*/

// in array of object value replacement
mySom.replace('value4','replace4');
mySom.data //will show
/**
 {
    "key1":"replace1",
    "array1":['value1','replace2'],
    "object1":{
        "nested1":"replace3"
    },
    "array2":[
        {"key1":"replace4"}
    ]
  }
 * 
 * 
*/



```


### Removing fields

The same way that for assigning value, you can delete a specific reference by specifying the path.\
Method description:

* remove
  Remove the value present at the path selected. If it is an object, remove the whole object.
  Arguments:
  * path : OPTIONAL : path with dot notation such as `tenant.array.0.firstname`
  * key : OPTIONAL : If you want to remove the key as well, then set to `true`

#### Examples

For this object:
```JS
{
    "_tenant" : {
        "firstname" : "Julien",
        "lastname": "Piccini"
        }
}
```
specifying the path `tenant.firstname` will remove `Julien`.
```JS
    som.remove('_tenant.firstname')
    /*
    This will remove the value from the object, so new XDM object is:
        {
            "_tenant" : {
                "firtname" : undefined,
                "lastname": "Piccini"
                }
        }
    */
```

You can also specify to remove the key itself, by passing a boolean in the `key` parameter:
```JS
    som.remove('_tenant.firstname',key=true)
    /*
    This will remove the key from the object, so new XDM object is:
        {
            "_tenant" : {
                "lastname": "Piccini"
                }
        }
    */
```


By default, if you are giving a path that contains an object, then the whole object is removed.\
Imagine this object:
```JS
mysom.data
//returning this:
{
    "tenant" : {
        "commerce":{
            "cartAddition" :1,
            "cartRemoval" :0,
        },
        "order":0
    }
}
```
if you are to pass `tenant.commerce`, because `commerce` is an object, it automatically delete the whole element.
```JS
mysom.remove('tenant.commerce');
// will result in:
{
    "tenant" : {
        "order":0
    }
}
```

### clear

The SOM instance can be cleaned completely from any data.\
For this purpose, the `clear` method is available and will restate the data of the SOM object to `{}`

```JS
mysom.data;
/* it will return this
{
    "tenant" : {
        "commerce":{
            "cartAddition" :1,
            "cartRemoval" :0,
        },
        "order":0
    }
}
*/
/// operations
mysom.clear();
mysom.data;
/* it will return this
{}
*/


```
### SearchValue

The `som` instance provides a `searchValue` method to search for paths that are leading to a set value.\
It does not look for a node but for an end value being set in your object definition.\
The use-case is to look for the type of path that are leading to similar values.

It takes 2 parameters:
* value : string : value you are looking for at the end of your path.
* regex : boolean : If you want to apply regex on your value search (default `false`)

It returns an object with the key being the value string you search.

Example:

```JS
myObject = {
    "data": {
        "foo1": {
            "string": "mystring",
            "string2": "mystring2"
        },
        "foo2": {
            "number": 0
        },
        "myarray": [
            0,
            1
        ],
        "myarrayObject": [
            {
                "foo1": "myString",
                "foo2": "myString2"
            }
        ]
    }
};
mySom = new Som(myObject);
mySom.searchValue('mystring') // will return {'mystring':['data.foo1.string']}
mySom.searchValue('ing[0-2]',true) // will return {'ing[0-2]':["data.foo1.string2","data.myarrayObject.0.foo2"]}
mySom.searchValue('^[0-2]$',true) // will return {'^[0-2]$': ["data.foo2.number","data.myarray.0","data.myarray.1"]}

```

### subSom

If you want to create another `Som` instance out of one node.\
It only works if the path provided is returning an object.\
If the path used is not defined, the `Som` instance will assign an empty object on that path and return a `Som` instance.\
The returns object is **not** deepcopied. Hence modification of that `Som` instance will impact the main `Som` instance.

It takes 1 parameter:
 * path : REQUIRED : The path where you want the object for the new SOM to be used.
 Note that it will not create a sub SOM if the path does not return an object but string or integer. 
 If the path does not return anything, it will create an object at that location. 

Example:

```JS
data = {'mydata':{'level1':{'foo':'bar'}}}
mySom = new Som(data)

/*existing node*/
mySom.get('mydata.level1') // will return {'foo':'bar'}
mySubSom1 = mySom.subSom('mydata.level1')
mySubSom1.assign('foo1','barr')
mySom.get('mydata.level1') // will return {foo: 'bar', foo1: 'barr'}

/*new node*/
mySom.get('mydata.level2','nothing here') // will return 'nothing here'
mySubSom2 = mySom.subSom('mydata.level2')
mySubSom2.assign('key.nested','value') // will now return {"key": {"nested": "value"}}

```

### Modify

Som provides a `modify` method that takes a path or list of paths and a function as paremeter. \
It then applies that function to the value returned by that path.\
Note that you could end up using the default value if your path does not return anything.

It takes 2 parameters:
 * path : REQUIRED : The path where to apply that function
 * function : REQUIRED : callback function where the value is passed as parameter 

Example:

```JS
data = {'mydata':{'level1':{'foo':'bar','value':1}}}
mySom = new Som(data)

mySom.modify('mydata.level1.value',(value)=>value+1)
mySom.get('mydata.level1.value') // will return 2

mySom.modify('mydata.level1.value',(value)=>value+1)
mySom.get('mydata.level1.value') // will return 3

mySom.modify('mydata.level1.otherThing',(value)=>value==undefined?"too bad":2)
mySom.get('mydata.level1.otherThing') // will return "too bad"
```


### getSubNodes

The `getSubNodes` method permits to deconstruct an object so you can use `subSom` object to it.\
In that sense, it can make working with some complex object easier.\
It takes 1 parameter:
* the path where to look for objects

Example:

```JS
let myobject = {"mydata":{
    "object1" : "foo",
    "object2" : 0,
    "object3" : {
        "some" : "value"
    },
    "array1" : [1,"value2",3],
    "array2" : [{
        "foo" : "value1"
    }]
}}
mySom = new Som(myobject);
let {object1,object2,object3,array1,array2} = mySom.getSubNodes('mydata');
object1 == undefined // true
object2 == undefined // true
object3.get("some") // returns "value"
array1.get() // returns [1, 'value2', 3]
array2.get() // returns {foo: 'value1'}
```


### Handling path error

The `som` instance should be robust enough so it doesn't break when a wrong path is used.\
If a wrong path is used, the `get` method will return undefined or the fallback passed as 2nd parameter\
If a wrong path is used, the `assign` method will create the new path for the element proposed.


### The stack

The Som object can instantiate a stack that will capture all methods used and the path used in these methods (if any path used).\
It can also provide a callback function to be executed during these methods calls, and the callback function will provide a parameter that you can use.\

Example: 

```JS
const myObj= {'foo':'bar'}
let myContext = function(parameter){
    return parameter
} 
const mySom = new Som(myObj,options={'stack':true,'context':myContext}) 

mySom.get('foo')
mySom.stack // will return [{'method':'get','path':'foo', context : {'method':'get','value':'bar'}}]

```


However, the type of object or value provided will depends on the method used.\
Therefore, please find a table below that explains the type of value returned in the stack and the context

| Method | stack | context | parameter provided in context | comment |
| - | - | - | - | - |
| get | supported | supported | `{'method':'get','value':'valueReturned'}` |  | 
| assign | supported | supported | `{'method':'assign','value':'valueAssigned'}` |  | 
| merge | supported | supported | `{'method':'merge','value':'objectPushed'}` |  | 
| mergeDeep | supported | supported | `{'method':'mergeDeep','value':'objectPushed'}` |  |  
| push | supported | supported | `{'method':'push','value':'valuePushed'}` |  |  
| remove | supported | supported | `{'method':'remove','value':undefined}` |  |  
| replace | supported | supported | `{'method':'replace','value':oldValueReplaced,'new_value':newValuePushed}` | an additional element is passed `new_value` that is the one replacing the old one. |  
| getSubNodes | supported | supported | `{'method':'getSubNodes','value':resultsOfSubNodes}` | the different sub nodes are being returned in the `value` parameter |  
| subSom | supported | supported | `{'method':'subSom','value':SubSom}` | SubSom Object is being returned |  
| modify | supported | supported | `{'method':'modify','value':resultOfModify}` | The value that has been calculated by the modify function is returned |  
| searchValue | supported | supported | `{'method':'searchValue','value':results}` | results of the search, that is an object that provides the results in an array such as: `{searchElement:[path1,path2]}` |  
| clear | supported | supported | `{'method':'searchValue','value':undefined}` |  |  



## Launch extension compatible

The library should be easily loadable in a Launch extension.

Ideally, the instanciation of a XDM Object Manager instance can be done via Data Element setup, such as: 
```JS
som1 = _satellite.getVar('DataElementsomReference')
```