'use strict';

const api = [{
	route: '/users',
	methods: [{
		name: 'GET',
		description: 'Returns users, filtered by the parameters. If there is a "keywords" parameters, a search will be performed based on the words serparated by spaces. Only public users will be returned.',
		parameters: ['firstName', 'last_name', 'discipline', 'country', 'keywords'],
		data: [],
		examples: ['/users', '/users?firstName=George&last_name=Balasis', '/users?keywords=george balasis'],
		example_response_success: JSON.stringify([{
			"_id": "5415cf0334a09e041c000001",
			"firstName": "George",
			"last_name": "Balasis",
			"discipline": "",
			"country": "",
			"username": "george",
			"formatted_country": "",
			"formatted_discipline": ""
		}], null, 4),
		example_response_fail: ''
	}]
}, {
	route: '/users/:userId',
	methods: [{
		name: 'GET',
		description: 'Returns the user by id. Only public users will be returned unless a logged in user tries to access themselves.',
		parameters: [],
		data: [],
		examples: ['/users/5415cf0334a09e041c000001'],
		example_response_success: '',
		example_response_fail: ''
	}]
}, {
	route: '/users/me',
	methods: [{
		name: 'GET',
		description: 'The logged in user. If the user is not logged in, nothing is returned.',
		parameters: [],
		data: [],
		examples: ['/users/me'],
		example_response_success: '',
		example_response_fail: ''
	}]
}, {
	route: '/users/:userId/activities',
	methods: [{
		name: 'GET',
		description: 'Returns all the public activities of the user.',
		parameters: ['from','to','discipline'],
		data: [],
		examples: ['/users/5415cf0334a09e041c000001/activities'],
		example_response_success: '',
		example_response_fail: ''
	}]
}, {
	route: '/users/:userId/activities/:activity_id',
	methods: [{
		name: 'GET',
		description: 'Returns the activity by id. Only public activities will be returned unless a logged in user tries to access their activity.',
		parameters: [],
		data: [],
		examples: ['/users/5415cf0334a09e041c000001/activities/5415d95a2a12b4b01f000001'],
		example_response_success: '',
		example_response_fail: ''
	}, {
		name: 'POST',
		description: 'Creates a new activity.',
		parameters: [],
		data: [{
			name: 'discipline',
			type: 'string',
			required: true
		}, {
			name: 'performance',
			type: 'object',
			data: [
				[{
					name: 'hours',
					type: 'number',
					required: false
				}, {
					name: 'minutes',
					type: 'number',
					required: false
				}, {
					name: 'seconds',
					type: 'number',
					required: false
				}, {
					name: 'centiseconds',
					type: 'number',
					required: false
				}],
				[{
					name: 'meters',
					type: 'number',
					required: false
				}, {
					name: 'centimeters',
					type: 'number',
					required: false
				}],
				[{
					name: 'points',
					type: 'number',
					required: false
				}]
			]
		}, {
			name: 'date',
			type: 'date object',
			required: true
		}, {
			name: 'place',
			type: 'number',
			required: false
		}, {
			name: 'location',
			type: 'number',
			required: false
		}, {
			name: 'competition',
			type: 'string',
			required: false
		}, {
			name: 'notes',
			type: 'string',
			required: false
		}],
		examples: ['/users/5415cf0334a09e041c000001/activities/5415d95a2a12b4b01f000001'],
		example_response_success: '',
		example_response_fail: ''
	}, {
		name: 'PUT',
		description: 'Edits the data of an existing activity.',
		parameters: [],
		data: [{
			name: 'discipline',
			type: 'string',
			required: true
		}, {
			name: 'performance',
			type: 'object',
			data: [
				[{
					name: 'hours',
					type: 'number',
					required: false
				}, {
					name: 'minutes',
					type: 'number',
					required: false
				}, {
					name: 'seconds',
					type: 'number',
					required: false
				}, {
					name: 'centiseconds',
					type: 'number',
					required: false
				}],
				[{
					name: 'meters',
					type: 'number',
					required: false
				}, {
					name: 'centimeters',
					type: 'number',
					required: false
				}],
				[{
					name: 'points',
					type: 'number',
					required: false
				}]
			]
		}, {
			name: 'date',
			type: 'date object',
			required: true
		}, {
			name: 'place',
			type: 'number',
			required: false
		}, {
			name: 'location',
			type: 'number',
			required: false
		}, {
			name: 'competition',
			type: 'string',
			required: false
		}, {
			name: 'notes',
			type: 'string',
			required: false
		}],
		examples: ['/users/5415cf0334a09e041c000001/activities/5415d95a2a12b4b01f000001'],
		example_response_success: '',
		example_response_fail: ''
	}, {
		name: 'DELETE',
		description: 'Deletes an activity',
		parameters: [],
		data: [],
		examples: ['/users/5415cf0334a09e041c000001/activities/5415d95a2a12b4b01f000001'],
		example_response_success: '',
		example_response_fail: ''
	}]
}, {
	route: '/users/:userId/disciplines',
	methods: [{
		name: 'GET',
		description: 'Returns all the disciplines that the user has recorded.',
		parameters: [],
		data: [],
		examples: ['/users/5415cf0334a09e041c000001/disciplines'],
		example_response_success: '',
		example_response_fail: ''
	}]
}, ];

exports.get = function(req, res) {
	res.json(api);
};

exports.get_view = function(req, res) {

	var formatObject = function(obj) {
		let object_parts = [];
		let counter = 0;

		let object_is_array = typeof obj.length !== 'undefined';

		for (let i in obj) {
			if (typeof obj[i] === 'object') {
				object_parts[counter] = object_is_array ? formatObject(obj[i]) : i + ': ' + formatObject(obj[i]);
			} else {
				object_parts[counter] = object_is_array ? obj[i].toString() : i + ': ' + obj[i].toString();
			}
			counter++;
		}

		let formatted_object = object_is_array ? '[' + object_parts.join(', ') + ']' : '{' + object_parts.join(', ') + '}';

		return formatted_object;
	};

	let api_length = api.length;

	for (let i = 0; i < api_length; i++) {
		let methods_length = api[i].methods.length;
		for (let j = 0; j < methods_length; j++) {
			let method_data = api[i].methods[j].data;
			let method_data_length = method_data.length;
			if (method_data_length) {
				for (let k = 0; k < method_data_length; k++) {
					api[i].methods[j].data[k] = formatObject(method_data[k]);
				}
			}
		}
	}

	res.render('api', {
		'api': api
	});
};
