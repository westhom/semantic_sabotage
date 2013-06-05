![Semantic Sabotage](https://raw.github.com/sosolimited/semantic_sabotage/master/img/logo.png)

## Introduction

Semantic Sabotage is an open source platform for creating live typographic YouTube transforms.

Each transform uses HTML5 and Javascript to visualize the transcript of a YouTube movie, as it plays. The transcripts are analyzed with the LIWC dictionaries, created by [James Pennebaker](http://www.secretlifeofpronouns.com/author.php) and the UT Austin Department of Psychology.

Semantic Sabotage was designed and coded by [Sosolimited](http://sosolimited.com). 

## Installation

+ Enable Apache and PHP, by following the instructions below in *Dependencies*.

+ Fork and clone the repo, by following the instructions below in *Get the Source Code*.

+ Begin creating your own transform, by following instructions below in *Creating your own Transform*.

## Dependencies

* __Apache__
* __PHP 5__

You can install Apache and PHP manually on [OSX](http://coolestguyplanettech.com/downtown/install-and-configure-apache-mysql-php-and-phpmyadmin-osx-108-mountain-lion) or [Linux](https://help.ubuntu.com/community/ApacheMySQLPHP), or download a one-click bundle: [MAMP](http://www.mamp.info/en/index.html) (for OSX) or [WAMP](http://www.wampserver.com/en/) (for Windows).


## Get the Source Code
Assuming you've followed the Apache and PHP setup instructions above, you're ready to get the source code. We recommend that you sign up for GitHub account if you don’t have one. If you don’t want to sign up for one, there are instructions below for getting the code.

*With a GitHub account*
  1. Log into your account and go to the URL https://github.com/sosolimited/semantic_sabotage
  2. Press the Fork button at the top right, which will fork the repo to your account.
  3. On a Mac, use Terminal and on Windows, use cmd, and  
   Navigate to the folder where apache is set up.  
   If you used MAMP on a Mac to set up apache, the folder is Applications/MAMP/htdocs  
   If you set up Apache manually on a Mac, the folder is ~/Sites  
      If you used WAMP on Windows to set up apache, the folder is C:/WAMP/www  
  4. Type in   
   ```git clone git@github.com:your_name/semantic_sabotage.git```  
   where your_name is your GitHub account name, and press return.  
   This will create a folder in your current folder called semantic_sabotage  
  5. Navigate into this folder.  
  6. Open this folder in Sublime or your chosen text editor.  
 

*Without a GitHub account*
  1. Go to the URL https://github.com/sosolimited/semantic_sabotage
  2. Press the Zip button with the down arrow to download the code.
  3. Save it into the folder where Apache is set up. See step 3 above for where this is on different machines.
  4. Navigate to the folder where you saved the zip files and unzip it.
  5. It should be in a folder called semantic_sabotage_master
  6. Open this folder in Sublime or your chosen text editor. 

## Loading the page

Once you've downloaded the code into the appropriate directory, you can load the page using Chrome, Safari, or Firefox.  
+If you are on OSX and set up Apache and PHP manually, then enter the following URL into your browser    
localhost/~username/semantic_sabotage  
+If you are on OSX and set up Apache and PHP with MAMP, then enter the following URL into your browser    
localhost:8888/semantic_sabotage  
+If you are on Windows and set up Apache and PHP with WAMP, then enter the following URL into your browser  
localhost/semantic_sabotage  

## Creating your own transform
You can start with a template, with an existing transform, or from scratch.
We’re going to do a quick walkthrough of the steps to create your own. 


  1. Once you have chosen a transform from sabotage.sosolimited.com to start with, navigate to the fills directory.
  2. Copy and rename the .js file as well as it’s corresponding .css file.  
  For example: if you were starting with the left scroll template,  
  Copy and rename fills/template_leftScroll.js into the fills directory.  
  Then copy and rename fills/css/template_leftScroll.css into the fills/css directory.  
  The js and css files must have the same exact name.   
  For the following instructions, let’s assume you named them my_transform.js and my_transform.css  
  3. Open your new js file and change the following two things  

    -At the very top, there is a line that looks like  
    ```var mode = function(id) {```  
    Change it to be the name of your js file. For example,  
    ```var my_transform = function(id) {```  

    -Near at the top, give your transform a name. This is how it will appear in the menu list. For example, change 
    ```name: "Left Scroll",```  
    to   
    ```name: “My Sweet Transform”,```  
  4. If there are any divs being inserted with a unique id, change the id to something else, so that it does not clash with another transform. Places to look for this are in the init() and enter() functions.
  5. Open your new css file and change the selectors to match the name of your file  
  e.g. if you started with template_leftScroll and renamed it my_transform, you would change all instances of #template_leftScroll in the css file to #my_transform.  
We are using this convention to avoid collisions with CSS names.  
  6. If you started with a template, you should comment out the line at the top of the js file  
   ```template: true,```  
  7. Reload the page in your browser and you should see your new transform in the list.  

*The main functions you’ll be working with in the transform are*  
init : Called once after the transform is created. Build things you will re-use here.
enter : Called once each time the transform is shown. Reset your transform and clean things up in here.
handleWord : Called each time a new word is ready.
handleSentenceEnd : Called each time a sentence is completed.
handleStats : Called every time a line of captions is completed. Passes in interesting linguistic information.
appendWordInContext :   Called by handleWord to append element to DOM.

Some useful notes:
- Each transform has a high-level container div. Always refer to this with this.el as in
    ```this.el.append(<div id=”myDiv”></div>);```
- To change the URL that your transform uses, set the defaultURL var
    ```defaultURL: "http://www.youtube.com/watch?v=u02nZW0QiSE",```
- To make your movie start at a specific time, add a &t=0m3s argument to your URL 
    ```defaultURL: "http://www.youtube.com/watch?v=u02nZW0QiSE&t=0m5s",```
- See the Message Specs section of the WIKI for detailed information on the messages.




## LIWC Dictionary

The <a href="http://www.liwc.net/" target="_blank">LIWC Dictionary</a> is loaded by the software. All incoming words are looked up against the dictionary, and tagged with their LIWC categories.  

+ The messages specs for words and stats can be found <a href="https://github.com/sosolimited/semantic_sabotage/wiki/Message-Specs" target="_blank">here</a>.
+ LIWC categories and abreviations can be found <a href="https://github.com/sosolimited/semantic_sabotage/wiki/LIWC-Categories" target="_blank">here</a>.
+ getCategoryIndex(category) Returns the index of the category (useful for comparing proximity or 'relatedness' of word categories.  Returns -1 if not found
+ getCategoryFullName(category) Returns full name of category, returns abbreviated name if not found



## YouTube Captioning ##

YouTube search terms can be modified with ', cc' to isolate results to content with closed captioning. Many videos have automatic captions, which are better than nothing, but are often inaccurate and contain little to no punctuation. For this reason, Semantic Sabotage first checks for official captioning, but will default to automatic captions when official captions aren't available.

## Sample YouTube Links with Good Captions

+ http://www.youtube.com/watch?v=usfRtJpyJDk - How to act in California court
+ http://www.youtube.com/watch?v=mox4InKEwgU - Obama talking about agenda
+ http://www.youtube.com/watch?v=UF8uR6Z6KLc - Steve Jobs Stanford commencement (real captions)
+ http://www.youtube.com/watch?v=ORxR5E7GXh4 - Allen Ginsberg reading a poem
+ http://www.youtube.com/watch?v=drTyNDRnyxs - how to download CC instructions
+ http://www.youtube.com/watch?v=cpQtyCCJk0c - beatles 'oh yeah'
+ http://www.youtube.com/watch?v=KaOC9danxNo - Astronaut singing "Ground Control to Major Tom" - good cc
+ http://www.youtube.com/watch?v=iBVtRPmMZXY - Andrew Soloman on hope
+ http://www.youtube.com/watch?v=YLO7tCdBVrA - Bob Ross remixed
+ http://www.youtube.com/watch?v=weNO9k1TXS0 - Glenn Danzig on books
+ http://www.youtube.com/watch?v=EOCcFcgRcTg - "America" by Allen Ginsberg
+ http://www.youtube.com/watch?v=l26Uq3PX-fk - Maya Angelou Presidential Medal of Freedom recipiant
+ http://www.youtube.com/watch?v=Ia7N1l7zrlk - Stalinst propoganda with English subtitles
+ http://www.youtube.com/watch?v=cImIlPSuyR8 - Introduction to the 1944 census
+ http://www.youtube.com/watch?v=u02nZW0QiSE - Kenndey v. Nixon
+ http://www.youtube.com/watch?v=6JDM4MY71G4 - Muhammad Ali refusing to go to Vietnam
+ http://www.youtube.com/watch?v=Ik0aS368Kv0 - Sermon on the mount.
+ http://www.youtube.com/watch?v=Uq1noGpVfEU - Syrian army beating civilian 
+ http://www.youtube.com/watch?v=28BXqQWqYJU - There Will Be Blood Scene (lots of silences)
+ http://www.youtube.com/watch?v=ALS92big4TY - Pussy Riot Punk Prayer (singing in russian, subtitles in english)
+ http://www.youtube.com/watch?v=jq42aHX4qk4 - I am the walrus good captions
+ http://www.youtube.com/watch?v=JnA8GUtXpXY&t=6m0s - The Extended Mind (start at 6:00 for crazy)

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
