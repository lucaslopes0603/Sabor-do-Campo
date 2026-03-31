$env:MYSQL_HOST = $env:MYSQL_HOST
$env:MYSQL_PORT = $env:MYSQL_PORT
$env:MYSQL_DATABASE = $env:MYSQL_DATABASE
$env:MYSQL_USER = $env:MYSQL_USER
$env:MYSQL_PASSWORD = $env:MYSQL_PASSWORD
& "$PSScriptRoot\mvnw.cmd" spring-boot:run
