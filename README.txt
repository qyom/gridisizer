Code Sample
Author:  Hayk Hakobyan
Project: Gridisizer


This code sample is copied and edited from a working subsystem of a custom platform created by Hayk Hakobyan.
It's purpose is to display rows of data(any DB data) in a nice UI with some good interactions with it e.g. filtering sorting, pagination, etc...

The parent platform itself is based on Zend FW + Smarty + Jquery so you might see some methods of those frameworks, but those are not essential aspect of this widget.

Explanations:
* In the backend folder you'll see all classes that manage the data
* In the frontend you'll see smarty templates and JS files

The goal was to make all operations as abstract as possible, thus minimizing the code everytime we want to implement a new grid.
In this example you'll see how does it construct a grid of all members in the database:

So in the template file(members.tpl) we just specify parameters of the grid and include the renderer(includes/grid.tpl):
Then in the JS side(members.js) we just instantiate the JS object(QyomGrid) with proper parameters and call the renderData method.

And then it's all good to go.
We just need to make sure the server side utilizes the Abstract_Table's _gridisizeSelect method.

Note*: The Qyom_Response object is not really an important aspect of this widget but it's purpose is to contain all communication status between service calls; It's a core concept in the Service Layer Architecture that was used in the parent platform

Note**: The code was copied and simplified for a better demonstration. This is not a working application.