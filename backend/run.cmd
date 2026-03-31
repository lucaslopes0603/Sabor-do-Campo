@echo off
call "%~dp0..\backend-spring\mvnw.cmd" -f "%~dp0..\backend-spring\pom.xml" spring-boot:run
