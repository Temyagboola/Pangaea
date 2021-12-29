 // Export configuration variables

 // Container for all environments
 let environments = {};

// Development default environment
environments.development = {
    'httpPort' : 5000,
    'httpsPort' : 8000,
    'envName' : 'development',
    'hashingSecret' : process.env.hash,
};


// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 8000,
    'envName' : 'production',
    'hashingSecret' : process.env.hash
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to development
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

// Export the module
module.exports = environmentToExport;
