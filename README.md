# WordLists, what is it?
This is a tool to practice and review Swedish word forms and vocabulary. You can check it out [here](https://redant333.github.io/word-lists/).

When I started learning Swedish, I thought that it would be nice to have a tool to practice things that one might practice using flashcards.
A tool where you can exercise grammar patterns or check how well you memorized things that follow no pattern.
I couldn't think of a good name, though, so WordLists stuck.

The tool is made in an application agnostic way and word lists for any purpose could be added, but so far I've kept it as a tool for learning Swedish.
It is hosted as a static site on GitHub to make the maintenance easier.

# What can it do?
It contains a bunch of lists of words in different forms like pronouns in different grammatical cases or verbs in different tenses.
It can show the forms as a table for review or use them in a mini game where you get one word form and you are supposed to give it the form it asks from you.

# Technical details
It is written as a static HTML website which is assembled and preprocessed with Gulp and uses Bootstrap for styling.
It uses simple .json files as data source to enable it to be served as a static site.