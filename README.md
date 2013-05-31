eyeo_semanticsabotage
=====================


## Introduction 


## Installation

+ Clone the repo and duplicate fill_firstname_lastname.js, change the name to yours.

+ Enable Apache and PHP for local dev [OSX 10.8](http://coolestguyplanettech.com/downtown/install-and-configure-apache-mysql-php-and-phpmyadmin-osx-108-mountain-lion)

+ See [Eyeo-Architecture.pdf](https://github.com/sosolimited/eyeo_semanticsabotage/blob/master/Eyeo-Architecture.pdf) for more about software layout.

## Create your own


## Software architecture


## Message specs

Use these specs to get useful information out of incoming messages.

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


## Sample YouTube Links with Good Captions

Search for YouTube movies with captions by adding ", cc" to your search phrase.

http://www.youtube.com/watch?v=usfRtJpyJDk - How to act in California court
http://www.youtube.com/watch?v=mox4InKEwgU - Obama talking about agenda
http://www.youtube.com/watch?v=UF8uR6Z6KLc - Steve Jobs Stanford commencement (real captions)
http://www.youtube.com/watch?v=ORxR5E7GXh4 - Allen Ginsberg reading a poem
http://www.youtube.com/watch?v=drTyNDRnyxs - how to download CC instructions
http://www.youtube.com/watch?v=cpQtyCCJk0c - beatles 'oh yeah'
http://www.youtube.com/watch?v=KaOC9danxNo - Astronaut singing "Ground Control to Major Tom" - good cc
http://www.youtube.com/watch?v=iBVtRPmMZXY - Andrew Soloman on hope
http://www.youtube.com/watch?v=YLO7tCdBVrA - Bob Ross remixed **** Currently crashes app.
http://www.youtube.com/watch?v=weNO9k1TXS0 - Glenn Danzig on books
http://www.youtube.com/watch?v=EOCcFcgRcTg - "America" by Allen Ginsberg
http://www.youtube.com/watch?v=l26Uq3PX-fk - Maya Angelou Presidential Medal of Freedom recipiant
http://www.youtube.com/watch?v=Ia7N1l7zrlk - Stalinst propoganda with English subtitles
http://www.youtube.com/watch?v=cImIlPSuyR8 - Introduction to the 1944 census
http://www.youtube.com/watch?v=u02nZW0QiSE - Kenndey v. Nixon
http://www.youtube.com/watch?v=6JDM4MY71G4 - Muhammad Ali refusing to go to Vietnam
http://www.youtube.com/watch?v=Ik0aS368Kv0 - Sermon on the mount.
http://www.youtube.com/watch?v=Uq1noGpVfEU - Syrian army beating civilian 
http://www.youtube.com/watch?v=28BXqQWqYJU - There Will Be Blood Scene (lots of silences)
http://www.youtube.com/watch?v=ALS92big4TY - Pussy Riot Punk Prayer (singing in russian, subtitles in english)
http://www.youtube.com/user/blankonblank?feature=watch - PBS blank on blank series **** NOT A VALID LINK - GO HERE FOR VIDS
http://www.youtube.com/watch?v=jq42aHX4qk4 - I am the walrus good captions
http://www.youtube.com/watch?v=JnA8GUtXpXY&t=6m0s - The Extended Mind (start at 6:00 for crazy)

## License

Copyright (c) 2013 Sosolimited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
