function getUserS3Folder(userId) {
    return `users/${userId}`;
}

function getProfileS3Folder(userId) {
    return `users/${userId}/profile`;
}

function getCompetitionS3Folder(userId, activityId) {
    return `users/${userId}/activities/${activityId}`;
}

module.exports = {
    getUserS3Folder,
    getProfileS3Folder,
    getCompetitionS3Folder: getCompetitionS3Folder
};
