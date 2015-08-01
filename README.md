# coffee - COmplete your Favourite FEEd

This project aims to help you complete your favourite feed. Be it [Paul Graham's essays](http://www.paulgraham.com/articles.html), [High Scalability all time favorites](http://highscalability.com/all-time-favorites/), [Algorithm tutorials by Topcoder](https://www.topcoder.com/community/data-science/data-science-tutorials/) or [Nerd Fitness guides](http://www.nerdfitness.com/resources/).

You can set it up to receive old content from the feed after fixed intervals and it's only a matter of weeks or months to finish up the feed you always wanted to read.

Happy Reading :)

## Project Setup
* The project uses `node` and `postgresql`. Make sure to install both of them.
* Configure your config variables in `config/secrets.js` using `config/secrets.sample.js` as example.
* Run `node models/database.js` to create database table.
* Install packages using `npm install`.
* Run the app using `npm start`.

## TODO
* ~~Setup a basic working version~~
* Improve email format
* Add a `resubscribe` link since people may unsubscribe by mistake
* Consider using alternative ORM (like `sequelize` or `node-orm2`) instead of `pg`
* Show the top feeds on homepage

## Contribution
Feel free to fork the repository and hack on it! Implemented some feature? Well, just send a pull request. Facing problems setting things up or thought of a feature that may be useful for everybody? Contact or open github issues for questions, bugs, feature requests etc.

## Licence
COFFEE is released under the [MIT License](http://opensource.org/licenses/MIT).
