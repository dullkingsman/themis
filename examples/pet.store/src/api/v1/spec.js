const {
  Themis,
  JsonContent,
  ENUM,
  ARRAY,
  OBJECT,
  UUID,
  STRING,
  NUMBER,
} = require('../../../../../lib/index');

const v1 = new Themis('v1', {
  title: 'Pets API',
  version: 'You can work with pets data.',
});

v1.path('/pets', {
  get: {
    responses: {
      ['200']: {
        description: 'Get a list of pets.',
        content: JsonContent(
          ARRAY(
            OBJECT({
              id: UUID,
              name: STRING,
              age: NUMBER,
              type: ENUM(['HUSKY', 'BULLDOG', 'GERMAN SHEPHERD']),
            }),
          ),
        ),
      },
    },
  },
});

module.exports = v1;
