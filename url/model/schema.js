/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-09T16:00:03+08:00
*/



'use strict';

let Sequelize = require('sequelize');

module.exports = {
  getModel: (name) => {
    return {
      name: name,
      columns: {
        unique_id: {
          type: Sequelize.STRING(600),
          comment: '唯一id',
          unique: true,
          allowNull: false
        },
        url: {
          type: Sequelize.STRING(600),
          allowNull: false,
          comment: 'URL'
        },
        params: {
          type: Sequelize.JSON,
          comment: 'URL相关的参数',
          defaultValue: null
        },
        retry: {
          type: Sequelize.INTEGER,
          comment: '重试的次数',
          defaultValue: 0
        },
        last_update: {
          type: Sequelize.DATE,
          comment: '确认爬取完成的时间'
        },
        store: {
          type: Sequelize.JSON,
          comment: '存储的一些和结果相关的状态'
        },
        lock: {
          type: Sequelize.BOOLEAN,
          comment: '是否被锁住(分布式的场景)',
          defaultValue: false,
          // index: true 最后声明index
        },
        isable: {
          type: Sequelize.BOOLEAN,
          comment: '是否失效',
          defaultValue: true
        },
        error: {
          type: Sequelize.STRING,
          comment: '最近的错误名称'
        },
        // Null 代表该url未分配
        // 0 代表该url爬取成功
        // 其余数字代表该url分配那一刻的时间戳
        placeholder: {
          type: Sequelize.BIGINT,
          comment: '占位'
        },
        query: {
          type: Sequelize.JSON,
          comment: '请求相关'
        },
        // index: {
        //   type: Sequelize.INTEGER,
        //   comment: '序号'
        // }
      }
    };
  }
}
