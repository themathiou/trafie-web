var Constants = Object.freeze({
    WSMessageType: {
        REQUEST: 'REQUEST',
        RESPONSE: 'RESPONSE',
        EVENT: 'EVENT'
    },

    ContentType:  {
        NONE: 'NONE',
        EXTENSION: 'EXTENSION',                 // Not used by client
        CONVERSATION: 'CONVERSATION'
    },

    ReturnCode: {
        // Client API Errors
        OK: 'OK',
        AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
        AUTHORIZATION_REQUIRED: 'AUTHORIZATION_REQUIRED',
        BACKEND_UNAVAILABLE: 'BACKEND_UNAVAILABLE',
        OVERLOADED: 'OVERLOADED',
        OLD_VERSION: 'OLD_VERSION',
        STORAGE_OVERLOADED: 'STORAGE_OVERLOADED',

        // Access Server Errors
        SERVICE_NOT_AVAILABLE: 'SERVICE_NOT_AVAILABLE'
    },

    ///////////////////////////////////////////////////////////////////////////
    // Conversation Action
    ///////////////////////////////////////////////////////////////////////////
    ConversationActionType: {
        CREATE: 'CREATE',
        DELETE: 'DELETE',

    }

}); // end of file