# Simple Object Manager

The Simple Object Manager (`Som`) is a project that tends to create an object containing methods helping you on manipulating data object representation.\

By default, this object can be available on a global scale (window) and can be instanciated multiple times, so you can handle different instances of the `Som`.

The goal of this library is to facilitate the object management for less advanced users that have to deal with complex data representation (Objects, Arrays interlocked, Set or nested Objects).\
Working with objects can be cumbersome and bring challenges on your data collection implementation. These chalenges leads usually to different approaches to solve them, it creates workarounds or replication of codes.

This [page](Simple_Object_Manager_Origin.md) will provide you the origin and philosophy behind the Simple Object Manager(`Som`).\

## Simple Object Manager Benefits

The Simple Object Manager (`Som`) provides you with a set of methods to manipulate complex data objects easily.\
Some of the benefits of using the Simple Object Manager (`Som`) include:
- **Easy to use methods**: The Simple Object Manager (`Som`) provides you with a set of methods that are easy to use and understand, making it simple to manipulate complex data objects.
- **Safe access to nested properties**: The Simple Object Manager (`Som`) allows you to safely access nested properties of objects without worrying about undefined errors.
- **Default values**: The Simple Object Manager (`Som`) allows you to set default values when getting properties, making it easy to handle missing data.
- **Automatic structure creation**: The Simple Object Manager (`Som`) allows you to assign values to nested properties easily, creating the structure if it does not exist.
- **Multiple instances**: You can create multiple instances of the Simple Object Manager (`Som`), allowing you to manage different data objects independently.
- **Global or local scope**: The Simple Object Manager (`Som`) can be available on a global scale (window) or can be instantiated locally, giving you flexibility in how you use it.
- **Lightweight**: The Simple Object Manager (`Som`) is a lightweight library. The minified 1.1.0 JavaScript build is about 16.4 KB.
- **Capabilities to track operations**: The Simple Object Manager (`Som`) can record operations in a stack for debugging or observability purposes.
- **Safer object handling**: The Simple Object Manager (`Som`) rejects dangerous path segments and strips dangerous object keys such as `__proto__`, `constructor`, and `prototype` to reduce prototype-pollution risk.

## Methods

This documentation will provide you with information on how to instantiate the `Som` class and the different methods available from the `Som` instance.\
[Simple Object Manager Methods](Simple_Object_Manager_Methods.md)

If you are more of hands-on test enthusiast, you can directly see the [cheat sheet](Simple_Object_Manager_CheatSheet.md) 

## FAQ

Some legitimate questions are rising from this project.\
I tried to answer them in this documentation.

[FAQ Simple Object Manager](FAQ.md)

## Libraries

Here are the link to the different libraries.

### Simple Object Manager - JS

This [link](src) will go to the JS version of the library.

### Simple Object Manager - Launch Extension

This [link](extension.md) will go to the Adobe Launch Extension documentation.

## Releases
You can find all the releases information here : [Link to release note](./release.md).
