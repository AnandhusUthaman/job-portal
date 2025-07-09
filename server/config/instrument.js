// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
// If you're using ECMAScript Modules (ESM) syntax, use `import "./instrument.js";`

import "./instrument.js";
import express from "express";




Sentry.init({
  dsn: "https://df199327de507fc5f6809d10bf539091@o4509614449557504.ingest.us.sentry.io/4509614473019392",
    integrations: [
        // nodeProfilingIntegration(),
        Sentry.mongooseIntegration()
    ],
  
  

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});




// All other imports below
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
// const express = require("express");

const app = express();

// All your controllers should live here

app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000);