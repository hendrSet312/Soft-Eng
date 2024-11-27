const {Client} = require('pg');

class database {
    constructor(username,password,host,port,database){
        this.username = username;
        this.password = password;
        this.host = host;
        this.port = port;
        this.database = database;

        this.client = new Client({
            user: this.username,
            password: this.password,
            host: this.host,
            port: this.port,
            database: this.database
        });
    }

    connect_database(){
        try{
            this.client.connect();
        }catch(error){
            console.error('failed connect to database : ', error);
        }
    }

    get get_client(){
        return this.client;
    }
}

module.exports = database;

