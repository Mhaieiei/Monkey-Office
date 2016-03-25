This folder contains dummy JSON dumped mongo collections for this project.
It is intended to sync data among collaborators so that we have the same piece of data.

-----------------------------------------------

Before importing, make sure that your machine is already connected to mongodb by running 'mongod' in the commandline

To import JSON file
mongoimport --db <database-name> --collection <collection-name> --file filename.json

To export JSON file
mongoexport --db <database-name> --collection <collection-name> --out filename.json

substitute <collection-name> with the name of the file in this folder.
----------------------------------------------

TODO
- Create a batch script for windows and MAC OSX. One for storing all these collections automatically. Another for dropping all these collections.
