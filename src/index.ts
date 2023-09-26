/*
 * Copyright 2023 ABSA Group Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fastify from 'fastify'
import {app, options} from './app'
import {config} from "./config";

// Define server options
const serverOptions = {
    logger: true
}

// Create a new fastify instance
const server = fastify(serverOptions)

// Register the application
server.register(app, options)

// Start the server
server.listen(
    {
        host: config.host,
        port: config.port
    },
    (err) => {
        if (err) {
            server.log.error(err)
            process.exit(1)
        }
    })
