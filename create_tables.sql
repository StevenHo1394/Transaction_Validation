DROP TABLE If EXISTS Transactions;
CREATE TABLE Transactions
(
  id int auto_increment 
	primary key, 
  discord_id VARCHAR(255),
  transaction_hash VARCHAR(255),
  timestamp VARCHAR(255),
  transaction_type_id VARCHAR(255) foreign
  constraint Transactions_id_uindex
	unique (id)
)
ENGINE = InnoDB;

DROP TABLE If EXISTS TransactionTypes;
CREATE TABLE TransactionTypes
(
  tid int auto_increment
	primary key, 
  name VARCHAR(255),
  transaction_hash VARCHAR(255),
  description VARCHAR(255),
  amount VARCHAR(255)
)
ENGINE = InnoDB;

DROP TABLE If EXISTS TwitterPost;
CREATE TABLE TwitterPost
(
  tid int auto_increment
	primary key, 
  discord_id VARCHAR(255),
  twitter_url VARCHAR(255),
  timestamp VARCHAR(255)
  constraint TwitterPost_tid_uindex
	unique (tid)
  constraint TwitterPost_twitter_url_uindex
        unique (twitter_url)
)
ENGINE = InnoDB;

DROP TABLE If EXISTS ArticlePost;
CREATE TABLE ArticlePost
(
  aid int auto_increment
	primary key, 
  discord_id VARCHAR(255),
  article_url VARCHAR(255),
  timestamp VARCHAR(255)
  constraint ArticlePost_aid_uindex
	unique (aid)
)
ENGINE = InnoDB;

DROP TABLE If EXISTS Incentives_Gained;
CREATE TABLE Incentives_Gained
(
  cid int auto_increment
	primary key, 
  discord_id VARCHAR(255),
  valued_transactions VARCHAR(255),
  amount_gained VARCHAR(255)
  constraint Incentives_Gained_cid_uindex
	unique (cid)
  constraint Incentives_Gained_discord_id_uindex
	unique (discord_id)
)
ENGINE = InnoDB;
