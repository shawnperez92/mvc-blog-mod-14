const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class comment extends Model {}

comment.init(
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        comment: {
        type: DataTypes.STRING,
        allowNull: false
        },
        user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
        },
        post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'post',
            key: 'id'
        }
        }
    },
    {
        sequelize,
        modelName: 'comment',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    }
    );
    module.exports= comment;