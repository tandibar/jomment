# jomment

Undestructive json comment.

## Why?

Have you ever thought __"It would be nice to be able to add comments to my package.json. Too bad that json does not allow comments."__
I had this thought very often, and after some years I thought about a solution and `jomment` is the closest I could get.

## How?

`jomment` does not modify the original json file. Instead it saves the comments you made in a seperate file and remembers the location of your comments (thanks to the awesome library [comment-json](https://www.npmjs.com/package/comment-json)). That is why it even works with files like `package.json` would be destroyed by adding comments in the original file.

## Prerequisites

You should have configured your favorite editor for command-line usage. Additionally it should wait for files to be closed before returning.
For example if you use [vscode](https://code.visualstudio.com/docs/editor/command-line), you should set your environments `EDITOR` variable to something like `EDITOR='code --wait'`. 
How you permanently set this up depends on your OS, your shell and your editor.
## Install

    $ npm install -g jomment

## Usage

Most comment use case might be for commenting `package.json`. Just go to the root folder of your project and execute

    $ jom edit 

Your favorite editor should open up, you can add comments wherever you want. If you close the editor, `jomment` will detect the comments and save it to an extra file (in this case `package.jom`). It will also save the `package.json` without the comments, so if you modified the json, it will be saved too.

This does not only work with `package.json` but with every json file:

    $ jom edit some-json-i-want-to-comment.json

If you just want to see the comments of a json file without editing, you can do

    $ jom cat <json-file>
## The `.jom` File

The jom file knows all your comments but should not be edited by hand. If you are using this in a project with source control, you should checkin the jom file to share the comments with your team.

## Change Log

[CHANGELOG](CHANGELOG.md)
## License

[MIT](LICENSE)