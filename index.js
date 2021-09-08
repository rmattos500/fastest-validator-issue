const Validator = require('fastest-validator');
const stringMax = 100;

const v = new Validator({
	debug: true,
	useNewCustomCheckerFunction: true,
	defaults: {
		object: {
			strict: true,
		},
		string: {
			// min, max, and trim have no effect but showing what we are doin in our string override
			min: 1,
			max: stringMax,
			trim: true,
			// Commenting out this custom function will pass
			custom(value) {
				if (typeof value !== 'string') {
					return value;
				}

				return value;
			},
		},
	},
});

const atcCalculationEntityValidator = {
	type: 'object',
	props: {
		fulfillments: {
			type: 'array',
			items: [
				// swapping the order of these object definitions will pass
				{
					type: 'object',
					props: {
						method: { type: 'equal', value: 'delivery' },
						routeId: { type: 'string' },
					},
				},
				{
					type: 'object',
					props: {
						method: { type: 'equal', value: 'customerPickup' },
					},
				},
			],
		},
	},
};

const schema = {
	entities: [
		atcCalculationEntityValidator,
		{ type: 'array', items: atcCalculationEntityValidator }
	],
};

const check = v.compile(schema);

const atcEntities = [
	{
		fulfillments: [
			{
				// changing this method to 'delivery' and adding a 'routeId' will pass.
				method: 'customerPickup',
			},
		],
	},
];

const res = check({ entities: atcEntities });
console.log("Result:", res);
