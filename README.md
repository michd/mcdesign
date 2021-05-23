# Minecraft design tool

** Note ** This is an old project I haven't touched in a long time. I'm only
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

## Vagrant development environment

For convenience, a [vagrant](https://www.vagrantup.com/) development environment is provided. 

It is set up to serve MCDesign at `mcdesign.local`, with a default IP of 192.168.33.14. Add this to your system's hosts file.

### SSL
To enable SSL in the development environment, install `minica` from https://github.com/jsha/minica

1. Run `minica --domains mcdesign.local
   This will create a root cert and private key in the same folder named minica.pem and a key minica-key.pem. It will also create the folder `mcdesign.local` containing cert.pem and key.pem.
2. Move the `mcdesign.local` folder into `vagrant-setup/`
3. Copy `minica.pem` into that same `mcdesign.local/` folder
4. Install the `minica.pem` root certificate for your system or browser. If you're using Firefox:
   Preferences > Privacy & Security > Certificates > View Certificates > Authorities > Import
   Then restart Firefox.

If you don't want to use SSL, you'll have to edit vagrant-setup/mcdesign.local.conf before provisioning.

If you did the above SSL setup after provisioning the vagrant box, you'll have to restart the nginx service or the box itself.

### Virtual machine setup

1. Install [Vagrant](http://vagrantup.com) on your dev machine
2. Install [VirtualBox](https://www.virtualbox.org/) on your dev machine
3. Clone this repository
4. Open a terminal and navigate to the root folder of this repository
5. Run `vagrant up`. This one will take a while, go do something else while you wait.
6. Once finished, the script will tell you what to add to your hosts file. See "editing the hosts file"
7. Fire up your browser and navigate to mcdesign.local
8. Have fun doing some coding

