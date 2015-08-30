# Currency rate converter

A currency rate conversion tool built to watch `currency` job from remote beanstalkd server. 

## Requirements

- Mongodb server
- Beanstalkd server

## Configurations

Not commiting sensitive credientials to public git repo. So, before we get this application start, please setup your config as follows:

- Copy the `config/beanstalkd.sample.yml` to `config/beanstalkd.yml` and change config to match your server
- Copy the `config/database.sample.yml` to `config/database.yml` and change config to point to your mongodb server.

## Usage

### Seed

Seed the beanstalkd server with a simply HKD to USD job.

    node seed.js

If we want to convert more currency. Simple create a job with payload

    {
      type: 'currency', # Indicate the job type
      payload: {
        uuid: 'd5912f40-4ee4-11e5-a58a-e9fa08f97a6b', # A unique id for the job
        from: 'CNY', # Currency rate from...
        to: 'HKD', # to this currency
      }
    }

### Start conversion

Start the node application and watch currency job on beanstalkd server.

    node index.js