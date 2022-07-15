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

Once you have created this `inventory` file, with the actual relevant IP addresses and key locations, you can test if your configuration works by pinging the prod and stage servers:
```
ansible prod -i inventory -m ping -u root
ansible stage -i inventory -m ping -u root
```

If this is successful, then your inventory file is correctly set up.

## Setting up the staging and production servers

```
ansible-playbook -i inventory playbooks/initial-setup-prod.yml
```
