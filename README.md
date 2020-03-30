# Minecraft design tool

__Note:__ This is an old project I haven't touched in a long time. I'm only
publishing its source because someone asked and I somehow hadn't already.

This tool lets you setch out Minecraft design ideas in 2D with some of the
available materials in the game. It lets you save these designs to a database
so they can be shared with friends, or you export the design to JSON so you
can save it on your own computer.

You can check the version as of 2020-03-30 on [mcdesign.michd.me](https://mcdesign.michd.me/).

---

The portion for saving designs to a database is a [Sinatra](http://sinatrarb.com/) application,
backed with ActiveRecord. I'm running it with a MySQL database.

Note that in your server configuration, you must specify the following environment variables
for said database:

- `MCDESIGN_MYSQL_USER` - Username to access the database
- `MCDESIGN_MYSQL_PWD` - Password for same
- `MCDESIGN_MYSQL_DB` - Database name

It's assumed that the database runs on the same machine as the application, thus `localhost`.

If that's not the case, change it in `mcdesign.rb`.

## Contributing

Since there seems to be interest, I'm open to reviewing pull requests for adding new materials to the tool.

If doing so, please ensure that the existing numbers for materials keep working; older designs made in it will use different materials.


