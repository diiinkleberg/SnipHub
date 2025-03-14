const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the YAML file
const swaggerDocument = YAML.load(
  path.resolve(__dirname, './routes/swagger.yaml')
);

module.exports = (app) => {
  // Setup Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'SnipHub API Documentation',
    })
  );
};
