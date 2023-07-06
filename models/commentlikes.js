//Models
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentLikes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.Comments, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'commentId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'commentId', // 4. Comments 모델의 UserId 컬럼과 연결합니다.
      });

      this.belongsTo(models.Users, { 
        targetKey: 'userId', 
        foreignKey: 'userId', 
      });
    }
  }
  CommentLikes.init({
    likedCount: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    PostId : {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    commentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CommentLikes',
  });
  return CommentLikes;
};