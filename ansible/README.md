## Install Ansible
First you must install ansible on the machine you wish to administer the servers from. This is probably your laptop or other local machine.

For example, this can be done with `sudo apt install ansible` on many linux systems, or `brew install ansible` on mac etc. To check the installation instructions for your machine, check the [ansible installation guide](https://docs.ansible.com/ansible/latest/installation_guide/index.html).

## Create an `inventory` file
In PerfectFit's cloud deployments we have a `prod` and a `stage` server (for production and staging, respectively). To run any of the ansible playbooks here, you will need to create an `inventory` config file locally, to tell ansible where these servers actually are. Note that this is also called a `hosts` file.

For the current setup, your inventory file will look something like the following:
```
[servers]
prod ansible_host=ip.address.prod.server
prod ansible_ssh_private_key_file=~/.ssh/privatekey_for_accessing_prod
stage ansible_host=ip.address.stage.server
stage ansible_ssh_private_key_file=~/.ssh/privatekey_for_accessing_stage

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

If you like, you can copy the `inventory.example` file (also in the ansible directory) and change the values to fit your case.

Once you have created this `inventory` file, with the actual relevant IP addresses and key locations, you can test if your configuration works by pinging the prod and stage servers:
```
ansible prod -i inventory -m ping -u root
ansible stage -i inventory -m ping -u root
```

If this is successful, then your inventory file is correctly set up.

## Setting up the staging and production servers
Now you can run the `initial-setup.yml` playbook, which installs docker, docker-compose and the general config environment on both the prod and stage servers defined in your `inventory` file. Run the notebook as follows:

```
ansible-playbook -i inventory playbooks/initial-setup.yml
```

## Spinning up (and updating) the staging server
To spin up the whole virtual coach app on the staging server, you must use the `start-stage.yml` playbook. Note that this playbook looks for a couple of files, that must be present in the /ansible directory:
* .env.stage : the .env file configured for the staging server
* read_private_packages_token : a file containing a github personal access token giving access to the private packages (the niceday-api and niceday-broker images).
These files are not under version control and must not be committed. There is a `.env.stage.example` file you to show you the form of file expected here.

Once the necessary secret containing files are present, run the following:
```
ansible-playbook -i inventory playbooks/start-stage.yml
```

## Spinning up specific releases on Production server
Starting the perfectfit app on the production server is achieved by running the `start-prod.yml` playbook. Similarly to the staging case, this requires two files to be present in the ansible directory (that are not and must not be under version control):
* .env.prod : the .env file configured for the production server
* read_private_packages_token : a file containing a github personal access token giving access to the private packages (the niceday-api and niceday-broker images).
There is a `.env.prod.example` file you to show you the form of file expected here.

You then spin up a particular release on the prod server as follows:
```
ansible-playbook -i inventory playbooks/start-prod.yml -e RELEASETAG=0.1.0
```
Important: note the `RELEASETAG` argument above. This means that prod will pull all images tagged with a specific release number. This is so that production is running a specific known version of the app.

## Rolling back
If there is a bad release to prod, rendering it e.g. unstable, you may wish to "roll back" to a previous release. You can then use the `start-prod.yml` playbook, as described above, but with an older RELEASETAG that you know was working well. This of course relies on the older versions still being available on ghcr, so it would be wise not to remove recent packages.
