module.exports = 
{
    user : process.env.NODEORACLEDB_USER || "system",
        password : process.env.NODEORACLEDB_PASSWORD || 'yt9599yt',
        connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/xe"
}

