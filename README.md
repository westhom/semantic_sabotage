
eyeo_semanticsabotage
=====================



## Setup ##

+ Clone the repo and duplicate fill_firstname_lastname.js, change the name to yours.

+ Enable lamp stack for local dev [OSX 10.8](http://coolestguyplanettech.com/downtown/install-and-configure-apache-mysql-php-and-phpmyadmin-osx-108-mountain-lion)

+ See [Eyeo-Architecture.pdf](https://github.com/sosolimited/eyeo_semanticsabotage/blob/master/Eyeo-Architecture.pdf) for more about software layout.


## Message specs ##

Sent every word
{	
  type: ”word”, 
  timeDiff: int,
  dbid: (uniquewords_id) int,
  word: string, 
  speaker: int 
  cats: string[], 
  wordInstances: int, 
  ngrams: [ [ngramID, ngramInstances], ... ]
}

Sent every time new n-gram is found ( when more than 3 instances have appeared)
{	
  type: ”newNGram”, 
  timeDiff: int,
  dbid: int,
  ngram: string[],
  instances: string[] //word ids of last words
}

Sent every line
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

