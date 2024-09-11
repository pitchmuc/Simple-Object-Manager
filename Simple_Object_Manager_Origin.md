# Simple Object Manager description

This page will explain the philosophy, origin and use-cases that this library was intended to support.

For Adobe Experience Platform, tracking the website through AEP Web SDK is expected.\
AEP Web SDK pass an object that are references to different fields specified during the AEP Schema creation.\

However, the management of such object is proven to be difficult to handle, because there is no way to handle the object directly in the AEP Web SDK library, in contrary to `s` object for the Adobe Analytics library.\

This project aimed at creating such intermediary step that would simplify the implementation and management of object reference. Accessing and creating paths easily.

## Simple Object Manager Origin

The main origin of that project comes from questions I received or challenge(s) that I have when dealing with legacy implementation from (Adobe) Analytics to the AEP Web SDK.\
The default approach for (Adobe) Analytics is to prepare an object, `s` for Adobe, and then fire the object once you are ready to fire.

The AEP Web SDK doesn't possess such object, therefore, it is require to use a Data Element to prepare your object before sending it via the library.

However, the default data elements created is not easy to manipulate.\
The modification of the fields can not be done directly in it, it references other data elements.\
This creates a layer of complexity to understand the Web SDK implementation and does not solve the complexity of creating the XDM object.

The current approach of AEP Web SDK:
* Let you figure it out yourself how to manage such complex object (via complex JS code)
* Let you handle the exception yourself in case a nested key is not present or misconfigured in your data layer.
* Split the XDM object into different objects that need to all be in sync in order to send the correct information at the right time.

This is very hard to maintain, especially in a complex TMS environment, and not very scalable to multi property setup.  

The best approach would be to ask your IT department to generate an EDDL that ensure the creation of the correct XDM structure for each event. ([see FAQ](FAQ.md))\
However, this is not always possible and even if possible, it lets you handle complex data structure representation on your own. 

This is where the **Simple Object Manage** can come handy.

## Simple Object Manager use-cases

Simple Object Manager is not really related to XDM (as you could imagine).\
The class provide an object that contains different method to easily manipulate the structure of complex object.\

The main use-case is to generate an XDM Schema object, but you could use it for different use-cases.

### Develop an object from scratch

You can use the methods described in the methods documentation to build an object from scratch and manage it. 

I will let you reference [the documentation](Simple_Object_Manager_Methods.md) to see how you could achieve this.

NOTE:
The object that you manage do not need to follow the XDM schema template.\
The main use-case I am referencing is focusing on XDM management but doesn't have to be. You can use this library for any data representation in an object.

### Complement the AEP Web SDK Schema

One smart thing that you could do is to generate a template of your schema within a Data Element. Simply putting a basic JSON in a data element to serve as template.\
Then use the XDM Object Manager to manipulate it, you can even use an object during the instanciation of the `Som` object.

Note: In the future, I wish to add a Launch Extension so you can directly push the template in the Launch interface. 

### Duplicate your data layer

For some reason, you may want to duplicate your data layer and modify it before using the AEP Web SDK beacon.
Maybe you wish to remove some elements from the object, and this type of modifcation may not be easy to do.

The Simple Object Manager will help you on that task.

Per example for the Adobe Client Data Layer library, you could realize the following: 

```JS
som = new Som(adobeDataLayer.getState())
```

This will duplicate the data layer value inside the `som` instance.
This element has been stringify and parse again, and remove out of any circular reference so only the data structure remain, without any possibility to modify the original data. 