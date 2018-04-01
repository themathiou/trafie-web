function getUserS3Folder(userId) {
    return `users/${userId}`;
}

function getProfileS3Folder(userId) {
    return `users/${userId}/profile`;
}

function getActivityS3Folder(userId, activityId) {
    return `users/${userId}/activities/${activityId}`;
}

module.exports = {
    getUserS3Folder,
    getProfileS3Folder,
    getActivityS3Folder
};
