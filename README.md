# Currency rate converter

A currency rate conversion tool built to watch currency conversion job from remote beanstalkd server. 

## Requirements

- Mongodb server
- Beanstalkd server

## Configurations

Simply change beanstalkd and mongodb server settings from `config/beanstalkd.yml` and `config/database.yml`

## Usage

### Seed

Seed the beanstalkd with a simply HKD to USD job by running `node seed.js`.

### Start conversion

Start the node application which `node index.js` we can then watch any job on beanstalkd server.