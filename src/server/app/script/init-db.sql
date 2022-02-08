DROP DATABASE IF EXISTS doctolib_researcher;
CREATE DATABASE doctolib_researcher;
USE doctolib_researcher;

CREATE TABLE keywords (
    id INT NOT NULL AUTO_INCREMENT,
    profileID INT NOT NULL,
    keyword VARCHAR(64),
    PRIMARY KEY (id),
    FOREIGN KEY (profileID) REFERENCES profiles(profileID)
) ENGINE=INNODB;

CREATE TABLE profiles (
    id INT NOT NULL AUTO_INCREMENT,
    profileID INT NOT NULL,
    profileUrl VARCHAR(2048),
    name VARCHAR(64),
    keywordsID INT NOT NULL,
    socialSecCard ENUM('yes', 'no', 'undefined'),
    address VARCHAR(2048),
    description TEXT CHARACTER SET utf8,
    PRIMARY KEY (id, profileID),
) ENGINE=INNODB;

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    profileID INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (profileID) REFERENCES profiles(profileID)
) ENGINE=INNODBl
