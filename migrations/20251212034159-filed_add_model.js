'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('models', 'isImage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'imageUrl'
    });

    await queryInterface.addColumn('models', 'isVideo', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'imageUrl'
    });

    await queryInterface.addColumn('models', 'isAudio', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'imageUrl'
    });

    await queryInterface.addColumn('models', 'isFile', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'imageUrl'
    });

    await queryInterface.addColumn('models', 'isCamera', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'imageUrl'
    });

    // Ensure older rows get the correct value too
    await queryInterface.bulkUpdate('models', {
      isImage: 0,
      isVideo: 0,
      isAudio: 0,
      isFile: 0,
      isCamera: 0,
    }, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('models', 'isImage');
    await queryInterface.removeColumn('models', 'isVideo');
    await queryInterface.removeColumn('models', 'isAudio');
    await queryInterface.removeColumn('models', 'isFile');
    await queryInterface.removeColumn('models', 'isCamera');
  }
};
