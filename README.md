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

## YouTube Links with Good Captions ##

DCrDuGyZ6FA - Does Marcellus Wallace look like a bitch? (if you like horrible captions)

usfRtJpyJDk - How to act in California court

mox4InKEwgU - Obama talking about agenda

QnZ0Y4rvz6E - Hahvahd Bah (also horrible)

UF8uR6Z6KLc - Steve Jobs Stanford commencement (real captions)

n3Sntwy4Z7g - Pink Floyd : Money (lyrics come in after 60 seconds, will find better songs)

drTyNDRnyxs - how to download CC instructions

cpQtyCCJk0c - beatles 'oh yeah'

KaOC9danxNo - Astronaut singing "Ground Control to Major Tom" - good cc

jq42aHX4qk4 - I am the walrus good captions (doesn't work yet, need to debug this)

http://www.youtube.com/user/blankonblank?feature=watch - PBS blank on blank series **** Currently crashes app.

http://www.youtube.com/watch?v=iBVtRPmMZXY - Andrew Soloman on hope

http://www.youtube.com/watch?v=YLO7tCdBVrA - Bob Ross remixed **** Currently crashes app.

http://www.youtube.com/watch?v=weNO9k1TXS0 - Glenn Danzig on books

http://www.youtube.com/watch?v=EOCcFcgRcTg - "America" by Allen Ginsberg

http://www.youtube.com/watch?v=l26Uq3PX-fk - Maya Angelou Presidential Medal of Freedom recipiant

http://www.youtube.com/watch?v=Ia7N1l7zrlk - Stalinst propoganda with English subtitles

http://www.youtube.com/watch?v=cImIlPSuyR8 - Introduction to the 1944 census

http://www.youtube.com/watch?v=u02nZW0QiSE - Kenndey v. Nixon

https://www.youtube.com/watch?v=6JDM4MY71G4 - Muhammad Ali refusing to go to Vietnam


http://www.youtube.com/watch?v=Ik0aS368Kv0 - Sermon on the mount.

http://www.youtube.com/watch?v=Uq1noGpVfEU - Syrian army beating civilian 

http://www.youtube.com/watch?v=28BXqQWqYJU - There Will Be Blood Scene (lots of silences)

