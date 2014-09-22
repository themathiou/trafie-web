'use strict';

const api = [
	{
		route: '/users',
		methods: [
			{
				name: 'GET',
				description: 'Returns users, filtered by the parameters. If there is a "keywords" parameters, a search will be performed based on the words serparated by spaces. Only public users will be returned.',
				parameters: 'first_name, last_name, discipline, country, keywords',
				examples: ['/users', '/users?first_name=George&last_name=Balasis', '/users?keywords=george balasis'],
				exampleResponseSuccess: JSON.stringify([
										  {
										    "_id": "5415cf0334a09e041c000001",
										    "first_name": "George",
										    "last_name": "Balasis",
										    "discipline": "",
										    "country": "",
										    "username": "george",
										    "formatted_country": "",
										    "formatted_discipline": ""
										  }
										], null, 4),
				exampleResponseFail: ''
			}
		]
	},
	{
		route: '/users/:user_id',
		methods: [
			{
				name: 'GET',
				description: 'Returns the user by id. Only public users will be returned unless a logged in user tries to access themselves.',
				parameters: '-',
				examples: ['/users/5415cf0334a09e041c000001'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			}
		]
	},
	{
		route: '/users/me',
		methods: [
			{
				name: 'GET',
				description: 'The logged in user. If the user is not logged in, nothing is returned.',
				parameters: '-',
				examples: ['/users/me'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			}
		]
	},
	{
		route: '/users/:user_id/activities',
		methods: [
			{
				name: 'GET',
				description: 'Returns all the public activities of the user',
				parameters: '-',
				examples: ['/users/5415cf0334a09e041c000001/activities'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			}
		]
	},
	{
		route: '/users/:user_id/activities/:activity_id',
		methods: [
			{
				name: 'GET',
				description: 'Returns the user by id. Only public users will be returned unless a logged in user tries to access themselves.',
				parameters: '-',
				examples: ['/users/5415cf0334a09e041c000001'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			},
			{
				name: 'POST',
				description: 'Returns users, filtered by the parameters',
				parameters: '[first_name, last_name, discipline, country]',
				examples: ['/users', '/users?first_name=George&last_name=Balasis'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			},
			{
				name: 'PUT',
				description: 'Returns users, filtered by the parameters',
				parameters: '[first_name, last_name, discipline, country]',
				examples: ['/users', '/users?first_name=George&last_name=Balasis'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			},
			{
				name: 'DELETE',
				description: 'Returns users, filtered by the parameters',
				parameters: '[first_name, last_name, discipline, country]',
				examples: ['/users', '/users?first_name=George&last_name=Balasis'],
				exampleResponseSuccess: '',
				exampleResponseFail: ''
			}
		]
	}
];

exports.get = function( req, res ) {
	res.json( api );
};

exports.get_view = function( req, res ) {

	res.render( 'api', { 'api': api } );
};