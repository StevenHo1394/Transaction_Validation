Use TxnValidation;

DROP TABLE If EXISTS Transactions;
DROP TABLE If EXISTS TransactionTypes;
DROP TABLE If EXISTS TwitterPost;
DROP TABLE If EXISTS ArticlePost;
DROP TABLE If EXISTS Incentives_Gained;

CREATE TABLE TransactionTypes
(
  tid int NOT NULL auto_increment
	primary key,
  name VARCHAR(255),
  description VARCHAR(255),
  amount VARCHAR(255)
)
ENGINE = InnoDB;

CREATE TABLE Transactions
(
  id int NOT NULL auto_increment
	primary key,
  discord_id VARCHAR(255),
  transaction_hash VARCHAR(255),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tid int NOT NULL,
  foreign key (tid) REFERENCES TransactionTypes(tid),
  constraint Txn_id_uindex unique (id)
)
ENGINE = InnoDB;

CREATE TABLE TwitterPost
(
  tid int NOT NULL auto_increment
	primary key, 
  discord_id VARCHAR(255),
  twitter_url VARCHAR(255) NOT NULL,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  constraint TwitterPost_tid_uindex
	unique (tid),
  constraint TwitterPost_twitter_url_uindex
        unique (twitter_url)
)
ENGINE = InnoDB;

CREATE TABLE ArticlePost
(
  aid int NOT NULL auto_increment
	primary key, 
  discord_id VARCHAR(255),
  article_url VARCHAR(255),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  constraint ArticlePost_aid_uindex
	unique (aid)
)
ENGINE = InnoDB;

CREATE TABLE Incentives_Gained
(
  cid int NOT NULL auto_increment
	primary key, 
  discord_id VARCHAR(255) NOT NULL,
  valued_transactions int,
  total_transactions int,
  amount_gained VARCHAR(255),
  constraint Incentives_Gained_cid_uindex
	unique (cid),
  constraint Incentives_Gained_discord_id_uindex
	unique (discord_id)
)
ENGINE = InnoDB;

