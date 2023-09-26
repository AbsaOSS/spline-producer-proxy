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

import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {ExecutionEvent, ExecutionPlan} from "../model";
import {isValidUUID} from "../utils";
import {persist} from "../persister";

const API_VERSIONS = ['1.1']
const SUPPORTED_MIME_TYPES = API_VERSIONS.map(v => `application/vnd.absa.spline.producer.v${v}+json`)

async function validateMimeType(request: FastifyRequest, reply: FastifyReply) {
    const ct = request.headers['content-type']
    if (!ct || !SUPPORTED_MIME_TYPES.includes(ct)) {
        reply.code(415).send({error: 'Unsupported Media Type'})
    }
}

export default async function (fastify: FastifyInstance) {

    // Register the Spline custom content types as aliases to JSON
    const jsonContentTypeParser = fastify.getDefaultJsonParser('error', 'error')
    SUPPORTED_MIME_TYPES.forEach(mt => fastify.addContentTypeParser(mt, {parseAs: 'string'}, jsonContentTypeParser))

    fastify.head('/producer/status', async (request, reply) => {
        reply
            .code(204)
            .headers({
                'ABSA-Spline-API-Version': API_VERSIONS,
                'ABSA-Spline-API-LTS-Version': API_VERSIONS,
                'ABSA-Spline-Accept-Request-Encoding': false
            })
            .send()
    })

    fastify.post<{ Body: ExecutionPlan }>('/producer/execution-plans', {preValidation: validateMimeType}, async (request, reply) => {
        const execPlan: ExecutionPlan = request.body

        if (!isValidUUID(execPlan.id)) {
            reply.code(400)
            return
        }

        await persist(execPlan)

        reply
            .code(201)
            .type("application/json")
            .send(JSON.stringify(execPlan.id))
    })

    fastify.post<{ Body: [ExecutionEvent] }>('/producer/execution-events', {preValidation: validateMimeType}, async (request, reply) => {
        const execEvents: [ExecutionEvent] = request.body

        if (!Array.isArray(execEvents)
            || execEvents.length < 1
            || !execEvents.every(e => isValidUUID(e.planId))
        ) {
            reply.code(400)
            return
        }

        await persist(execEvents)

        reply.code(201).send()
    })
}
