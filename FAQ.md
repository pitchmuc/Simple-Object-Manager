# XDM Object Manager FAQ

This page is to answer most of the questions I heard about this project.\
This will help people to understand the nature of the project, as well as its limitation.\
It will provide some hint of the philosophy around the XDM Object Manager.

## Questions

**Why Not using an EDDL ?**\
You should use the EDDL structure to manage a clean XDM structure for tracking if you can.(it has been inspired from it).\
That would be the best course of action but there are 3 main reasons why this project can be interesting:
1. Many websites / owner do not have the capacity to change their Data Layer structure, moving from their legacy CEDDL to EDDL.

2. Your EDDL may not be containing "XDM compatible" data. XDM is specific to Adobe, you may want a more neutral representation of your data.

3. The use-case I am trying to cover doesn't require to have the event management that normal EDDL structure handle to. It means that the event listener and event pushing is not covered.

**Who is going to maintain it?**\
The community ? The code would be open-source (like everything I do) so if you are not happy about it, you can fork it, you can generate your own version of the library.
Also, the idea is to have a minimum amount of methods available that are quite basic so the support should be minimal after the first edge cases are solved.
