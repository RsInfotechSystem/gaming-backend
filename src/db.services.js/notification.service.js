const { Notification } = require("../db/db");

const notificationServices = {
    insertNotification: async (notifications) => {
        try {
            const result = await Notification.bulkCreate(notifications);
            return result;
        } catch (error) {
            throw error;
        }
    },
    deleteAllNotification: async (id) => {
        try {
            const result = await Notification.destroy({
                where: {
                    userId: id
                },force: true
            });
            return result;
        } catch (error) {
            throw error;
        }
    },
    getNotificationById: async (notificationId) => {
        try {

        } catch (error) {
            throw error;
        }
    },
    deleteNotification: async (notificationId) => {
        try {

        } catch (error) {
            throw error;
        }
    },
    deleteSelectedNotifications: async (notificationIds) => {
        try {

        } catch (error) {
            throw error;
        }
    },
    getNotification: async (id, searchString, page = 1) => {
        try {

        } catch (error) {
            throw error;
        }
    },
    markNotificationAsSeen: async () => {
        try {

        } catch (error) {
            throw error;
        }
    },
    getNotificationCount: async (id) => {
        try {

        } catch (error) {
            throw error;
        }
    }
};

module.exports = notificationServices;