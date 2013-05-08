eyeo_semanticsabotage
=====================

## Setup ##

Clone the repo and duplicate fill_firstname_lastname.js, change the name to yours.


## Getting started ##

To install and get the ReConstitution BackEnd running, you will need two open
source technologies:

* [Node.js](http://nodejs.org)
* [mongoDB](http://www.mongodb.org)

Once these are installed, clone or download the repository and change directory
into it.  From there run...

``` bash
npm install
```

...to fetch all the required dependencies.

## Running the server ##

To start mongo, run the following command…

``` bash
mongod run --config /usr/local/etc/mongod.conf
```

The mongo_dumps folder contains LIWC libs, run...
``` bash
sh mongo_dumps/loadLIWC.sh
```
…to load the libraries.

While in the `recon_backend` folder, run the following command...

``` bash
node .
```
...to get the server running.


To manage the db, use the following commands...

``` bash
use db
```

``` bash
clear db
```

``` bash
unlock
```

``` bash
lock
```



### Loading text file arguments ###

Do not use any arguments if you want live cc streaming from OF app.  An
example of arguments is `index.html?docName=2008_2.txt&delay=100`

* `docName` Filename to load from the `recon_backend` project. Place documents
  in the documents folder in `recon_backend`.
* `delay` Timeout between each message in milliseconds.  Defaults to 0.
* `nosocket` Used to disable the socket from attempting to make a connection.`


## Message specs ##

Sent to all clients, every word
{	
  type: ”word”, 
  timeDiff: int,
  dbid: (uniquewords_id) int,
  word: string, 
  speaker: int 
  cats: string[], 
  sentenceStartFlag: bool, 
  punctuationFlag: bool,
  wordInstances: int, 
  ngrams: [ [ngramID, ngramInstances], ... ]
}


Sent to all clients, every sentence end
{	
type: ”sentenceEnd”, 
timeDiff: int,
  speaker: int,
  sentiment: [ pos energy(int), neg energy (int), [ {word: string, value: int} ] ],
  length: int
}

Sent to all clients, every time new n-gram is found ( when more than 3 instances have appeared)
{	
  type: ”newNGram”, 
  timeDiff: int,
  dbid: int,
  ngram: string[],
  instances: string[] //word ids of last words
}

Sent to all clients, every n seconds
{	
type: ”livestate”, 
  debate: int
}

Sent to all clients, every n seconds
{	
  type: “stats”,
  timeDiff: int,
  posemo: float[2],
  negemo: float[2],
  anger: float[2],
  I: float[2],
  we: float[2],
  complexity: float[2],
  status: float[2],
  depression: float[2],
  formality: float[2],
  honesty: float[2]
}




# Frontend #
