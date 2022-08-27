# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  config.vm.box = "archlinux/archlinux"

  config.vm.network "private_network", ip: "192.168.56.15"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"
  end

  config.vm.hostname = "mcdesign-vagrant"

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    DEFAULT_IP="192.168.56.15"
    HOME='/home/vagrant'
    RUBY_VERSION='2.7.3'
    MYSQL_PASSWORD='mcdesign'
    DEV_DATABASE_USER='mcdesign_dev'
    DEV_DATABASE_PASSWORD='mcdesign_dev'
    DEV_DATABASE_NAME='mcdesign_dev'

    announce() {
        echo -e "\n## [$1/12] $2\n"
    }

    announce 1 "Installing updates"
    sudo pacman -Syu --noconfirm

    announce 2 "Installing mysql"

    sudo pacman -S mariadb --noconfirm
    sudo mariadb-install-db
    sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
    sudo systemctl enable mariadb.service
    sudo systemctl start mariadb.service

    announce 3 "Installing assorted stuff"
    sudo pacman -S git gcc make nodejs vim --noconfirm

    announce 4 "Setting up rbenv..."
    cd $HOME
    git clone https://github.com/rbenv/rbenv.git ~/.rbenv
    echo "export PATH=\$HOME/.rbenv/bin:\$PATH" >> "$HOME/.bash_profile"
    echo 'eval "$(rbenv init -)"' >> "$HOME/.bash_profile"
    source "$HOME/.bash_profile"
    mkdir -p "$HOME/.rbenv/plugins"
    pushd "$HOME/.rbenv/plugins"
    git clone https://github.com/rbenv/ruby-build.git
    popd

    announce 5 "Installing ruby $RUBY_VERSION"
    rbenv install "$RUBY_VERSION"
    rbenv global "$RUBY_VERSION"

    announce 6 "Installing bundler, passenger"
    gem install bundler passenger
    rbenv rehash
    chown -R vagrant:vagrant $HOME

    announce 7 "Installing nginx"
    sudo pacman -S nginx --noconfirm
    sleep 2
    sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
    sudo awk 'BEGIN { blockLevel=0; blockName=\"\"; } /\{/ { blockLevel++; } /^http\s*\{/ { if (blockLevel == 1) { blockName = \"http\"; } print \"\"; } /\}/ { blockLevel--; if (blockLevel == 0 && blockName == \"http\") { print \"\\n    include \\"sites-enabled/*\\";\" } } { print; }' /etc/nginx/nginx.conf | sudo tee -a /etc/nginx/nginx.conf.new
    # Technically I could do this sed stuff in the awk program above, but I wanted to keep it single-purpose
    sudo sed -i 's/\#user\s*http/user vagrant vagrant/' /etc/nginx/nginx.conf.new
    # Keep a backup of the unmodified file
    sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old
    sudo mv /etc/nginx/nginx.conf.new /etc/nginx/nginx.conf

    announce 8 "Create DB and user (dev) for mcdesign..."
    # Development env database
    sudo mysql -u root -e "CREATE USER '$DEV_DATABASE_USER'@'localhost' IDENTIFIED BY '$DEV_DATABASE_PASSWORD';"
    sudo mysql -u root -e "CREATE DATABASE $DEV_DATABASE_NAME DEFAULT CHARACTER SET utf8;"
    sudo mysql -u root -e "GRANT ALL ON $DEV_DATABASE_NAME.* TO '$DEV_DATABASE_USER'@'localhost';"

    announce 9 "Installing service for Passenger server"
    sudo cp /vagrant/vagrant-setup/mcdesign-passenger.service /etc/systemd/system/mcdesign-passenger.service
    sudo systemctl daemon-reload
    sudo systemctl enable mcdesign-passenger.service
    # Note: not starting it yet

    announce 10 "Installing nginx config and enabling"
    sudo cp /vagrant/vagrant-setup/mcdesign.vagrant.conf /etc/nginx/sites-available/
    sudo ln -s /etc/nginx/sites-available/mcdesign.vagrant.conf /etc/nginx/sites-enabled/
    sudo systemctl enable nginx.service

    announce 11 "Installing MCDesign Sinatra app"
    pushd /vagrant
    bundle install

    mysql -u $DEV_DATABASE_USER -p$DEV_DATABASE_PASSWORD -h localhost $DEV_DATABASE_NAME < /vagrant/vagrant-setup/mcdesign_schema.sql

    announce 12 "Starting nginx and passenger"
    sudo systemctl start nginx.service
    sudo systemctl start mcdesign-passenger.service

    echo -e "\n"
    echo "====================================================================="
    echo "Provision finished, hopefully."
    echo ""
    echo "Make sure to add this to your hosts file:"
    echo "$DEFAULT_IP mcdesign.vagrant"
    echo ""
    echo "If you haven't already, make sure to follow the SSL setup part of the"
    echo "README too."
    
  SHELL
end
