# city-lore

This repo contains the application files for the City Lore's <a href="https://storymaps.esri.com/stories/city-lore/" target="_blank">New York Video Treasury</a> application, a collaboration between City Lore and Esri's StoryMap team.

## Deployment

The primary file types in this repo are **html**, **css**, and **javascript**.  To deploy, simply copy the folder to a web server directory.

## Notes for developers

* This is a simple [JAMstack](https://jamstack.org/) project, consisting only of vanilla javascript (no frameworks)

* The *html*, *css*, and *javascript* files in this project do not require build scripts.  Source files can be edited and re-deployed with modifications.

	* Note: *Css* developers have an alternative to working with the css code directly. If you're familiar with [Sass](https://sass-lang.com/) (which we use for convenience in developing our css), you can work with the *scss* source files provided (in the *scss* folder).

* Files you can ignore:

	* *Gruntfile.js*: A file that I use to automate some tasks in my own environment.  This file does not directly relate to the mechanics of the application.
	* Source *scss* files in the *scss* folder. If you're not using Sass, you needn't worry about these.
