# XDM Object Manager description

This page will explain the philosophy, origin and use-cases that this library will support.

AEP Web SDK expect to pass an object that has the reference to different fields specified in the AEP Schema creation.\
However, there is no way to handle the object directly in the AEP Web SDK, as it is for the `s` object for the Adobe Analytics library.\
This project aims at creating such intermediary step that would simplify the implementation and management of object reference.

## XDM Object Manager Origin

The main origin of that project comes from question I received or challenge that I have when dealing with legacy implementation from (Adobe) Analytics tool to the AEP Web SDK.\
The default approach for (Adobe) Analytics is to prepare an object, `s` for Adobe, and then fire the object once you are ready to fire.

The AEP Web SDK doesn't possess such object, therefore, it is require to use a Data Element to prepare your object.

However, the default data element created is not callable from the code.\
Also the modification can not be done directly in it, it references other data elements.

This approach either:
* let you figure it out yourself how to manage such complex object
* Split the object into different object that need to all be in sync in order to send the correct information.

This is very hard to maintain in a complex Launch environment and not very scalable to multi property setup.  

The best approach would be to ask your IT department to generate an EDDL that ensure the creation of the correct XDM structure for each event.

However, this is not always possible.

This is where the XDM Object Manager can come handy.

## XDM Object Manager use-cases

XDM Object Manager is not really related to XDM (as you could imagine).\
The class provide an object that contains different method to easily manipulate the structure of complex object.\

The main use-case is to generate an XDM Schema object, but you could use it for different use-cases.

### Develop an (XDM) object from scratch

You can use the methods describe in the methods documentation to build an object from scratch and manage it. 

I will let you reference [the documentation](XDM_Object_Manager_Methods.md) to see how you could achieve this.

The object that you manage do not need to follow the XDM schema template. It can simply be

### Complement the AEP Web SDK Schema

One smart thing that you could do is to generate a template of your schema within a Data Element. Simply putting a basic JSON in a data element to serve as template.\
Then use the XDM Object Manager to manipulate it, you can use any object during the instanciation of the `Xom` object.

In the future, I wish to add an Extension so you can directly push the template in the Launch interface. 

### Duplicate your data layer

For some reason, you may want to duplicate your data layer and modify it before using the AEP Web SDK beacon.
Maybe you wish to remove some elements from the object, and this type of modifcation may not be easy to do.

The XDM Object Manager will help you on that task.

Per example for the Adobe Client Data Layer library, you could realize the following: 

```JS
xom = new Xom(adobeDataLayer.getState())
```

This will duplicate the data layer value inside the `xom` instance.