'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;



// const Sequelize = require('sequelize');

// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config')[env]; //config.json 불러오기
// const db = {}; // 실제 데이터베이스가 이 db 객체와 연결됨

// const sequelize = new Sequelize(config.database, config.username, config.password, config); 
// // 데이터베이스와 연결하기, 시퀄라이즈 ORM 객체 생성

// db.sequelize = sequelize; // 나중에 연결 객체 재사용을 위해 넣어둠, db객체에 sequelize라는 프로퍼티 추가

// module.exports = db; // export 하기